import { NextRequest, NextResponse } from "next/server";
import { withVayvaAPI, HandlerContext } from "@/lib/api-handler";
import { PERMISSIONS } from "@/lib/team/permissions";
import { AnalyticsService } from "@/services/AnalyticsService";

export const GET = withVayvaAPI(
    PERMISSIONS.FINANCE_VIEW,
    async (req: NextRequest, { storeId }: HandlerContext) => {
        try {
            const { searchParams } = new URL(req.url);
            const range = (searchParams.get("range") || "7d") as '7d' | '30d' | '90d';

            const data = await AnalyticsService.getOverview(storeId, range);
            return NextResponse.json(data);
        } catch (error: unknown) {
            return NextResponse.json({ error: error.message || "Failed to fetch analytics" }, { status: 500 });
        }
    }
);
