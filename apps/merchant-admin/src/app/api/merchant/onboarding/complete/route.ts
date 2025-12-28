import { NextRequest, NextResponse } from 'next/server';
import { getSessionUser } from '@/lib/session';
import { prisma } from '@vayva/db';
import { syncOnboardingData } from '@/lib/onboarding-sync';
import { OnboardingState } from '@/types/onboarding';
import { ONBOARDING_PROFILES } from '@/lib/onboarding-profiles';

export async function POST(request: NextRequest) {
    try {
        // Get authenticated user from session
        const sessionUser = await getSessionUser();

        if (!sessionUser) {
            return NextResponse.json(
                { error: 'Not authenticated' },
                { status: 401 }
            );
        }

        // Fetch current onboarding state
        const onboarding = await prisma.merchantOnboarding.findUnique({
            where: { storeId: sessionUser.storeId }
        });

        if (onboarding?.data) {
            const state = onboarding.data as unknown as OnboardingState;

            // FAST PATH VALIDATION
            if (state.template?.id) {
                const profile = ONBOARDING_PROFILES[state.template.id];
                if (profile?.requireSteps) {
                    for (const step of profile.requireSteps) {
                        if (step === 'payments' && (!state.payments?.method)) {
                            return NextResponse.json(
                                { error: `Missing required step: ${step}`, code: 'MISSING_REQUIRED_STEP' },
                                { status: 422 }
                            );
                        }
                        if (step === 'delivery' && (!state.delivery?.policy)) {
                            return NextResponse.json(
                                { error: `Missing required step: ${step}`, code: 'MISSING_REQUIRED_STEP' },
                                { status: 422 }
                            );
                        }
                        if (step === 'kyc' && (state.kycStatus !== 'verified' && state.kycStatus !== 'pending')) {
                            // Weak check for now, as KYC might be async
                            // return NextResponse.json({ error: 'KYC Required' }, { status: 422 });
                        }
                    }
                }
            }

            // Sync data to core tables
            await syncOnboardingData(sessionUser.storeId, state);

            // REFERRAL TRACKING
            if (state.referralCode) {
                try {
                    const { ReferralService } = await import('@/services/referral.service');
                    const refResult = await ReferralService.trackReferral(sessionUser.storeId, state.referralCode);
                    if (!refResult.success) {
                        console.warn('Referral tracking failed:', refResult.error);
                        // We don't block completion if referral tracking fails
                    }
                } catch (e) {
                    console.error('Referral tracking service error:', e);
                }
            }
        }

        // Mark onboarding as complete in a transaction
        await prisma.$transaction([
            // Update onboarding status
            prisma.merchantOnboarding.update({
                where: { storeId: sessionUser.storeId },
                data: {
                    status: 'COMPLETE',
                    completedSteps: {
                        push: 'completion'
                    },
                    completedAt: new Date(),
                },
            }),
            // Update store
            prisma.store.update({
                where: { id: sessionUser.storeId },
                data: {
                    onboardingCompleted: true,
                    onboardingLastStep: 'complete',

                },
            }),
        ]);

        return NextResponse.json({
            message: 'Onboarding completed successfully',
            redirectUrl: '/admin/dashboard?welcome=true',
        });

    } catch (error) {
        console.error('Complete onboarding error:', error);
        return NextResponse.json(
            { error: 'Failed to complete onboarding' },
            { status: 500 }
        );
    }
}
