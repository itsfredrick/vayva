
import { prisma } from '@vayva/db';
import { getMerchantId } from '@/lib/auth/tenant';
import { IntegrationsView } from './components/IntegrationsView';

export const metadata = {
    title: 'Integrations - Settings',
};

export default async function IntegrationsPage() {
    const merchantId = await getMerchantId();

    if (!merchantId) {
        return <div>Unauthorized</div>;
    }

    const [keys, webhooks] = await Promise.all([
        prisma.apiKey.findMany({
            where: { storeId: merchantId },
            orderBy: { createdAt: 'desc' }
        }),
        prisma.webhookSubscription.findMany({
            where: { merchantId },
            orderBy: { createdAt: 'desc' }
        })
    ]);

    return (
        <div className="max-w-5xl mx-auto space-y-8">
            <div>
                <h1 className="text-2xl font-bold tracking-tight">Integrations</h1>
                <p className="text-muted-foreground">Manage API keys and webhook subscriptions.</p>
            </div>

            <IntegrationsView
                keys={keys}
                webhooks={webhooks}
            />
        </div>
    );
}
