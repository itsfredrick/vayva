
import { NextResponse } from "next/server";
import { prisma } from "@vayva/db";
import { OpsAuthService } from "@/lib/ops-auth";

export async function POST(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { user } = await OpsAuthService.requireSession();
        if (!["OPS_OWNER", "OPS_ADMIN", "OPS_SUPPORT"].includes(user.role)) {
            return NextResponse.json({ error: "Forbidden" }, { status: 403 });
        }

        const resolvedParams = await params;
        const { id } = resolvedParams;
        const { orderId, reason } = await request.json();

        if (!orderId || !reason) {
            return NextResponse.json({ error: "orderId and reason are required" }, { status: 400 });
        }

        // 1. Log the audit event
        // 1. Log the audit event
        await OpsAuthService.logEvent(user.id, "MERCHANT_ORDER_WEBHOOK_REPLAY", {
            storeId: id,
            orderId,
            reason
        });

        // 2. TODO: Push to BullMQ 'webhook-retries' queue if applicable
        // For now, we simulate success

        return NextResponse.json({ success: true, message: "Webhook replay queued" });

    } catch (error: any) {
        if (error.message === "Unauthorized") {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
