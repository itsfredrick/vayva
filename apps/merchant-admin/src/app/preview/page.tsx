
import { redirect } from 'next/navigation';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@vayva/db';
import { TemplateRenderer } from '@/components/templates/TemplateRenderer';
import { StoreProvider } from '@/context/StoreContext';

export default async function PreviewPage() {
    // 1. Auth & Data Fetching (Server Side)
    const session = await getServerSession(authOptions);

    // Preview is only for the merchant themselves (for now)
    if (!session?.user) {
        return <div className="h-screen flex items-center justify-center">Unauthorized Preview</div>;
    }

    const storeId = (session.user as any).storeId;
    if (!storeId) return <div>No Store Context</div>;

    // Fetch the DRAFT to show work-in-progress
    const draft = await prisma.storefrontDraft.findUnique({
        where: { storeId },
        include: { store: true }
    });

    if (!draft) {
        return <div>No template selected. Please go to the Template Gallery.</div>;
    }

    // 2. Fetch Store Products for Context
    // The templates rely on StoreContext which usually fetches its own data.
    // However, in a Server Component page -> Client Component renderer, we might want to pass initial data.
    // For V1, we rely on the StoreProvider to fetch data client-side OR use demo mode if empty.

    // We pass the Draft Config to the Renderer
    return (
        <StoreProvider>
            <TemplateRenderer
                templateId={draft.activeTemplateId}
                config={draft.themeConfig}
                storeName={draft.store.name || "My Store"}
                isDemo={false} // Or true if we want to force demo data in preview
            />
        </StoreProvider>
    );
}
