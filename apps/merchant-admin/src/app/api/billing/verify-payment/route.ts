import { NextResponse } from 'next/server';
import { PaystackService } from '@/lib/payment/paystack';
import { prisma } from '@vayva/db';

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { reference } = body;

        if (!reference) {
            return NextResponse.json(
                { error: 'Payment reference is required' },
                { status: 400 }
            );
        }

        // Verify payment with Paystack
        const verification = await PaystackService.verifyPlanChangePayment(reference);

        if (!verification.success) {
            return NextResponse.json(
                { error: 'Payment verification failed' },
                { status: 400 }
            );
        }

        const { storeId, newPlan } = verification;

        // Update store plan
        await prisma.store.update({
            where: { id: storeId },
            data: { plan: newPlan as any },
        });

        // Create or update subscription
        const existingSubscription = await prisma.merchantSubscription.findUnique({
            where: { storeId },
        });

        const now = new Date();
        const periodEnd = new Date(now);
        periodEnd.setMonth(periodEnd.getMonth() + 1);

        if (existingSubscription) {
            await prisma.merchantSubscription.update({
                where: { storeId },
                data: {
                    planSlug: newPlan,
                    status: 'ACTIVE',
                    currentPeriodStart: now,
                    currentPeriodEnd: periodEnd,
                },
            });
        } else {
            await prisma.merchantSubscription.create({
                data: {
                    storeId,
                    planSlug: newPlan,
                    status: 'ACTIVE',
                    currentPeriodStart: now,
                    currentPeriodEnd: periodEnd,
                },
            });
        }

        return NextResponse.json({
            success: true,
            message: 'Subscription updated successfully',
        });
    } catch (error: any) {
        console.error('Payment verification error:', error);

        return NextResponse.json(
            { error: error.message || 'Failed to verify payment' },
            { status: 500 }
        );
    }
}
