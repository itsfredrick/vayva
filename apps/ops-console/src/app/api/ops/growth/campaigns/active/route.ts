import { NextResponse } from "next/server";
import { prisma } from "@vayva/db";
import { OpsAuthService } from "@/lib/ops-auth";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
    const { user } = await OpsAuthService.requireSession();
    if (!["OPS_OWNER", "OPS_ADMIN", "OPS_GROWTH"].includes(user.role)) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get("limit") || "50");

    const campaigns = await prisma.flashSale.findMany({
        where: {
            isActive: true,
            endTime: { gt: new Date() }
        },
        orderBy: { discount: "desc" },
        take: limit,
        include: {
            store: {
                select: { id: true, name: true, slug: true }
            }
        }
    });

    return NextResponse.json({ data: campaigns });
}
