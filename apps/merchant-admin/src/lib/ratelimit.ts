import { redis } from "./redis";

const RATES = {
    auth: { limit: 5, window: 60 * 15 }, // 5 failures per 15 min
    api_write: { limit: 100, window: 60 },
    api_read: { limit: 300, window: 60 },
    default: { limit: 60, window: 60 },
};

export async function checkRateLimit(identifier: any, type: any = "default") {
    // If no redis, skip (dev mode or fallback)
    if (!redis) return { success: true, limit: 0, remaining: 100, reset: 0 };

    const rate = (RATES as any)[type] || RATES.default;
    const key = `ratelimit:${type}:${identifier}`;

    // Simple counter implementation
    const current = await redis.incr(key);
    if (current === 1) {
        await redis.expire(key, rate.window);
    }

    const reset = await redis.ttl(key);

    if (current > rate.limit) {
        return {
            success: false,
            limit: rate.limit,
            remaining: 0,
            reset
        };
    }

    return {
        success: true,
        limit: rate.limit,
        remaining: rate.limit - current,
        reset
    };
}
