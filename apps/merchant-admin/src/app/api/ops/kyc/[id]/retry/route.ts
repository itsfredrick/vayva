
import { NextResponse } from 'next/server';
import { prisma } from '@vayva/db';
import { OpsAuthService } from '@/lib/ops-auth';
// Assuming we can use the KycService from merchant-admin or common
import { kycService } from '@/services/kyc';

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

    try {
        const record = await prisma.kycRecord.findUnique({ where: { id } });
        if (!record) return NextResponse.json({ error: 'Record not found' }, { status: 404 });

        const auditData = (record.audit as any[]) || [];
        const last = auditData[auditData.length - 1] || {};

        // Trigger kycService retry
        const result = await kycService.verifyIdentity(record.storeId, {
            method: last.method || 'NIN',
            idNumber: last.idNumber || '',
            firstName: last.firstName || '',
            lastName: last.lastName || '',
            dob: last.dob,
            phone: last.phone,
            consent: true
        });

        return NextResponse.json(result);
    } catch (err: any) {
        console.error(err);
        return NextResponse.json({ error: err.message || 'Internal server error' }, { status: 500 });
    }
}
