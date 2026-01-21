import Redis from "ioredis";
// Use environment variable or default to localhost
const redisUrl = process.env.REDIS_URL || "redis://localhost:6379";
const redis = new Redis(redisUrl);
// Config per route type (simplified)
const LIMITS = {
    "auth": { limit: 5, window: 60 * 15 }, // 5 failures per 15 min (handled by auth logic usually, but here for API)
    "api_write": { limit: 100, window: 60 }, // 100 requests per minute
    "api_read": { limit: 300, window: 60 }, // 300 requests per minute
    "default": { limit: 200, window: 60 }
};
export async function checkRateLimit(identifier, type) {
    const config = LIMITS[type];
    const key = `ratelimit:${type}:${identifier}`;
    const currentUsage = await redis.incr(key);
    if (currentUsage === 1) {
        await redis.expire(key, config.window);
    }
    const remaining = Math.max(0, config.limit - currentUsage);
    const success = currentUsage <= config.limit;
    return {
        success,
        limit: config.limit,
        remaining,
        reset: Math.floor(Date.now() / 1000) + config.window // approximate
    };
}
