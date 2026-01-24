import { IndustryConfig, IndustrySlug } from "@/lib/templates/types";

// --- WIDGETS ---
const COMMON_WIDGETS = [
    { id: "setup_checklist", title: "Setup Progress", dataSource: "real", type: "list", w: 4 },
];
const COMMERCE_WIDGETS = [
    { id: "sales_today", title: "Sales Today", dataSource: "real", type: "stat", w: 1 },
    { id: "orders_pending", title: "Pending Orders", dataSource: "real", type: "stat", w: 1 },
    { id: "setup_checklist", title: "Next Steps", dataSource: "real", type: "list", w: 4 },
];
// --- MODULE SETS ---
const COMMERCE_MODULES = ["dashboard", "catalog", "sales", "fulfillment", "finance", "marketing", "settings"];
const SERVICE_MODULES = ["dashboard", "bookings", "finance", "marketing", "content", "settings"];
// --- FORM PRESETS ---
const BASE_PRODUCT_FORM = {
    requiredFields: ["price", "sku", "stock", "images"],
    optionalFields: ["barcode", "weight", "description"],
    variantLabel: "Options",
    validation: { minImages: 1, minDescriptionLength: 20 },
};
export const INDUSTRY_CONFIG: Record<IndustrySlug, IndustryConfig> = {
    // --- RETAIL & COMMERCE ---
    retail: {
        displayName: "General Retail",
        primaryObject: "product",
        modules: COMMERCE_MODULES,
        dashboardWidgets: COMMERCE_WIDGETS,
        forms: { product: { ...BASE_PRODUCT_FORM } },
        onboardingSteps: ["store_profile", "payments", "shipping", "first_product"],
    },
    fashion: {
        displayName: "Fashion & Apparel",
        primaryObject: "product",
        modules: COMMERCE_MODULES,
        dashboardWidgets: COMMERCE_WIDGETS,
        forms: {
            product: {
                requiredFields: ["price", "sku", "stock", "images", "size_guide"],
                optionalFields: ["material", "care_instructions"],
                variantLabel: "Sizes & Colors",
                validation: { minImages: 3, minDescriptionLength: 50 },
            }
        },
        onboardingSteps: ["store_profile", "size_charts", "first_product"],
    },
    electronics: {
        displayName: "Electronics",
        primaryObject: "product",
        modules: COMMERCE_MODULES,
        dashboardWidgets: COMMERCE_WIDGETS,
        forms: {
            product: {
                requiredFields: ["price", "sku", "stock", "specs_map", "warranty"],
                optionalFields: ["brand", "model_number"],
                variantLabel: "Models",
                validation: { minImages: 2, requiredGroups: ["specs"] },
            }
        },
        onboardingSteps: ["store_profile", "first_product"],
    },
    beauty: {
        displayName: "Beauty & Cosmetics",
        primaryObject: "product",
        modules: COMMERCE_MODULES,
        dashboardWidgets: COMMERCE_WIDGETS,
        forms: {
            product: {
                requiredFields: ["price", "stock", "ingredients", "usage"],
                optionalFields: ["batch_code", "expiry"],
                variantLabel: "Shades",
                validation: { minImages: 2 },
            }
        },
        onboardingSteps: ["store_profile", "first_product"],
    },
    grocery: {
        displayName: "Grocery",
        primaryObject: "product",
        modules: COMMERCE_MODULES,
        dashboardWidgets: COMMERCE_WIDGETS,
        forms: {
            product: {
                requiredFields: ["price", "stock", "unit_weight", "expiry_date"],
                optionalFields: ["origin", "nutritional_info"],
                variantLabel: "Pack Sizes",
                validation: { minImages: 1 },
            }
        },
        onboardingSteps: ["store_profile", "delivery_zones", "inventory"],
    },
    // --- FOOD & RESTAURANT ---
    food: {
        displayName: "Restaurants & Food",
        primaryObject: "menu_item",
        modules: ["dashboard", "catalog", "sales", "fulfillment", "finance", "marketing", "settings"],
        moduleLabels: { catalog: "Menu Items", sales: "Orders", fulfillment: "Kitchen View" },
        moduleRoutes: {
            catalog: { index: "/dashboard/menu-items", create: "/dashboard/menu-items/new" },
            fulfillment: { index: "/dashboard/kitchen" }
        },
        dashboardWidgets: [
            { id: "active_orders", title: "Active Orders", dataSource: "real", type: "stat", w: 1 },
            { id: "revenue_today", title: "Revenue Today", dataSource: "real", type: "stat", w: 1 },
            ...COMMON_WIDGETS
        ],
        forms: {
            menu_item: {
                requiredFields: ["price", "prep_time", "veg_non_veg"],
                optionalFields: ["calories", "allergens", "spice_level", "ingredients"],
                variantLabel: "Modifiers",
                validation: { minImages: 1 },
            }
        },
        onboardingSteps: ["store_profile", "menu_setup", "delivery_settings"],
    },
    // --- SERVICES & BOOKINGS ---
    services: {
        displayName: "Professional Services",
        primaryObject: "service",
        modules: ["dashboard", "bookings", "finance", "marketing", "content", "settings"],
        moduleLabels: { bookings: "Bookings" },
        moduleRoutes: { bookings: { index: "/dashboard/bookings", create: "/dashboard/bookings/new" } },
        dashboardWidgets: [
            { id: "upcoming_bookings", title: "Upcoming Bookings", dataSource: "real", type: "stat", w: 1 },
            { id: "active_services", title: "Active Services", dataSource: "real", type: "stat", w: 1 },
            ...COMMON_WIDGETS
        ],
        forms: {
            service: {
                requiredFields: ["price", "duration_min", "provider_id"],
                optionalFields: ["buffer", "remote_link"],
                variantLabel: "Service Types",
                validation: { minImages: 1 },
            }
        },
        onboardingSteps: ["store_profile", "service_menu", "availability"],
    },
    // --- DIGITAL & COURSES ---
    digital: {
        displayName: "Digital Products",
        primaryObject: "digital_asset",
        modules: ["dashboard", "catalog", "sales", "finance", "marketing", "settings"],
        moduleLabels: { catalog: "Digital Assets", sales: "Downloads" },
        moduleRoutes: { catalog: { index: "/dashboard/digital-assets", create: "/dashboard/digital-assets/new" } },
        dashboardWidgets: [
            { id: "total_downloads", title: "Total Downloads", dataSource: "real", type: "stat", w: 1 },
            { id: "active_assets", title: "Active Assets", dataSource: "real", type: "stat", w: 1 },
            ...COMMON_WIDGETS
        ],
        forms: {
            digital_asset: {
                requiredFields: ["price", "file_upload", "access_settings"],
                optionalFields: ["preview_file"],
                variantLabel: "Licenses",
                validation: { minImages: 1, requiredGroups: ["files"] },
            }
        },
        onboardingSteps: ["store_profile", "file_setup"],
    },
    // --- EVENTS & TICKETING ---
    events: {
        displayName: "Events & Ticketing",
        primaryObject: "event",
        modules: ["dashboard", "catalog", "sales", "marketing", "finance", "settings"],
        moduleLabels: { catalog: "Events", sales: "Guest List" },
        moduleRoutes: {
            catalog: { index: "/dashboard/events", create: "/dashboard/events/new" },
            sales: { index: "/dashboard/check-in" }
        },
        dashboardWidgets: [
            { id: "tickets_sold", title: "Tickets Sold", dataSource: "real", type: "stat", w: 1 },
            { id: "active_events", title: "Active Events", dataSource: "real", type: "stat", w: 1 },
            ...COMMON_WIDGETS
        ],
        forms: {
            event: {
                requiredFields: ["price", "event_date", "venue", "ticket_quota"],
                optionalFields: ["seat_map"],
                variantLabel: "Ticket Classes",
                validation: { minImages: 1, requiredGroups: ["location", "schedule"] },
            }
        },
        onboardingSteps: ["organizer_profile", "event_setup"],
    },
    // --- B2B & WHOLESALE ---
    b2b: {
        displayName: "B2B Wholesale",
        primaryObject: "product",
        modules: ["dashboard", "catalog", "sales", "finance", "marketing", "settings"],
        moduleLabels: { catalog: "Catalog", sales: "Quotes & Orders" },
        moduleRoutes: {
            catalog: { index: "/dashboard/wholesale-catalog" },
            sales: { index: "/dashboard/quotes" }
        },
        dashboardWidgets: [
            { id: "pending_quotes", title: "Pending Quotes", dataSource: "real", type: "stat", w: 1 },
            { id: "total_orders", title: "Total Orders", dataSource: "real", type: "stat", w: 1 },
            ...COMMON_WIDGETS
        ],
        forms: {
            product: {
                requiredFields: ["price", "sku", "moq", "tier_pricing"],
                optionalFields: ["lead_time", "packaging"],
                variantLabel: "Volume Tiers",
                validation: { minImages: 1, requiredGroups: ["specs"] },
            }
        },
        onboardingSteps: ["company_verification", "first_product"],
    },
    // --- REAL ESTATE & AUTO ---
    real_estate: {
        displayName: "Real Estate",
        primaryObject: "listing",
        modules: ["dashboard", "catalog", "bookings", "marketing", "settings"],
        moduleLabels: { catalog: "Properties", bookings: "Viewings" },
        moduleRoutes: {
            catalog: { index: "/dashboard/properties", create: "/dashboard/properties/new" },
            bookings: { index: "/dashboard/viewings" }
        },
        dashboardWidgets: [
            { id: "active_listings", title: "Active Listings", dataSource: "real", type: "stat", w: 1 },
            { id: "total_viewings", title: "Total Viewings", dataSource: "real", type: "stat", w: 1 },
            ...COMMON_WIDGETS
        ],
        forms: {
            listing: {
                requiredFields: ["price", "location", "sqft", "rooms"],
                optionalFields: ["virtual_tour"],
                variantLabel: "Units",
                validation: { minImages: 5, requiredGroups: ["location", "specs"] },
            }
        },
        onboardingSteps: ["agency_profile", "listings_upload"],
    },
    automotive: {
        displayName: "Automotive",
        primaryObject: "vehicle",
        modules: ["dashboard", "catalog", "sales", "finance", "marketing", "settings"],
        moduleLabels: { catalog: "Vehicles", sales: "Leads" },
        moduleRoutes: {
            catalog: { index: "/dashboard/vehicles", create: "/dashboard/vehicles/new" },
            sales: { index: "/dashboard/leads" }
        },
        dashboardWidgets: [
            { id: "active_listings", title: "Active Listings", dataSource: "real", type: "stat", w: 1 },
            { id: "total_leads", title: "Total Leads", dataSource: "real", type: "stat", w: 1 },
            ...COMMON_WIDGETS
        ],
        forms: {
            vehicle: {
                requiredFields: ["price", "make", "model", "year", "vin"],
                optionalFields: ["mileage", "history_report"],
                variantLabel: "Trims",
                validation: { minImages: 5, requiredGroups: ["specs"] },
            },
            // Basic Lead Form if we treat leads as resources
            lead: {
                requiredFields: ["title", "client"], // Title = "Inquiry for X", Client = Name
                optionalFields: ["tags", "description"], // Description = Message
                validation: { minImages: 0 }
            }
        },
        onboardingSteps: ["dealer_profile", "inventory_upload"],
    },
    travel_hospitality: {
        displayName: "Travel",
        primaryObject: "stay",
        modules: ["dashboard", "catalog", "bookings", "finance", "settings"],
        moduleLabels: { catalog: "Stays", bookings: "Reservations" },
        moduleRoutes: { catalog: { index: "/dashboard/stays", create: "/dashboard/stays/new" } },
        dashboardWidgets: [
            { id: "active_stays", title: "Active Stays", dataSource: "real", type: "stat", w: 1 },
            { id: "upcoming_reservations", title: "Upcoming Bookings", dataSource: "real", type: "stat", w: 1 },
            ...COMMON_WIDGETS
        ],
        forms: {
            stay: {
                requiredFields: ["price", "location", "dates", "amenities"],
                optionalFields: ["house_rules"],
                variantLabel: "Rooms",
                validation: { minImages: 5, requiredGroups: ["location"] },
            }
        },
        onboardingSteps: ["property_profile", "room_setup"],
    },
    // --- CONTENT & MEDIA ---
    blog_media: {
        displayName: "Blog",
        primaryObject: "post",
        modules: ["dashboard", "content", "marketing", "settings"],
        moduleLabels: { content: "Posts" },
        moduleRoutes: { content: { index: "/dashboard/blog", create: "/dashboard/blog/new" } },
        dashboardWidgets: [
            { id: "total_posts", title: "Total Posts", dataSource: "real", type: "stat", w: 1 },
            { id: "total_reads", title: "Total Reads", dataSource: "real", type: "stat", w: 1 },
            { id: "avg_read_time", title: "Avg. Read Time", dataSource: "real", type: "stat", w: 1 },
            ...COMMON_WIDGETS
        ],
        forms: {
            post: {
                requiredFields: ["title", "content"],
                optionalFields: ["tags", "author"],
                validation: { minImages: 1 },
            }
        },
        onboardingSteps: ["profile", "content_strategy"],
    },
    creative_portfolio: {
        displayName: "Portfolio",
        primaryObject: "project",
        modules: ["dashboard", "content", "settings"],
        moduleLabels: { content: "Projects" },
        moduleRoutes: { content: { index: "/dashboard/projects", create: "/dashboard/projects/new" } },
        dashboardWidgets: [
            { id: "total_projects", title: "Total Projects", dataSource: "real", type: "stat", w: 1 },
            { id: "total_views", title: "Total Views", dataSource: "real", type: "stat", w: 1 },
            ...COMMON_WIDGETS
        ],
        forms: {
            project: {
                requiredFields: ["title", "media"],
                optionalFields: ["client", "year", "description", "tags"],
                validation: { minImages: 1 },
            }
        },
        onboardingSteps: ["profile", "upload_work"],
    },
    nonprofit: {
        displayName: "Nonprofit",
        primaryObject: "campaign",
        modules: ["dashboard", "marketing", "finance", "content", "settings"],
        moduleLabels: { marketing: "Campaigns" },
        moduleRoutes: { marketing: { index: "/dashboard/campaigns", create: "/dashboard/campaigns/new" } },
        dashboardWidgets: [
            { id: "total_donations", title: "Total Donations", dataSource: "real", type: "stat", w: 1 },
            { id: "active_campaigns", title: "Active Campaigns", dataSource: "real", type: "stat", w: 1 },
            ...COMMON_WIDGETS
        ],
        forms: {
            campaign: {
                requiredFields: ["cause", "goal"],
                optionalFields: ["tags"],
                variantLabel: "Tiers",
                validation: { minImages: 1 },
            }
        },
        onboardingSteps: ["org_profile", "campaign_setup"],
    },
    education: {
        displayName: "Education & Courses",
        primaryObject: "course",
        modules: ["dashboard", "catalog", "sales", "finance", "content", "settings"],
        moduleLabels: { catalog: "Courses", sales: "Enrollments" },
        moduleRoutes: {
            catalog: { index: "/dashboard/courses", create: "/dashboard/courses/new" },
            sales: { index: "/dashboard/enrollments" }
        },
        dashboardWidgets: [
            { id: "active_students", title: "Active Students", dataSource: "real", type: "stat", w: 1 },
            { id: "active_courses", title: "Active Courses", dataSource: "real", type: "stat", w: 1 },
            ...COMMON_WIDGETS
        ],
        forms: {
            course: {
                requiredFields: ["price", "curriculum", "description"],
                optionalFields: ["tags", "instructor"],
                variantLabel: "Modules",
                validation: { minImages: 1 },
            }
        },
        onboardingSteps: ["instructor_profile", "course_setup"],
    },
    marketplace: {
        displayName: "Marketplace",
        primaryObject: "vendor",
        modules: ["dashboard", "ops_console", "finance", "settings"],
        moduleLabels: { ops_console: "Ops Console", finance: "Payouts" },
        moduleRoutes: {
            ops_console: { index: "/dashboard/ops-console" },
            finance: { index: "/dashboard/payouts" }
        },
        dashboardWidgets: [
            { id: "total_vendors", title: "Total Vendors", dataSource: "real", type: "stat", w: 1 },
            { id: "commission_earned", title: "Commission Earned", dataSource: "real", type: "stat", w: 1 },
            ...COMMON_WIDGETS
        ],
        forms: {
            vendor: {
                requiredFields: ["name", "email", "category"],
                optionalFields: ["tags"],
                validation: { minImages: 1 },
            }
        },
        onboardingSteps: ["marketplace_setup", "vendor_onboarding"],
    },
    one_product: {
        displayName: "One Product Store",
        primaryObject: "product",
        modules: ["dashboard", "catalog", "sales", "marketing", "finance", "settings"],
        moduleLabels: { catalog: "The Product" },
        moduleRoutes: {
            catalog: { index: "/dashboard/products" }
        },
        dashboardWidgets: [
            { id: "conversion_rate", title: "Conversion Rate", dataSource: "real", type: "stat", w: 1 },
            { id: "total_revenue", title: "Total Revenue", dataSource: "real", type: "stat", w: 1 },
            ...COMMON_WIDGETS
        ],
        forms: {
            product: {
                ...BASE_PRODUCT_FORM,
                requiredFields: ["price", "description", "images", "usp"],
            }
        },
        onboardingSteps: ["product_setup", "funnel_design"],
    },
};
