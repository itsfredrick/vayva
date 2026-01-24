import { prisma } from "@vayva/db";

export class DisputeService {
    static async getDisputes(storeId: any, status: any) {
        return prisma.dispute.findMany({
            where: {
                storeId,
                status: status || undefined,
            },
            include: {
                order: true,
            },
            orderBy: { createdAt: "desc" },
        });
    }

    static async getDispute(disputeId: any, storeId: any) {
        return prisma.dispute.findFirst({
            where: {
                id: disputeId,
                storeId,
            },
            include: {
                order: true,
                evidence: true,
            } as any,
        });
    }

    static async submitEvidence(disputeId: any, userId: any, fileData: any) {
        return prisma.disputeEvidence.create({
            data: {
                disputeId,
                fileUrl: fileData.url,
                fileType: "DOCUMENT",
                metadata: {
                    fileName: fileData.fileName,
                    fileSize: fileData.fileSize,
                    contentType: fileData.contentType,
                    uploadedBy: userId,
                },
            } as any,
        });
    }

    static async submitResponse(disputeId: any, userId: any, note: any) {
        // Reject submission if not configured, using structure API can parse
        const error = new Error("Dispute submission is not configured");
        (error as any).code = "feature_not_configured";
        (error as any).feature = "DISPUTES_ENABLED";
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
