import { NextRequest, NextResponse } from 'next/server';
import { prisma } from "@vayva/db";
import { withOpsAuth } from "@/lib/withOpsAuth";

export const GET = withOpsAuth(async (_req, { user }) => {
    try {
        // Aggregate platform-wide stats for ops dashboard
        const [merchantCount, recentActivity] = await Promise.all([
            prisma.store.count({
                where: { isActive: true }
            }),
            prisma.opsAuditEvent.findMany({
                take: 5,
                orderBy: { createdAt: "desc" },
                select: {
                    eventType: true,
                    createdAt: true
                }
            })
        ]);

        // Calculate revenue (last 30 days)
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

        const orders = await prisma.order.aggregate({
            where: {
                createdAt: { gte: thirtyDaysAgo },
                paymentStatus: "SUCCESS"
            },
            _sum: {
                total: true
            }
        });

        const revenue = {
            total: Number(orders._sum?.total || 0)
        };

        const merchants = {
            total: merchantCount,
            delta: "+5 this week" // Delta tracking planned for V2
        };

        const operations = {
            tickets: 0 // Ticket support integration planned for V2
        };

        const formattedActivity = recentActivity.map(log => ({
            message: `${(log as any).eventType} performed`,
            timestamp: new Date((log as any).createdAt).toLocaleString()
        }));

        return NextResponse.json({
            revenue,
            merchants,
            operations,
            recentActivity: formattedActivity
        });
    } catch (error: any) {
        console.error("Dashboard Stats Error:", error);
        return NextResponse.json(
            { error: "Failed to fetch dashboard stats" },
            { status: 500 }
        );
    }
});
