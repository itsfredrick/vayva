import { NextRequest, NextResponse } from 'next/server';
import { getSessionUser } from '@/lib/session';
import { prisma } from '@vayva/db';

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

        // Mark onboarding as complete in a transaction
        await prisma.$transaction([
            // Update onboarding status
            prisma.merchantOnboarding.update({
                where: { storeId: sessionUser.storeId },
                data: {
                    status: 'COMPLETE',
                    currentStepKey: 'complete',
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
