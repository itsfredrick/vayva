import { NextResponse } from "next/server";
import { prisma } from "@vayva/db";
import { PaystackService } from "@/services/PaystackService";
import { LedgerService } from "@/services/LedgerService";
import { WalletTransactionType } from "@vayva/shared";
import crypto from "crypto";

/**
 * Payment Verification Endpoint
 *
 * SECURITY CRITICAL: This endpoint handles payment confirmations
 * - Verifies Paystack webhook signatures
 * - Validates payment amounts match order totals
 * - Uses database transactions for data integrity
 */

// GET endpoint for redirect-based verification
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const reference = searchParams.get("reference");

    if (!reference) {
      return NextResponse.json(
        { error: "Reference required" },
        { status: 400 },
      );
    }

    // 1. Verify with Paystack
    const paystackData = await PaystackService.verifyTransaction(reference);

    if (paystackData.status !== "success") {
      return NextResponse.json(
        { error: "Payment verification failed or not successful" },
        { status: 400 },
      );
    }

    // 2. Find Order
    const order = await prisma.order.findFirst({
      where: {
        OR: [{ refCode: reference }, { id: reference }],
      },
    });

    if (!order) {
      console.error(`Order not found for verified reference: ${reference}`);
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    // 3. Idempotency check
    if (
      order.paymentStatus === "SUCCESS" ||
      order.paymentStatus === "VERIFIED"
    ) {
      return NextResponse.json({ message: "Order already processed", order });
    }

    // 4. CRITICAL: Verify amount matches
    const orderAmountKobo = Math.round(Number(order.total) * 100); // Convert to kobo
    const paystackAmountKobo = paystackData.amount;

    if (orderAmountKobo !== paystackAmountKobo) {
      console.error(
        `Amount mismatch! Order: ${orderAmountKobo}, Paystack: ${paystackAmountKobo}`,
      );
      return NextResponse.json(
        {
          error: "Payment amount mismatch",
          details: {
            expected: orderAmountKobo,
            received: paystackAmountKobo,
          },
        },
        { status: 400 },
      );
    }

    // 5. CRITICAL: Update in transaction for data integrity
    await prisma.$transaction(async (tx: any) => {
      // Record Ledger Entry
      await LedgerService.recordTransaction({
        storeId: order.storeId,
        type: WalletTransactionType.PAYMENT,
        amount: paystackAmountKobo,
        currency: "NGN",
        referenceId: order.id,
        referenceType: "order",
        description: `Payment for Order #${order.orderNumber}`,
      });

      // Update Order
      await tx.order.update({
        where: { id: order.id },
        data: {
          paymentStatus: "SUCCESS",
          status: "PAID",
          updatedAt: new Date(),
        },
      });
    });

    const updatedOrder = await prisma.order.findUnique({
      where: { id: order.id },
    });

    return NextResponse.json({
      message: "Payment successful",
      order: updatedOrder,
    });
  } catch (error: any) {
    console.error("Payment Verify Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// POST endpoint for webhook-based verification
export async function POST(request: Request) {
  try {
    // 1. CRITICAL: Verify Paystack signature
    const signature = request.headers.get("x-paystack-signature");
    const body = await request.text();

    if (!signature) {
      console.error("Missing Paystack signature");
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Verify signature
    const hash = crypto
      .createHmac("sha512", process.env.PAYSTACK_SECRET_KEY!)
      .update(body)
      .digest("hex");

    if (hash !== signature) {
      console.error("Invalid Paystack signature");
      return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
    }

    // 2. Parse webhook data
    const event = JSON.parse(body);

    // Only process successful charge events
    if (event.event !== "charge.success") {
      return NextResponse.json({ message: "Event ignored" });
    }

    const reference = event.data.reference;
    const amountKobo = event.data.amount;

    // 3. Find Order
    const order = await prisma.order.findFirst({
      where: {
        OR: [{ refCode: reference }, { id: reference }],
      },
    });

    if (!order) {
      console.error(`Order not found for webhook reference: ${reference}`);
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    // 4. Idempotency check
    if (
      order.paymentStatus === "SUCCESS" ||
      order.paymentStatus === "VERIFIED"
    ) {
      return NextResponse.json({ message: "Order already processed" });
    }

    // 5. CRITICAL: Verify amount matches
    const orderAmountKobo = Math.round(Number(order.total) * 100);

    if (orderAmountKobo !== amountKobo) {
      console.error(
        `Webhook amount mismatch! Order: ${orderAmountKobo}, Paystack: ${amountKobo}`,
      );
      return NextResponse.json(
        {
          error: "Payment amount mismatch",
        },
        { status: 400 },
      );
    }

    // 6. CRITICAL: Update in transaction
    await prisma.$transaction(async (tx: any) => {
      // Record Ledger Entry
      await LedgerService.recordTransaction({
        storeId: order.storeId,
        type: WalletTransactionType.PAYMENT,
        amount: amountKobo,
        currency: "NGN",
        referenceId: order.id,
        referenceType: "order",
        description: `Payment for Order #${order.orderNumber} (Webhook)`,
      });

      // Update Order
      await tx.order.update({
        where: { id: order.id },
        data: {
          paymentStatus: "SUCCESS",
          status: "PAID",
          updatedAt: new Date(),
        },
      });
    });

    return NextResponse.json({ message: "Webhook processed successfully" });
  } catch (error: any) {
    console.error("Webhook Processing Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
