import { Job } from "bullmq";
import { prisma } from "@vayva/db";

export const processPaystackEvent = async (job: Job) => {
    const { eventType, data, metadata } = job.data;


    if (eventType === "charge.success") {
        await handleChargeSuccess(data, metadata);
    }
};

interface PaystackPayload {
    id: number;
    reference: string;
    amount: number;
    currency: string;
    paid_at?: string;
    receipt_number?: string;
    fees?: number;
}

async function handleChargeSuccess(data: PaystackPayload, metadata: unknown) {
    const meta = metadata as { storeId?: string; orderId?: string } || {};
    const reference = data.reference;
    const existingCharge = await prisma.charge.findFirst({
        where: {
            provider: "PAYSTACK",
            providerChargeId: String(data.id),
        },
    });

    if (existingCharge) {
        return;
    }

    const amountKobo = data.amount;
    const amountNaira = amountKobo / 100;
    const currency = data.currency;
    const storeId = meta.storeId;

    if (!storeId) {
        console.error(
            "[PAYSTACK_WORKER] Missing storeId in metadata, cannot record ledger",
        );
        return;
    }

    // 1. Create Charge Record
    const charge = await prisma.charge.create({
        data: {
            storeId,
            orderId: meta.orderId,
            provider: "PAYSTACK",
            providerChargeId: String(data.id),
            status: "succeeded",
            amount: amountNaira,
            currency: currency,
            paidAt: new Date(data.paid_at || new Date()),
            receiptUrl: data.receipt_number || null,
        },
    });

    // 2. Create Ledger Entries
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
                amount: netNaira,
                currency,
                description: `Net Sale Settlement - ${reference}`,
            },
            {
                storeId,
                referenceType: "charge",
                referenceId: charge.id,
                direction: "DEBIT",
                account: "fees",
                amount: feesNaira,
                currency,
                description: `Processing Fees - ${reference}`,
            },
            {
                storeId,
                referenceType: "charge",
                referenceId: charge.id,
                direction: "CREDIT",
                account: "revenue",
                amount: amountNaira,
                currency,
                description: `Revenue from Sale - ${reference}`,
            },
        ],
    });
}
