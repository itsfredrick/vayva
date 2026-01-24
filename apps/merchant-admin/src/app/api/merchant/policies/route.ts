import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { withVayvaAPI } from "@/lib/api-handler";
import { PERMISSIONS } from "@/lib/team/permissions";
export const GET = withVayvaAPI(PERMISSIONS.SETTINGS_VIEW, async (req, { storeId }) => {
    try {
        const policies = await prisma.merchantPolicy.findMany({
            where: { storeId },
            orderBy: { type: "asc" },
        });
        return NextResponse.json({ policies });
    }
    catch (error: any) {
        console.error("Error fetching policies:", error);
        return NextResponse.json({ error: "Internal Error" }, { status: 500 });
    }
});
