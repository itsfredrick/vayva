import { prisma } from '@vayva/db';
// Using any for some types if they are strings in schema now

export class DisputeService {

    async createDispute(data: {
        merchantId: string;
        provider: any;
        providerDisputeId: string;
        amount: number;
        currency: string;
        reasonCode?: string;
        paymentId?: string;
        orderId?: string;
        evidenceDueAt?: Date;
    }) {
        // Idempotency: Ignore if exists
        const existing = await prisma.disputeV2.findUnique({
            where: { providerDisputeId: data.providerDisputeId }
        });

        if (existing) return existing;

        return prisma.disputeV2.create({
            data: {
                merchantId: data.merchantId,
                storeId: data.merchantId, // Using merchantId as storeId for V1
                provider: data.provider,
                providerDisputeId: data.providerDisputeId,
                amountNgn: data.amount,
                currency: data.currency,
                reason: data.reasonCode || 'Unknown',
                orderId: data.orderId,
                deadlineAt: data.evidenceDueAt,
                status: 'OPENED',
                correlationId: `DISP-${Date.now()}`
            }
        });
    }

    async addEvidence(disputeId: string, data: {
        merchantId: string;
        type: any;
        url?: string;
        textExcerpt?: string;
        metadata?: any;
    }) {
        const evidence = await (prisma as any).disputeEvidenceV2.create({
            data: {
                disputeId,
                merchantId: data.merchantId,
                type: data.type,
                fileUrl: data.url || '',
                fileName: 'evidence.txt',
                fileSize: 0,
                contentType: 'text/plain',
                uploadedBy: 'SYSTEM'
            }
        });

        return evidence;
    }

    async getDisputes(merchantId: string) {
        return prisma.disputeV2.findMany({
            where: { merchantId },
            orderBy: { createdAt: 'desc' }
        });
    }

    async getDisputeDetails(disputeId: string) {
        return prisma.disputeV2.findUnique({
            where: { id: disputeId },
            include: { evidence: true, order: true } as any
        });
    }
}

export const disputeService = new DisputeService();
