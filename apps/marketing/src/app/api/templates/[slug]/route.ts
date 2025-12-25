
import { NextResponse } from 'next/server';
import { prisma } from '@vayva/db';

export const dynamic = 'force-dynamic';

export async function GET(request: Request, { params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params;

    try {
        const template = await prisma.template.findUnique({
            where: { slug: slug }
        });

        if (!template || !template.isActive) {
            return NextResponse.json({ error: 'Template not found' }, { status: 404 });
        }

        const assets = await prisma.templateAsset.findMany({ where: { templateId: template.id } });
        const versions = await prisma.templateVersion.findMany({
            where: { templateId: template.id },
            orderBy: { createdAt: 'desc' },
            take: 1
        });

        // Normalize response
        const payload = {
            id: template.id,
            slug: template.slug,
            name: template.name,
            description: template.description,
            category: template.category,
            tags: template.tags,
            isFree: template.isFree,
            licenseName: template.licenseName,
            licenseKey: template.licenseKey,
            stars: template.stars,
            repoUrl: template.repoUrl,
            homepageUrl: template.homepageUrl,
            updatedAt: template.updatedAt,
            version: versions[0]?.version || '0.0.0',
            assets: assets.map((a: any) => ({
                type: a.type,
                url: a.publicUrl || (a.type === 'preview_image' && template.repoUrl ? `https://opengraph.githubassets.com/1/${template.repoUrl.replace('https://github.com/', '')}` : null)
            }))
        };

        return NextResponse.json(payload);
    } catch (error) {
        console.error('Failed to fetch template details:', error);
        return NextResponse.json({ error: 'Failed to fetch template' }, { status: 500 });
    }
}
