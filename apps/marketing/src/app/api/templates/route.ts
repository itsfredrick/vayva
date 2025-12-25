
import { NextResponse } from 'next/server';
import { prisma } from '@vayva/db';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');
    const q = searchParams.get('q');
    const featured = searchParams.get('featured');

    const where: any = {
        isActive: true
    };

    if (category && category !== 'All') {
        where.category = category;
    }

    if (featured === 'true') {
        where.isFeatured = true;
    }

    if (q) {
        where.OR = [
            { name: { contains: q, mode: 'insensitive' } },
            { description: { contains: q, mode: 'insensitive' } },
            { tags: { has: q } }
        ];
    }

    try {
        const templates = await prisma.template.findMany({
            where,
            orderBy: {
                stars: 'desc', // Popularity sort
            },
            take: 50, // Cap results
        });

        // Normalize response
        const payload = templates.map((t: any) => ({
            id: t.id,
            slug: t.slug,
            name: t.name,
            description: t.description,
            category: t.category,
            tags: t.tags,
            isFree: t.isFree,
            licenseName: t.licenseName,
            stars: t.stars,
            previewImage: t.repoUrl ? `https://opengraph.githubassets.com/1/${t.repoUrl.replace('https://github.com/', '')}` : null,
            // Fallback preview logic or use assets if implemented
            updatedAt: t.updatedAt
        }));

        return NextResponse.json(payload);
    } catch (error) {
        console.error('Failed to fetch templates:', error);
        return NextResponse.json({ error: 'Failed to fetch templates' }, { status: 500 });
    }
}
