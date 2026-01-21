"use client";
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import useSWR from "swr";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { useStore } from "@/context/StoreContext";
import { INDUSTRY_CONFIG } from "@/config/industry";
import { formatCurrency } from "@/lib/i18n";
import { Button, Card, Icon } from "@vayva/ui";
import { DashboardSetupChecklist } from "@/components/dashboard/DashboardSetupChecklist";
import { extensionRegistry } from "@/lib/extensions/registry";
const fetcher = (url) => fetch(url).then((r) => r.json());
const StatWidget = ({ title, value, loading, icon, }) => (_jsxs(Card, { className: "p-5 bg-white border border-studio-border shadow-xl shadow-black/5 hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 group", children: [_jsxs("div", { className: "flex justify-between items-start mb-3", children: [_jsx("div", { className: "text-xs font-bold text-gray-400 uppercase tracking-wider", children: title }), _jsx("div", { className: "p-2 bg-studio-gray rounded-lg group-hover:bg-vayva-green transition-colors", children: _jsx(Icon, { name: icon || "Activity", size: 16, className: "text-gray-400 group-hover:text-white" }) })] }), _jsx("div", { className: "text-3xl font-black text-black", children: loading ? (_jsx("div", { className: "h-8 w-24 bg-gray-100 rounded-lg animate-pulse" })) : (value ?? "—") })] }));
export default function DashboardPage() {
    const { merchant } = useAuth();
    const { store } = useStore();
    const { data: metricsData, isLoading: metricsLoading } = useSWR("/api/dashboard/metrics", fetcher);
    if (!merchant)
        return (_jsxs("div", { className: "p-8 max-w-7xl mx-auto space-y-6", children: [_jsx("div", { className: "h-8 w-48 bg-gray-100 rounded-lg animate-pulse mb-2" }), _jsx("div", { className: "h-4 w-64 bg-gray-50 rounded-lg animate-pulse mb-8" }), _jsx("div", { className: "grid grid-cols-1 md:grid-cols-4 gap-6", children: [1, 2, 3, 4].map((i) => (_jsx("div", { className: "h-32 bg-gray-50 rounded-2xl animate-pulse" }, i))) })] }));
    // Redirect if no industry set — send to onboarding entry to resolve the correct step dynamically
    // Redirect if no industry set
    if (!merchant.industrySlug) {
        // Fallback or send to settings
        return _jsx("div", { className: "p-8", children: "Please complete your store profile in Settings." });
    }
    const industrySlug = store?.industrySlug || merchant.industrySlug;
    const config = INDUSTRY_CONFIG[industrySlug];
    if (!config) {
        return _jsx("div", { className: "p-8", children: "Configuration Error: Unknown Industry" });
    }
    // Determine Main CTA
    let ctaLabel = `Create ${config.primaryObject.replace(/_/g, " ")}`;
    let ctaLink = `/dashboard/products/new`; // Safe default
    // Smart Lookup for Create Route
    // Find the module that handles the primary object (usually catalog, or explicitly defined create route)
    for (const mod of config.modules) {
        const route = config.moduleRoutes?.[mod]?.create;
        if (route) {
            ctaLink = route;
            break; // Found a specific create route, use it
        }
    }
    // Fallback Mapping if no explicit route found in config
    if (ctaLink === '/dashboard/products/new') {
        const map = {
            service: "/dashboard/services/new",
            event: "/dashboard/events/new",
            course: "/dashboard/courses/new",
            listing: "/dashboard/listings/new",
            post: "/dashboard/posts/new",
            project: "/dashboard/projects/new",
            campaign: "/dashboard/campaigns/new",
            menu_item: "/dashboard/menu-items/new",
            digital_asset: "/dashboard/digital-assets/new"
        };
        if (map[config.primaryObject]) {
            ctaLink = map[config.primaryObject];
        }
    }
    const metrics = metricsData?.metrics || {};
    return (_jsxs("div", { className: "p-6 max-w-7xl mx-auto space-y-6", children: [_jsxs("div", { className: "flex flex-col md:flex-row md:items-center justify-between gap-4", children: [_jsxs("div", { children: [_jsx("h1", { className: "text-2xl font-bold tracking-tight", children: "Dashboard" }), _jsxs("p", { className: "text-gray-500", children: ["Overview for ", store?.name || "Your Store", " \u2022 ", _jsx("span", { className: "capitalize", children: config.displayName })] })] }), _jsx(Link, { href: ctaLink, children: _jsxs(Button, { size: "lg", className: "bg-vayva-green text-white hover:bg-vayva-green/90 shadow-xl shadow-green-500/20 font-bold", children: [_jsx(Icon, { name: "Plus", className: "mr-2 h-4 w-4" }), ctaLabel] }) })] }), _jsxs("div", { className: "grid grid-cols-1 md:grid-cols-4 gap-6", children: [config.dashboardWidgets.map((widget) => {
                        if (widget.id === "setup_checklist")
                            return null;
                        if (widget.type === "stat") {
                            let icon = "Activity";
                            let title = widget.title;
                            let value = "—";
                            if (widget.id === "sales_today") {
                                const amount = metrics.revenue?.value || 0;
                                value = formatCurrency(amount, store?.currency || "NGN");
                                icon = "DollarSign";
                            }
                            else if (widget.id === "orders_pending") {
                                value = metrics.orders?.value || 0;
                                icon = "ShoppingBag";
                            }
                            else if (widget.id === "customers_count") {
                                value = metrics.customers?.value || 0;
                                icon = "Users";
                            }
                            return (_jsx("div", { className: `md:col-span-${widget.w || 1}`, children: _jsx(StatWidget, { title: title, value: value, loading: metricsLoading, icon: icon }) }, widget.id));
                        }
                        return null;
                    }), extensionRegistry.getActiveForStore(industrySlug, merchant.enabledExtensionIds || []).map(ext => ext.dashboardWidgets?.map(widget => (_jsx("div", { className: `md:col-span-${widget.gridCols || 1}`, children: _jsx(StatWidget, { title: widget.label, value: metrics[widget.id]?.value || metrics.custom?.[widget.id] || "—", loading: metricsLoading }) }, widget.id))))] }), _jsx("div", { className: "grid grid-cols-1 gap-6", children: _jsx(DashboardSetupChecklist, {}) })] }));
}
