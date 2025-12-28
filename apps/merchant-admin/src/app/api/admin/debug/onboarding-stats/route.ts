
import { NextResponse } from 'next/server';
import { prisma } from '@vayva/db';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';


const calculateMedianTime = async (eventName: string) => {
    // Basic Outlier Filter: Only consider events that happened AFTER store was "required complete".
    // This is hard to do in a single aggregated query without complex joins on properties(JSON).
    // For now, we will fetch recent events and filter in code if we can get the store context, 
    // OR we just rely on the 'timeSinceRequiredCompleteMs' property being positive.
    // If telemetryEvent properties already has 'timeSinceRequiredCompleteMs', we can just use that.
    // Negative values would imply it happened before completion (which shouldn't happen with our new logic, but older data might exist).

    // NOTE: The prompt says "ignore events with createdAt older than requiredCompleteAt for that merchant".
    // This implies we need to join on Store or trust the property. 
    // Since we are logging 'timeSinceRequiredCompleteMs', filtering for > 0 is effectively the same safeguard.

    const events = await prisma.telemetryEvent.findMany({
        where: {
            eventName,
            // Safeguard: Ensure we rely on server-generated createdAt, 
            // and for hygiene, ignore very old events if needed, but here we filter by property value.
        },
        select: { properties: true }
    });

    const times = events
        .map((e: any) => e.properties?.timeSinceRequiredCompleteMs)
        .filter((t: any) => typeof t === 'number' && t > 0) // Safeguard: Positive duration only
        .sort((a: number, b: number) => a - b);

    if (times.length === 0) return 0;
    const mid = Math.floor(times.length / 2);
    return times.length % 2 !== 0 ? times[mid] : (times[mid - 1] + times[mid]) / 2;
};

export async function GET() {
    try {
        const session = await getServerSession(authOptions);
        if (!session) return new NextResponse('Unauthorized', { status: 401 });

        // Simple aggregation
        const totalWelcome = await prisma.telemetryEvent.count({
            where: { eventName: 'onboarding_step_view' } // Approximation
        });

        const totalComplete = await prisma.telemetryEvent.count({
            where: { eventName: 'onboarding_required_complete' }
        });

        // Get recent events
        const recent = await prisma.telemetryEvent.findMany({
            take: 10,
            orderBy: { createdAt: 'desc' }
        });

        return NextResponse.json({
            stats: {
                totalWelcome,
                totalComplete,
                completionRate: totalWelcome > 0 ? (totalComplete / totalWelcome) : 0,
                activation: {
                    productsCreated: await prisma.telemetryEvent.count({ where: { eventName: 'activation_first_product_created' } }),
                    ordersCreated: await prisma.telemetryEvent.count({ where: { eventName: 'activation_first_order_created' } }),
                    welcomeShown: await prisma.telemetryEvent.count({ where: { eventName: 'activation_welcome_shown' } }),
                    medianTimeProduct: await calculateMedianTime('activation_first_product_created'),
                    medianTimeOrder: await calculateMedianTime('activation_first_order_created')
                }
            },
            recent
        });
    } catch (error) {
        return new NextResponse('Error ' + error, { status: 500 });
    }
}
