import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@vayva/db';

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    const session = await getServerSession(authOptions);
    if (!session?.user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const { id } = await params;

    const conversation = await prisma.conversation.findUnique({
        where: { id },
        include: {
            contact: {
                include: {
                    // Include any relevant contact info or last orders if we had relation
                    // For now basic info
                }
            },
            messages: {
                orderBy: { createdAt: 'asc' },
                take: 100 // Simplified pagination for v1
            },
            internalNotes: {
                orderBy: { createdAt: 'desc' },
                // Include author name if needed, assuming user relation in schema update?
                // The schema I added didn't explicitly relation Author -> User but just authorId string for simplicity in plan.
                // We should probably rely on just ID or fetch user separate if strict.
            }
        }
    });

    if (!conversation) return new NextResponse('Not Found', { status: 404 });
    if (conversation.storeId !== (session!.user as any).storeId) return new NextResponse('Forbidden', { status: 403 });

    // Mark as Read? Usually separated endpoint or side-effect.
    // We'll leave it to explicit action if needed, or assume opening = read eventually.

    return NextResponse.json(conversation);
}
