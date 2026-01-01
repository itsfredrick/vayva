import { NextResponse } from "next/server";
import { requireAuth } from "@/lib/auth/session";
import { prisma } from "@vayva/db";
import { logAuditEvent, AuditEventType } from "@/lib/audit";

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const session = await requireAuth();
    const storeId = session.user.storeId;
    const { id } = await params;
    const body = await request.json();
    const { status } = body; // Map next_status to status if needed, but standard is status? Previous test used next_status. I'll use status as standard.
    // Wait, test used `next_status`. Frontend might send `next_status`.
    // I will check if Frontend uses `next_status`? I can't check easily.
    // I'll support both.
    const targetStatus = status || body.next_status;

    if (!targetStatus) {
      return NextResponse.json(
        { error: "Status is required" },
        { status: 400 },
      );
    }

    const data = await prisma.order.update({
      where: { id, storeId },
      data: { status: targetStatus },
    });

    // Log audit event
    await logAuditEvent(storeId, session.user.id, AuditEventType.ORDER_STATUS_CHANGED, {
      orderId: id,
      newStatus: targetStatus,
    });

    return NextResponse.json({ success: true, order: data });
  } catch (error) {
    console.error("Order status update error:", error);
    return NextResponse.json(
      { error: "Failed to update order status" },
      { status: 500 },
    );
  }
}
