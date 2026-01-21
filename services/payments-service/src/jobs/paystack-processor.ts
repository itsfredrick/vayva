import { Job } from "bullmq";
import { prisma } from "@vayva/db";

export const processPaystackEvent = async (job: Job) => {
    const { eventType, data, metadata } = job.data;

    console.log(`[PAYSTACK_WORKER] Processing ${eventType} for ${data.reference}`);

    if (eventType === "charge.success") {
        await handleChargeSuccess(data, metadata);
    }
};

async function handleChargeSuccess(data: any, metadata: any) {
    const reference = data.reference;
    const existingCharge = await prisma.charge.findFirst({
        where: {
            provider: "PAYSTACK",
            providerChargeId: String(data.id)
        }
    });

    if (existingCharge) {
        console.log(`[PAYSTACK_WORKER] Charge ${data.id} already processed`);
        return;
    }

    const amountKobo = data.amount;
    const amountNaira = amountKobo / 100;
    const currency = data.currency;
    const storeId = metadata?.storeId; // We rely on metadata heavily
    const orderId = metadata?.orderId; // Optional link

    if (!storeId) {
        console.error("[PAYSTACK_WORKER] Missing storeId in metadata, cannot record ledger");
        return;
        // In prod we might try to infer from customer or reference format, 
        // but metadata is safest for multi-tenant.
    }

    // 1. Create Charge Record
    const charge = await prisma.charge.create({
        data: {
            storeId,
            orderId, // Link if present
            provider: "PAYSTACK",
            providerChargeId: String(data.id),
            status: "succeeded",
            amount: amountNaira,
            currency: currency,
            paidAt: new Date(data.paid_at || new Date()),
            receiptUrl: data.receipt_number || null, // Paystack doesn't always send URL in webhook data immediately
            // PaymentIntentId? Paystack doesn't strictly have Intents like Stripe, 
            // but we could map 'reference' to a transient intent if needed. 
            // For now we leave it null or map checking 'reference'.
        }
    });

    // 2. Create Ledger Entries (Double Entry)
    // Debit Cash (Asset)
    // Credit Revenue (Income)

    // Note: Fees handling would require `data.fees` (Paystack sends fees in kobo usually)
    const feesKobo = data.fees || 0;
    const feesNaira = feesKobo / 100;
    const netNaira = amountNaira - feesNaira;

    await prisma.ledgerEntry.createMany({
        data: [
            {
                storeId,
                referenceType: "charge",
                referenceId: charge.id,
                direction: "DEBIT",
                account: "cash",
                amount: netNaira, // We received Net
                currency,
                description: `Net Sale Settlement - ${reference}`,
            },
            {
                storeId,
                referenceType: "charge",
                referenceId: charge.id,
                direction: "DEBIT",
                account: "fees",
                amount: feesNaira, // Expense
                currency,
                description: `Processing Fees - ${reference}`,
            },
            {
                storeId,
                referenceType: "charge",
                referenceId: charge.id,
                direction: "CREDIT",
                account: "revenue",
                amount: amountNaira, // Gross Revenue
                currency,
                description: `Revenue from Sale - ${reference}`,
            }
        ]
    });

    console.log(`[PAYSTACK_WORKER] Ledger entries created for ${reference}`);
}
