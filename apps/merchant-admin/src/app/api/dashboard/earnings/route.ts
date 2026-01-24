import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { withVayvaAPI } from "@/lib/api-handler";
import { PERMISSIONS } from "@/lib/team/permissions";
// API for Seller Earnings
export const GET = withVayvaAPI(PERMISSIONS.METRICS_VIEW, async (request, { storeId }) => {
    try {
        // 1. Calculate Totals using aggregation for efficiency
        const salesStats = await prisma.order.aggregate({
            where: {
                storeId,
                paymentStatus: "SUCCESS"
            },
            _sum: { total: true },
            _count: { id: true }
        });
        const totalSales = Number(salesStats._sum.total || 0);
        // 2. Platform Fee Calculation (3% base)
        const platformFee = Math.ceil(totalSales * 0.03);
        const netEarnings = totalSales - platformFee;
        // 3. Escrow & Available Funds Logic
        const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
        // Pending funds: Orders fulfilled < 7 days ago OR not yet delivered
        const pendingOrders = await prisma.order.findMany({
            where: {
                storeId,
                paymentStatus: "SUCCESS",
                OR: [
                    { fulfillmentStatus: { not: "DELIVERED" } },
                    { updatedAt: { gt: sevenDaysAgo } }
                ]
            },
            select: { total: true }
        });
        const pendingFunds = pendingOrders.reduce((sum, o) => sum + (Number(o.total) * 0.97), 0);
        const availableFunds = Math.max(0, netEarnings - pendingFunds);
        // 4. Payout History
        const payouts = await prisma.payout.findMany({
            where: { storeId },
            orderBy: { createdAt: "desc" },
            take: 10
        });
        const history = payouts.map(p => ({
            id: p.id,
            amount: Number(p.amount),
            status: p.status,
            date: p.createdAt.toISOString()
        }));
        return NextResponse.json({
            totalSales,
            platformFee,
            netEarnings,
            pendingFunds: Math.ceil(pendingFunds),
            availableFunds: Math.floor(availableFunds),
            history
        });
    }
    catch (error: any) {
        console.error("Earnings Error:", error);
        return NextResponse.json({ error: "Failed to fetch earnings" }, { status: 500 });
    }
});
