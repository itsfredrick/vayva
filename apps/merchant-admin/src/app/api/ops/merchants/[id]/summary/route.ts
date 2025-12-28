
import { NextResponse } from 'next/server';
import { prisma } from '@vayva/db';
import { OpsAuthService } from '@/lib/ops-auth';

export async function GET(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    const session = await OpsAuthService.getSession();
    if (!session) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;

    try {
        const merchant = await prisma.store.findUnique({
            where: { id },
            include: {
                kycRecord: true,
                merchantSubscription: true,
                bankBeneficiaries: { where: { isDefault: true } }
            }
        });

        if (!merchant) {
            return NextResponse.json({ error: 'Merchant not found' }, { status: 404 });
        }

        // Fetch profile and audit logs separately since relations are not in the Store model
        const profile = await prisma.storeProfile.findUnique({ where: { storeId: id } });
        const auditLogs = await prisma.auditLog.findMany({
            where: { storeId: id },
            orderBy: { createdAt: 'desc' },
            take: 20
        });

        // Aggregate health statuses
        const health = {
            kyc: merchant.kycRecord?.status || 'PENDING',
            payouts: merchant.bankBeneficiaries.length > 0,
            subscription: (merchant.merchantSubscription as any)?.status || 'INACTIVE',
            isBlocked: false,
            blockReason: ''
        };

        if (health.kyc !== 'VERIFIED') {
            health.isBlocked = true;
            health.blockReason = 'KYC Not Verified';
        } else if (!health.payouts) {
            health.isBlocked = true;
            health.blockReason = 'Missing Bank Beneficiary';
        }

        return NextResponse.json({
            ...merchant,
            StoreProfile: profile,
            AuditLog: auditLogs,
            health
        });
    } catch (err) {
        console.error(err);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
