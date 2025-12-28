import { prisma } from '@vayva/db';
import { addDays } from 'date-fns';

export class DeletionService {
    /**
     * Request Account Deletion (Owner Only)
     * - Enforces Grace Period (7 days)
     * - Checks for Blockers
     */
    static async requestDeletion(storeId: string, userId: string, reason?: string) {
        // 1. Check ownership
        // Assuming middleware covers it.

        // 2. Check Blockers
        const blockers = await this.checkBlockers(storeId);
        if (blockers.length > 0) {
            return { success: false, error: 'Cannot delete account yet.', blockers };
        }

        // 3. Create Request
        const scheduledFor = addDays(new Date(), 7); // 7 Day Grace Period

        await (prisma as any).accountDeletionRequest.create({
            data: {
                storeId,
                requestedByUserId: userId,
                status: 'SCHEDULED',
                scheduledFor,
                reason
            }
        });

        // 4. Send Confirmation Email (TODO: Phase G integration)
        // await EmailService.sendDeletionScheduled(...)

        return { success: true, scheduledFor };
    }

    /**
     * Cancel Pending Deletion
     */
    static async cancelDeletion(storeId: string, userId: string) {
        const activeRequest = await (prisma as any).accountDeletionRequest.findFirst({
            where: { storeId, status: 'SCHEDULED' }
        });

        if (!activeRequest) {
            return { success: false, error: 'No active deletion request found.' };
        }

        await (prisma as any).accountDeletionRequest.update({
            where: { id: activeRequest.id },
            data: { status: 'CANCELED' }
        });

        return { success: true };
    }

    /**
     * Get Current Deletion Status
     */
    static async getStatus(storeId: string) {
        return await (prisma as any).accountDeletionRequest.findFirst({
            where: { storeId, status: 'SCHEDULED' },
            orderBy: { createdAt: 'desc' }
        });
    }

    /**
     * Execute Logic (To be called by Job Worker)
     */
    static async executeDeletion(requestId: string) {
        const request = await (prisma as any).accountDeletionRequest.findUnique({
            where: { id: requestId },
            include: { store: true }
        });

        if (!request || request.status !== 'SCHEDULED') return;

        // Soft Delete / Deactivate
        await prisma.$transaction([
            // 1. Mark Store as offline
            prisma.store.update({
                where: { id: request.storeId },
                data: { isLive: false }
            }),
            // 2. Mark Request as Executed
            (prisma as any).accountDeletionRequest.update({
                where: { id: request.id },
                data: { status: 'EXECUTED' }
            })
        ]);

        // 4. Invalidate Sessions (would need Redis/Auth logic here)
    }

    private static async checkBlockers(storeId: string): Promise<string[]> {
        const blockers: string[] = [];

        // Check 1: Pending Payouts
        const pendingPayouts = await prisma.payout.count({
            where: { storeId, status: { in: ['PENDING', 'PROCESSING'] } }
        });
        if (pendingPayouts > 0) blockers.push('You have pending payouts processing.');

        return blockers;
    }
}
