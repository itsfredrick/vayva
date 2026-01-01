// Template type definitions for Vayva marketing site

export type CanonicalTemplateId =
  | "vayva-standard"
  | "vayva-aa-fashion"
  | "vayva-gizmo-tech"
  | "vayva-bloome-home"
  | "vayva-bookly-pro"
  | "vayva-chopnow"
  | "vayva-file-vault"
  | "vayva-ticketly"
  | "vayva-eduflow"
  | "vayva-bulktrade"
  | "vayva-markethub"
  | "vayva-giveflow"
  | "vayva-homelist"
  | "vayva-oneproduct";

export type CanonicalCategorySlug =
  | "retail"
  | "service"
  | "food"
  | "digital"
  | "events"
  | "education"
  | "b2b"
  | "marketplace"
  | "nonprofit"
  | "real-estate";

export interface Template {
  id: string;
  slug: string;
  name: string;
  category?: string;
  description: string;
  previewImageDesktop: string;
  previewImageMobile: string;
  previewRoute: string;
  features: string[];
  isFree: boolean;
  requiredPlan?: string;
  status: "active" | "inactive" | "deprecated" | string;
  layoutComponent?: string | null;
  registry: any;
}
