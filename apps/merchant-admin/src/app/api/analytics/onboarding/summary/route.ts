import { NextResponse } from 'next/server';
import { prisma } from '@vayva/db';

export const dynamic = 'force-dynamic'; // No caching

export async function GET() {
    try {
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

        // 1. Overview
        const [totalStarted, totalCompleted] = await Promise.all([
            prisma.onboardingAnalyticsEvent.count({
                where: { eventName: 'ONBOARDING_STARTED', createdAt: { gte: thirtyDaysAgo } }
            }),
            prisma.onboardingAnalyticsEvent.count({
                where: { eventName: 'ONBOARDING_COMPLETED', createdAt: { gte: thirtyDaysAgo } }
            })
        ]);

        const overview = {
            started: totalStarted,
            completed: totalCompleted,
            rate: totalStarted > 0 ? (totalCompleted / totalStarted) : 0
        };

        // 2. By Template
        const templateStarts = await prisma.onboardingAnalyticsEvent.groupBy({
            by: ['templateSlug'],
            where: { eventName: 'ONBOARDING_STARTED', createdAt: { gte: thirtyDaysAgo } },
            _count: { _all: true }
        });
        const templateCompletes = await prisma.onboardingAnalyticsEvent.groupBy({
            by: ['templateSlug'],
            where: { eventName: 'ONBOARDING_COMPLETED', createdAt: { gte: thirtyDaysAgo } },
            _count: { _all: true }
        });

        const byTemplate = templateStarts.map((s: any) => {
            const slug = s.templateSlug || 'unknown';
            const started = s._count._all;
            const comp = templateCompletes.find((c: any) => (c.templateSlug || 'unknown') === slug)?._count._all || 0;
            return {
                slug,
                started,
                completed: comp,
                rate: started > 0 ? (comp / started) : 0
            };
        }).sort((a: any, b: any) => b.rate - a.rate);

        // 3. By Plan
        const planStarts = await prisma.onboardingAnalyticsEvent.groupBy({
            by: ['plan'],
            where: { eventName: 'ONBOARDING_STARTED', createdAt: { gte: thirtyDaysAgo } },
            _count: { _all: true }
        });
        const planCompletes = await prisma.onboardingAnalyticsEvent.groupBy({
            by: ['plan'],
            where: { eventName: 'ONBOARDING_COMPLETED', createdAt: { gte: thirtyDaysAgo } },
            _count: { _all: true }
        });

        const byPlan = planStarts.map((s: any) => {
            const plan = s.plan || 'unknown';
            const started = s._count._all;
            const comp = planCompletes.find((c: any) => (c.plan || 'unknown') === plan)?._count._all || 0;
            return {
                plan,
                started,
                completed: comp,
                rate: started > 0 ? (comp / started) : 0
            };
        });

        // 4. By Step (Drop-off Heatmap)
        // Count unique sessions per step view
        const stepViews = await prisma.onboardingAnalyticsEvent.groupBy({
            by: ['step'],
            where: { eventName: 'ONBOARDING_STEP_VIEWED', createdAt: { gte: thirtyDaysAgo } },
            _count: { _all: true } // Proxies for unique sessions if we don't distinct count, but good enough for heatmap
        });

        // Normalize step names if necessary or return raw
        const byStep = stepViews.map((s: any) => ({
            step: s.step || 'unknown',
            views: s._count._all
        })).sort((a: any, b: any) => b.views - a.views);

        // 5. Fast Path vs Normal
        // We'll approximate this by checking 'ONBOARDING_COMPLETED' where fastPath=true vs false
        const fastPathCompletes = await prisma.onboardingAnalyticsEvent.count({
            where: { eventName: 'ONBOARDING_COMPLETED', fastPath: true, createdAt: { gte: thirtyDaysAgo } }
        });
        const normalCompletes = await prisma.onboardingAnalyticsEvent.count({
            where: { eventName: 'ONBOARDING_COMPLETED', fastPath: false, createdAt: { gte: thirtyDaysAgo } }
        });

        const fastPathStats = {
            fastPathCompletes,
            normalCompletes,
            percentFastPath: totalCompleted > 0 ? (fastPathCompletes / totalCompleted) : 0
        };

        return NextResponse.json({
            meta: {
                since: thirtyDaysAgo.toISOString(),
                generatedAt: new Date().toISOString()
            },
            overview,
            byTemplate,
            byPlan,
            byStep,
            fastPathStats
        });

    } catch (e) {
        console.error('Analytics aggregation error:', e);
        return NextResponse.json({ error: 'Failed to generate analytics' }, { status: 500 });
    }
}
