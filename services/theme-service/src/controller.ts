
import { prisma } from '@vayva/db';

const DEFAULT_TEMPLATE_SLUG = 'vayva-default';

export const ThemeController = {
    // --- Template Gallery ---
    listTemplates: async (filters?: any) => {
        const templates = await prisma.template.findMany({
            where: {
                isActive: true,
                ...(filters?.category && filters.category !== 'All' && { category: filters.category })
            },
            orderBy: { createdAt: 'desc' }
        });

        // Enrich with Preview Image assets manually
        const enriched = await Promise.all(templates.map(async (t) => {
            const assets = await prisma.templateAsset.findMany({
                where: { templateId: t.id, type: 'preview_image' },
                take: 1
            });
            return { ...t, assets };
        }));

        return enriched;
    },

    getTemplate: async (slug: string) => {
        const template = await prisma.template.findUnique({
            where: { slug }
        });

        if (!template) return null;

        const assets = await prisma.templateAsset.findMany({ where: { templateId: template.id } });
        const versions = await prisma.templateVersion.findMany({ where: { templateId: template.id } });

        return { ...template, assets, versions };
    },

    // --- Merchant Theme Management ---
    getMerchantTheme: async (storeId: string) => {
        const theme = await prisma.merchantTheme.findFirst({
            where: { storeId, status: 'PUBLISHED' }
        });

        if (!theme) return null;

        const template = await prisma.template.findUnique({ where: { id: theme.templateId } });

        return { ...theme, template };
    },

    applyTemplate: async (storeId: string, templateSlug: string, userId?: string) => {
        const template = await prisma.template.findUnique({ where: { slug: templateSlug } });
        if (!template) throw new Error('Template not found');

        // Logic: Create new draft
        return await prisma.merchantTheme.create({
            data: {
                storeId,
                templateId: template.id,
                status: 'DRAFT',
                config: {},
            }
        });
    },

    updateSettings: async (storeId: string, config: any) => {
        const theme = await prisma.merchantTheme.findFirst({
            where: { storeId, status: 'DRAFT' } // Assume editing draft
        });

        if (!theme) throw new Error('No draft theme found');

        return await prisma.merchantTheme.update({
            where: { id: theme.id },
            data: {
                config
            }
        });
    },

    publishTheme: async (storeId: string, userId?: string) => {
        // Archive current published theme
        await prisma.merchantTheme.updateMany({
            where: { storeId, status: 'PUBLISHED' },
            data: { status: 'DRAFT', publishedAt: null }
        });

        // Get draft theme
        const draftTheme = await prisma.merchantTheme.findFirst({
            where: { storeId, status: 'DRAFT' }
        });

        if (!draftTheme) throw new Error('No draft theme found');

        // Create history snapshot
        await prisma.merchantThemeHistory.create({
            data: {
                storeId,
                themeId: draftTheme.id,
                templateId: draftTheme.templateId,
                templateVersionId: draftTheme.templateVersionId,
                configSnapshot: draftTheme.config || {},
                changedByUserId: userId
            }
        });

        // Publish draft
        return await prisma.merchantTheme.update({
            where: { id: draftTheme.id },
            data: {
                status: 'PUBLISHED',
                publishedAt: new Date()
            }
        });
    },

    // --- Auto-assign Default Template ---
    assignDefaultTemplate: async (storeId: string) => {
        const template = await prisma.template.findUnique({
            where: { slug: DEFAULT_TEMPLATE_SLUG }
        });

        if (!template) {
            console.warn(`Default template ${DEFAULT_TEMPLATE_SLUG} not found`);
            return null;
        }

        return await prisma.merchantTheme.create({
            data: {
                storeId,
                templateId: template.id,
                status: 'PUBLISHED',
                config: {},
                publishedAt: new Date()
            }
        });
    }
};
