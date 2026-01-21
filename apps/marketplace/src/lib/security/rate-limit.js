import { redis } from "@/lib/redis";
import { NextResponse } from "next/server";
export class RateLimitService {
    /**
     * Check rate limit for a given key
     */
    async check(key, config = { windowMs: 60000, max: 10 }) {
        const now = Date.now();
        const windowStart = now - config.windowMs;
        const redisKey = `ratelimit:marketplace:${key}`; // Namespace for marketplace
        try {
            const current = await redis.incr(redisKey);
            if (current === 1) {
                await redis.expire(redisKey, Math.ceil(config.windowMs / 1000));
            }
            const remaining = Math.max(0, config.max - current);
            const reset = Math.ceil(now / 1000) + Math.ceil(config.windowMs / 1000);
            return {
                success: current <= config.max,
                limit: config.max,
                remaining,
                reset,
            };
        }
        catch (error) {
            console.warn("Rate limit check failed (failing open):", error);
            return {
                success: true,
                limit: config.max,
                remaining: 1,
                reset: Math.ceil(now / 1000) + 60,
            };
        }
    }
    /**
     * Middleware-compatible rate limiter
     */
    async middlewareCheck(req, keyPrefix = "global", config) {
        const ip = req.headers.get("x-forwarded-for") || "unknown";
        const key = `${keyPrefix}:${ip}`;
        const result = await this.check(key, config);
        if (!result.success) {
            return NextResponse.json({ error: "Too many requests, please try again later." }, { status: 429, headers: { "Retry-After": String(result.reset) } });
        }
        return null; // Null means pass
    }
}
export const rateLimitService = new RateLimitService();
