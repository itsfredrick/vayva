import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@vayva/db";
import { withVayvaAPI, APIContext } from "@/lib/api-handler";
import { PERMISSIONS } from "@/lib/team/permissions";
export const POST = withVayvaAPI(PERMISSIONS.MARKETING_MANAGE, async (req: NextRequest, { storeId }: APIContext) => {
    try {
        const body = await req.json();
        const { name, discount, startTime, endTime, targetType, targetId } = body;
        if (!name || !discount || !startTime || !endTime) {
            return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
        }
        const flashSale = await prisma.flashSale.create({
            data: {
                storeId,
                name,
                discount: Number(discount),
                startTime: new Date(startTime),
                endTime: new Date(endTime),
                targetType: targetType || "ALL",
                targetId: targetId || null,
                isActive: true,
            },
        });
        return NextResponse.json({ success: true, data: flashSale });
    }
    catch (error: any) {
        console.error("Failed to create flash sale:", error);
        return NextResponse.json({ error: error.message || "Internal Server Error" }, { status: 500 });
    }
});
export const GET = withVayvaAPI(PERMISSIONS.MARKETING_VIEW, async (req: NextRequest, { storeId }: APIContext) => {
    try {
        const sales = await prisma.flashSale.findMany({
            where: { storeId },
            orderBy: { createdAt: "desc" },
            take: 50,
        });
        return NextResponse.json({ success: true, data: sales });
    }
    catch (error: any) {
        console.error("Failed to fetch flash sales:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
});
