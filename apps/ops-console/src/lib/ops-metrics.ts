
import { prisma } from "@vayva/db";

export interface DashboardMetrics {
  overview: {
    orders24h: number;
    grossSales24h: number;
    paymentsSuccess24h: number;
    paymentsFailed24h: number;
    activeDispatchJobs: number;
    appDownloads: number;
  };
  growth: {
    totalMerchants: number;
    newMerchants7d: number;
    activeStores24h: number;
  };
  exceptions: {
    stuckOrdersCount: number; // Paid but unfulfilled > 24h
    failedWebhooks24h: number;
    disputesOpen: number;
  };
  health: {
    paystack: ServiceStatus;
    whatsapp: ServiceStatus;
    kwik: ServiceStatus;
    openai: ServiceStatus;
  };
}

export type ServiceStatus = "OPERATIONAL" | "DEGRADED" | "DOWN" | "UNKNOWN";

export async function getDashboardMetrics(): Promise<DashboardMetrics> {
  const now = new Date();
  const oneDayAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000);
  const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

  // Parallelize DB queries for performance
  const [
    orders24h,
    grossSales24h,
    paymentsSuccess24h,
    paymentsFailed24h,
    activeDispatchJobs,
    totalMerchants,
    newMerchants7d,
    activeStores24h,
    stuckOrdersCount,
    failedWebhooks24h,
    disputesOpen,
  ] = await Promise.all([
    // Overview
    prisma.order.count({ where: { createdAt: { gte: oneDayAgo } } }),

    // Real Gross Sales
    prisma.order.aggregate({
      where: {
        createdAt: { gte: oneDayAgo },
        status: { in: ["PAID", "COMPLETED"] as unknown}
      },
      _sum: { total: true }
    }).then(res => Number(res._sum.total || 0)),

    prisma.charge.count({
      where: { status: "SUCCESS", createdAt: { gte: oneDayAgo } }
    }),
    prisma.charge.count({
      where: { status: "FAILED", createdAt: { gte: oneDayAgo } }
    }),
    prisma.dispatchJob.count({
      where: { status: { in: ["CREATED", "ASSIGNED", "PICKED_UP"] } }
    }),

    // Growth
    prisma.user.count(),
    prisma.user.count({ where: { createdAt: { gte: sevenDaysAgo } } }),
    // Active stores: approximated by orders in last 24h distinct storeId 
    prisma.order.groupBy({
      by: ['storeId'],
      where: { createdAt: { gte: oneDayAgo } },
    }).then(groups => groups.length),

    // Exceptions - Stuck Orders (Paid but not Fulfilled/Completed for > 24h)
    prisma.order.count({
      where: {
        createdAt: { lt: oneDayAgo, gte: sevenDaysAgo },
        status: "PAID"
      }
    }),

    prisma.deliveryWebhookEvent.count({
      where: { status: "FAILED", receivedAt: { gte: oneDayAgo } }
    }),
    prisma.dispute.count({
      // Use explicitly valid enum values found in schema
      where: { status: { in: ["OPENED", "EVIDENCE_REQUIRED", "SUBMITTED", "UNDER_REVIEW"] } }
    })
  ]);

  return {
    overview: {
      orders24h: orders24h as unknown,
      grossSales24h: grossSales24h as unknown,
      paymentsSuccess24h: paymentsSuccess24h as unknown,
      paymentsFailed24h: paymentsFailed24h as unknown,
      activeDispatchJobs: activeDispatchJobs as unknown,
      appDownloads: 0, // Metric not yet tracked
    },
    growth: {
      totalMerchants: totalMerchants as unknown,
      newMerchants7d: newMerchants7d as unknown,
      activeStores24h: activeStores24h as unknown,
    },
    exceptions: {
      stuckOrdersCount: stuckOrdersCount as unknown,
      failedWebhooks24h: failedWebhooks24h as unknown,
      disputesOpen: disputesOpen as unknown,
    },
    health: {
      paystack: "OPERATIONAL",
      whatsapp: "OPERATIONAL",
      kwik: "OPERATIONAL",
      openai: "OPERATIONAL",
    }
  };
}

export async function getServiceHealth(): Promise<Record<string, unknown>> {
  return {
    database: "UP",
    redis: "UP",
    paystack: "UP",
  };
}
