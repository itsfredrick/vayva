
import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@vayva/db';

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

        // 1. Get current draft
        const draft = await prisma.storefrontDraft.findUnique({
            where: { storeId }
        });

        if (!draft) {
            return NextResponse.json({ error: 'No draft found to publish' }, { status: 400 });
        }

        // 2. Upsert Published Snapshot
        const published = await prisma.storefrontPublished.upsert({
            where: { storeId },
            create: {
                storeId,
                activeTemplateId: draft.activeTemplateId,
                themeConfig: draft.themeConfig ?? {},
                sectionConfig: draft.sectionConfig ?? {},
                assets: draft.assets ?? {},
                publishedAt: new Date(),
            },
            update: {
                activeTemplateId: draft.activeTemplateId,
                themeConfig: draft.themeConfig ?? {},
                sectionConfig: draft.sectionConfig ?? {},
                assets: draft.assets ?? {},
                publishedAt: new Date(),
            }
        });

        // 3. Update Draft to reflect publish time (optional but good for UI "Saved & Published")
        await prisma.storefrontDraft.update({
            where: { storeId },
            data: {
                publishedAt: new Date()
            }
        });

        return NextResponse.json({ success: true, published });

    } catch (error) {
        console.error('POST /api/storefront/publish error:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
