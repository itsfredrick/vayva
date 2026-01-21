"use client";
import { jsx as _jsx } from "react/jsx-runtime";
import { notFound } from "next/navigation";
import { getNormalizedTemplates } from "@/lib/templates-registry";
import { LivePreviewClient } from "@/components/preview/LivePreviewClient";
import { resolveLayout } from "@/lib/templates/layout-resolver";
const DEFAULT_DESKTOP_PREVIEW = "https://images.unsplash.com/photo-1441986300917-64674bd600d8?q=80&w=2070&auto=format&fit=crop";
const DEFAULT_MOBILE_PREVIEW = "https://images.unsplash.com/photo-1512314889357-e157c22f938d?q=80&w=2071&auto=format&fit=crop";
export default async function TemplatePreviewPage({ params, }) {
    const { slug } = await params;
    const template = getNormalizedTemplates().find((t) => t.slug === slug);
    if (!template)
        return notFound();
    const layoutKey = template.layoutKey || template.layoutComponent;
    const LayoutComponent = resolveLayout(layoutKey);
    return (_jsx(LivePreviewClient, { templateName: template.displayName, slug: template.slug, LayoutComponent: LayoutComponent || (() => _jsx("div", { children: "Layout not found" })), fallbackDesktopImage: template.preview?.desktopUrl || DEFAULT_DESKTOP_PREVIEW, fallbackMobileImage: template.preview?.mobileUrl || DEFAULT_MOBILE_PREVIEW }));
}
