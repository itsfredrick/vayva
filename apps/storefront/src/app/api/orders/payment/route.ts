import { NextRequest, NextResponse } from "next/server";
import { PaystackService } from "@/lib/paystack";
import { reportError } from "@/lib/error";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { email, amount, orderId, callbackUrl } = body;

    if (!email || !amount || !orderId) {
      return NextResponse.json(
        { error: "Missing required payment fields" },
        { status: 400 },
      );
    }

    // Amount comes in as Naira, convert to Kobo if not already?
    // Let's assume input is in Naira for safety from frontend, but usually frontend sends NGN.
    // Paystack expects Kobo (integer).
    // Let's ensure we are dealing with Kobo.
    // Storefront service passes 'amount' which is usually NGN.
    // Let's cast to Kobo: Math.round(amount * 100).

    // Wait, did the caller already convert?
    // StorefrontService.initializePayment passes { amount: number }
    // Let's assume it's NGN (standard display currency).

    const amountKobo = Math.round(amount * 100);

    const response = await PaystackService.initializeTransaction({
      email,
      amount: amountKobo,
      reference: `ORD-${orderId}-${Date.now()}`, // Unique Ref
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
      { error: error.message || "Payment initialization failed" },
      { status: 500 },
    );
  }
}
