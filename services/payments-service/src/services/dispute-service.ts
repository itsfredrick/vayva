import { prisma } from "@vayva/db";
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
    // Composite unique key: provider + providerDisputeId
    const existing = await prisma.dispute.findUnique({
      where: {
        provider_providerDisputeId: {
          provider: data.provider,
          providerDisputeId: data.providerDisputeId,
        },
      },
    });

    if (existing) return existing;

    return prisma.dispute.create({
      data: {
        merchantId: data.merchantId,
        storeId: data.merchantId, // Using merchantId as storeId for V1
        provider: data.provider,
        providerDisputeId: data.providerDisputeId,
        amount: data.amount, // Field is 'amount'
        currency: data.currency,
        reasonCode: data.reasonCode || "Unknown", // Field is 'reasonCode' not 'reason'
        orderId: data.orderId,
        evidenceDueAt: data.evidenceDueAt, // Field is 'evidenceDueAt' not 'deadlineAt'
        status: "OPENED",
        // correlationId // Field absent in schema? I'll remove it.
      },
    });
  }

  async addEvidence(
    disputeId: string,
    data: {
      merchantId: string;
      type: any;
      url?: string;
      textExcerpt?: string;
      metadata?: any;
    },
  ) {
    const evidence = await prisma.disputeEvidence.create({
      data: {
        disputeId,
        type: data.type || "OTHER", // Enum required
        url: data.url || "",
        // Mapping extra fields to metadata since schema lacks them
        metadata: {
          fileName: "evidence.txt",
          fileSize: 0,
          contentType: "text/plain",
          uploadedBy: "SYSTEM",
          merchantId: data.merchantId,
          ...(data.metadata || {}),
        },
      },
    });

    return evidence;
  }

  async getDisputes(merchantId: string) {
    return prisma.dispute.findMany({
      where: { merchantId },
      orderBy: { createdAt: "desc" },
    });
  }

  async getDisputeDetails(disputeId: string) {
    const dispute = await prisma.dispute.findUnique({
      where: { id: disputeId },
      include: { order: true }, // camelCase relation
    });

    if (!dispute) return null;

    // Manual fetch for evidence since relation is missing
    const evidence = await prisma.disputeEvidence.findMany({
      where: { disputeId },
    });

    return { ...dispute, evidence };
  }
}

export const disputeService = new DisputeService();
