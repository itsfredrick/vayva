
import { NextResponse } from 'next/server';
import { prisma } from '@vayva/db';
import { PaystackService } from '@/services/PaystackService';

export async function POST(request: Request) {
    try {
        const { orderId, callbackUrl } = await request.json();

        if (!orderId) {
            return NextResponse.json({ error: "Order ID is required" }, { status: 400 });
        }

        const order = await prisma.order.findUnique({
            where: { id: orderId },
            include: { Customer: true }
        });

        if (!order) {
            return NextResponse.json({ error: "Order not found" }, { status: 404 });
        }

        if (order.status === 'PAID' || order.paymentStatus === 'SUCCESS' || order.paymentStatus === 'VERIFIED') {
            return NextResponse.json({ error: "Order already paid" }, { status: 400 });
        }

        // Amount in order is typically in Major units (NGN), Paystack needs Kobo
        // Schema says `total` is Decimal.
        const amountKobo = Math.round(Number(order.total) * 100);
        const email = order.Customer?.email || order.customerEmail || 'guest@vayva.com';

        const initResponse = await PaystackService.initializeTransaction(
            email,
            amountKobo,
            order.refCode || order.id, // Use refCode if available for neatness, or ID
            callbackUrl || 'http://localhost:3000/order/confirmation'
        );

        return NextResponse.json(initResponse);

    } catch (error: any) {
        console.error("Payment Init Error:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
