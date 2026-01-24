import { NextResponse } from "next/server";
import { ReportsService } from "@/lib/reports";
import { withVayvaAPI } from "@/lib/api-handler";
import { PERMISSIONS } from "@/lib/team/permissions";
export const GET = withVayvaAPI(PERMISSIONS.METRICS_VIEW, async (req, { storeId, params }) => {
    try {
        const { type } = await params;
        // Validate type
        if (!["reconciliation"].includes(type)) {
            return NextResponse.json({ error: "Invalid Type" }, { status: 400 });
        }
        const csv = await ReportsService.generateCSV(storeId, type, { from: new Date(0), to: new Date() });
        return new NextResponse(csv, {
            headers: {
                "Content-Type": "text/csv",
                "Content-Disposition": `attachment; filename="${type}-${Date.now()}.csv"`,
            },
        });
    }
    catch (error: any) {
        console.error("Reports Export API Error:", error);
        return NextResponse.json({ error: "Internal Error" }, { status: 500 });
    }
});
