import { MerchantContext } from "@vayva/shared";

export type IndustrySlug =
    | "retail"
    | "fashion"
    | "electronics"
    | "beauty"
    | "grocery"
    | "food"
    | "services"
    | "digital"
    | "events"
    | "b2b"
    | "real_estate"
    | "automotive"
    | "travel_hospitality"
    | "blog_media"
    | "creative_portfolio"
    | "nonprofit";

export interface IndustryConfig {
    displayName: string;
    primaryObject: string;
    modules: string[];
    moduleLabels?: Record<string, string>;
    moduleRoutes?: Record<string, { index?: string; create?: string }>;
    dashboardWidgets: any[];
    forms: Record<string, any>;
    onboardingSteps: string[];
}

export interface Store {
    id: string;
    name: string;
    slug: string;
    industrySlug: IndustrySlug;
    currency: string;
    themeConfig?: any;
}

export interface ExtendedMerchant extends MerchantContext {
    industrySlug?: IndustrySlug;
    enabledExtensionIds?: string[];
}
