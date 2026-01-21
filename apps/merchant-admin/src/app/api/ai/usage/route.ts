import { NextRequest, NextResponse } from "next/server";
import { requireAuth } from "@/lib/auth/session";
import { AiUsageService } from "@/lib/ai/ai-usage.service";

interface UsageResponse {
  success: boolean;
  data: {
    current: number;
    allowed: boolean;
    reason?: string;
    history: Array<{
      date: Date | string;
      tokens: number;
      requests: number;
      cost: number | bigint;
    }>;
  };
}

/**
 * Get AI Usage stats for the merchant
 */
export async function GET(request: NextRequest) {
  try {
    const session = await requireAuth();
    const storeId = (session.user as { storeId?: string }).storeId;

    if (!storeId) {
      return NextResponse.json(
        { error: "No store associated with this account" },
        { status: 400 },
      );
    }

    // 1. Get current limit status
    const limitInfo = await AiUsageService.checkLimits(storeId);

    // 2. Get history (last 14 days)
    const history = await AiUsageService.getUsageStats(storeId, 14);

    const responseData: UsageResponse["data"] = {
      current: limitInfo.usage.messagesUsed,
      allowed: limitInfo.allowed,
      reason: limitInfo.reason,
      history: history.map((h) => ({
        date: h.date,
        tokens: h.totalTokens,
        requests: h.totalRequests,
        cost: h.totalCost,
      })),
    };

    return NextResponse.json({
      success: true,
      data: responseData,
    });
  } catch (error) {
    console.error("[AI Usage API] Error:", error);
    return NextResponse.json(
      {
        error: "Failed to fetch usage stats",
        message: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    );
  }
}
