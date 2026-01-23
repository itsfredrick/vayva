/**
 * These are core modules that are treated as extensions.
 * In the future, these could be moved to separate packages.
 */

export interface SidebarItem {
    id: string;
    label: string;
    href: string;
    icon: string;
    parentGroup: string;
}

export interface DashboardWidget {
    id: string;
    label: string;
    type: string;
    gridCols: number;
    icon?: string;
    apiEndpoint: string;
}

export interface ExtensionManifest {
    id: string;
    name: string;
    version: string;
    description: string;
    category: string;
    sidebarItems: SidebarItem[];
    primaryObject: string;
    dashboardWidgets?: DashboardWidget[];
}

export const INTERNAL_EXTENSIONS: ExtensionManifest[] = [
    {
        id: "vayva.retail",
        name: "General Retail",
        version: "1.0.0",
        description: "Core commerce features: Products, Orders, and Fulfillment.",
        category: "commerce",
        sidebarItems: [
            { id: "products", label: "Products", href: "/dashboard/products", icon: "Package", parentGroup: "sales" },
            { id: "orders", label: "Orders", href: "/dashboard/orders", icon: "ShoppingBag", parentGroup: "sales" },
            { id: "fulfillment", label: "Fulfillment", href: "/dashboard/fulfillment/shipments", icon: "Truck", parentGroup: "sales" },
        ],
        primaryObject: "product",
        dashboardWidgets: [
            { id: "retail.sales_velocity", label: "Sales Velocity", type: "large_stat", gridCols: 1, icon: "Zap", apiEndpoint: "/api/analytics/sales-velocity" },
            { id: "retail.top_products", label: "Top Products", type: "list_activity", gridCols: 2, icon: "Package", apiEndpoint: "/api/analytics/top-products" }
        ]
    },
    {
        id: "vayva.kitchen",
        name: "Kitchen Management",
        version: "1.0.0",
        description: "Live kitchen view for restaurants and food delivery.",
        category: "industry",
        sidebarItems: [
            { id: "kitchen", label: "Kitchen View", href: "/dashboard/kitchen", icon: "ChefHat", parentGroup: "ops" }
        ],
        primaryObject: "menu_item"
    },
    {
        id: "vayva.real-estate",
        name: "Real Estate Listings",
        version: "1.0.0",
        description: "Manage properties, viewings, and real estate leads.",
        category: "industry",
        sidebarItems: [
            { id: "properties", label: "Properties", href: "/dashboard/properties", icon: "Home", parentGroup: "sales" },
            { id: "viewings", label: "Viewings", href: "/dashboard/viewings", icon: "Calendar", parentGroup: "sales" }
        ],
        primaryObject: "listing"
    },
    {
        id: "vayva.automations",
        name: "Visual Automations",
        version: "1.0.0",
        description: "Build visual, no-code workflows to automate your business operations.",
        category: "productivity",
        sidebarItems: [
            { id: "automations", label: "Automations", href: "/dashboard/automations", icon: "Zap", parentGroup: "ops" }
        ],
        primaryObject: "workflow"
    }
];
class ExtensionRegistry {
    private extensions: Map<string, ExtensionManifest>;
    constructor(initial: ExtensionManifest[]) {
        this.extensions = new Map();
        initial.forEach(ext => this.extensions.set(ext.id, ext));
    }
    register(manifest: ExtensionManifest) {
        this.extensions.set(manifest.id, manifest);
    }
    get(id: string) {
        return this.extensions.get(id);
    }
    getAll() {
        return Array.from(this.extensions.values());
    }
    /**
     * Get active extensions for a store.
     * @param industrySlug - Legacy industry identifier
     * @param enabledIds - Explicitly enabled extension IDs (from DB)
     */
    getActiveForStore(industrySlug: string, enabledIds: string[]): ExtensionManifest[] {
        // Core retail is always active
        const retailExt = this.extensions.get("vayva.retail");
        const active: ExtensionManifest[] = retailExt ? [retailExt] : [];

        // If we have explicit enabled IDs from DB, use them
        if (enabledIds && enabledIds.length > 0) {
            enabledIds.forEach(id => {
                const ext = this.extensions.get(id);
                if (ext && !active.find(a => a.id === id)) {
                    active.push(ext);
                }
            });
            return active;
        }
        // Fallback for new stores or pre-migration: derive from industrySlug
        if (industrySlug === "food") {
            const ext = this.extensions.get("vayva.kitchen");
            if (ext) active.push(ext);
        }
        if (industrySlug === "real_estate") {
            const ext = this.extensions.get("vayva.real-estate");
            if (ext) active.push(ext);
        }
        return active;
    }
}
export const extensionRegistry = new ExtensionRegistry(INTERNAL_EXTENSIONS);
