import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@vayva/db";
import { PaystackService } from "@/lib/paystack";
import { reportError } from "@/lib/error";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { email, orderId, callbackUrl } = body;

    // 1. Validate Input
    if (!email || !orderId) {
      return NextResponse.json(
        { error: "Missing required payment fields" },
        { status: 400 },
      );
    }

    // 2. Fetch Authoritative Order
    const order = await prisma.order.findUnique({
      where: { id: orderId }
    });

    if (!order) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    // 3. Security & State Checks
    if (order.paymentStatus === "SUCCESS" || order.status === "PAID") {
      return NextResponse.json({ error: "Order is already paid" }, { status: 400 });
    }

    // Verify ownership (or at least knowledge of email)
    if (order.customerEmail && order.customerEmail.toLowerCase() !== email.toLowerCase()) {
      return NextResponse.json({ error: "Invalid customer email" }, { status: 403 });
    }

    // 4. Use Database Price (Source of Truth)
    // Paystack expects Kobo (integer). Order.total is in Naira (decimal/float).
    const amountKobo = Math.round(Number(order.total) * 100);

    const response = await PaystackService.initializeTransaction({
      email,
      amount: amountKobo,
      reference: `ORD-${orderId}-${Date.now()}`,
      callback_url: callbackUrl,
      metadata: {
        order_id: orderId,
        custom_fields: [
          {
            display_name: "Order ID",
            variable_name: "order_id",
            value: orderId,
          },
        ],
      },
    });

    return NextResponse.json(response);
  } catch (error: any) {
    reportError(error, { route: "POST /api/orders/payment" });
    return NextResponse.json(
      { error: error?.message || "Payment initialization failed" },
      { status: 500 },
    );
  }
}
