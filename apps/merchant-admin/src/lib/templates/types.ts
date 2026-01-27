import { MerchantContext } from "@vayva/shared";

export type PrimaryObject =
    | "product"
    | "service"
    | "event"
    | "course"
    | "post"
    | "project"
    | "campaign"
    | "listing"
    | "menu_item"
    | "digital_asset"
    | string;

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
    | "nonprofit"
    | "education"
    | "marketplace"
    | "one_product"
    | "nightlife";

export interface IndustryConfig {
    displayName: string;
    description?: string;
    primaryObject: string;
    modules: string[];
    moduleLabels?: Record<string, string>;
    moduleRoutes?: Record<string, { index?: string; create?: string }>;
    dashboardWidgets: any[];
    forms: Record<string, any>;
    onboardingSteps: string[];
    features?: {
        bookings?: boolean;
        delivery?: boolean;
        content?: boolean;
        inventory?: boolean;
        reservations?: boolean;
        tickets?: boolean;
        quotes?: boolean;
        donations?: boolean;
        enrollments?: boolean;
        viewings?: boolean;
        testDrives?: boolean;
    };
    aiTools?: string[];
}

export interface Store {
    id: string;
    name: string;
    slug: string;
    industrySlug: IndustrySlug;
    currency: string;
    themeConfig?: any;
}

export interface ExtendedMerchant extends Omit<MerchantContext, "industrySlug"> {
    industrySlug?: IndustrySlug;
    enabledExtensionIds?: string[];
}

export interface SidebarItem {
    name: string;
    href: string;
    icon: string;
}

export interface SidebarGroup {
    name: string;
    items: SidebarItem[];
}
