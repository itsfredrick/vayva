
import { prisma } from '@vayva/db';
import { logAuditEvent, AuditEventType } from './audit';

const LOCK_TIMEOUT_MS = 30000; // 30 seconds

export class LockError extends Error {
    constructor(message: string) {
        super(message);
        this.name = 'LockError';
    }
}

/**
 * Acquire a soft lock on a withdrawal record.
 * Throws LockError if already locked by another user.
 */
export async function acquireWithdrawalLock(
    withdrawalId: string,
    userId: string,
    storeId: string
): Promise<void> {
    const now = new Date();
    const lockTimeout = new Date(now.getTime() - LOCK_TIMEOUT_MS);

    // Try to acquire lock
    const result = await prisma.withdrawal.updateMany({
        where: {
            id: withdrawalId,
            OR: [
                { lockedAt: null },
                { lockedAt: { lt: lockTimeout } }, // Stale lock
                { lockedBy: userId } // Already locked by this user
            ]
        },
        data: {
            lockedAt: now,
            lockedBy: userId
        }
    });

    if (result.count === 0) {
        // Lock failed - check if it's locked by someone else
        const withdrawal = await prisma.withdrawal.findUnique({
            where: { id: withdrawalId }
        });

        if (withdrawal?.lockedAt && withdrawal.lockedAt > lockTimeout) {
            await logAuditEvent(
                storeId,
                userId,
                AuditEventType.OPERATION_LOCKED,
                {
                    withdrawalId,
                    lockedBy: withdrawal.lockedBy,
                    referenceCode: withdrawal.referenceCode
                }
            );
            throw new LockError('Withdrawal is currently being processed by another admin');
        }

        throw new LockError('Failed to acquire lock');
    }

    // Log successful lock
    await logAuditEvent(
        storeId,
        userId,
        AuditEventType.OPERATION_LOCKED,
        { withdrawalId, action: 'acquired' }
    );
}

/**
 * Release a lock on a withdrawal record.
 */
export async function releaseWithdrawalLock(
    withdrawalId: string,
    userId: string
): Promise<void> {
    await prisma.withdrawal.updateMany({
        where: {
            id: withdrawalId,
            lockedBy: userId
        },
        data: {
            lockedAt: null,
            lockedBy: null
        }
    });
}

/**
 * Clean up stale locks (optional maintenance function).
 */
export async function cleanupStaleLocks(): Promise<number> {
    const lockTimeout = new Date(Date.now() - LOCK_TIMEOUT_MS);

    const result = await prisma.withdrawal.updateMany({
        where: {
            lockedAt: { lt: lockTimeout }
        },
        data: {
            lockedAt: null,
            lockedBy: null
        }
    });

    if (result.count > 0) {
        console.log(`Cleaned up ${result.count} stale withdrawal locks`);
    }

    return result.count;
}

/**
 * Acquire a soft lock on an export job.
 */
export async function acquireExportLock(
    exportId: string,
    userId: string
): Promise<void> {
    const now = new Date();
    const lockTimeout = new Date(now.getTime() - LOCK_TIMEOUT_MS);

    const result = await prisma.exportJob.updateMany({
        where: {
            id: exportId,
            OR: [
                { lockedAt: null },
                { lockedAt: { lt: lockTimeout } },
                { lockedBy: userId }
            ]
        },
        data: {
            lockedAt: now,
            lockedBy: userId
        }
    });

    if (result.count === 0) {
        throw new LockError('Export job is currently being processed');
    }
}

/**
 * Release a lock on an export job.
 */
export async function releaseExportLock(
    exportId: string,
    userId: string
): Promise<void> {
    await prisma.exportJob.updateMany({
        where: {
            id: exportId,
            lockedBy: userId
        },
        data: {
            lockedAt: null,
            lockedBy: null
        }
    });
}
