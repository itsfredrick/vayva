import { NextResponse } from "next/server";
import { withVayvaAPI } from "@/lib/api-handler";
import { PERMISSIONS } from "@/lib/team/permissions";
import { AnalyticsService } from "@/services/AnalyticsService";
export const GET = withVayvaAPI(PERMISSIONS.FINANCE_VIEW, async (req, { storeId }) => {
    try {
        const { searchParams } = new URL(req.url);
        const range = (searchParams.get("range") || "7d");
        const data = await AnalyticsService.getOverview(storeId, range);
        return NextResponse.json(data);
    }
    catch (error) {
        return NextResponse.json({ error: error.message || "Failed to fetch analytics" }, { status: 500 });
    }
});
