import { NextResponse } from 'next/server';
import { requireAuth } from '@/lib/auth/session';
import { PaystackService } from '@/lib/payment/paystack';
import { prisma } from '@vayva/db';

export async function POST(request: Request) {
    try {
        const { checkFeatureAccess } = await import('@/lib/auth/gating');
        const access = await checkFeatureAccess('template_upgrade');
        if (!access.allowed) {
            return NextResponse.json({
                error: access.reason,
                requiredAction: access.requiredAction
            }, { status: 403 });
        }

        const session = await requireAuth();
        const { templateId, amountNgn } = await request.json();

        if (!templateId || !amountNgn) {
            return NextResponse.json({ error: 'Missing templateId or amount' }, { status: 400 });
        }

        const payment = await PaystackService.initiateTemplatePurchase(
            session.user.email,
            templateId,
            session.user.storeId,
            amountNgn
        );

        return NextResponse.json({
            success: true,
            paymentUrl: payment.authorization_url,
            reference: payment.reference
        });

    } catch (error: any) {
        console.error('Template payment initiation error:', error);
        return NextResponse.json({ error: 'Failed to initiate payment' }, { status: 500 });
    }
}
