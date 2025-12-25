
import { Job } from 'bullmq';
import { prisma, PaymentStatus, OrderStatus } from '@vayva/db';

export const processStripeEvent = async (job: Job) => {
    const { eventId, type, data } = job.data;

    // Check if recently processed (idempotency at job level too)
    const webhookEvent = await prisma.paymentWebhookEvent.findFirst({
        where: { provider: 'stripe', providerEventId: eventId }
    });

    if (webhookEvent?.status === 'PROCESSED') {
        return;
    }

    try {
        switch (type) {
            case 'payment_intent.succeeded':
                await handlePaymentIntentSucceeded(data);
                break;
            case 'payment_intent.payment_failed':
                await handlePaymentIntentFailed(data);
                break;
            case 'charge.succeeded':
                await handleChargeSucceeded(data);
                break;
            case 'charge.refunded':
                await handleChargeRefunded(data);
                break;
            default:
                console.log(`Unhandled event type: ${type}`);
        }

        // Mark as processed
        await prisma.paymentWebhookEvent.update({
            where: { provider_providerEventId: { provider: 'stripe', providerEventId: eventId } },
            data: { status: 'PROCESSED', processedAt: new Date() }
        });

    } catch (err: any) {
        // Log failure
        await prisma.paymentWebhookEvent.update({
            where: { provider_providerEventId: { provider: 'stripe', providerEventId: eventId } },
            data: { status: 'FAILED', error: err.message }
        });
        throw err; // Trigger retry
    }
};

async function handlePaymentIntentSucceeded(intent: any) {
    // 1. Update Intent Record
    const paymentIntent = await prisma.paymentIntent.update({
        where: { provider_providerPaymentIntentId: { provider: 'stripe', providerPaymentIntentId: intent.id } },
        data: {
            status: 'succeeded',
            amount: intent.amount / 100, // Stripe is minor units
        },
        include: { Order: true }
    });

    // 2. Update Order Status if linked
    if (paymentIntent.orderId) {
        await prisma.order.update({
            where: { id: paymentIntent.orderId },
            data: {
                paymentStatus: 'SUCCESS',
                status: 'PAID' // Simplified transition
            }
        });
    }
}

async function handlePaymentIntentFailed(intent: any) {
    await prisma.paymentIntent.update({
        where: { provider_providerPaymentIntentId: { provider: 'stripe', providerPaymentIntentId: intent.id } },
        data: {
            status: 'failed',
        }
    });
    // Can update order to 'PENDING_PAYMENT' or 'FAILED' if needed
}

async function handleChargeSucceeded(charge: any) {
    // Create or Update Charge Record
    // Note: Charge usually comes after PaymentIntent success or simultaneously

    // Find linked intent
    const intentId = charge.payment_intent;
    const paymentIntent = await prisma.paymentIntent.findUnique({
        where: { provider_providerPaymentIntentId: { provider: 'stripe', providerPaymentIntentId: intentId } }
    });

    if (!paymentIntent) {
        console.warn(`Orphan charge ${charge.id} for intent ${intentId}`);
        return;
    }

    const amount = charge.amount / 100;
    const fee = (charge.balance_transaction?.fee || 0) / 100; // Simplified fee logic (needs fetch usually)

    // Check if charge exists
    const existing = await prisma.charge.findUnique({
        where: { provider_providerChargeId: { provider: 'stripe', providerChargeId: charge.id } }
    });

    if (!existing) {
        await prisma.charge.create({
            data: {
                storeId: paymentIntent.storeId,
                orderId: paymentIntent.orderId,
                paymentIntentId: paymentIntent.id,
                provider: 'stripe',
                providerChargeId: charge.id,
                status: 'succeeded',
                amount: amount,
                currency: charge.currency,
                paidAt: new Date(charge.created * 1000),
                receiptUrl: charge.receipt_url
            }
        });

        // 3. Create Ledger Entries (Double Entry)
        // Debit: Cash/Receivable (Asset) | Credit: Revenue (Equity/Income)
        // Also Debit: Fees (Expense) | Credit: Cash (Asset)

        await prisma.ledgerEntry.createMany({
            data: [
                {
                    storeId: paymentIntent.storeId,
                    referenceType: 'charge',
                    referenceId: charge.id,
                    direction: 'DEBIT',
                    account: 'cash', // or 'stripe_clearing'
                    amount: amount,
                    currency: charge.currency,
                    description: `Sale from Order ${paymentIntent.orderId}`
                },
                {
                    storeId: paymentIntent.storeId,
                    referenceType: 'charge',
                    referenceId: charge.id,
                    direction: 'CREDIT',
                    account: 'revenue',
                    amount: amount,
                    currency: charge.currency,
                    description: `Revenue from Order ${paymentIntent.orderId}`
                }
            ]
        });
    }
}

async function handleChargeRefunded(charge: any) {
    // Determine refund amount from event
    const amountRefunded = charge.amount_refunded / 100;

    await prisma.charge.update({
        where: { provider_providerChargeId: { provider: 'stripe', providerChargeId: charge.id } },
        data: {
            status: charge.refunded ? 'refunded' : 'partial_refund'
        }
    });

    // Ledger logic for refund would go here (Debit Revenue/Refunds, Credit Cash)
    // Complex because we need the Refund object ID ideally. 
    // Usually we listen to `refund.created` or `charge.refunded`
}
