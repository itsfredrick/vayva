import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { prisma } from '@vayva/db';
import { sanitizeMarkdown, validatePolicyContent } from '@vayva/policies';

export const dynamic = 'force-dynamic';

export async function GET(
    req: NextRequest,
    { params }: { params: { type: string } }
) {
    try {
        const session = await getServerSession();
        if (!session?.user?.storeId) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const policy = await prisma.merchantPolicy.findUnique({
            where: {
                storeId_type: {
                    storeId: session.user.storeId,
                    type: params.type.toUpperCase().replace('-', '_')
                }
            }
        });

        if (!policy) {
            return NextResponse.json({ error: 'Policy not found' }, { status: 404 });
        }

        return NextResponse.json({ policy });
    } catch (error) {
        console.error('Error fetching policy:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}

export async function PUT(
    req: NextRequest,
    { params }: { params: { type: string } }
) {
    try {
        const session = await getServerSession();
        if (!session?.user?.storeId) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const body = await req.json();
        const { title, contentMd } = body;

        // Validate content
        const validation = validatePolicyContent(contentMd);
        if (!validation.valid) {
            return NextResponse.json({ error: validation.error }, { status: 400 });
        }

        // Sanitize and generate HTML
        const contentHtml = sanitizeMarkdown(contentMd);

        const policy = await prisma.merchantPolicy.update({
            where: {
                storeId_type: {
                    storeId: session.user.storeId,
                    type: params.type.toUpperCase().replace('-', '_')
                }
            },
            data: {
                title,
                contentMd,
                contentHtml,
                updatedAt: new Date()
            }
        });

        return NextResponse.json({ policy });
    } catch (error) {
        console.error('Error updating policy:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
