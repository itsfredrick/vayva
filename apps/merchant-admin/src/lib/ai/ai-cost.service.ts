import { prisma } from "@vayva/db";
import { logger } from "@/lib/logger";

export class AiCostService {
  /**
   * Compute estimated cost of a request in Kobo
   */
  static async estimateRequestCost(params: {
    provider: string;
    inputTokens: number;
    outputTokens: number;
    hasImage?: boolean;
  }): Promise<bigint> {
    const pricing = await prisma.providerPricing.findFirst({
      where: { provider: params.provider },
      orderBy: { effectiveFrom: "desc" },
    });

    if (!pricing) return BigInt(0);

    const inputCostMicros =
      (params.inputTokens / 1000) * pricing.inputCostPer1K;
    const outputCostMicros =
      (params.outputTokens / 1000) * pricing.outputCostPer1K;
    const imageCostMicros = params.hasImage ? pricing.imageCost || 0 : 0;

    const totalMicrosUSD = inputCostMicros + outputCostMicros + imageCostMicros;

    // Convert to NGN Kobo: micros -> USD -> NGN -> Kobo
    // 1,000,000 micros = 1 USD
    // 1 USD = fxRate NGN
    // 1 NGN = 100 Kobo
    const costKobo = (totalMicrosUSD / 1_000_000) * pricing.fxRateToNGN * 100;

    return BigInt(Math.ceil(costKobo));
  }

  /**
   * Update daily cost records for a merchant
   */
  static async recordMerchantUsage(storeId: string, costKobo: bigint) {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    try {
      await prisma.merchantCostDaily.upsert({
        where: { merchantId_date: { merchantId: storeId, date: today } },
        update: {
          estimatedCostKobo: { increment: costKobo },
          requestsCount: { increment: 1 },
        },
        create: {
          merchantId: storeId,
          date: today,
          estimatedCostKobo: costKobo,
          requestsCount: 1,
        },
      });
    } catch (error) {
      logger.error("[CostService] Failed to record usage", { storeId, error });
    }
  }

  /**
   * Check if a merchant or platform is over budget
   */
  static async checkBudgetSafety(
    storeId: string,
  ): Promise<{ safe: boolean; reason?: string }> {
    // 1. Check Platform-wide budget
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const platformStat = await prisma.platformCostDaily.findUnique({
      where: { date: today },
    });
    if (platformStat && platformStat.budgetUsedPercent >= 100) {
      return {
        safe: false,
        reason:
          "Platform-wide AI budget reached. Service temporarily throttled.",
      };
    }

    // 2. Check active throttle policies
    const policy = await prisma.throttlePolicy.findFirst({
      where: {
        AND: [
          {
            OR: [
              { scope: "MERCHANT", targetId: storeId },
              { scope: "PLATFORM" },
            ],
          },
          { startsAt: { lte: new Date() } },
          {
            OR: [{ endsAt: null }, { endsAt: { gte: new Date() } }],
          },
        ],
      },
    });

    if (policy && policy.mode === "HARD_BLOCK") {
      return { safe: false, reason: policy.reason };
    }

    return { safe: true };
  }
}
