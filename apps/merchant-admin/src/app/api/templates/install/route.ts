import { NextResponse } from 'next/server';
import { prisma } from '@vayva/db';
import { TEMPLATE_REGISTRY } from '@/lib/templates-registry';
import { CanonicalTemplateId } from '@/types/templates';

// Define the shape of StoreSettings (simplified)
interface StoreSettings {
    modules?: Record<string, boolean>;
    installedTemplateId?: string;
    [key: string]: any;
}

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { storeId, templateId } = body;

        if (!storeId || !templateId) {
            return NextResponse.json({ error: 'Missing storeId or templateId' }, { status: 400 });
        }

        // 1. Validate Template
        const template = TEMPLATE_REGISTRY[templateId as string];
        if (!template) {
            return NextResponse.json({ error: 'Invalid template ID' }, { status: 400 });
        }

        // 2. Upsert TemplateManifest (Ensure DB knows about this template)
        // We use the canonical ID as the DB ID to ensure consistency
        await prisma.templateManifest.upsert({
            where: { id: template.templateId },
            create: {
                id: template.templateId,
                name: template.displayName,
                description: template.compare.headline || "",
                version: "1.0.0",
                author: "Vayva",
                source: 'canonical-registry',
                homepageUrl: (template as any).demoStoreUrl || '',
                previewImageUrl: template.preview.thumbnailUrl || (template.preview as any).desktopUrl || '',
                tags: template.compare.bestFor || [],
                supportedPages: [],
                configSchema: {}, // No schema for now
                isArchived: template.status !== 'implemented'
            },
            update: {
                name: template.displayName,
                description: template.compare.headline || "",
                version: "1.0.0",
                previewImageUrl: template.preview.thumbnailUrl || (template.preview as any).desktopUrl || '',
                tags: template.compare.bestFor || [],
                isArchived: template.status !== 'implemented'
            }
        });

        // 3. Upsert StoreTemplateSelection
        // This records the "installation" event and links the store to the manifest
        await prisma.storeTemplateSelection.upsert({
            where: { storeId: storeId },
            create: {
                storeId: storeId,
                templateId: template.templateId,
                version: "1.0.0",
                config: {}, // Default config
                appliedBy: 'system-installer'
            },
            update: {
                templateId: template.templateId,
                version: "1.0.0",
                // We keep existing config or reset? For a fresh install, maybe reset or merge.
                // For now, we update the reference.
                appliedBy: 'system-installer',
                appliedAt: new Date()
            }
        });

        // 4. Update Store Settings (Enable Modules)
        // We need to fetch existing settings first to merge, but Prisma's update of JSON can be tricky (set vs push).
        // Since we want to ensure these modules are ON, we fetch-modify-save.

        const store = await prisma.store.findUnique({ where: { id: storeId } });
        if (!store) {
            return NextResponse.json({ error: 'Store not found' }, { status: 404 });
        }

        const currentSettings = (store.settings as StoreSettings) || {};
        const newSettings: StoreSettings = {
            ...currentSettings,
            installedTemplateId: template.templateId,
            modules: {
                ...(currentSettings.modules || {}),
                // Add any default modules for this template
            }
        };

        await prisma.store.update({
            where: { id: storeId },
            data: {
                settings: newSettings as any
            }
        });

        return NextResponse.json({
            success: true,
            message: `Template ${template.displayName} installed successfully`
        });

    } catch (error: any) {
        console.error('Template installation failed:', error);
        return NextResponse.json({ error: error.message || 'Installation failed' }, { status: 500 });
    }
}
