import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { OpsAuthService } from "@/lib/ops-auth";
export async function GET(req: any, { params }: any) {
    try {
        await OpsAuthService.requireSession();
        const { id } = await params;
        const history = await prisma.notificationLog.findMany({
            where: { storeId: id },
            orderBy: { createdAt: "desc" },
            take: 50,
        });
        return NextResponse.json(history);
    }
    catch (error: any) {
        console.error("Notification history fetch error:", error);
        return NextResponse.json({ error: "Failed to fetch notification history" }, { status: 500 });
    }
}
