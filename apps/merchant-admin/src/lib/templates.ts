import {
  CanonicalCategorySlug,
  CanonicalTemplateId,
} from "@/types/templates";
import { TEMPLATE_REGISTRY } from "@/lib/templates-registry";

export type PlanTier = "free" | "growth" | "pro";

export interface Template {
  id: CanonicalTemplateId | string; // Allow string for legacy/dev but prefer canonical
  name: string;
  slug: string;
  category: CanonicalCategorySlug | string;
  tier: PlanTier;
  description: string;
  bestFor: string;
  workflows: string[];
  setupTime: string;
  volume: "low" | "medium" | "high" | "any";
  teamSize: "solo" | "small" | "multi" | "any";
  configures: string[];
  customizable: string[];
  capabilitiesUnlocked?: string[];
  previewImage: string;
  creates: {
    pages: string[];
    sections: string[];
    objects: string[];
  };
}

export const TEMPLATES: Template[] = Object.values(TEMPLATE_REGISTRY).map((t: unknown) => ({
  id: t.templateId,
  name: t.displayName,
  slug: t.slug,
  category: t.industry, // Use industry slug as category for now to match types
  tier: t.requiredPlan as PlanTier,
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

export function getTemplateBySlug(slug: string) {
  return TEMPLATES.find((t) => t.slug === slug);
}

export function isTierAccessible(
  userTier: PlanTier,
  requiredTier: PlanTier,
): boolean {
  const tierHierarchy: Record<PlanTier, number> = {
    free: 0,
    growth: 1,
    pro: 2,
  };
  return tierHierarchy[userTier] >= tierHierarchy[requiredTier];
}
