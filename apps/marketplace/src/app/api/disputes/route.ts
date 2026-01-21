import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { NextResponse } from "next/server";
import { DisputeProvider, DisputeStatus } from "@vayva/db";
import { rateLimitService } from "@/lib/security/rate-limit";
import { z } from "zod";

const DisputeSchema = z.object({
    orderId: z.string().min(1, "Order ID is required"),
    reason: z.string().min(10, "Reason must be at least 10 characters").max(500),
    amount: z.number().positive("Amount must be positive").max(10000000), // Max 10M
    evidenceText: z.string().max(2000).optional(),
});

export async function POST(request: Request) {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Rate Limit strict: 5 disputes per 15 minutes
    const rateLimit = await rateLimitService.middlewareCheck(request, "disputes", { windowMs: 15 * 60 * 1000, max: 5 });
    if (rateLimit) return rateLimit;

    try {
        const body = await request.json();
        const validation = DisputeSchema.safeParse(body);

        if (!validation.success) {
            return NextResponse.json({ error: "Invalid input", details: validation.error.flatten() }, { status: 400 });
        }

        const { orderId, reason, amount } = validation.data;

        // 1. Verify Order Ownership & Status
        const order = await prisma.order.findUnique({
            where: { id: orderId },
            include: { store: true }
        });

        if (!order) {
            return NextResponse.json({ error: "Order not found" }, { status: 404 });
        }

        if (order.customerId !== (session.user as any).id) {
            return NextResponse.json({ error: "Forbidden" }, { status: 403 });
        }

        // 2. Check if a dispute already exists for this order
        const existingDispute = await prisma.dispute.findFirst({
            where: { orderId }
        });

        if (existingDispute) {
            return NextResponse.json({ error: "Dispute already exists for this order" }, { status: 400 });
        }

        // 3. Create Dispute
        const dispute = await prisma.dispute.create({
            data: {
                storeId: order.storeId || "SYSTEM",
                orderId: orderId,
                customerId: (session.user as any).id,
                merchantId: order.storeId || "SYSTEM",
                amount: amount,
                currency: order.currency,
                reasonCode: reason,
                status: DisputeStatus.OPENED,
                provider: DisputeProvider.OTHER,
                providerDisputeId: `MKT-${Date.now()}-${orderId.slice(0, 8)}`, // Generate unique ID
            },
        });

        // 4. Create Timeline Event
        await prisma.orderTimelineEvent.create({
            data: {
                orderId: orderId,
                title: "Dispute Opened",
                body: `Buyer has opened a dispute for ₦${amount.toLocaleString()}. Reason: ${reason}`,
            },
        });

        return NextResponse.json({ success: true, disputeId: dispute.id });
    } catch (error: any) {
        console.error("[DISPUTE_POST]", error);
        return NextResponse.json(
            { error: error.message || "Internal Server Error" },
            { status: 500 }
        );
    }
}
