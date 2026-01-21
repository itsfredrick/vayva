
import { redis } from "@/lib/redis";
import { NextResponse } from "next/server";

interface RateLimitConfig {
    windowMs: number;
    max: number;
}

export class RateLimitService {
    /**
     * Check rate limit for a given key
     */
    async check(key: string, config: RateLimitConfig = { windowMs: 60000, max: 10 }) {
        const now = Date.now();
        const windowStart = now - config.windowMs;

        // Create a unique key for the rate limit bucket
        const redisKey = `ratelimit:${key}`;

        try {
            // Use a simple counter with expiration
            // In a real production scenario with high concurrency, a Lua script or sliding window is better
            // But for this hardening phase, a fixed window counter is sufficient and robust enough

            const current = await redis.incr(redisKey);

            if (current === 1) {
                // Set expiration if it's the first request
                await redis.expire(redisKey, Math.ceil(config.windowMs / 1000));
            }

            const remaining = Math.max(0, config.max - current);
            const reset = Math.ceil(now / 1000) + Math.ceil(config.windowMs / 1000); // Approximate reset time

            return {
                success: current <= config.max,
                limit: config.max,
                remaining,
                reset,
            };
        } catch (error) {
            console.warn("Rate limit check failed (failing open):", error);
            // Fail open to avoid blocking legitimate traffic if Redis is down
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
    async middlewareCheck(req: Request, keyPrefix: string = "global", config?: RateLimitConfig) {
        const ip = req.headers.get("x-forwarded-for") || "unknown";
        const key = `${keyPrefix}:${ip}`;

        const result = await this.check(key, config);

        if (!result.success) {
            // Log security event for monitoring
            try {
                // Dynamic import to avoid circular dependencies if any
                const { logAuditEvent, AuditEventType } = await import("@/lib/audit");
                await logAuditEvent(
                    null, // No specific store context for global middleware check
                    "system",
                    AuditEventType.SECURITY_RATE_LIMIT_BLOCKED,
                    {
                        ipAddress: ip,
                        targetType: "endpoint",
                        targetId: req.url,
                        reason: "Rate limit exceeded",
                        meta: { limit: result.limit, remaining: result.remaining }
                    }
                );
            } catch (e) {
                console.error("Failed to log security event", e);
            }

            return NextResponse.json(
                { error: "Too many requests, please try again later." },
                { status: 429, headers: { "Retry-After": String(result.reset) } }
            );
        }

        return null; // Null means pass
    }
}

export const rateLimitService = new RateLimitService();
