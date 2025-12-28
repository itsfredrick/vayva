import { NextResponse } from 'next/server';
import { prisma } from '@vayva/db';
import { withRBAC } from '@/lib/team/rbac';
import { PERMISSIONS } from '@/lib/team/permissions';

export const GET = withRBAC(PERMISSIONS.COMMERCE_VIEW, async (session: any) => {
    try {
        const storeId = session.user.storeId;

        // Parallelize counts
        const [
            revenueResult,
            activeOrdersCount,
            customersCount,
            totalOrdersCount
        ] = await Promise.all([
            prisma.order.aggregate({
                where: {
                    storeId,
                    paymentStatus: 'PAID' as any
                },
                _sum: { total: true }
            }),
            prisma.order.count({
                where: {
                    storeId,
                    OR: [{ status: 'PENDING' as any }, { status: 'PROCESSING' as any }]
                }
            }),
            prisma.customer.count({
                where: { storeId }
            }),
            prisma.order.count({
                where: { storeId }
            })
        ]);

        const totalRevenue = Number(revenueResult._sum?.total || 0);
        const avgOrderValue = totalOrdersCount > 0 ? (totalRevenue / totalOrdersCount) : 0;

        // Current metrics
        const metrics = {
            revenue: {
                label: 'Total Revenue',
                value: `₦${totalRevenue.toLocaleString()}`,
                trend: 'stable'
            },
            orders: {
                label: 'Active Orders',
                value: activeOrdersCount.toString(),
                trend: activeOrdersCount > 0 ? 'up' : 'stable'
            },
            customers: {
                label: 'Total Customers',
                value: customersCount.toString(),
                trend: 'stable'
            },
            avgOrder: {
                label: 'Avg Order Value',
                value: `₦${avgOrderValue.toLocaleString(undefined, { maximumFractionDigits: 0 })}`,
                trend: 'stable'
            }
        };

        return NextResponse.json({
            metrics,
            charts: {
                status: "NOT_IMPLEMENTED",
                reason: "time_series_aggregation_missing",
                revenue: [],
                orders: [],
                fulfillment: {
                    status: "NOT_IMPLEMENTED",
                    avgTime: null,
                    targetTime: null,
                    percentage: null
                }
            }
        });

    } catch (error) {
        return NextResponse.json({
            code: "internal_error",
            message: "Failed to fetch metrics"
        }, { status: 500 });
    }
});
