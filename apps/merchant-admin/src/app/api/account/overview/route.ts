import { NextResponse } from 'next/server';
import { requireAuth } from '@/lib/auth/session';
import { prisma } from '@vayva/db';

export async function GET() {
    try {
        const session = await requireAuth();
        const storeId = session.user.storeId;

        // Fetch store data
        const store = await prisma.store.findUnique({
            where: { id: storeId },
            include: {
                wallet: true,
                kycRecord: true,
                whatsAppChannel: true,
                merchantSubscription: true,
            },
        });

        if (!store) {
            return NextResponse.json(
                { error: 'Store not found' },
                { status: 404 }
            );
        }

        // Fetch bank account
        const bankAccount = await prisma.bankBeneficiary.findFirst({
            where: {
                storeId,
                isDefault: true,
            },
        });

        // Build response matching the specification
        const overview = {
            // Subscription Status
            subscription: {
                plan: store.plan || 'STARTER',
                status: store.merchantSubscription?.status || 'ACTIVE',
                renewalDate: store.merchantSubscription?.currentPeriodEnd || null,
                canUpgrade: store.plan !== 'PRO',
            },

            // KYC Status
            kyc: {
                status: store.kycRecord?.status || 'NOT_STARTED',
                missingDocs: getMissingKYCDocs(store.kycRecord),
                canWithdraw: store.kycRecord?.status === 'VERIFIED',
            },

            // Payment Readiness
            payment: {
                bankConnected: !!bankAccount,
                payoutsEnabled: store.kycRecord?.status === 'VERIFIED' && !!bankAccount,
            },

            // WhatsApp Agent Status
            whatsapp: {
                connected: !!store.whatsAppChannel,
                automationEnabled: store.whatsAppChannel?.status === 'active' || false,
            },

            // Alerts (blocking issues)
            alerts: buildAlerts(store, bankAccount),

            // Store info
            store: {
                id: store.id,
                name: store.name,
                category: store.category,
            },
        };

        return NextResponse.json(overview);
    } catch (error: any) {
        console.error('Account overview error:', error);

        if (error.message === 'Unauthorized') {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        return NextResponse.json(
            { error: 'Failed to load account overview' },
            { status: 500 }
        );
    }
}

function getMissingKYCDocs(kycRecord: any): string[] {
    if (!kycRecord) {
        return ['BVN', 'ID', 'CAC'];
    }

    const missing: string[] = [];

    // Check for required documents based on business type
    if (!kycRecord.bvnVerified) missing.push('BVN');
    if (!kycRecord.idVerified) missing.push('ID');
    if (kycRecord.businessType === 'REGISTERED' && !kycRecord.cacVerified) {
        missing.push('CAC');
    }

    return missing;
}

function buildAlerts(store: any, bankAccount: any): Array<{
    id: string;
    severity: 'error' | 'warning' | 'info';
    message: string;
    action: string;
}> {
    const alerts: any[] = [];

    // KYC incomplete
    if (store.kycRecord?.status !== 'VERIFIED') {
        alerts.push({
            id: 'kyc-incomplete',
            severity: 'warning',
            message: 'KYC verification incomplete — payouts disabled',
            action: '/admin/account/compliance-kyc',
        });
    }

    // No bank account
    if (!bankAccount) {
        alerts.push({
            id: 'no-bank',
            severity: 'warning',
            message: 'Bank account required to withdraw funds',
            action: '/admin/wallet',
        });
    }

    // Subscription expired
    if (store.merchantSubscription?.status === 'EXPIRED') {
        alerts.push({
            id: 'subscription-expired',
            severity: 'error',
            message: 'Subscription expired — upgrade to continue',
            action: '/admin/account/subscription',
        });
    }

    // WhatsApp not connected
    if (!store.whatsAppChannel) {
        alerts.push({
            id: 'whatsapp-disconnected',
            severity: 'info',
            message: 'Connect WhatsApp to enable automated messaging',
            action: '/admin/account/connected-services',
        });
    }

    return alerts;
}
