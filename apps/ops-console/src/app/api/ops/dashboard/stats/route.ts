import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@vayva/db";
import { OpsAuthService } from "@/lib/ops-auth";

export async function GET(req: NextRequest) {
    try {
        // Authenticate ops user
        const session = await OpsAuthService.getSession();
        if (!session) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

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
            delta: "+5 this week" // TODO: Calculate actual delta
        };

        const operations = {
            tickets: 0 // TODO: Implement support ticket count
        };

        const formattedActivity = recentActivity.map(log => ({
            message: `${log.eventType} performed`,
            timestamp: new Date(log.createdAt).toLocaleString()
        }));

        return NextResponse.json({
            revenue,
            merchants,
            operations,
            recentActivity: formattedActivity
        });
    } catch (error) {
        console.error("Dashboard Stats Error:", error);
        return NextResponse.json(
            { error: "Failed to fetch dashboard stats" },
            { status: 500 }
        );
    }
}
