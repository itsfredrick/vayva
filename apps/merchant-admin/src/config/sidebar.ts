import { INDUSTRY_CONFIG } from "./industry";
// Default Routes/Icons if not overridden by IndustryConfig
const MODULE_DEFAULTS = {
    dashboard: { label: "Dashboard", href: "/dashboard", icon: "LayoutDashboard" },
    catalog: { label: "Products", href: "/dashboard/products", icon: "Package" },
    sales: { label: "Orders", href: "/dashboard/orders", icon: "ShoppingBag" },
    bookings: { label: "Bookings", href: "/dashboard/bookings", icon: "Calendar" },
    fulfillment: { label: "Fulfillment", href: "/dashboard/fulfillment/shipments", icon: "Truck" },
    finance: { label: "Finance", href: "/dashboard/finance", icon: "CreditCard" },
    marketing: { label: "Marketing", href: "/dashboard/marketing/discounts", icon: "Megaphone" },
    content: { label: "Content", href: "/dashboard/digital-assets", icon: "FileText" },
    support: { label: "Support", href: "/dashboard/support", icon: "LifeBuoy" },
    settings: { label: "Settings", href: "/dashboard/settings/profile", icon: "Settings" },
    control_center: { label: "Control Center", href: "/dashboard/control-center", icon: "LayoutTemplate" },
    ops_console: { label: "Ops Console", href: "/dashboard/ops-console", icon: "Terminal" },
};
export const SIDEBAR_GROUPS = [
    {
        name: "General",
        items: [
            { name: "Dashboard", href: "/dashboard", icon: "LayoutDashboard" },
        ]
    },
    {
        name: "Sales & Marketplace",
        items: [
            MODULE_DEFAULTS.sales,
            MODULE_DEFAULTS.catalog,
            MODULE_DEFAULTS.fulfillment,
        ].map(m => ({ name: m.label, href: m.href, icon: m.icon }))
    },
    {
        name: "Operations",
        items: [
            MODULE_DEFAULTS.finance,
            MODULE_DEFAULTS.marketing,
            { name: "Portfolio", href: "/dashboard/portfolio/overview", icon: "GalleryVerticalEnd" },
            { name: "Kitchen Display", href: "/dashboard/kitchen", icon: "UtensilsCrossed" },
            { name: "Creative Editor", href: "/dashboard/creative-editor", icon: "Megaphone" },
            MODULE_DEFAULTS.support,
        ].map((m: any) => ({ name: m.label || m.name, href: m.href, icon: m.icon }))
    },
    {
        name: "Growth Tools",
        items: [
            { name: "QR Generator", href: "/dashboard/growth/qr", icon: "TrendingUp" },
        ]
    },
    {
        name: "System",
        items: [
            { label: "WhatsApp Agent", href: "/dashboard/ai-agent/profile", icon: "MessageSquare" },
            MODULE_DEFAULTS.control_center,
            { label: "Roles & Permissions", href: "/dashboard/settings/roles", icon: "ShieldCheck" },
            { label: "Developer Hub", href: "/dashboard/developer/apps", icon: "Code" },
        ].map(m => ({ name: m.label, href: m.href, icon: m.icon }))
    }
];
import { extensionRegistry } from "@/lib/extensions/registry";
export function getSidebar(industrySlug: any, enabledIds: any) {
    // 1. Get Base Industry Config
    const config = INDUSTRY_CONFIG[industrySlug as keyof typeof INDUSTRY_CONFIG];
    if (!config)
        return SIDEBAR_GROUPS;
    // 2. Load Extensions for this store
    const activeExtensions = extensionRegistry.getActiveForStore(industrySlug, enabledIds);
    // 3. Build Sidebar from Extensions
    const groups = [
        { name: "General", items: [{ name: "Dashboard", href: "/dashboard", icon: "LayoutDashboard" }] },
        { name: "Sales & Marketplace", items: [] },
        {
            name: "Operations",
            items: [
                { name: "Finance", href: "/dashboard/finance", icon: "CreditCard" },
                { name: "Blog", href: "/dashboard/blog", icon: "BookOpen" },
            ]
        },
        {
            name: "System", items: [
                { name: "WhatsApp Agent", href: "/dashboard/ai-agent/profile", icon: "MessageSquare" },
                { name: "Control Center", href: "/dashboard/control-center", icon: "LayoutTemplate" },
                { name: "Roles & Permissions", href: "/dashboard/settings/roles", icon: "ShieldCheck" },
                { name: "Developer Hub", href: "/dashboard/developer/apps", icon: "Code" },
            ]
        },
    ];
    activeExtensions.forEach((ext: any) => {
        ext.sidebarItems?.forEach((item: any) => {
            let groupId = 1; // Default to Sales
            if (item.parentGroup === "ops")
                groupId = 2;
            if (item.parentGroup === "system")
                groupId = 3;
            groups[groupId].items.push({
                name: item.label,
                href: item.href,
                icon: item.icon
            });
        });
    });

    // 4. Move Control Center to the absolute bottom
    const systemGroup = groups.find(g => g.name === "System");
    if (systemGroup) {
        const ccIndex = systemGroup.items.findIndex(i => i.name === "Control Center");
        if (ccIndex !== -1) {
            const [ccItem] = systemGroup.items.splice(ccIndex, 1);
            systemGroup.items.push(ccItem);
        }
    }

    // Cleanup empty groups
    return groups.filter(g => g.items.length > 0);
}
