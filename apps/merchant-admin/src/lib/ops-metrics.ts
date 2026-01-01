import { prisma } from "@vayva/db";
import { logAuditEvent, AuditEventType } from "./audit";
import { getIntegrationHealth } from "./integration-health";

const STUCK_THRESHOLD_MS = 30 * 60 * 1000; // 30 minutes
const PENDING_THRESHOLD_MS = 60 * 60 * 1000; // 60 minutes (P11.2)

export interface StuckWithdrawal {
  id: string;
  referenceCode: string;
  status: string;
  amountMajor: number;
  stuckDuration: number; // milliseconds
  createdAt: Date;
  updatedAt: Date;
}

export interface StuckExport {
  id: string;
  type: string;
  status: string;
  merchantId?: string;
  userId: string;
  createdAt: Date;
  expiresAt: Date;
}

export interface OpsMetrics {
  withdrawals: {
    byStatus: Record<string, number>;
    stuck: StuckWithdrawal[];
    agingPending?: StuckWithdrawal[]; // P11.2
    avgTimeToPaid: number | null;
  };
  exports: {
    createdToday: number;
    downloaded: number;
    downloadedToday?: number; // P11.2
    expiredUnused: number;
    stuckJobs: StuckExport[];
    expiredUnusedRows?: StuckExport[]; // P11.2
  };
  security: {
    rateLimitBlocks24h: number;
    stepUpRequired: number;
    sudoSuccess24h?: number; // P11.2
    sudoFailed24h?: number; // P11.2
    sudoAttempts?: { success: number; failed: number }; // Kept for compat
  };
  apiHealth?: {
    // P11.2
    errors1h: number;
    errors24h: number;
    topFailingRoutes: Array<{ routeKey: string; count: number }>;
  };
  performance?: {
    // P11.2
    slowPaths: Array<{
      routeKey: string;
      maxDuration: number;
      count: number;
      lastSeen: string;
    }>;
  };
  integrations?: {
    // P11.2
    whatsapp: {
      status: string;
      lastSuccess: Date | null;
      lastEvent: Date | null;
    };
    paystack: {
      status: string;
      lastSuccess: Date | null;
      lastEvent: Date | null;
    };
    delivery: {
      status: string;
      lastSuccess: Date | null;
      lastEvent: Date | null;
    };
  };
}

/**
 * Detect withdrawals stuck in PROCESSING status
 */
export async function detectStuckWithdrawals(
  storeId?: string,
): Promise<StuckWithdrawal[]> {
  const threshold = new Date(Date.now() - STUCK_THRESHOLD_MS);

  const stuck = await prisma.withdrawal.findMany({
    where: {
      ...(storeId ? { storeId } : {}),
      status: "PROCESSING",
      updatedAt: { lt: threshold },
    },
    orderBy: { updatedAt: "asc" },
    take: 50,
  });

  return stuck.map((w) => ({
    id: w.id,
    referenceCode: w.referenceCode,
    status: w.status,
    amountMajor: Number(w.amountKobo) / 100,
    stuckDuration: Date.now() - w.updatedAt.getTime(),
    createdAt: w.createdAt,
    updatedAt: w.updatedAt,
  }));
}

/**
 * P11.2: Detect withdrawals aging in PENDING status (>60 minutes)
 */
export async function detectAgingPending(
  storeId?: string,
): Promise<StuckWithdrawal[]> {
  const threshold = new Date(Date.now() - PENDING_THRESHOLD_MS);

  const aging = await prisma.withdrawal.findMany({
    where: {
      ...(storeId ? { storeId } : {}),
      status: "PENDING",
      createdAt: { lt: threshold },
    },
    orderBy: { createdAt: "asc" },
    take: 50,
  });

  return aging.map((w) => ({
    id: w.id,
    referenceCode: w.referenceCode,
    status: w.status,
    amountMajor: Number(w.amountKobo) / 100,
    stuckDuration: Date.now() - w.createdAt.getTime(),
    createdAt: w.createdAt,
    updatedAt: w.updatedAt,
  }));
}

