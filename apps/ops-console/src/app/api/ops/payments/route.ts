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
        const status = searchParams.get("status") || "all";
        const twentyFourHoursAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);

        const whereClause: any = {
            createdAt: { gte: twentyFourHoursAgo },
        };

        if (status !== "all") {
            whereClause.paymentStatus = status;
        }

        const orders = await prisma.order.findMany({
            where: whereClause,
            include: {
                store: { select: { id: true, name: true } },
            },
            orderBy: { createdAt: "desc" },
            take: 100,
        });

        const payments = orders.map((order) => ({
            id: order.id,
            orderId: order.id,
            orderNumber: order.orderNumber || order.id.slice(0, 8),
            amount: Number(order.total || 0),
            status: order.paymentStatus || "PENDING",
            provider: "Paystack",
            reference: order.refCode || order.id,
            storeName: order.store?.name || "Unknown",
            storeId: order.storeId,
            customerEmail: order.customerEmail || "",
            createdAt: order.createdAt.toISOString(),
        }));

        // Stats
        const [success, pending, failed] = await Promise.all([
            prisma.order.count({ where: { paymentStatus: "SUCCESS", createdAt: { gte: twentyFourHoursAgo } } }),
            prisma.order.count({ where: { paymentStatus: "PENDING", createdAt: { gte: twentyFourHoursAgo } } }),
            prisma.order.count({ where: { paymentStatus: "FAILED", createdAt: { gte: twentyFourHoursAgo } } }),
        ]);

        return NextResponse.json({
            payments,
            stats: { success, pending, failed, total: success + pending + failed },
        });
    } catch (error: any) {
        console.error("Payments error:", error);
        return NextResponse.json({ error: "Failed to fetch payments" }, { status: 500 });
    }
}
