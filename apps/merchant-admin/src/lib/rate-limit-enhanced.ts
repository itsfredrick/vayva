/**
 * Enhanced Rate Limiting Utility
 * Provides flexible rate limiting with multiple strategies
 */

import { NextRequest } from "next/server";

export interface RateLimitConfig {
    maxAttempts: number;
    windowSeconds: number;
    strategy?: 'fixed' | 'sliding';
}

export interface RateLimitResult {
    allowed: boolean;
    remaining: number;
    resetAt: Date;
    error?: string;
}

// In-memory store for development (replace with Redis in production)
const rateLimitStore = new Map<string, { count: number; resetAt: number }>();

/**
 * Get client identifier from request
 */
export function getClientIdentifier(request: NextRequest): string {
    // Try to get IP from various headers
    const forwarded = request.headers.get('x-forwarded-for');
    const realIp = request.headers.get('x-real-ip');
    const cfConnectingIp = request.headers.get('cf-connecting-ip');

    const ip = forwarded?.split(',')[0] || realIp || cfConnectingIp || 'unknown';

    // For authenticated requests, also include user ID if available
    // This prevents one user from exhausting the IP limit for others
    const userId = request.headers.get('x-user-id') || '';

    return userId ? `${ip}:${userId}` : ip;
}

/**
 * Check rate limit for a given key
 */
export async function checkRateLimit(
    identifier: string,
    endpoint: string,
    maxAttempts: number,
    windowSeconds: number
): Promise<RateLimitResult> {
    const key = `ratelimit:${endpoint}:${identifier}`;
    const now = Date.now();
    const windowMs = windowSeconds * 1000;

    // Get or create rate limit entry
    let entry = rateLimitStore.get(key);

    // Reset if window has expired
    if (!entry || now > entry.resetAt) {
        entry = {
            count: 0,
            resetAt: now + windowMs
        };
    }

    // Increment count
    entry.count++;
    rateLimitStore.set(key, entry);

    // Clean up expired entries periodically
    if (Math.random() < 0.01) { // 1% chance
        cleanupExpiredEntries();
    }

    const remaining = Math.max(0, maxAttempts - entry.count);
    const allowed = entry.count <= maxAttempts;

    return {
        allowed,
        remaining,
        resetAt: new Date(entry.resetAt),
        error: allowed ? undefined : 'Rate limit exceeded. Please try again later.'
    };
}

/**
 * Clean up expired entries from store
 */
function cleanupExpiredEntries(): void {
    const now = Date.now();
    const entries = Array.from(rateLimitStore.entries());
    for (const [key, entry] of entries) {
        if (now > entry.resetAt) {
            rateLimitStore.delete(key);
        }
    }
}

/**
 * Rate limit middleware for API routes
 */
export async function rateLimit(
    request: NextRequest,
    endpoint: string,
    config: RateLimitConfig
): Promise<RateLimitResult> {
    const identifier = getClientIdentifier(request);
    return checkRateLimit(
        identifier,
        endpoint,
        config.maxAttempts,
        config.windowSeconds
    );
}

/**
 * Predefined rate limit configurations for common endpoints
 */
export const RATE_LIMITS = {
    // Authentication endpoints
    AUTH_REGISTER: { maxAttempts: 5, windowSeconds: 3600 }, // 5 per hour
    AUTH_LOGIN: { maxAttempts: 10, windowSeconds: 900 }, // 10 per 15 min
    AUTH_VERIFY: { maxAttempts: 10, windowSeconds: 3600 }, // 10 per hour
    // Added for specific flows
    AUTH_STRICT: { maxAttempts: 5, windowSeconds: 3600 },
    OTP_VERIFY: { maxAttempts: 5, windowSeconds: 300 }, // 5 per 5 min to stop brute-force
    OTP_REQUEST: { maxAttempts: 3, windowSeconds: 60 }, // 3 per minute

    // Onboarding endpoints
    ONBOARDING_UPDATE: { maxAttempts: 30, windowSeconds: 60 }, // 30 per minute
    ONBOARDING_COMPLETE: { maxAttempts: 5, windowSeconds: 300 }, // 5 per 5 min

    // Product/Order creation
    PRODUCT_CREATE: { maxAttempts: 20, windowSeconds: 60 }, // 20 per minute
    ORDER_CREATE: { maxAttempts: 30, windowSeconds: 60 }, // 30 per minute

    // Payment endpoints
    PAYMENT_INITIATE: { maxAttempts: 10, windowSeconds: 300 }, // 10 per 5 min
    WITHDRAWAL_REQUEST: { maxAttempts: 5, windowSeconds: 3600 }, // 5 per hour

    // File uploads
    FILE_UPLOAD: { maxAttempts: 20, windowSeconds: 300 }, // 20 per 5 min

    // Webhooks
    WEBHOOK: { maxAttempts: 100, windowSeconds: 60 }, // 100 per minute

    // General API
    API_DEFAULT: { maxAttempts: 60, windowSeconds: 60 }, // 60 per minute
} as const;

/**
 * Helper to apply rate limiting to an API route
 * Returns null if allowed, or NextResponse with error if rate limited
 */
export async function applyRateLimit(
    request: NextRequest,
    endpoint: string,
    config: RateLimitConfig
): Promise<{ allowed: boolean; response?: Response }> {
    const result = await rateLimit(request, endpoint, config);

    if (!result.allowed) {
        return {
            allowed: false,
            response: new Response(
                JSON.stringify({
                    error: result.error,
                    code: 'RATE_LIMIT_EXCEEDED',
                    retryAfter: Math.ceil((result.resetAt.getTime() - Date.now()) / 1000)
                }),
                {
                    status: 429,
                    headers: {
                        'Content-Type': 'application/json',
                        'X-RateLimit-Limit': config.maxAttempts.toString(),
                        'X-RateLimit-Remaining': result.remaining.toString(),
                        'X-RateLimit-Reset': result.resetAt.toISOString(),
                        'Retry-After': Math.ceil((result.resetAt.getTime() - Date.now()) / 1000).toString()
                    }
                }
            )
        };
    }

    return { allowed: true };
}
