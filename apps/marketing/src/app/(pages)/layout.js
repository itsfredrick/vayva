import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { MarketingHeader } from "@/components/marketing/marketing-header";
import { MarketingFooter } from "@/components/marketing/marketing-footer";
import { MarketingShell } from "@/components/marketing/marketing-shell";
import { CookieBanner } from "@/components/marketing/CookieBanner";
import { SchemaOrg } from "@/components/seo/SchemaOrg";
import { ParticleBackground } from "@/components/marketing/ParticleBackground";
import { metadataFor } from "@/lib/seo/seo-engine";
export const metadata = metadataFor("/");
import { DownloadModalProvider } from "@/context/DownloadModalContext";
import { PWAInstallToast } from "@/components/marketing/PWAInstallToast";
// ... existing imports
export default function MarketingLayout({ children, }) {
    return (_jsx(MarketingShell, { children: _jsxs(DownloadModalProvider, { children: [_jsx(ParticleBackground, {}), _jsx(SchemaOrg, { type: "Organization" }), _jsx(SchemaOrg, { type: "WebSite" }), _jsx(MarketingHeader, {}), _jsx("main", { children: children }), _jsx(MarketingFooter, {}), _jsx(PWAInstallToast, {}), _jsx(CookieBanner, {})] }) }));
}
