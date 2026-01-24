import { NextResponse } from "next/server";
import { ReportsService } from "@/lib/reports";
import { withVayvaAPI } from "@/lib/api-handler";
import { PERMISSIONS } from "@/lib/team/permissions";
export const GET = withVayvaAPI(PERMISSIONS.METRICS_VIEW, async (req, { storeId }) => {
    try {
        const { searchParams } = new URL(req.url);
        const fromStr = searchParams.get("from");
        const toStr = searchParams.get("to");
        // Default: Last 7 days
        const to = toStr ? new Date(toStr) : new Date();
        const from = fromStr
            ? new Date(fromStr)
            : new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
        const data = await ReportsService.getSummary(storeId, { from, to });
        return NextResponse.json(data);
    }
    catch (error: any) {
        console.error("Reports Summary API Error:", error);
        return NextResponse.json({ error: "Internal Error" }, { status: 500 });
    }
});
