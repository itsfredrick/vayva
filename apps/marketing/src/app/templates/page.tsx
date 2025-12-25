
import { Suspense } from 'react';
import { prisma } from '@vayva/db';
import { TemplateGallery } from '@/components/templates/template-gallery';
import { MarketingShell } from '@/components/marketing/MarketingShell';
import { PageHero } from '@/components/marketing/PageHero';
import { Section } from '@/components/marketing/Section';
import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Template Gallery | Vayva',
    description: 'Browse our collection of free, high-performance store templates.'
};

export const dynamic = 'force-dynamic';

export default async function TemplatesPage() {
    // Initial fetch of active templates
    let templates;
    try {
        templates = await prisma.template.findMany({
            where: { isActive: true },
            orderBy: { stars: 'desc' },
            take: 50,
        });
    } catch (error) {
        console.error("Database connection failed, using mock templates:", error);
        // Mock data fallback
        templates = Array.from({ length: 6 }).map((_, i) => ({
            id: `mock-${i}`,
            slug: `vayva-starter-${i}`,
            name: `Vayva Starter ${i + 1}`,
            description: "A high-conversion template for modern brands. Preview before applying.",
            category: "Retail",
            tags: ["Nigeria-ready", "WhatsApp-first", "Fast"],
            isFree: true,
            licenseName: "MIT",
            stars: 120 + i * 10,
            repoUrl: "https://github.com/vayva/starter",
            isActive: true,
            createdAt: new Date(),
            updatedAt: new Date(),
        }));
    }

    const normalizedTemplates = templates.map((t: any) => ({
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
        updatedAt: t.updatedAt.toISOString()
    }));

    return (
        <MarketingShell>
            <PageHero
                title="Choose a storefront that looks expensive"
                subtitle="Made for mobile. Built for WhatsApp. Fast to load."
            />

            <Section className="py-0 md:py-8">
                <p className="text-center text-gray-500 mb-8 max-w-2xl mx-auto">Pick a category to see templates that match your business.</p>
                <Suspense fallback={<div className="text-center py-20 text-gray-500">Loading templates...</div>}>
                    <TemplateGallery initialTemplates={normalizedTemplates} />
                </Suspense>
            </Section>
        </MarketingShell>
    );
}
