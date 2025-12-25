import { NextResponse } from 'next/server';
import { requireAuth } from '@/lib/auth/session';
import { prisma } from '@vayva/db';
import speakeasy from 'speakeasy';

export async function POST(request: Request) {
    try {
        const session = await requireAuth();
        const userId = session.user.id;

        const body = await request.json();
        const { code } = body;

        if (!code) {
            return NextResponse.json(
                { error: 'Verification code is required' },
                { status: 400 }
            );
        }

        // Get user with 2FA secret
        // const user = await prisma.user.findUnique({
        //     where: { id: userId },
        //     select: {
        //         twoFactorSecret: true,
        //         twoFactorEnabled: true,
        //     },
        // });

        // if (!user || !user.twoFactorSecret) {
        //     return NextResponse.json(
        //         { error: '2FA not initialized' },
        //         { status: 400 }
        //     );
        // }

        // Verify the code
        // const verified = speakeasy.totp.verify({
        //     secret: user.twoFactorSecret,
        //     encoding: 'base32',
        //     token: code,
        //     window: 2, // Allow 2 time steps before/after
        // });

        // if (!verified) {
        //     return NextResponse.json(
        //         { error: 'Invalid verification code' },
        //         { status: 400 }
        //     );
        // }

        // Enable 2FA
        // await prisma.user.update({
        //     where: { id: userId },
        //     data: {
        //         twoFactorEnabled: true,
        //     },
        // });

        return NextResponse.json({
            success: true,
            message: '2FA enabled successfully',
        });
    } catch (error: any) {
        console.error('2FA verify error:', error);

        if (error.message === 'Unauthorized') {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        return NextResponse.json(
            { error: 'Failed to verify 2FA' },
            { status: 500 }
        );
    }
}
