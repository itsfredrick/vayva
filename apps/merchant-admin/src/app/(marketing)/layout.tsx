import type { Metadata } from 'next';
import { MarketingHeader } from '@/components/marketing/marketing-header';
import { MarketingFooter } from '@/components/marketing/marketing-footer';
import { MarketingShell } from '@/components/marketing/marketing-shell';
import { CookieBanner } from '@/components/marketing/CookieBanner';
import { MarketingAIAssistant } from '@/components/marketing/MarketingAIAssistant';
import { SchemaOrg } from '@/components/seo/SchemaOrg';
import { BRAND } from '@/config/brand';
import { ParticleBackground } from '@/components/marketing/ParticleBackground';

import { metadataFor } from '@/lib/seo/seo-engine';

export const metadata = metadataFor('/');

export default function MarketingLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <MarketingShell>
            <ParticleBackground />
            <SchemaOrg type="Organization" />
            <SchemaOrg type="WebSite" />
            <MarketingHeader />
            <main>
                {children}
            </main>
            <MarketingFooter />
            <CookieBanner />
            <MarketingAIAssistant />
        </MarketingShell>
    );
}
