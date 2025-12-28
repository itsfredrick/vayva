
import { NextResponse } from 'next/server';
import { requireAuth } from '@/lib/auth/session';
import { prisma } from '@vayva/db';

export async function GET() {
    try {
        const session = await requireAuth();
        const storeId = session.user.storeId;

        const store = await prisma.store.findUnique({
            where: { id: storeId }
        });

        const subscription = await prisma.merchantSubscription.findFirst({
            where: { storeId },
            orderBy: { createdAt: 'desc' }
        });

        // Mock invoices for demonstration
        const invoices = [
            { id: 'INV-001', amount: '₦0.00', date: new Date().toISOString(), status: 'PAID', plan: 'FOUNDER_FREE' }
        ];

        return NextResponse.json({
            plan: store?.plan || 'FREE',
            status: subscription?.status || 'ACTIVE',
            renewalDate: subscription?.currentPeriodEnd || null,
            usage: {
                products: 5,
                orders: 12,
                storage: '120MB'
            },
            invoices
        });
    } catch (error: any) {
        console.error('Billing fetch error:', error);
        return NextResponse.json({ error: 'Failed to fetch billing info' }, { status: 500 });
    }
}