/**
 * Detect expired export jobs that were never downloaded
 */
export async function detectStuckExports(
  merchantId?: string,
): Promise<StuckExport[]> {
  const now = new Date();

  const stuck = await prisma.exportJob.findMany({
    where: {
      ...(merchantId ? { merchantId } : {}),
      status: "READY",
      expiresAt: { lt: now },
    },
    orderBy: { createdAt: "desc" },
    take: 50,
  });

  return stuck.map((e) => ({
    id: e.id,
    type: e.type,
    status: e.status,
    merchantId: e.merchantId,
    userId: e.userId,
    createdAt: e.createdAt,
    expiresAt: e.expiresAt,
  }));
}

/**
 * Get comprehensive ops metrics for a store (or all stores if storeId undefined)
 */
export async function getOpsMetrics(storeId?: string): Promise<OpsMetrics> {
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const yesterday = new Date(today.getTime() - 24 * 60 * 60 * 1000);

  const whereStore = storeId ? { storeId } : {};
  const whereMerchant = storeId ? { merchantId: storeId } : {};

  // Withdrawal metrics
  const withdrawalsByStatus = await prisma.withdrawal.groupBy({
    by: ["status"],
    where: whereStore,
    _count: { id: true },
  });

  const byStatus: Record<string, number> = {};
  withdrawalsByStatus.forEach((g) => {
    byStatus[g.status] = g._count.id;
  });

  const stuck = await detectStuckWithdrawals(storeId);

  // Average time to PAID
  const paidWithdrawals = await prisma.withdrawal.findMany({
    where: {
      ...whereStore,
      status: "PAID",
      updatedAt: { gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) }, // last 7 days
    },
    select: {
      createdAt: true,
      updatedAt: true,
    },
    take: 100,
  });

  let avgTimeToPaid: number | null = null;
  if (paidWithdrawals.length > 0) {
    const totalTime = paidWithdrawals.reduce((sum, w) => {
      return sum + (w.updatedAt.getTime() - w.createdAt.getTime());
    }, 0);
    avgTimeToPaid = totalTime / paidWithdrawals.length;
  }

  // Export metrics
  const exportsCreatedToday = await prisma.exportJob.count({
    where: {
      ...whereMerchant,
      createdAt: { gte: today },
    },
  });

  // For downloaded count, we'd need a downloadedAt field (not implemented yet)
  // For MVP, we'll estimate based on audit logs
  const exportDownloads = await prisma.auditLog.count({
    where: {
      ...whereStore,
      action: "EXPORT_DOWNLOADED",
      createdAt: { gte: today },
    },
  });

  const expiredUnused = await prisma.exportJob.count({
    where: {
      ...whereMerchant,
      status: "READY",
      expiresAt: { lt: now },
    },
  });

  const stuckExports = await detectStuckExports(storeId);

  // Security metrics
  const rateLimitBlocks = await prisma.auditLog.count({
    where: {
      ...whereStore,
      action: "SECURITY_RATE_LIMIT_BLOCKED",
      createdAt: { gte: yesterday },
    },
  });

  // P11.2: Real sudo attempt tracking
  const sudoSuccess = await prisma.auditLog.count({
    where: {
      ...whereStore,
      action: "SUDO_SUCCESS",
      createdAt: { gte: yesterday },
    },
  });

  const sudoFailed = await prisma.auditLog.count({
    where: {
      ...whereStore,
      action: "SUDO_FAILED",
      createdAt: { gte: yesterday },
    },
  });

  const stepUpRequired = await prisma.auditLog.count({
    where: {
      ...whereStore,
      action: "SECURITY_STEP_UP_REQUIRED",
      createdAt: { gte: yesterday },
    },
  });

  // P11.2: Get aging pending withdrawals
  const agingPending = await detectAgingPending(storeId);

  // P11.2: API Health metrics
  const isP112Enabled = process.env.OPS_P11_2_ENABLED === "true";
  let apiHealth, performance, integrations, downloadedToday, expiredUnusedRows;

  if (isP112Enabled) {
    const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000);

    // API errors
    const errors1h = await prisma.apiError.count({
      where: { ...whereStore, createdAt: { gte: oneHourAgo } },
    });

    const errors24h = await prisma.apiError.count({
      where: { ...whereStore, createdAt: { gte: yesterday } },
    });

    const topFailingRoutesData = await prisma.apiError.groupBy({
      by: ["routeKey"],
      where: { ...whereStore, createdAt: { gte: yesterday } },
      _count: { id: true },
      orderBy: { _count: { id: "desc" } },
      take: 5,
    });

    apiHealth = {
      errors1h,
      errors24h,
      topFailingRoutes: topFailingRoutesData.map((r) => ({
        routeKey: r.routeKey,
        count: r._count.id,
      })),
    };

    // Downloaded today using downloadedAt
    downloadedToday = await prisma.exportJob.count({
      where: {
        ...whereMerchant,
        downloadedAt: { gte: today },
      },
    });

    // Expired unused rows
    expiredUnusedRows = stuckExports.slice(0, 10);

    // Performance (empty for now - instance-local)
    performance = {
      slowPaths: [],
    };

    // Integrations
    try {
      // Integration health usually depends on store config? Or global gateway?
      // If storeId provided, specific. If not, global default?
      if (storeId) {
        integrations = await getIntegrationHealth(storeId);
      } else {
        // Fallback or empty if no store
        integrations = {
          whatsapp: { status: "UNKNOWN", lastSuccess: null, lastEvent: null },
          paystack: { status: "UNKNOWN", lastSuccess: null, lastEvent: null },
          delivery: { status: "UNKNOWN", lastSuccess: null, lastEvent: null },
        };
      }
    } catch {
      // If no events logged yet
      integrations = {
        whatsapp: {
          status: "NOT_INSTRUMENTED",
          lastSuccess: null,
          lastEvent: null,
        },
        paystack: {
          status: "NOT_INSTRUMENTED",
          lastSuccess: null,
          lastEvent: null,
        },
        delivery: {
          status: "NOT_INSTRUMENTED",
          lastSuccess: null,
          lastEvent: null,
        },
      };
    }
  }

  return {
    withdrawals: {
      byStatus,
      stuck,
      agingPending, // P11.2
      avgTimeToPaid,
    },
    exports: {
      createdToday: exportsCreatedToday,
      downloaded: exportDownloads,
      downloadedToday, // P11.2
      expiredUnused,
      stuckJobs: stuckExports,
      expiredUnusedRows, // P11.2
    },
    security: {
      rateLimitBlocks24h: rateLimitBlocks,
      sudoAttempts: {
        success: sudoSuccess,
        failed: sudoFailed,
      },
      stepUpRequired,
      sudoSuccess24h: sudoSuccess,
      sudoFailed24h: sudoFailed,
    },
    apiHealth, // P11.2
    performance, // P11.2
    integrations, // P11.2
  };
}

/**
 * Log stuck operations (called by background job or on-demand)
 */
export async function logStuckOperations(
  storeId: string,
  userId: string,
): Promise<void> {
  const stuck = await detectStuckWithdrawals(storeId);

  for (const withdrawal of stuck) {
    await logAuditEvent(storeId, userId, AuditEventType.OPERATION_STUCK, {
      type: "withdrawal",
      reference: withdrawal.referenceCode,
      status: withdrawal.status,
      stuckDurationMs: withdrawal.stuckDuration,
    });
  }

  const stuckExports = await detectStuckExports(storeId);
  for (const exp of stuckExports) {
    await logAuditEvent(storeId, userId, AuditEventType.OPERATION_STUCK, {
      type: "export",
      exportId: exp.id,
      exportType: exp.type,
      status: exp.status,
    });
  }
}
