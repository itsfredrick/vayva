import { prisma } from '@vayva/db';

/**
 * P11.2: Track API errors for ops monitoring
 * Only logs when statusCode >= 500 and feature flag is enabled
 */
export async function trackApiError(params: {
    routeKey: string;
    statusCode: number;
    storeId?: string;
}): Promise<void> {
    // Feature flag check
    const isEnabled = process.env.OPS_API_ERROR_TRACKING_ENABLED === 'true';
    if (!isEnabled) return;

    // Only track server errors
    if (params.statusCode < 500) return;

    try {
        await prisma.apiError.create({
            data: {
                routeKey: params.routeKey,
                statusCode: params.statusCode,
                storeId: params.storeId || null
            }
        });
    } catch (error) {
        // Silent fail - don't break the request
        console.error('[API Error Tracker] Failed to log error:', error);
    }
}
