import { NextRequest, NextResponse } from "next/server";
import { OpsAuthService } from "@/lib/ops-auth";
import { prisma } from "@vayva/db";


export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
    try {
        await OpsAuthService.requireSession();

        const searchParams = req.nextUrl.searchParams;
        const page = parseInt(searchParams.get("page") || "1");
        const limit = parseInt(searchParams.get("limit") || "20");
        const search = searchParams.get("q") || "";
        const provider = searchParams.get("provider") || "";
        const status = searchParams.get("status") || "";

        const skip = (page - 1) * limit;

        const where: any = {
            AND: [
                provider
                    ? { provider: { equals: provider, mode: "insensitive" } }
                    : {},
                status
                    ? { status: { equals: status.toLowerCase() } }
                    : {},
                search
                    ? {
                        OR: [
                            { eventType: { contains: search, mode: "insensitive" } },
                            { eventId: { contains: search, mode: "insensitive" } },
                            { store: { name: { contains: search, mode: "insensitive" } } },
                        ],
                    }
                    : {},
            ],
        };

        const [webhooks, total] = await Promise.all([
            prisma.webhookEvent.findMany({
                where,
                take: limit,
                skip,
                orderBy: { receivedAt: "desc" },
                include: {
                    store: {
                        select: { name: true, slug: true },
                    },
                },
            }),
            prisma.webhookEvent.count({ where }),
        ]);

        const data = webhooks.map((w) => ({
            id: w.id,
            provider: w.provider,
            eventType: w.eventType,
            status: w.status.toUpperCase(),
            receivedAt: w.receivedAt,
            processedAt: w.processedAt,
            error: w.error,
            storeName: w.store?.name || "Unknown Store",
            storeSlug: w.store?.slug,
        }));

        return NextResponse.json({
            data,
            meta: {
                total,
                page,
                limit,
                totalPages: Math.ceil(total / limit),
            },
        });
    } catch (error) {
        console.error("Webhooks list error:", error);
        return NextResponse.json(
            { error: "Internal Server Error" },
            { status: 500 }
        );
    }
}
