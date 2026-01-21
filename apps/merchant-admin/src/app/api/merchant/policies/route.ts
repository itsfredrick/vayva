import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { withVayvaAPI, HandlerContext } from "@/lib/api-handler";
import { PERMISSIONS } from "@/lib/team/permissions";

export const GET = withVayvaAPI(
  PERMISSIONS.SETTINGS_VIEW,
  async (req: NextRequest, { storeId }: HandlerContext) => {
    try {
      const policies = await prisma.merchantPolicy.findMany({
        where: { storeId },
        orderBy: { type: "asc" },
      });

      return NextResponse.json({ policies });
    } catch (error) {
      console.error("Error fetching policies:", error);
      return NextResponse.json({ error: "Internal Error" }, { status: 500 });
    }
  }
);
