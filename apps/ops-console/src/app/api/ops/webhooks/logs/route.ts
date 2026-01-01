import { NextResponse } from "next/server";
import { prisma } from "@vayva/db";
import { OpsAuthService } from "@/lib/ops-auth";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
    const { user } = await OpsAuthService.requireSession();
    if (!["OPS_OWNER", "OPS_ADMIN", "OPS_SUPPORT"].includes(user.role)) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get("limit") || "50");
    const status = searchParams.get("status");

    const where: any = {};
    if (status && status !== "ALL") {
        where.status = status;
    }

    const logs = await prisma.webhookDelivery.findMany({
        where,
        orderBy: { createdAt: "desc" },
        take: limit,
        // Include basic store info if needed, but logs might be high volume so keeping it lean
    });

    return NextResponse.json({ data: logs });
}
