import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@vayva/db';
import { PLANS } from '@/lib/billing/plans';

export async function POST(req: NextRequest) {
    const session = await getServerSession(authOptions);
    if (!(session?.user as any)?.storeId) return new NextResponse('Unauthorized', { status: 401 });

    const body = await req.json();
    const { plan_slug } = body;

    if (!PLANS[plan_slug]) {
        return new NextResponse('Invalid Plan', { status: 400 });
    }

    try {
        // Mocking Paystack Init
        // In real world: Call Paystack API to initialize transaction/subscription
        // Return checkout_url

        const checkoutUrl = `https://checkout.paystack.com/mock-transaction-${Date.now()}`;

        // Upsert pending subscription
        await prisma.merchantSubscription.upsert({
            where: { storeId: (session!.user as any).storeId },
            update: {
                planSlug: plan_slug,
                lastPaymentStatus: 'pending'
                // Don't change status to active yet until webhook logic
            },
            create: {
                storeId: (session!.user as any).storeId,
                planSlug: plan_slug,
                status: 'pending',
                lastPaymentStatus: 'pending'
            }
        });

        return NextResponse.json({ ok: true, checkout_url: checkoutUrl });

    } catch (e: any) {
        return new NextResponse(e.message, { status: 500 });
    }
}
