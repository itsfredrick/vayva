import { NextResponse } from 'next/server';
import { requireAuth } from '@/lib/auth/session';
import { prisma } from '@vayva/db';

export async function POST(request: Request, { params }: { params: Promise<{ id: string }> }) {
    try {
        const session = await requireAuth();
        const storeId = session.user.storeId;
        const { id } = await params;
        const { note } = await request.json();

        if (!note) return NextResponse.json({ error: 'Note cannot be empty' }, { status: 400 });

        // Retrieve current note to append
        const order = await prisma.order.findUnique({
            where: { id, storeId },
            select: { internalNote: true }
        });

        if (!order) {
            return NextResponse.json({ error: 'Order not found' }, { status: 404 });
        }

        const timestamp = new Date().toISOString();
        const entry = `[${timestamp}]: ${note}`;
        const updatedNote = order.internalNote
            ? `${order.internalNote}\n${entry}`
            : entry;

        const updatedOrder = await prisma.order.update({
            where: { id, storeId },
            data: { internalNote: updatedNote }
        });

        return NextResponse.json({
            id,
            message: 'Note added successfully',
            note_id: `note_${Date.now()}`, // Consistent ID generation (virtual)
            created_at: timestamp
        });
    } catch (error) {
        console.error('Add note error:', error);
        return NextResponse.json({ error: 'Failed to add note' }, { status: 500 });
    }
}
