
import { NextResponse } from 'next/server';
import { requireAuth } from '@/lib/auth/session';
import { prisma } from '@vayva/db';

const PLAN_PRICING = {
    STARTER: 0,
    GROWTH: 30000,
    PRO: 40000
};

export async function GET() {
    try {
        const session = await requireAuth();
        const storeId = session.user.storeId;

        // Fetch subscription
        const subscription = await prisma.merchantSubscription.findUnique({
            where: { storeId },
        });

        // Fetch billing profile
        const billingProfile = await prisma.billingProfile.findUnique({
            where: { storeId },
        });

        return NextResponse.json({
            subscription: subscription ? {
                plan: subscription.planSlug,
                status: subscription.status,
                renewalDate: subscription.currentPeriodEnd,
                provider: subscription.provider,
                amount: PLAN_PRICING[subscription.planSlug as keyof typeof PLAN_PRICING] || 0,
                interval: 'monthly'
            } : {
                plan: 'FREE',
                status: 'active',
                renewalDate: null,
                provider: 'none',
                amount: 0,
                interval: 'monthly'
            },
            billing: {
                legalName: billingProfile?.legalName || '',
                email: billingProfile?.billingEmail || '',
                taxId: billingProfile?.taxId || '',
                address: billingProfile?.addressText || '',
            },
        });
    } catch (error: any) {
        console.error('Billing fetch error:', error);
        if (error.message === 'Unauthorized') {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }
        return NextResponse.json({ error: 'Failed to fetch billing details' }, { status: 500 });
    }
}

export async function PUT(request: Request) {
    try {
        const session = await requireAuth();
        const storeId = session.user.storeId;
        const body = await request.json();
        const { legalName, email, taxId, address } = body;

        const updatedProfile = await prisma.billingProfile.upsert({
            where: { storeId },
            create: {
                storeId,
                legalName,
                billingEmail: email,
                taxId,
                addressText: address,
            },
            update: {
                legalName,
                billingEmail: email,
                taxId,
                addressText: address,
            }
        });

        // Audit Logging
        const { logAuditEvent, AuditEventType } = await import('@/lib/audit');
        await logAuditEvent(storeId, session.user.id, AuditEventType.SETTINGS_CHANGED, {
            keysChanged: ['billing_profile']
        });

        return NextResponse.json({
            success: true,
            message: 'Billing details updated successfully',
            profile: updatedProfile
        });
    } catch (error: any) {
        console.error('Billing update error:', error);
        if (error.message === 'Unauthorized') {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }
        return NextResponse.json({ error: 'Failed to update billing details' }, { status: 500 });
    }
}
