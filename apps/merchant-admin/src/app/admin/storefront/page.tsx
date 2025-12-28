
import { redirect } from 'next/navigation';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@vayva/db';
import StoreBuilder from './store-builder';

export const metadata = {
    title: 'Store Builder | Vayva',
};

export default async function StorefrontPage() {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
        redirect('/login');
    }

    // Type assertion for session.user
    const user = session.user as any;
    const storeId = user.storeId;

    if (!storeId) {
        redirect('/onboarding');
    }

    // Fetch the draft logic
    // 1. Check StorefrontDraft
    let draft = await prisma.storefrontDraft.findUnique({
        where: { storeId },
        include: { template: true }
    });

    if (!draft) {
        // 2. Fallback: Check StoreTemplateSelection (Legacy)
        // If legacy exists, we might want to auto-migrate or treat it as draft.
        // For strict adherence to "No template selected -> Gallery", we check if ANY template is selected.

        const legacySelection = await prisma.storeTemplateSelection.findUnique({
            where: { storeId },
            include: { templateManifest: true }
        });

        if (legacySelection) {
            // Auto-migrate to Draft on first visit
            draft = await prisma.storefrontDraft.create({
                data: {
                    storeId,
                    activeTemplateId: legacySelection.templateId,
                    themeConfig: legacySelection.config || {},
                    sectionConfig: {}, // Initialize empty
                    sectionOrder: [], // Should come from manifest but empty for now
                },
                include: { template: true }
            });
        } else {
            // No template selected at all -> Redirect to Gallery
            redirect('/admin/storefront/templates');
        }
    }

    return <StoreBuilder initialDraft={draft} />;
}
