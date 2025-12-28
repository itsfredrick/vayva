
import { NextResponse } from 'next/server';
import { getSessionUser } from '@/lib/session';
import { prisma } from '@vayva/db';
import { authorizeAction, AppRole } from '@/lib/permissions';
import { logAuditEvent, AuditEventType } from '@/lib/audit';
import { getIdempotencyKey, checkIdempotency, storeIdempotencyResponse } from '@/lib/idempotency';
import { acquireWithdrawalLock, releaseWithdrawalLock, LockError } from '@/lib/operation-lock';

const VALID_TRANSITIONS: Record<string, string[]> = {
    'PENDING': ['PROCESSING', 'CANCELED'],
    'PROCESSING': ['PAID', 'FAILED'],
    'CANCELED': [],
    'PAID': [],
    'FAILED': []
};

export async function POST(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    const { id } = await params;
    let lockAcquired = false;

    try {
        const user = await getSessionUser();

        // 1. Auth & Permissions (Admin/Owner only)
        const authError = await authorizeAction(user || undefined, AppRole.ADMIN);
        if (authError) return authError;
        if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

        // 2. Idempotency check
        const idempotencyKey = getIdempotencyKey(request);
        if (idempotencyKey) {
            const cachedResponse = await checkIdempotency({
                key: idempotencyKey,
                userId: user.id,
                merchantId: user.storeId,
                route: `/api/admin/withdrawals/${id}/status`,
                ttlSeconds: 3600 // 1 hour
            });
            if (cachedResponse) return cachedResponse;
        }

        const body = await request.json();
        const { toStatus } = body;

        if (!toStatus) {
            return NextResponse.json({ error: 'Missing toStatus' }, { status: 400 });
        }

        // 3. Acquire Lock (prevents concurrent updates)
        await acquireWithdrawalLock(id, user.id, user.storeId);
        lockAcquired = true;
        const withdrawal = await prisma.withdrawal.findUnique({
            where: { id, storeId: user.storeId }
        });

        if (!withdrawal) {
            return NextResponse.json({ error: 'Withdrawal not found' }, { status: 404 });
        }

        // 3. Validate Transition
        const allowedNext = VALID_TRANSITIONS[withdrawal.status] || [];
        if (!allowedNext.includes(toStatus)) {
            return NextResponse.json({
                error: `Invalid status transition from ${withdrawal.status} to ${toStatus}`
            }, { status: 400 });
        }

        // 4. Update Status
        const updated = await prisma.withdrawal.update({
            where: { id },
            data: {
                status: toStatus,
                // If moving to PAID, we might update amountNet if fees changed, but P8 says do not edit amounts.
                // We keep amounts as is.
            }
        });

        // 5. Audit Log
        await logAuditEvent(
            user.storeId,
            user.id,
            AuditEventType.WITHDRAWAL_STATUS_CHANGED,
            {
                referenceCode: withdrawal.referenceCode,
                fromStatus: withdrawal.status,
                toStatus: toStatus
            }
        );

        const responseData = { success: true, data: updated };

        // Store idempotency response
        if (idempotencyKey) {
            await storeIdempotencyResponse({
                key: idempotencyKey,
                userId: user.id,
                merchantId: user.storeId,
                route: `/api/admin/withdrawals/${id}/status`
            }, responseData);
        }

        return NextResponse.json(responseData);

    } catch (error: any) {
        console.error("Update Status Error:", error);

        if (error.name === 'LockError') {
            return NextResponse.json({ error: error.message }, { status: 409 });
        }

        return NextResponse.json({ error: "Failed to update status" }, { status: 500 });
    } finally {
        // Release lock if acquired
        if (lockAcquired) {
            try {
                const user = await getSessionUser();
                if (user) {
                    await releaseWithdrawalLock(id, user.id);
                }
            } catch (e) {
                console.error("Failed to release lock:", e);
            }
        }
    }
}
