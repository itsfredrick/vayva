"use client";
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import Link from "next/link";
import { Icon, Button } from "@vayva/ui";
import { useAuth } from "@/context/AuthContext";
export const ProFeatureUpsell = ({ featureName }) => {
    const { merchant } = useAuth();
    if (!merchant || merchant.plan !== "STARTER") {
        return null;
    }
    return (_jsxs("div", { className: "rounded-xl border border-indigo-100 bg-gradient-to-r from-indigo-50 to-purple-50 p-6 relative overflow-hidden group hover:shadow-md transition-shadow", children: [_jsx("div", { className: "absolute top-0 right-0 p-4 opacity-10 transform translate-x-1/3 -translate-y-1/3 group-hover:scale-110 transition-transform duration-700", children: _jsx(Icon, { name: "Crown", size: 120 }) }), _jsxs("div", { className: "relative z-10", children: [_jsxs("div", { className: "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-indigo-100 text-indigo-700 text-[10px] font-bold uppercase tracking-wide mb-3", children: [_jsx(Icon, { name: "Sparkles", size: 12 }), featureName ? `${featureName} Locked` : "Upgrade Available"] }), _jsx("h3", { className: "font-bold text-gray-900 mb-2", children: "Unlock Professional Powers" }), _jsx("p", { className: "text-sm text-gray-600 mb-4 max-w-[80%]", children: "Get access to AI automation, removed branding, priority support, and lower transaction fees." }), _jsx(Link, { href: "/dashboard/settings/billing", children: _jsx(Button, { variant: "primary", className: "bg-indigo-600 hover:bg-indigo-700 text-sm px-4 py-2 shadow-sm shadow-indigo-200", children: "View Plans & Upgrade" }) })] })] }));
};
