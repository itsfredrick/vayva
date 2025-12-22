
import { prisma } from '@vayva/db';

export class DisputeService {

    static async handleWebhookEvent(event: any) {
        // event: { event: 'dispute.create', data: { ... } }
        const { event: eventType, data } = event;

        // 1. Map Paystack Data to our Schema
        // data usually contains: id, amount, currency, transaction: { reference }, reason, due_at

        const providerDisputeId = data.id.toString(); // Paystack ID is number/string
        const amount = data.amount; // Paystack is in kobo? Assume passed as normalized or check docs. usually kobo.
        const amountNgn = amount / 100;

        // 2. Resolve Store/Order
        // We need to find the store. 
        // Maybe via transaction reference -> Order -> Store?
        // Or transaction -> Payment -> ...
        // For V1, let's try to find an Order by provider reference "data.transaction.reference"
        // If not found, we might need a fallback or log error.

        // Mock lookup:
        // const order = await prisma.order.findUnique({ where: { providerRef: data.transaction.reference }})
        // const storeId = order.storeId;
        const storeId = 'store_mock_id'; // Fallback for V1 ingestion without live orders

        if (!storeId) throw new Error('Store not found for dispute');

        // 3. Upsert Dispute (Safe check first as providerDisputeId not unique)
        let status = 'OPENED';
        if (eventType === 'dispute.evidence_required') status = 'EVIDENCE_REQUIRED';
        if (eventType === 'dispute.won') status = 'WON';
        if (eventType === 'dispute.lost') status = 'LOST';

        const existingDispute = await prisma.dispute.findFirst({
            where: { providerDisputeId }
        });

        if (existingDispute) {
            await prisma.dispute.update({
                where: { id: existingDispute.id },
                data: {
                    status: status as any, // Cast to any to bypass strict enum check if mismatched
                    evidenceDueAt: data.due_at ? new Date(data.due_at) : undefined,
                }
            });
        } else {
            await prisma.dispute.create({
                data: {
                    merchantId: 'user_mock_id', // Needs resolution
                    provider: 'PAYSTACK',
                    providerDisputeId,
                    status: status as any,
                    amount: amountNgn, // Decimal? Needs Decimal type or number
                    currency: 'NGN',
                    reasonCode: data.reason || 'General Dispute',
                    evidenceDueAt: data.due_at ? new Date(data.due_at) : undefined,
                }
            });
        }

        // 4. Notify (Logic Stub)
        // if (status === 'evidence_required') sendNotification(...)
    }

    static async addEvidence(disputeId: string, userId: string, fileData: any) {
        return prisma.disputeEvidence.create({
            data: {
                disputeId,
                type: fileData.type,
                url: fileData.fileUrl,
                metadata: {
                    fileName: fileData.fileName,
                    fileSize: fileData.fileSize,
                    contentType: fileData.contentType,
                    uploadedBy: userId
                }
            }
        });
    }

    static async submitResponse(disputeId: string, userId: string, note?: string) {
        await prisma.$transaction(async (tx) => {
            // Create Submission Record
            await tx.disputeSubmissionV2.create({
                data: {
                    disputeId,
                    submittedBy: userId,
                    notes: note
                }
            });

            // Update Status
            await tx.dispute.update({
                where: { id: disputeId },
                data: { status: 'SUBMITTED' as any }
            });

            // TODO: Trigger API call to Paystack to actually submit
        });
    }

    static async getRecentDeadlines() {
        const soon = new Date();
        soon.setHours(soon.getHours() + 72); // 3 Days

        return prisma.dispute.findMany({
            where: {
                status: 'EVIDENCE_REQUIRED',
                evidenceDueAt: {
                    lte: soon,
                    gte: new Date()
                }
            }
        });
    }
}
