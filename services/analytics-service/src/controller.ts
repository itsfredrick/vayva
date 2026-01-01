import { prisma } from "@vayva/db";

export const AnalyticsController = {
  // --- Overview Dashboard ---
  getOverview: async (storeId: string, range: string = "30d") => {
    const daysAgo = range === "7d" ? 7 : range === "90d" ? 90 : 30;
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - daysAgo);

    // Aggregate KPIs
    const sales = await prisma.analyticsDailySales.aggregate({
      where: { storeId, date: { gte: startDate } },
      _sum: { netSales: true, ordersCount: true, refunds: true },
    });

    const payments = await prisma.analyticsDailyPayments.aggregate({
      where: { storeId, date: { gte: startDate } },
      _sum: { successCount: true, failedCount: true },
    });

    const delivery = await prisma.analyticsDailyDelivery.aggregate({
      where: { storeId, date: { gte: startDate } },
      _avg: { deliverySuccessRate: true },
    });

    const support = await prisma.analyticsDailySupport.aggregate({
      where: { storeId, date: { gte: startDate } },
      _avg: { firstResponseAvgSeconds: true },
    });

    // Latest Health Score
    const healthScore = await prisma.healthScore.findFirst({
      where: { storeId },
      orderBy: { date: "desc" },
    });

    const paymentSuccessRate =
      payments._sum.successCount && payments._sum.failedCount
        ? (payments._sum.successCount /
            (payments._sum.successCount + payments._sum.failedCount)) *
          100
        : 0;

    const refundRate =
      sales._sum.netSales && sales._sum.refunds
        ? (Number(sales._sum.refunds) / Number(sales._sum.netSales)) * 100
        : 0;

    return {
      kpis: {
        netSales: sales._sum.netSales || 0,
        orders: sales._sum.ordersCount || 0,
        paymentSuccessRate: paymentSuccessRate.toFixed(1),
        deliverySuccessRate: delivery._avg.deliverySuccessRate || 0,
        refundRate: refundRate.toFixed(1),
        whatsappResponseTime: support._avg.firstResponseAvgSeconds || 0,
      },
      healthScore: healthScore?.score || 0,
      healthComponents: healthScore?.components || {},
    };
  },

  // --- Reports ---
  getSalesReport: async (storeId: string, filters: any) => {
    const { dateFrom, dateTo } = filters;

    return await prisma.analyticsDailySales.findMany({
      where: {
        storeId,
        date: {
          gte: dateFrom ? new Date(dateFrom) : undefined,
          lte: dateTo ? new Date(dateTo) : undefined,
        },
      },
      orderBy: { date: "desc" },
    });
  },

  // --- Goals ---
  createGoal: async (storeId: string, data: any) => {
    return await prisma.goal.create({
      data: {
        storeId,
        metricKey: data.metricKey,
        period: data.period,
        targetValue: data.targetValue,
        startDate: new Date(data.startDate),
      },
    });
  },

  listGoals: async (storeId: string) => {
    return await prisma.goal.findMany({
      where: { storeId, isActive: true },
      orderBy: { createdAt: "desc" },
    });
  },
};
