import { NextRequest, NextResponse } from 'next/server';
import { getSessionUser } from '@/lib/session';
import { prisma } from '@vayva/db';

export async function GET(request: NextRequest) {
    try {
        // Get user from session
        const sessionUser = await getSessionUser();

        if (!sessionUser) {
            return NextResponse.json(
                { error: 'Not authenticated' },
                { status: 401 }
            );
        }

        // Fetch full user data with onboarding status
        const user = await prisma.user.findUnique({
            where: { id: sessionUser.id },
            include: {
                memberships: {
                    where: {
                        storeId: sessionUser.storeId,
                        status: 'active',
                    },
                    include: {
                        store: true,
                    },
                },
            },
        });

        if (!user || user.memberships.length === 0) {
            return NextResponse.json(
                { error: 'User or store not found' },
                { status: 404 }
            );
        }

        const membership = user.memberships[0];
        const store = membership.store;

        // Get onboarding status
        const onboarding = await prisma.merchantOnboarding.findUnique({
            where: { storeId: store.id },
        });

        return NextResponse.json({
            user: {
                id: user.id,
                email: user.email,
                firstName: user.firstName,
                lastName: user.lastName,
                businessName: store.name,
                emailVerified: user.isEmailVerified,
                phoneVerified: user.isPhoneVerified || false,
            },
            merchant: {
                merchantId: user.id,
                storeId: store.id,
                storeName: store.name,
                businessType: store.category || 'UNKNOWN',
                onboardingStatus: onboarding?.status || 'UNKNOWN',
                onboardingLastStep: store.onboardingLastStep || 'welcome',
                onboardingCompleted: store.onboardingCompleted || false,
                onboardingUpdatedAt: onboarding?.updatedAt || new Date(),
                onboardingData: onboarding?.data || {},
                plan: store.plan || 'UNKNOWN',
            },
        });

    } catch (error) {
        console.error('Auth me error:', error);
        return NextResponse.json(
            { error: 'Failed to fetch user data' },
            { status: 500 }
        );
    }
}
