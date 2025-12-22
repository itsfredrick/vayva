import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth'; // Using mock auth
import { authOptions } from '@/lib/auth'; // Using mock auth
import { prisma } from '@vayva/db';
import { PLANS } from '@/lib/billing/plans';

export async function GET(req: NextRequest) {
    const session = await getServerSession(authOptions);
    if (!(session?.user as any)?.storeId) return new NextResponse('Unauthorized', { status: 401 });

    try {
        const sub = await prisma.merchantSubscription.findUnique({
            where: { storeId: (session!.user as any).storeId }
        });

        const invoices = await prisma.invoice.findMany({
            where: { storeId: (session!.user as any).storeId },
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
