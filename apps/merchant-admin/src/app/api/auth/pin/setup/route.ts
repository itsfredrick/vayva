import { NextResponse } from 'next/server';
import { prisma } from '@vayva/db';
import { requireStoreAccess } from '@/lib/auth/session';
import bcrypt from 'bcryptjs';

export async function POST(request: Request) {
    try {
        const session = await requireStoreAccess();

        const body = await request.json();
        const { pin } = body;

        // Basic validation
        if (!pin || pin.length !== 4 || !/^\d+$/.test(pin)) {
            return NextResponse.json({ error: "PIN must be 4 digits" }, { status: 400 });
        }

        // Hash PIN
        const salt = await bcrypt.genSalt(10);
        const pinHash = await bcrypt.hash(pin, salt);

        // Store & Invalidate old sessions by incrementing version
        await prisma.wallet.update({
            where: { storeId: session.user.storeId },
            data: {
                pinHash,
                pinSet: true,
                pinVersion: { increment: 1 },
                updatedAt: new Date()
            }
        });

        // Audit log could go here

        return NextResponse.json({ success: true });

    } catch (e) {
        console.error("PIN Setup Error:", e);
        return NextResponse.json({ error: "Failed to setup PIN" }, { status: 500 });
    }
}
