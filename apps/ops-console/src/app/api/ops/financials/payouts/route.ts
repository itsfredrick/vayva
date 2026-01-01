import { NextResponse } from "next/server";
import { prisma } from "@vayva/db";
import { OpsAuthService } from "@/lib/ops-auth";

export async function GET(request: Request) {
    const { user } = await OpsAuthService.requireSession();
    if (!["OPS_OWNER", "OPS_ADMIN", "OPS_SUPPORT"].includes(user.role)) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    const { searchParams } = new URL(request.url);
    const status = searchParams.get("status") || "PENDING";

    const where: any = {};
    if (status !== "ALL") where.status = status;

    const withdrawals = await prisma.withdrawal.findMany({
        where,
        orderBy: { createdAt: "desc" },
        include: {
            store: {
                select: { id: true, name: true, slug: true }
            }
        },
        take: 100
    });

    // Handle BigInt serialization
    const data = withdrawals.map(w => ({
        ...w,
        amountKobo: w.amountKobo.toString(),
        feeKobo: w.feeKobo.toString(),
        amountNetKobo: w.amountNetKobo.toString(),
        feePercent: w.feePercent.toString()
    }));

    return NextResponse.json({ data });
}
