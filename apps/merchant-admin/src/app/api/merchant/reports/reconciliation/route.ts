import { NextRequest, NextResponse } from "next/server";
import { ReportsService } from "@/lib/reports";
import { withVayvaAPI, HandlerContext } from "@/lib/api-handler";
import { PERMISSIONS } from "@/lib/team/permissions";

export const GET = withVayvaAPI(
  PERMISSIONS.METRICS_VIEW,
  async (req: NextRequest, { storeId }: HandlerContext) => {
    try {
      const { searchParams } = new URL(req.url);
      const cursor = searchParams.get("cursor") || undefined;
      const limit = parseInt(searchParams.get("limit") || "20");

      const data = await ReportsService.getReconciliation(
        storeId,
        limit,
        cursor
      );

      return NextResponse.json(data);
    } catch (error) {
      console.error("Reconciliation Report Error:", error);
      return NextResponse.json({ error: "Internal Error" }, { status: 500 });
    }
  }
);
