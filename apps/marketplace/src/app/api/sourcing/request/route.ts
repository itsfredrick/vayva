import { NextResponse } from "next/server";
import { authOptions } from "@/lib/auth";
import { getServerSession } from "next-auth";
import { prisma } from "@vayva/db";
import { ChinaSyncService } from "@vayva/shared/china-sync-service";
import { rateLimitService } from "@/lib/security/rate-limit";
import { z } from "zod";

export async function POST(req: Request) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        // Rate Limit: 5 requests per hour (prevent spam)
        const rateLimit = await rateLimitService.middlewareCheck(req, "sourcing-request", { windowMs: 60 * 1000 * 60, max: 5 });
        if (rateLimit) return rateLimit;

        const body = await req.json();

        // Zod Validation
        const SourcingRequestSchema = z.object({
            productName: z.string().min(3),
            description: z.string().min(10),
            quantity: z.number().int().positive(),
            targetPrice: z.number().positive().optional(),
            referenceUrl: z.string().url().optional().or(z.literal("")),
            images: z.array(z.string().url()).optional()
        });

        const validation = SourcingRequestSchema.safeParse(body);
        if (!validation.success) {
            return NextResponse.json({ error: "Invalid input", details: validation.error.flatten() }, { status: 400 });
        }

        const { productName, description, quantity, targetPrice, referenceUrl, images } = validation.data;

        // CAP Phase 33: Auto-suggest a supplier
        const { ChinaSyncService } = await import("@vayva/shared/china-sync-service");
        const suggestedSupplier = await ChinaSyncService.suggestSupplier(`${productName} ${description}`);

        const request = await prisma.sourcingRequest.create({
            data: {
                userId: session.user?.id,
                productName,
                description,
                quantity,
                targetPrice,
                referenceUrl,
                images: images || [],
                status: "PENDING",
                suggestedStoreId: suggestedSupplier?.id
            }
        });

        // Optional: Trigger notification to Ops Team here

        return NextResponse.json(request);

    } catch (error) {
        console.error("Sourcing request error:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
