import { prisma } from "@vayva/db";

export class SupportContextService {
  /**
   * Get a comprehensive safe snapshot for the support bot
   */
  static async getMerchantSnapshot(storeId: string) {
    const [storeData, orders] = await Promise.all([
      prisma.store.findUnique({
        where: { id: storeId },
        include: { merchantSubscription: true, waAgentSettings: true } as any,
      }),
      prisma.order.findMany({
        where: { storeId },
        take: 5,
        orderBy: { createdAt: "desc" },
        select: { id: true, status: true, total: true, createdAt: true },
      }),
    ]);

    if (!storeData) return null;

    return {
      store: {
        name: storeData.name,
        category: storeData.category,
        verificationStatus: storeData.isLive ? "LIVE" : "DRAFT",
        domain: (storeData as any).customDomain || "vayva.shop",
      },
      plan: {
        name: storeData.plan || "FREE",
        status: (storeData as any).merchantSubscription?.status || "TRIAL",
        expiresAt: (storeData as any).merchantSubscription?.trialEndsAt,
        daysRemaining: (storeData as any).merchantSubscription?.trialEndsAt
          ? Math.max(0, Math.ceil((new Date((storeData as any).merchantSubscription.trialEndsAt).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)))
          : null,
      },
      stats: {
        totalOrders: await prisma.order.count({ where: { storeId } }),
        totalProducts: await prisma.product.count({ where: { storeId } }),
        totalLeads: await prisma.customer.count({ where: { storeId } }),
      },
      whatsapp: {
        connected: !!(storeData as any).waAgentSettings,
        status: "ACTIVE",
        aiActive: true,
      },
      recentOrders: orders.map((o) => ({
        id: o.id,
        status: o.status,
        amount: `₦${(Number(o.total) / 100).toFixed(2)}`,
        date: o.createdAt.toISOString().split("T")[0],
      })),
    };
  }
}
