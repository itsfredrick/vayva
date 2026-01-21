import type { Metadata } from "next";
import { MarketingHeader } from "@/components/marketing/marketing-header";
import { MarketingFooter } from "@/components/marketing/marketing-footer";
import { MarketingShell } from "@/components/marketing/marketing-shell";
import { CookieBanner } from "@/components/marketing/CookieBanner";
import { SchemaOrg } from "@/components/seo/SchemaOrg";
import { BRAND } from "@vayva/shared";
import { ParticleBackground } from "@/components/marketing/ParticleBackground";


import { metadataFor } from "@/lib/seo/seo-engine";

export const metadata = metadataFor("/");

import { DownloadModalProvider } from "@/context/DownloadModalContext";
import { PWAInstallToast } from "@/components/marketing/PWAInstallToast";

// ... existing imports

export default function MarketingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <MarketingShell>
      <DownloadModalProvider>
        <ParticleBackground />
        <SchemaOrg type="Organization" />
        <SchemaOrg type="WebSite" />
        <MarketingHeader />
        <main>{children}</main>
        <MarketingFooter />
        <PWAInstallToast />
        <CookieBanner />
      </DownloadModalProvider>
    </MarketingShell>
  );
}
