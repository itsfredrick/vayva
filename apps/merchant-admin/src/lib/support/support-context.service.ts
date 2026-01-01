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
        verificationStatus: storeData.isLive ? "LIVE" : "DRAFT", // Simplified mapping
        domain: (storeData as any).customDomain || "vayva.shop", // Fallback
      },
      plan: {
        name: (storeData as any).merchantSubscription?.planId || "Free",
        status: (storeData as any).merchantSubscription?.status || "TRIAL",
        expiresAt: (storeData as any).merchantSubscription?.currentPeriodEnd,
      },
      whatsapp: {
        connected: !!(storeData as any).waAgentSettings,
        status: "ACTIVE", // Simplified for MVP
        aiActive: true,
      },
      recentOrders: orders.map((o) => ({
        id: o.id,
        status: o.status,
        amount: `₦${(Number(o.total) / 100).toFixed(2)}`, // Assuming Decimal requires formatting
        date: o.createdAt.toISOString().split("T")[0],
      })),
    };
  }
}
