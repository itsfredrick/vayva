
import { NextResponse } from 'next/server';
import { prisma } from '@vayva/db';
import { OpsAuthService } from '@/lib/ops-auth';

export const dynamic = 'force-dynamic';

export async function POST(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    const session = await OpsAuthService.getSession();
    if (!session) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;
    const { reason, recordId } = await request.json();

    if (!reason) {
        return NextResponse.json({ error: 'Reason is required for override' }, { status: 400 });
    }

    try {
        // Find the record
        const record = await prisma.kycRecord.findUnique({ where: { id: recordId || id } });
        if (!record) return NextResponse.json({ error: 'Record not found' }, { status: 404 });

        // Update status
        const updated = await prisma.kycRecord.update({
            where: { id: record.id },
            data: { status: 'VERIFIED' }
        });

        // Audit Log in Merchant Log
        await prisma.auditLog.create({
            data: {
                storeId: record.storeId,
                actorType: 'OPS',
                actorLabel: session.user.email,
                action: 'KYC_OVERRIDE',
                correlationId: `ops-override-${Date.now()}`,
                afterState: { reason, overriddenBy: session.user.email, previousStatus: record.status }
            }
        });

        // Audit Log in Ops Log
        await OpsAuthService.logEvent(session.user.id, 'OPS_KYC_OVERRIDE', {
            storeId: record.storeId,
            recordId: record.id,
            reason
        });

        return NextResponse.json({ success: true, record: updated });
    } catch (err) {
        console.error(err);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
