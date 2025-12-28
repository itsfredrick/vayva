
import { prisma } from '@vayva/db';
import { NextResponse } from 'next/server';
import crypto from 'crypto';
import { logAuditEvent, AuditEventType } from './audit';

interface IdempotencyOptions {
    key: string;
    userId: string;
    merchantId: string;
    route: string;
    ttlSeconds?: number;
}

export class IdempotencyError extends Error {
    constructor(message: string, public readonly cachedResponse: any) {
        super(message);
        this.name = 'IdempotencyError';
    }
}

/**
 * Check if an idempotency key has been used before.
 * If yes, return the cached response.
 * If no, return null (caller should proceed with operation).
 */
export async function checkIdempotency(
    options: IdempotencyOptions
): Promise<NextResponse | null> {
    const { key, userId, merchantId, route, ttlSeconds = 86400 } = options;

    // 1. Look up existing record
    const existing = await prisma.idempotencyRecord.findUnique({
        where: { key }
    });

    if (!existing) {
        return null; // New request, proceed
    }

    // 2. Check expiry
    if (existing.expiresAt < new Date()) {
        // Expired, allow retry
        await prisma.idempotencyRecord.delete({ where: { key } });
        return null;
    }

    // 3. Verify ownership (security check)
    if (existing.userId !== userId || existing.merchantId !== merchantId) {
        throw new Error('Idempotency key conflict: different user');
    }

    // 4. Return cached response
    await logAuditEvent(
        merchantId,
        userId,
        AuditEventType.IDEMPOTENCY_REPLAYED,
        { route, key: key.substring(0, 8) + '...' }
    );

    // Return the cached response
    if (existing.response) {
        return NextResponse.json(existing.response, {
            status: 200,
            headers: { 'X-Idempotency-Replayed': 'true' }
        });
    }

    return null;
}

/**
 * Store the response for an idempotency key.
 */
export async function storeIdempotencyResponse(
    options: IdempotencyOptions,
    response: any
): Promise<void> {
    const { key, userId, merchantId, route, ttlSeconds = 86400 } = options;

    const responseHash = crypto
        .createHash('sha256')
        .update(JSON.stringify(response))
        .digest('hex');

    const expiresAt = new Date();
    expiresAt.setSeconds(expiresAt.getSeconds() + ttlSeconds);

    await prisma.idempotencyRecord.upsert({
        where: { key },
        create: {
            key,
            userId,
            merchantId,
            route,
            responseHash,
            response,
            expiresAt
        },
        update: {
            responseHash,
            response,
            expiresAt
        }
    });
}

/**
 * Extract idempotency key from request headers.
 */
export function getIdempotencyKey(request: Request): string | null {
    return request.headers.get('Idempotency-Key') ||
        request.headers.get('idempotency-key');
}
