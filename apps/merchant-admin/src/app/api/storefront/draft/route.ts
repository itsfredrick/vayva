
import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@vayva/db';

export async function GET(req: Request) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const storeId = (session.user as any).storeId;
        if (!storeId) {
            return NextResponse.json({ error: 'No store context' }, { status: 400 });
        }

        const draft = await prisma.storefrontDraft.findUnique({
            where: { storeId },
            include: { template: true }
        });

        if (!draft) {
            // Check if there is a legacy StoreTemplateSelection we should migrate?
            // Or just return null/404.
            // For now, return 404 so UI knows to init or redirect.
            return NextResponse.json({ found: false }, { status: 404 });
        }

        return NextResponse.json({ found: true, draft });

    } catch (error) {
        console.error('GET /api/storefront/draft error:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}

export async function POST(req: Request) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const storeId = (session.user as any).storeId;
        if (!storeId) {
            return NextResponse.json({ error: 'No store context' }, { status: 400 });
        }

        const body = await req.json();
        const { activeTemplateId, themeConfig, sectionConfig, sectionOrder, assets } = body;

        // Upsert Draft
        const draft = await prisma.storefrontDraft.upsert({
            where: { storeId },
            create: {
                storeId,
                activeTemplateId,
                themeConfig: themeConfig || {},
                sectionConfig: sectionConfig || {},
                sectionOrder: sectionOrder || [],
                assets: assets || {}
            },
            update: {
                activeTemplateId, // can change template in draft
                themeConfig,
                sectionConfig,
                sectionOrder,
                assets
            }
        });

        return NextResponse.json({ success: true, draft });

    } catch (error) {
        console.error('POST /api/storefront/draft error:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
