
import { NextResponse } from 'next/server';
import { prisma } from '@vayva/db';
import { PaystackService } from '@/services/PaystackService';
import { LedgerService } from '@/services/LedgerService';
import { WalletTransactionType } from '@vayva/shared';

export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const reference = searchParams.get('reference');

        if (!reference) {
            return NextResponse.json({ error: "Reference required" }, { status: 400 });
        }

        // 1. Verify with Paystack
        const paystackData = await PaystackService.verifyTransaction(reference);

        if (paystackData.status !== 'success') {
            return NextResponse.json({ error: "Payment verification failed or not successful" }, { status: 400 });
        }

        // 2. Find Order
        // We used refCode or ID as reference
        const order = await prisma.order.findFirst({
            where: {
                OR: [
                    { refCode: reference },
                    { id: reference }
                ]
            }
        });

        if (!order) {
            console.error(`Order not found for verified reference: ${reference}`);
            // If order invalid but payment valid, needs manual reconciliation logging
            return NextResponse.json({ error: "Order not found" }, { status: 404 });
        }

        if (order.paymentStatus === 'VERIFIED') {
            return NextResponse.json({ message: "Order already processed", order });
        }

        // 3. Update Order and Credit Ledger in Transaction
        // We do this via LedgerService? LedgerService handles Ledger+Wallet. 
        // Order update is side effect.
        // Let's optimize: Update Order first/concurrently or wrapper.
        // Ideally strict transaction, but LedgerService.recordTransaction is self-contained.

        // Let's create a pragmatic transaction here if LedgerService exposed DB tx, but it doesn't.
        // We will call LedgerService, then update Order.
        // Idempotency check handled by check above.

        const amountKobo = paystackData.amount; // Verified amount

        // Record Ledger Entry
        await LedgerService.recordTransaction({
            storeId: order.storeId,
            type: WalletTransactionType.PAYMENT,
            amount: amountKobo, // Kobo
            currency: 'NGN', // Paystack currency or Order currency
            referenceId: order.id,
            referenceType: 'order',
            description: `Payment for Order #${order.orderNumber}`
        });

        // Update Order
        const updatedOrder = await prisma.order.update({
            where: { id: order.id },
            data: {
                paymentStatus: 'SUCCESS',
                status: 'PAID',
                updatedAt: new Date()
            }
        });

        return NextResponse.json({ message: "Payment successful", order: updatedOrder });

    } catch (error: any) {
        console.error("Payment Verify Error:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
