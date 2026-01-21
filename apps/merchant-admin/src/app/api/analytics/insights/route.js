import { NextResponse } from "next/server";
import { withVayvaAPI } from "@/lib/api-handler";
import { PERMISSIONS } from "@/lib/team/permissions";
import { AnalyticsService } from "@/services/AnalyticsService";
export const GET = withVayvaAPI(PERMISSIONS.METRICS_VIEW, async (request, { storeId }) => {
    try {
        const insights = await AnalyticsService.getInsights(storeId);
        return NextResponse.json({ insights });
    }
    catch (error) {
        return NextResponse.json({ error: error.message || "Failed to fetch insights" }, { status: 500 });
    }
});
