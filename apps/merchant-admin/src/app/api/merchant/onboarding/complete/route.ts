import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { prisma } from '@vayva/db';

export async function POST(req: NextRequest) {
    try {
        const session = await getServerSession();
        if (!(session?.user as any)?.storeId) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        // Update onboarding status
        await prisma.merchantOnboarding.update({
            where: { storeId: (session!.user as any).storeId },
            data: {
                status: 'COMPLETE',
                currentStepKey: 'completed',
                completedAt: new Date(),
                completedSteps: {
                    set: ['welcome', 'identity', 'template', 'products', 'payments', 'delivery', 'policies']
                }
            }
        });

        // Mark onboarding as completed on store
        await prisma.store.update({
            where: { id: (session!.user as any).storeId },
            data: {
                onboardingCompleted: true,
                onboardingStatus: 'COMPLETE'
            }
        });

        return NextResponse.json({ ok: true, redirect: '/onboarding/live' });
    } catch (error) {
        console.error('Error completing onboarding:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
