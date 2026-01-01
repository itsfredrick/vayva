import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@vayva/db";
import { PaystackService } from "@/services/PaystackService";

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ slug: string }> },
) {
  try {
    const { slug } = await params;
    const body = await req.json();
    const { customer, items, total } = body;

    if (!customer || !items || items.length === 0) {
      return NextResponse.json(
        { error: "Invalid cart or customer data" },
        { status: 400 },
      );
    }

    const store = await prisma.store.findUnique({
      where: { slug },
      select: { id: true },
    });

    if (!store) {
      return NextResponse.json({ error: "Store not found" }, { status: 404 });
    }

    // Simple ID generation (in production use a robust generator)
    const refCode = `ORD-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
    const orderNumber = `#${Math.floor(100000 + Math.random() * 900000)}`;

    // Create Order
    const order = await prisma.order.create({
      data: {
        storeId: store.id,
        refCode,
        orderNumber,
        customerEmail: customer.email,
        customerPhone: customer.phone,
        // Using DRAFT as it is the safe default. Status flow: DRAFT -> PAID -> FULFILLED
        status: "DRAFT",
        subtotal: total,
        total: total,
        OrderItem: {
          create: items.map((item: any) => ({
            title: item.name,
            price: item.price,
            quantity: item.quantity,
            productId: item.id,
          })),
        },
      },
    });

    // Initialize Paystack Transaction
    try {
      const origin = req.nextUrl.origin;
      // Callback to the store page with query params to show success modal
      const callbackUrl = `${origin}/store/${slug}?payment_success=true&order_ref=${refCode}`;

      const paystackData = await PaystackService.initializeTransaction(
        customer.email,
        Math.round(total * 100), // Convert to Kobo
        refCode,
        callbackUrl,
        {
          orderId: order.id,
          storeId: store.id,
          type: "storefront_order",
        },
      );

      // Update order with payment reference if needed (optional, as we used refCode)

      return NextResponse.json({
        success: true,
        orderId: order.id,
        authorization_url: paystackData.authorization_url,
        reference: paystackData.reference,
        message: "Order created, redirecting to payment...",
      });
    } catch (paymentError: any) {
      console.error("Payment Initialization Error:", paymentError);
      // Optionally delete the draft order or mark as failed
      // For now, we return specific error
      return NextResponse.json(
        {
          error: "Payment initialization failed. Please try again.",
          details: paymentError.message,
        },
        { status: 500 },
      );
    }
  } catch (error: any) {
    console.error("Checkout Error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}
