import { TEMPLATE_REGISTRY } from "@/lib/templates-registry";
export const TEMPLATES = Object.values(TEMPLATE_REGISTRY).map((t: any) => ({
    id: t.templateId,
    name: t.displayName,
    slug: t.slug,
    category: t.industry, // Use industry slug as category for now to match types
    tier: t.requiredPlan,
    description: t.compare?.headline || "",
    bestFor: t.compare?.bestFor?.[0] || "Merchants",
    workflows: t.compare?.keyModules || [],
    setupTime: "5 minutes",
    volume: "any",
    teamSize: "any",
    configures: [],
    customizable: [],
    previewImage: t.preview?.thumbnailUrl || "/marketing/templates/simple-retail.png",
    creates: {
        pages: [],
        sections: [],
        objects: []
    }
}));
export function getTemplateBySlug(slug: any) {
    return TEMPLATES.find((t: any) => t.slug === slug);
}
export function isTierAccessible(userTier: any, requiredTier: any) {
    const tierHierarchy = {
        free: 0,
        growth: 1,
        pro: 2,
    };
    return tierHierarchy[userTier] >= tierHierarchy[requiredTier];
}
