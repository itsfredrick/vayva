"use client";

import { notFound } from "next/navigation";
import { getNormalizedTemplates } from "@/lib/templates-registry";
import { LivePreviewClient } from "@/components/preview/LivePreviewClient";
import { StoreShell } from "@/components/storefront/store-shell";
import { AAFashionHome } from "@/components/storefront/AAFashionHome";
import { GizmoTechHome } from "@/components/storefront/GizmoTechHome";
import { BloomeHome } from "@/components/storefront/BloomeHome";

const COMPONENT_MAP: Record<string, React.ComponentType<any>> = {
    'StoreShell': StoreShell,
    'AAFashionHome': AAFashionHome,
    'GizmoTechHome': GizmoTechHome,
    'BloomeHomeLayout': BloomeHome,
};

export default function TemplatePreviewPage({ params }: { params: { slug: string } }) {
    const template = getNormalizedTemplates().find((t) => t.slug === params.slug);
    if (!template) return notFound();

    const layoutName = (template as any).layoutComponent as string | null | undefined;
    const LayoutComponent = layoutName ? COMPONENT_MAP[layoutName] ?? null : null;

    return (
        <LivePreviewClient
            templateName={template.name}
            slug={template.slug}
            LayoutComponent={LayoutComponent}
            fallbackDesktopImage={template.previewImageDesktop}
            fallbackMobileImage={template.previewImageMobile}
        />
    );
}
