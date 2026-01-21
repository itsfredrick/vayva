import { NextRequest, NextResponse } from "next/server";
import { withVayvaAPI, HandlerContext } from "@/lib/api-handler";
import { PERMISSIONS } from "@/lib/team/permissions";
import { AnalyticsService } from "@/services/AnalyticsService";

export const GET = withVayvaAPI(
    PERMISSIONS.METRICS_VIEW,
    async (request: NextRequest, { storeId }: HandlerContext) => {
        try {
            const insights = await AnalyticsService.getInsights(storeId);
            return NextResponse.json({ insights });
        } catch (error: any) {
            return NextResponse.json({ error: error.message || "Failed to fetch insights" }, { status: 500 });
        }
    }
);
