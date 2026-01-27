import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@vayva/db";
import { OpsAuthService } from "@/lib/ops-auth";

export async function GET(req: NextRequest) {
    const session = await OpsAuthService.getSession();
    if (!session) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    try {
        const { searchParams } = new URL(req.url);
        const status = searchParams.get("status") || "PENDING";

        const returns = await (prisma.returnRequest as any).findMany({
            where: { status: status },
            include: {
                order: {
                    include: {
                        store: { select: { id: true, name: true } }
                    }
                }
            },
            orderBy: { createdAt: "desc" },
            take: 100,
        });

        const refunds = returns.map((ret: any) => ({
            id: ret.id,
            orderId: ret.orderId,
            orderNumber: ret.order?.orderNumber || ret.orderId.slice(0, 8),
            amount: Number(ret.refundAmount || 0),
            status: ret.status,
            reason: ret.reason || "No reason provided",
            storeName: ret.order?.store?.name || "Unknown",
            storeId: ret.order?.storeId || "",
            customerEmail: ret.order?.customerEmail || "",
            createdAt: ret.createdAt.toISOString(),
        }));

        // Stats
        const [pending, approved, rejected] = await Promise.all([
            (prisma.returnRequest as any).count({ where: { status: "PENDING" } }),
            (prisma.returnRequest as any).count({ where: { status: "APPROVED" } }),
            (prisma.returnRequest as any).count({ where: { status: "REJECTED" } }),
        ]);

        return NextResponse.json({
            refunds,
            stats: { pending, approved, rejected },
        });
    } catch (error: any) {
        console.error("Refunds error:", error);
        return NextResponse.json({ error: "Failed to fetch refunds" }, { status: 500 });
    }
}
