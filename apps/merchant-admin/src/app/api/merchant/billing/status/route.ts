import { NextRequest, NextResponse } from 'next/server';
import { getSessionUser } from '@/lib/session';
import { prisma } from '@vayva/db';
import { PLANS } from '@/lib/billing/plans';

export async function GET(req: NextRequest) {
    const user = await getSessionUser();
    if (!user?.storeId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    try {
        const sub = await prisma.merchantSubscription.findUnique({
            where: { storeId: user.storeId }
        });

        const invoices = await prisma.invoice.findMany({
            where: { storeId: user.storeId },
            orderBy: { issuedAt: 'desc' },
            take: 10
        });

        // If no sub, return default 'trial' or basic structure
        const status = sub ? {
            planSlug: sub.planSlug,
            status: sub.status,
            currentPeriodEnd: sub.currentPeriodEnd,
            cancelAtPeriodEnd: sub.cancelAtPeriodEnd
        } : {
            planSlug: 'growth', // Default assumption or no plan
            status: 'none',
            currentPeriodEnd: null
        };

        return NextResponse.json({
            ...status,
            invoices
        });

    } catch (e: any) {
        return new NextResponse(e.message, { status: 500 });
    }
}
