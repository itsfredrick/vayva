import { NextResponse } from 'next/server';
import { requireAuth } from '@/lib/auth/session';
import { prisma } from '@vayva/db';

export async function GET() {
    try {
        const session = await requireAuth();
        const storeId = session.user.storeId;

        const store = await prisma.store.findUnique({
            where: { id: storeId },
            include: {
                kycRecord: true,
            },
        });

        if (!store) {
            return NextResponse.json(
                { error: 'Store not found' },
                { status: 404 }
            );
        }

        const kycRecord = store.kycRecord;

        return NextResponse.json({
            status: kycRecord?.status || 'NOT_STARTED',
            businessType: null, // Field not in schema yet
            documents: kycRecord ? [
                {
                    type: 'BVN',
                    status: 'PENDING', // Schema field missing, defaulting to PENDING
                    uploadedAt: kycRecord.createdAt,
                },
                {
                    type: 'ID',
                    status: 'PENDING', // Schema field missing, defaulting to PENDING
                    uploadedAt: kycRecord.createdAt,
                }
            ] : [],
            canWithdraw: kycRecord?.status === 'VERIFIED',
        });
    } catch (error: any) {
        console.error('KYC status fetch error:', error);

        if (error.message === 'Unauthorized') {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        return NextResponse.json(
            { error: 'Failed to fetch KYC status' },
            { status: 500 }
        );
    }
}
