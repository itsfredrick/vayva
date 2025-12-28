
import { logAuditEvent, AuditEventType } from './audit';

const SLOW_THRESHOLD_MS = 3000; // 3 seconds

interface PerformanceMetric {
    route: string;
    method: string;
    durationMs: number;
    success: boolean;
    timestamp: Date;
}

// In-memory store for recent slow paths (rolling window)
const recentSlowPaths: PerformanceMetric[] = [];
const MAX_SLOW_PATHS = 100;

/**
 * Track API route performance
 */
export async function trackPerformance(
    route: string,
    method: string,
    startTime: number,
    success: boolean,
    storeId?: string,
    userId?: string
): Promise<void> {
    const durationMs = Date.now() - startTime;

    if (durationMs > SLOW_THRESHOLD_MS) {
        // Store in memory
        recentSlowPaths.push({
            route,
            method,
            durationMs,
            success,
            timestamp: new Date()
        });

        // Keep only recent entries
        if (recentSlowPaths.length > MAX_SLOW_PATHS) {
            recentSlowPaths.shift();
        }

        // Log slow operation
        if (storeId && userId) {
            await logAuditEvent(
                storeId,
                userId,
                AuditEventType.OPERATION_SLOW,
                {
                    route,
                    method,
                    durationMs,
                    success
                }
            );
        }

        console.warn(`[SLOW PATH] ${method} ${route} took ${durationMs}ms`);
    }
}

/**
 * Get recent slow paths
 */
export function getRecentSlowPaths(limit: number = 50): PerformanceMetric[] {
    return recentSlowPaths.slice(-limit).reverse();
}

/**
 * Wrapper for timing async operations
 */
export async function withTiming<T>(
    operation: () => Promise<T>,
    context: {
        route: string;
        method: string;
        storeId?: string;
        userId?: string;
    }
): Promise<T> {
    const startTime = Date.now();
    let success = true;

    try {
        const result = await operation();
        return result;
    } catch (error) {
        success = false;
        throw error;
    } finally {
        await trackPerformance(
            context.route,
            context.method,
            startTime,
            success,
            context.storeId,
            context.userId
        );
    }
}
