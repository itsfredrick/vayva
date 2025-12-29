import { NextResponse } from 'next/server';
import { prisma } from '@vayva/db';
import { withRBAC } from '@/lib/team/rbac';
import { PERMISSIONS } from '@/lib/team/permissions';

export const GET = withRBAC(PERMISSIONS.COMMERCE_VIEW, async (session: any) => {
    try {
        const storeId = session.user.storeId;

        // 1. Calculate Score based on real metrics
        // Metrics: Order Success Rate, AI Resolution Rate, Return Rate
        const [
            totalOrders,
            paidOrders,
            refundedOrders,
            activeCustomers
        ] = await Promise.all([
            prisma.order.count({ where: { storeId } }),
            prisma.order.count({ where: { storeId, paymentStatus: 'PAID' as any } }),
            prisma.order.count({ where: { storeId, status: 'REFUNDED' as any } }),
            prisma.customer.count({ where: { storeId } })
        ]);

        // Mock-to-Real Hybrid Logic (If no data, show a 'Setup' score)
        let score = 50;
        let factors = [];

        if (totalOrders > 0) {
            const successRate = (paidOrders / totalOrders) * 100;
            const refundRate = (refundedOrders / totalOrders) * 100;

            score = Math.min(100, 60 + (successRate / 4) - (refundRate * 2));

            if (successRate > 80) factors.push({ id: 'f1', text: 'High Payment Success Rate', sentiment: 'positive' });
            if (refundRate < 5) factors.push({ id: 'f2', text: 'Low Refund Rate', sentiment: 'positive' });
            else if (refundRate > 10) factors.push({ id: 'f2', text: 'High Refund Rate', sentiment: 'negative' });
        } else {
            factors.push({ id: 'f0', text: 'Awaiting your first sale', sentiment: 'warning' });
        }

        if (activeCustomers > 5) {
            factors.push({ id: 'f3', text: 'Growing Customer Base', sentiment: 'positive' });
        }

        const healthData = {
            score: Math.round(score),
            status: score > 80 ? 'healthy' : score > 60 ? 'watch' : 'risk',
            trend: 'stable',
            factors: factors.length > 0 ? factors : [{ id: 'df', text: 'Platform initialization complete', sentiment: 'positive' }]
        };

        return NextResponse.json({
            success: true,
            data: healthData
        });

    } catch (error) {
        return NextResponse.json({
            success: false,
            error: 'Failed to calculate health metrics'
        }, { status: 500 });
    }
});
