import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@vayva/db';

export async function POST(req: NextRequest, { params }: { params: { id: string } }) {
    const session = await getServerSession(authOptions);
    if (!session?.user) return new NextResponse('Unauthorized', { status: 401 });

    const { id } = params;
    const { tagIds } = await req.json(); // Expecting array of Tag IDs

    if (!Array.isArray(tagIds)) return new NextResponse('Invalid tags', { status: 400 });

    const conv = await prisma.conversation.findUnique({ where: { id } });
    if (!conv || conv.merchantId !== (session!.user as any).storeId) return new NextResponse('Forbidden', { status: 403 });

    // Transaction to replace tags
    // 1. Delete existing maps
    await prisma.conversationTagMap.deleteMany({
        where: { conversationId: id }
    });

    // 2. Create new maps
    if (tagIds.length > 0) {
        await prisma.conversationTagMap.createMany({
            data: tagIds.map((tagId: string) => ({
                conversationId: id,
                tagId
            }))
        });
    }

    return NextResponse.json({ ok: true });
}
