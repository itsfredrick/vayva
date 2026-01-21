"use client";
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { Icon } from "@vayva/ui";
import { INDUSTRY_CONFIG } from "@/config/industry";
export const QuickActions = () => {
    const [industrySlug, setIndustrySlug] = useState("retail");
    useEffect(() => {
        async function load() {
            try {
                const res = await fetch("/api/merchant/dashboard/activation-progress");
                if (res.ok) {
                    const data = await res.json();
                    setIndustrySlug(data?.data?.industrySlug || "retail");
                }
            }
            catch (e) {
                // ignore, default retail
            }
        }
        load();
    }, []);
    const config = useMemo(() => {
        return INDUSTRY_CONFIG[industrySlug] || INDUSTRY_CONFIG.retail;
    }, [industrySlug]);
    const createPath = config?.moduleRoutes?.catalog?.create ||
        (config?.primaryObject === "menu_item"
            ? "/dashboard/menu-items/new"
            : config?.primaryObject === "digital_asset"
                ? "/dashboard/digital-assets/new"
                : "/dashboard/products/new");
    const primaryLabelMap = {
        menu_item: "Menu Item",
        digital_asset: "Digital Asset",
        service: "Service",
        listing: "Listing",
        course: "Course",
        event: "Event",
        project: "Project",
        campaign: "Campaign",
    };
    const primaryLabel = primaryLabelMap[config?.primaryObject] || "Product";
    const hasFulfillment = (config?.modules || []).includes("fulfillment");
    const actions = [
        {
            label: `New ${primaryLabel}`,
            icon: "Plus",
            href: createPath,
            available: true,
        },
        { label: "Create Discount", icon: "Tag", href: "#", available: false },
        {
            label: "Create Invoice",
            icon: "FileText",
            href: "/dashboard/finance",
            available: true,
        },
        { label: "Send Broadcast", icon: "Send", href: "#", available: false },
        {
            label: "Delivery Task",
            icon: "Truck",
            href: "/dashboard/orders",
            available: hasFulfillment,
        },
        {
            label: "View Reports",
            icon: "BarChart2",
            href: "/dashboard/analytics",
            available: true,
        },
    ];
    return (_jsx("div", { className: "grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8", children: actions.map((action) => (_jsx(Link, { href: action.available ? action.href : "#", className: `block group ${!action.available ? "cursor-not-allowed opacity-50" : ""}`, onClick: (e) => !action.available && e.preventDefault(), children: _jsxs("div", { className: "bg-[#0A0F0D] border border-white/5 rounded-xl p-4 flex flex-col items-center gap-3 hover:border-primary/30 hover:bg-white/5 transition-all text-center h-full", children: [_jsx("div", { className: "w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-white group-hover:scale-110 transition-transform group-hover:bg-primary group-hover:text-black", children: _jsx(Icon, { name: action.icon, size: 20 }) }), _jsx("span", { className: "text-xs font-medium text-text-secondary group-hover:text-white transition-colors", children: action.label }), !action.available && (_jsx("span", { className: "text-[10px] text-primary/50 uppercase tracking-wider font-bold", children: "Soon" }))] }) }, action.label))) }));
};
