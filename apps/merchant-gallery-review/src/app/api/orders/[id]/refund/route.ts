import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@vayva/db";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { logAuditEvent, AuditEventType } from "@/lib/audit";

/**
 * Real Refund Implementation
 * Eliminates simulation delay and mock ledger. Performs atomic balance check and order updates.
 */
export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.storeId) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  const { id } = await params;
  let body;
  try {
    body = await req.json();
  } catch (e) {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }

  const { amount, reason } = body;
  const storeId = session.user.storeId;
  const userId = session.user.id;

  if (!amount || amount <= 0) {
    return NextResponse.json(
      { error: "Invalid refund amount" },
      { status: 400 },
    );
  }

  try {
    const result = await prisma.$transaction(async (tx: any) => {
      // 1. Verify Order ownership and state
      const order = await tx.order.findUnique({
        where: { id, storeId },
      });

      if (!order) {
        throw new Error("Order not found or access denied");
      }

      const currentStatus = String(order.status).toUpperCase();
      if (currentStatus === "REFUNDED" || currentStatus === "CANCELLED") {
        throw new Error("Order cannot be refunded in its current state");
      }

      // 2. Validate Wallet Balance (Merchant must fund the refund)
      const wallet = await tx.wallet.findUnique({
        where: { storeId },
      });

      const refundKobo = BigInt(Math.round(amount * 100));
      if (!wallet || wallet.availableKobo < refundKobo) {
        throw new Error("Insufficient store wallet balance to process refund");
      }

      // 3. Update Order Status
      // If the refund amount is >= order total, mark as fully REFUNDED
      const isFullRefund = amount >= Number(order.total);

      const updatedOrder = await tx.order.update({
        where: { id },
        data: {
          status: (isFullRefund ? "REFUNDED" : order.status) as any,
          paymentStatus: (isFullRefund ? "REFUNDED" : order.paymentStatus) as any,
        },
      });

      // 4. Record the debit in merchant wallet
      await tx.wallet.update({
        where: { storeId },
        data: {
          availableKobo: { decrement: refundKobo },
        },
      });

      // 5. Create Order Event record
      await tx.orderEvent.create({
        data: {
          storeId,
          orderId: id,
          type: "REFUND",
          message: `Processed ${isFullRefund ? "full" : "partial"} refund of ${amount}. Reason: ${reason || "No reason provided"}`,
          createdBy: userId,
        },
      });

      // 6. Create Ledger Entry for History
      await tx.ledgerEntry.create({
        data: {
          storeId,
          referenceType: "REFUND",
          referenceId: id,
          direction: "DEBIT",
          account: "WALLET",
          amount: Number(amount),
          currency: "NGN",
          description: `Refund for Order #${order.orderNumber}. Reason: ${reason || "N/A"}`,
        },
      });

      return updatedOrder;
    });

    // 7. Log Audit Event
    await logAuditEvent(storeId, userId, AuditEventType.REFUND_PROCESSED, {
      orderId: id,
      amount,
      reason,
      refundRef: `RFD-${Date.now()}`
    });

    return NextResponse.json({
      success: true,
      orderId: result.id,
      status: result.status,
      amount: amount
    });
  } catch (error: any) {
    console.error("[Refund] Processing error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to process refund" },
      { status: 400 }
    );
  }
}
