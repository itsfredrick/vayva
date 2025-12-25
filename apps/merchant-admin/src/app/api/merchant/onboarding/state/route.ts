import { NextRequest, NextResponse } from 'next/server';
import { getSessionUser } from '@/lib/session';
import { prisma } from '@vayva/db';

// GET /api/merchant/onboarding/state - Retrieve onboarding state
export async function GET(request: NextRequest) {
    try {
        // Get authenticated user from session
        const sessionUser = await getSessionUser();

        if (!sessionUser) {
            return NextResponse.json(
                { error: 'Not authenticated' },
                { status: 401 }
            );
        }

        // Get onboarding state from database
        const onboarding = await prisma.merchantOnboarding.findUnique({
            where: { storeId: sessionUser.storeId },
        });

        // Get store for onboarding metadata
        const store = await prisma.store.findUnique({
            where: { id: sessionUser.storeId },
        });

        if (!onboarding || !store) {
            // Return default state if not found
            return NextResponse.json({
                onboardingStatus: 'IN_PROGRESS',
                currentStep: 'welcome',
                completedSteps: [],
                data: {
                    business: {
                        name: store?.name || '',
                        email: sessionUser.email,
                    },
                    user: {
                        firstName: sessionUser.firstName,
                        lastName: sessionUser.lastName,
                    },
                },
            });
        }

        // Return onboarding state
        return NextResponse.json({
            onboardingStatus: onboarding.status,
            currentStep: onboarding.currentStepKey,
            completedSteps: onboarding.completedSteps || [],
            data: onboarding.data || {},
        });

    } catch (error) {
        console.error('Get onboarding state error:', error);
        return NextResponse.json(
            { error: 'Failed to retrieve onboarding state' },
            { status: 500 }
        );
    }
}

// POST /api/merchant/onboarding/state - Save onboarding progress
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

        const body = await request.json();
        const { currentStep, data, completedSteps } = body;

        // Update onboarding state
        const onboarding = await prisma.merchantOnboarding.upsert({
            where: { storeId: sessionUser.storeId },
            update: {
                currentStepKey: currentStep || undefined,
                data: data || undefined,
                completedSteps: completedSteps || undefined,
                updatedAt: new Date(),
            },
            create: {
                storeId: sessionUser.storeId,
                status: 'IN_PROGRESS',
                currentStepKey: currentStep || 'welcome',
                data: data || {},
                completedSteps: completedSteps || [],
            },
        });

        // Update store's onboarding last step
        if (currentStep) {
            await prisma.store.update({
                where: { id: sessionUser.storeId },
                data: { onboardingLastStep: currentStep },
            });
        }

        return NextResponse.json({
            message: 'Onboarding progress saved',
            onboarding: {
                status: onboarding.status,
                currentStep: onboarding.currentStepKey,
                completedSteps: onboarding.completedSteps,
            },
        });

    } catch (error) {
        console.error('Save onboarding state error:', error);
        return NextResponse.json(
            { error: 'Failed to save onboarding progress' },
            { status: 500 }
        );
    }
}
