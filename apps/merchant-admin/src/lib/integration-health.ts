import { prisma } from '@vayva/db';

type IntegrationKey = 'whatsapp' | 'paystack' | 'delivery';
type EventStatus = 'SUCCESS' | 'FAIL';

/**
 * P11.2: Log integration events for health monitoring
 */
export async function logIntegrationEvent(
    storeId: string,
    integrationKey: IntegrationKey,
    eventType: string,
    status: EventStatus
): Promise<void> {
    // Feature flag check
    const isEnabled = process.env.OPS_INTEGRATION_HEALTH_ENABLED === 'true';
    if (!isEnabled) return;

    try {
        await prisma.integrationEvent.create({
            data: {
                storeId,
                integrationKey,
                eventType,
                status
            }
        });
    } catch (error) {
        // Silent fail
        console.error('[Integration Health] Failed to log event:', error);
    }
}

/**
 * Get integration health status for ops dashboard
 */
export async function getIntegrationHealth(storeId: string): Promise<{
    whatsapp: { status: string; lastSuccess: Date | null; lastEvent: Date | null };
    paystack: { status: string; lastSuccess: Date | null; lastEvent: Date | null };
    delivery: { status: string; lastSuccess: Date | null; lastEvent: Date | null };
}> {
    const integrations: IntegrationKey[] = ['whatsapp', 'paystack', 'delivery'];
    const health: {
        whatsapp?: { status: string; lastSuccess: Date | null; lastEvent: Date | null };
        paystack?: { status: string; lastSuccess: Date | null; lastEvent: Date | null };
        delivery?: { status: string; lastSuccess: Date | null; lastEvent: Date | null };
    } = {};

    const now = Date.now();
    const day24h = 24 * 60 * 60 * 1000;
    const hours2 = 2 * 60 * 60 * 1000;

    for (const key of integrations) {
        const lastSuccess = await prisma.integrationEvent.findFirst({
            where: { storeId, integrationKey: key, status: 'SUCCESS' },
            orderBy: { createdAt: 'desc' }
        });

        const lastEvent = await prisma.integrationEvent.findFirst({
            where: { storeId, integrationKey: key },
            orderBy: { createdAt: 'desc' }
        });

        // Determine status
        let status: 'OK' | 'WARNING' | 'FAIL' | 'UNKNOWN' = 'UNKNOWN';

        if (lastSuccess && (now - lastSuccess.createdAt.getTime()) < day24h) {
            status = 'OK'; // Success in last 24h
        } else if (lastEvent && lastEvent.status === 'FAIL' && (now - lastEvent.createdAt.getTime()) < hours2) {
            status = 'FAIL'; // Recent failure within 2h
        } else if (lastSuccess) {
            status = 'WARNING'; // No success in 24h but has historical success
        }

        health[key] = {
            status,
            lastSuccess: lastSuccess?.createdAt || null,
            lastEvent: lastEvent?.createdAt || null
        };
    }

    return health as {
        whatsapp: { status: string; lastSuccess: Date | null; lastEvent: Date | null };
        paystack: { status: string; lastSuccess: Date | null; lastEvent: Date | null };
        delivery: { status: string; lastSuccess: Date | null; lastEvent: Date | null };
    };
}
