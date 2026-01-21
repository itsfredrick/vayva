
export type IndustrySlug =
    | "retail" | "fashion" | "electronics" | "beauty" | "grocery" | "food"
    | "b2b"
    | "services" | "events" | "digital"
    | "real_estate" | "automotive" | "travel_hospitality"
    | "blog_media" | "creative_portfolio" | "nonprofit";

// 1) Canonical Module List
export type IndustryModule =
    | "dashboard"
    | "sales"       // Orders, Leases, Tickets, Leads
    | "catalog"     // Products, Services, Courses, Events, Listings
    | "bookings"    // Appointments, Reservations
    | "fulfillment" // Shipping, Delivery
    | "finance"     // Earnings, Payouts
    | "marketing"   // Campaigns, Discounts
    | "support"     // Messages, Tickets
    | "content"     // Blog, Pages
    | "settings";

// 2) Field Keys
export type FieldKey =
    | "title" | "name" | "price" | "sku" | "stock" | "images" | "media"
    | "description" | "content" | "file_upload" | "preview_file"
    | "weight" | "barcode" | "brand" | "model_number" | "warranty"
    | "size_guide" | "material" | "care_instructions"
    | "prep_time" | "veg_non_veg" | "calories" | "allergens" | "spice_level"
    | "duration_min" | "provider_id" | "buffer" | "remote_link"
    | "event_date" | "venue" | "ticket_quota" | "seat_map"
    | "curriculum" | "instructor" | "certificate"
    | "location" | "sqft" | "rooms" | "virtual_tour"
    | "make" | "model" | "year" | "vin" | "mileage" | "history_report"
    | "dates" | "amenities" | "house_rules"
    | "cause" | "goal" | "tags" | "author" | "client"
    | "vendor_id" | "commission_rate" | "vendor_sku"
    | "moq" | "tier_pricing" | "lead_time" | "packaging"
    | "access_settings" | "origin" | "nutritional_info" | "unit_weight" | "expiry_date" | "batch_code" | "expiry" | "ingredients" | "usage" | "specs_map";

export type PrimaryObject =
    | "product" | "service" | "course" | "event" | "listing"
    | "post" | "project" | "campaign" | "menu_item" | "digital_asset"
    | "vehicle" | "stay" | "lead";

// 3) Module Configuration
export interface ModuleRouteConfig {
    index: string;
    create?: string;
}

export interface IndustryConfig {
    displayName: string;
    primaryObject: PrimaryObject;
    modules: IndustryModule[];
    moduleLabels?: Partial<Record<IndustryModule, string>>;
    moduleRoutes?: Partial<Record<IndustryModule, ModuleRouteConfig>>;
    dashboardWidgets: DashboardWidget[];
    forms: IndustryFormConfig;
    onboardingSteps: string[];
    features?: {
        content?: boolean;
        bookings?: boolean;
        fulfillment?: boolean;
    };
}

export interface DashboardWidget {
    id: string;
    title: string;
    dataSource: "real" | "mock";
    type: "stat" | "list" | "chart";
    w?: number;
}

export interface IndustryFormConfig {
    [key: string]: FormFieldConfig;
}

export interface FormFieldConfig {
    requiredFields: FieldKey[];
    optionalFields: FieldKey[];
    variantLabel?: string;
    validation?: {
        minImages?: number;
        minDescriptionLength?: number;
        requiredGroups?: Array<"specs" | "location" | "schedule" | "files">;
        requireSpecs?: boolean;
        requireDate?: boolean;
        requireLocation?: boolean;
    };
}

// 4) Template Definitions
export type TemplateStatus = "active" | "beta" | "deprecated" | "coming_soon";

export interface OnboardingProfile {
    prefill?: Record<string, any>;
    requireSteps?: string[];
    skipSteps?: string[];
}

export interface TemplateDefinition {
    templateId: string;
    slug: string; // URL-friendly ID
    displayName: string;
    category: string; // e.g. 'Retail', 'Service'
    industry: IndustrySlug;
    businessModel: string; // 'Retail', 'Service', 'Digital'
    primaryUseCase: string;
    requiredPlan: "free" | "growth" | "pro";
    defaultTheme: "light" | "dark";
    status: TemplateStatus;

    preview: {
        thumbnailUrl: string | null;
        mobileUrl: string | null;
        desktopUrl: string | null;
    };

    compare: {
        headline: string;
        bullets: string[];
        bestFor: string[];
        keyModules: string[];
    };

    routes: string[]; // e.g. ["/", "/shop", "/cart"]
    layoutKey: string; // Maps to internal Layout Component

    onboardingProfile?: OnboardingProfile;

    // Legacy/Optional/Extended
    demoStoreUrl?: string;
    componentProps?: Record<string, any>;
}
export interface SidebarItem {
    name: string;
    href: string;
    icon?: any;
    external?: boolean;
    alwaysShow?: boolean;
}

export interface SidebarGroup {
    name: string;
    items: SidebarItem[];
    title?: string;
}
