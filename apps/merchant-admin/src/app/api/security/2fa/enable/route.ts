import { NextResponse } from 'next/server';
import { requireAuth } from '@/lib/auth/session';
import { prisma } from '@vayva/db';
import speakeasy from 'speakeasy';
import QRCode from 'qrcode';

export async function POST(request: Request) {
    try {
        const session = await requireAuth();
        const userId = session.user.id;

        // Generate secret
        const secret = speakeasy.generateSecret({
            name: `Vayva (${session.user.email})`,
            length: 32,
        });

        // Generate QR code
        const qrCode = await QRCode.toDataURL(secret.otpauth_url!);

        // Generate backup codes
        const backupCodes = Array.from({ length: 10 }, () =>
            Math.random().toString(36).substring(2, 10).toUpperCase()
        );

        // Store secret temporarily (will be confirmed later)
        // await prisma.user.update({
        //     where: { id: userId },
        //     data: {
        //         twoFactorSecret: secret.base32,
        //         twoFactorBackupCodes: backupCodes,
        //         twoFactorEnabled: false, // Not enabled until verified
        //     },
        // });

        return NextResponse.json({
            success: true,
            qrCode,
            secret: secret.base32,
            backupCodes,
        });
    } catch (error: any) {
        console.error('2FA enable error:', error);

        if (error.message === 'Unauthorized') {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        return NextResponse.json(
            { error: 'Failed to enable 2FA' },
            { status: 500 }
        );
    }
}
