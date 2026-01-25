import { prisma } from "@vayva/db";

interface AdminAuditLogData {
  targetType: string;
  targetId: string;
  storeId?: string;
  reason: string;
  before?: unknown;
  after?: unknown;
  ipAddress?: string;
  userAgent?: string;
}

const logAdminAction = async (
  actorUserId: string,
  action: string,
  data: AdminAuditLogData,
) => {
  await prisma.adminAuditLog.create({
    data: {
      actorUserId,
      action,
      targetType: data.targetType,
      targetId: data.targetId,
      storeId: data.storeId,
      reason: data.reason,
      before: data.before as any,
      after: data.after as any,
      ipAddress: data.ipAddress,
      userAgent: data.userAgent,
    },
  });
};

export interface CreateSupportCaseData {
  storeId: string;
  category: string;
  summary: string;
  links?: string[];
}

export const AdminController = {
  // --- Merchant Management ---
  searchStores: async (query: string): Promise<unknown> => {
    return await prisma.store.findMany({
      where: {
        OR: [
          { name: { contains: query, mode: "insensitive" } },
          { slug: { contains: query, mode: "insensitive" } },
          { id: query },
        ],
      },
      take: 20,
    });
  },

  getMerchantDetail: async (storeId: string): Promise<unknown> => {
    const store = await prisma.store.findUnique({
      where: { id: storeId },
    });

    if (!store) return null;

    // Manual fetches for relation-like data
    const merchantFlags = await prisma.merchantFlag.findMany({
      where: { storeId },
    });
    const supportCases = await prisma.supportCase.findMany({
      where: { storeId, status: { in: ["OPEN", "PENDING"] } },
    });

    return { ...store, merchantFlags, supportCases };
  },

  suspendMerchant: async (
    storeId: string,
    reason: string,
    actorUserId: string,
    ipAddress?: string,
  ): Promise<unknown> => {
    const before = await prisma.store.findUnique({ where: { id: storeId } });

    await prisma.merchantFlag.create({
      data: {
        storeId,
        key: "suspended",
        severity: "HIGH",
        notes: reason,
      },
    });

    await logAdminAction(actorUserId, "merchant.suspend", {
      targetType: "store",
      targetId: storeId,
      storeId,
      reason,
      before,
      ipAddress,
    });

    return { success: true };
  },

  // --- Kill Switches ---
  listKillSwitches: async (): Promise<unknown> => {
    return await prisma.platformKillSwitch.findMany();
  },

  toggleKillSwitch: async (
    key: string,
    enabled: boolean,
    reason: string,
    actorUserId: string,
  ): Promise<unknown> => {
    const before = await prisma.platformKillSwitch.findUnique({
      where: { key },
    });

    const killSwitch = await prisma.platformKillSwitch.upsert({
      where: { key },
      create: { key, enabled, reason },
      update: { enabled, reason },
    });

    await logAdminAction(actorUserId, "killswitch.toggle", {
      targetType: "killswitch",
      targetId: key,
      reason,
      before,
      after: killSwitch,
    });

    return killSwitch;
  },

  // --- Moderation ---
  listPendingReviews: async (): Promise<unknown> => {
    return await prisma.review.findMany({
      where: { status: "PENDING" },
      orderBy: { createdAt: "desc" },
      take: 50,
    });
  },

  moderateReview: async (
    reviewId: string,
    action: "PUBLISHED" | "REJECTED" | "HIDDEN",
    reason: string,
    actorUserId: string,
  ): Promise<unknown> => {
    const before = await prisma.review.findUnique({ where: { id: reviewId } });
    if (!before) throw new Error("Review not found");

    const review = await prisma.review.update({
      where: { id: reviewId },
      data: { status: action },
    });

    await logAdminAction(actorUserId, "review.moderate", {
      targetType: "review",
      targetId: reviewId,
      storeId: review.storeId,
      reason,
      before,
      after: review,
    });

    return review;
  },

  // --- Support Cases ---
  createSupportCase: async (
    data: CreateSupportCaseData,
    actorUserId: string,
  ): Promise<unknown> => {
    return await prisma.supportCase.create({
      data: {
        storeId: data.storeId,
        createdByAdminId: actorUserId,
        category: data.category as any,
        summary: data.summary,
        links: data.links || [],
        status: "OPEN",
      },
    });
  },

  listSupportCases: async (status?: string): Promise<unknown> => {
    return await prisma.supportCase.findMany({
      where: status ? { status: status as any } : undefined,
      orderBy: { createdAt: "desc" },
      take: 100,
    });
  },

  // --- System Health ---
  getSystemHealth: async (): Promise<unknown> => {
    const webhooksPending = await prisma.webhookDelivery.count({
      where: { status: "PENDING" },
    });

    const webhooksFailed = await prisma.webhookDelivery.count({
      where: { status: "FAILED" },
    });

    return {
      webhooks: {
        pending: webhooksPending,
        failed: webhooksFailed,
      },
      timestamp: new Date(),
    };
  },
};
