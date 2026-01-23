import { logAuditEvent, AuditEventType } from "./audit";
const SLOW_THRESHOLD_MS = 3000; // 3 seconds
// In-memory store for recent slow paths (rolling window)
const recentSlowPaths = [];
const MAX_SLOW_PATHS = 100;
/**
 * Track API route performance
 */
export async function trackPerformance(route: unknown, method: unknown, startTime: unknown, success: unknown, storeId: unknown, userId: unknown) {
    const durationMs = Date.now() - startTime;
    if (durationMs > SLOW_THRESHOLD_MS) {
        // Store in memory
        recentSlowPaths.push({
            route,
            method,
            durationMs,
            success,
            timestamp: new Date(),
        });
        // Keep only recent entries
        if (recentSlowPaths.length > MAX_SLOW_PATHS) {
            recentSlowPaths.shift();
        }
        // Log slow operation
        if (storeId && userId) {
            await logAuditEvent(storeId, userId, AuditEventType.OPERATION_SLOW, {
                targetType: "API_ROUTE",
                targetId: route,
                meta: {
                    method,
                    durationMs,
                    success,
                }
            });
        }
        console.warn(`[SLOW PATH] ${method} ${route} took ${durationMs}ms`);
    }
}
/**
 * Get recent slow paths
 */
export function getRecentSlowPaths(limit = 50) {
    return recentSlowPaths.slice(-limit).reverse();
}
/**
 * Wrapper for timing async operations
 */
export async function withTiming(operation: unknown, context: unknown) {
    const startTime = Date.now();
    let success = true;
    try {
        const result = await operation();
        return result;
    }
    catch (error) {
        success = false;
        throw error;
    }
    finally {
        await trackPerformance(context.route, context.method, startTime, success, context.storeId, context.userId);
    }
}
