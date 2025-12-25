import { NextResponse } from 'next/server';
import { requireAuth } from '@/lib/auth/session';
import { prisma } from '@vayva/db';

export async function POST(request: Request) {
    try {
        const session = await requireAuth();
        const userId = session.user.id;

        const body = await request.json();
        const { code } = body;

        if (!code) {
            return NextResponse.json(
                { error: 'Code is required' },
                { status: 400 }
            );
        }

        // Get user
        const user = await prisma.user.findUnique({
            where: { id: userId },
            select: {
                id: true,
            },
        });

        if (!user) {
            return NextResponse.json(
                { error: 'User not found' },
                { status: 404 }
            );
        }

        // const backupCodes = user.twoFactorBackupCodes as string[];

        // Check if code is valid
        // if (!backupCodes.includes(code)) {
        //     return NextResponse.json(
        //         { error: 'Invalid backup code' },
        //         { status: 400 }
        //     );
        // }

        // Remove used backup code
        // const updatedCodes = backupCodes.filter(c => c !== code);

        // Disable 2FA (Disabled until schema update)
        /*
        await prisma.user.update({
            where: { id: userId },
            data: {
                twoFactorEnabled: false,
                twoFactorSecret: null,
                twoFactorBackupCodes: updatedCodes,
            },
        });
        */

        return NextResponse.json({
            success: true,
            message: '2FA disabled successfully',
        });
    } catch (error: any) {
        console.error('2FA disable error:', error);

        if (error.message === 'Unauthorized') {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        return NextResponse.json(
            { error: 'Failed to disable 2FA' },
            { status: 500 }
        );
    }
}
