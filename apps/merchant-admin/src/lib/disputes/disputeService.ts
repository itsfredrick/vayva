import { prisma } from "@vayva/db";

export class DisputeService {
  static async handleWebhookEvent(event: any) {
    const { event: eventType, data } = event;

    const providerDisputeId = data.id.toString();
    const amount = data.amount;
    const amountNgn = amount / 100;

    const providerRef = data.transaction?.reference;
    if (!providerRef) return;

    // Use PaymentTransaction for unique lookup
    const transaction = await prisma.paymentTransaction.findUnique({
      where: { reference: providerRef },
      include: {
        store: {
          include: {
            memberships: {
              where: { role: "OWNER" },
              take: 1,
            },
          },
        },
      },
    });

    if (!transaction || !transaction.store) return;

    const storeId = transaction.store.id;
    // Resolve real merchant owner ID or fallback
    const merchantId =
      transaction.store.memberships[0]?.userId || "system_fallback";

    // Upsert Dispute
    let status = "OPENED";
    if (eventType === "dispute.evidence_required") status = "EVIDENCE_REQUIRED";
    if (eventType === "dispute.won") status = "WON";
    if (eventType === "dispute.lost") status = "LOST";

    const existingDispute = await prisma.dispute.findFirst({
      where: { providerDisputeId },
    });

    if (existingDispute) {
      await prisma.dispute.update({
        where: { id: existingDispute.id },
        data: {
          status: status as any,
          evidenceDueAt: data.due_at ? new Date(data.due_at) : undefined,
        },
      });
    } else {
      await prisma.dispute.create({
        data: {
          merchantId: merchantId,
          storeId: storeId,
          provider: "PAYSTACK",
          providerDisputeId,
          status: status as any,
          amount: amountNgn,
          currency: "NGN",
          reasonCode: data.reason || "General Dispute",
          evidenceDueAt: data.due_at ? new Date(data.due_at) : undefined,
        },
      });
    }
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
          uploadedBy: userId,
        },
      },
    });
  }

  static async submitResponse(
    disputeId: string,
    userId: string,
    note?: string,
  ) {
    // Reject submission if not configured, using structure API can parse
    const error: any = new Error("Dispute submission is not configured");
    error.code = "feature_not_configured";
    error.feature = "DISPUTES_ENABLED";
    throw error;
  }

  static async getRecentDeadlines() {
    const soon = new Date();
    soon.setHours(soon.getHours() + 72); // 3 Days

    return prisma.dispute.findMany({
      where: {
        status: "EVIDENCE_REQUIRED",
        evidenceDueAt: {
          lte: soon,
          gte: new Date(),
        },
      },
    });
  }
}
