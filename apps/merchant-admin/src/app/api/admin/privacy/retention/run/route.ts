import { NextRequest, NextResponse } from 'next/server';
import { checkAdminAccess } from '@/lib/admin/auth';
import { prisma } from '@vayva/db';
import { RETENTION_POLICIES, shouldPurge } from '@/lib/privacy/retentionPolicies';

export async function POST(req: NextRequest) {
    try {
        const admin = await checkAdminAccess('admin.jobs.manage');

        // 1. Purge Webhook Payloads
        const purgeDate = new Date();
        purgeDate.setDate(purgeDate.getDate() - RETENTION_POLICIES.WEBHOOK_PAYLOAD_DAYS);

        // For V1, assume we might delete the whole row or update payload to null if supported. 
        // Classification said "Hard Delete (Keep Metadata)". If we delete row, we lose metadata.
        // Assuming "Keep Metadata" means we clear the `payload` JSON field but keep the row.
        // However, schema might not allow payload to be null.
        // If payload is required, we replace it with `{"purged": true}`.

        const result = await prisma.webhookEvent.updateMany({
            where: {
                receivedAt: { lt: purgeDate },
                // Only if not already purged to save DB writes
                // payload: { not: { equals: { purged: true } } } // Json filter syntax varies, let's just run update
            },
            data: {
                payload: { purged: true, reason: 'retention_policy' }
            }
        });

        // Audit Retention Run
        await prisma.auditLog.create({
            data: {
                action: 'retention.purge',
                actorType: 'system', // or admin triggered
                actorId: admin.user.email || 'job',
                entityType: 'system',
                entityId: 'webhook_events',
                afterState: { count: result.count } as any,
                correlationId: `job_${Date.now()}`,
                actorLabel: 'System Job'
            }
        });

        return NextResponse.json({ success: true, purgedCount: result.count });

    } catch (e: any) {
        return new NextResponse(e.message, { status: 500 });
    }
}
