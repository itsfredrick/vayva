import { prisma } from '@vayva/db';
import { createHash } from 'crypto';

export type IdempotencyStatus = 'started' | 'completed' | 'failed';

export interface IdempotencyResult {
    status: IdempotencyStatus;
    response?: any;
    isNew: boolean;
}

export class IdempotencyService {

    static generateHash(data: any): string {
        return createHash('sha256').update(JSON.stringify(data)).digest('hex');
    }

    /**
     * Locks a key. If key exists:
     * - matches hash? -> return status (idempotent)
     * - different hash? -> return error (conflict)
     * If key new -> create 'started' and return isNew=true
     */
    static async lockKey(key: string, scope: string, merchantId: string | null, payload: any): Promise<IdempotencyResult> {
        const hash = this.generateHash(payload);

        // Atomic upsert or find logic needed. 
        // Prisma upsert is atomic for creating.

        const existing = await prisma.idempotencyKey.findUnique({ where: { key } });

        if (existing) {
            if (existing.requestHash !== hash) {
                throw new Error(`Idempotency Key Conflict: Key '${key}' used for different payload.`);
            }
            if (existing.status === 'started' && new Date() < existing.expiresAt) {
                // In progress
                return { status: 'started', isNew: false };
            }
            if (existing.status === 'completed') {
                return { status: 'completed', response: existing.response, isNew: false };
            }
            // If failed, we arguably allow retry (re-lock).
            // For now, simpler to treat as "proceed" or return failure. 
            // We'll treat failed as "allows retry" -> delete and recreate or update.
            // Let's implement Re-Lock update.
            await prisma.idempotencyKey.update({
                where: { key },
                data: { status: 'started', expiresAt: new Date(Date.now() + 60000), response: null as any }
            });
            return { status: 'started', isNew: true };
        }

        // Create New
        await prisma.idempotencyKey.create({
            data: {
                key,
                scope,
                merchantId,
                requestHash: hash,
                status: 'started',
                expiresAt: new Date(Date.now() + 60000) // 1 min timeout for processing
            }
        });

        return { status: 'started', isNew: true };
    }

    static async complete(key: string, response: any) {
        await prisma.idempotencyKey.update({
            where: { key },
            data: { status: 'completed', response }
        });
    }

    static async fail(key: string, error?: string) {
        await prisma.idempotencyKey.update({
            where: { key },
            data: { status: 'failed', response: { error } }
        });
    }
}
