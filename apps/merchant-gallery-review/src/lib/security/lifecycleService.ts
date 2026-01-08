import { prisma } from "@vayva/db";

export class LifecycleService {
  static async requestExport(merchantId: string) {
    // Test Job Queue
    console.log(`[JOB] Export requested for merchant ${merchantId}`);
    return { jobId: `exp_${Date.now()}`, status: "pending" };
  }

  static async requestDeletion(merchantId: string, reason: string) {
    // Soft Delete / Schedule
    return prisma.merchantAccountLifecycle.upsert({
      where: { merchantId },
      update: {
        status: "deletion_requested",
        deletionRequestedAt: new Date(),
        deletionReason: reason,
      },
      create: {
        merchantId,
        status: "deletion_requested",
        deletionRequestedAt: new Date(),
        deletionReason: reason,
      },
    });
  }

  static async cancelDeletion(merchantId: string) {
    return prisma.merchantAccountLifecycle.update({
      where: { merchantId },
      data: {
        status: "active",
        deletionRequestedAt: null,
        deletionReason: null,
      },
    });
  }
}
