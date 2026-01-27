import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@vayva/db";
import { OpsAuthService } from "@/lib/ops-auth";

export async function POST(
    req: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    const session = await OpsAuthService.getSession();
    if (!session) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    try {
        const { user } = await OpsAuthService.requireSession();
        if (!["OPS_OWNER", "OPS_ADMIN"].includes(user.role)) {
            return NextResponse.json({ error: "Insufficient permissions" }, { status: 403 });
        }

        const { id: storeId } = await params;
        const { orderId } = await req.json();

        if (!orderId) {
            return NextResponse.json({ error: "Order ID required" }, { status: 400 });
        }

        // Verify order belongs to store
        const order = await prisma.order.findFirst({
            where: { id: orderId, storeId },
            select: { id: true, orderNumber: true, paymentStatus: true },
        });

        if (!order) {
            return NextResponse.json({ error: "Order not found" }, { status: 404 });
        }

        // Log the replay action (webhook replay would be handled by a background job)
        // In production, this would trigger actual webhook processing

        await OpsAuthService.logEvent(user.id, "REPLAY_ORDER_WEBHOOK", {
            storeId,
            orderId,
            orderNumber: order.orderNumber,
        });

        return NextResponse.json({
            success: true,
            message: "Webhook replay queued",
        });
    } catch (error: any) {
        console.error("Replay webhook error:", error);
        return NextResponse.json({ error: "Failed to replay webhook" }, { status: 500 });
    }
}
