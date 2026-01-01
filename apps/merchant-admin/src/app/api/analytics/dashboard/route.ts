import { NextRequest, NextResponse } from "next/server";
import { getSessionUser } from "@/lib/session";
import { AnalyticsService } from "@/lib/analytics/service";

export async function GET(req: NextRequest) {
  try {
    const user = await getSessionUser();
    if (!user)
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const storeId = user.storeId;
    if (!storeId)
      return NextResponse.json({ error: "No Store Context" }, { status: 400 });

    const { searchParams } = new URL(req.url);
    const fromStr = searchParams.get("from");
    const toStr = searchParams.get("to");

    const to = toStr ? new Date(toStr) : new Date();
    const from = fromStr
      ? new Date(fromStr)
      : new Date(Date.now() - 30 * 24 * 60 * 60 * 1000); // Default 30d

    const [funnel, counts, activation] = await Promise.all([
      AnalyticsService.getCheckoutFunnel(storeId, { from, to }),
      AnalyticsService.getEventCounts(storeId, { from, to }),
      AnalyticsService.getActivationProgress(storeId),
    ]);

    return NextResponse.json({
      funnel,
      counts,
      activation,
    });
  } catch (error) {
    console.error("Analytics Dashboard Error:", error);
    return NextResponse.json(
      { error: "Failed to fetch analytics" },
      { status: 500 },
    );
  }
}
