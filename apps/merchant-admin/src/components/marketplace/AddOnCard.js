"use client";
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Button } from "@vayva/ui";
import Link from "next/link";
export function AddOnCard({ addon, compatibility, isEnabled, onPreview, onEnable, }) {
    const getTypeColor = (type) => {
        switch (type) {
            case "capability":
                return "bg-blue-100 text-blue-800";
            case "integration":
                return "bg-purple-100 text-purple-800";
            case "automation":
                return "bg-green-100 text-green-800";
            default:
                return "bg-gray-100 text-gray-800";
        }
    };
    const getPlanBadge = (plan) => {
        switch (plan) {
            case "free":
                return "bg-gray-100 text-gray-800";
            case "growth":
                return "bg-blue-100 text-blue-800";
            case "pro":
                return "bg-purple-100 text-purple-800";
            default:
                return "bg-gray-100 text-gray-800";
        }
    };
    return (_jsxs("div", { className: `bg-white border rounded-lg p-6 ${!compatibility.isCompatible ? "opacity-60" : ""}`, children: [_jsxs("div", { className: "flex justify-between items-start mb-4", children: [_jsxs("div", { children: [_jsx("h3", { className: "text-lg font-semibold text-black mb-1", children: addon.name }), _jsxs("div", { className: "flex gap-2", children: [_jsx("span", { className: `text-xs px-2 py-1 rounded ${getTypeColor(addon.type)}`, children: addon.type }), _jsx("span", { className: `text-xs px-2 py-1 rounded ${getPlanBadge(addon.requiredPlan)}`, children: addon.requiredPlan })] })] }), isEnabled && (_jsx("span", { className: "text-xs bg-green-100 text-green-800 px-2 py-1 rounded", children: "Enabled" }))] }), _jsx("p", { className: "text-sm text-[#64748B] mb-4", children: addon.description }), !compatibility.isCompatible && (_jsx("div", { className: "mb-4 bg-amber-50 border border-amber-200 rounded p-3", children: _jsx("p", { className: "text-sm text-amber-900", children: compatibility.reasons.join(". ") }) })), _jsxs("div", { className: "mb-4", children: [_jsx("p", { className: "text-xs text-[#64748B] mb-2", children: "Compatible templates:" }), _jsxs("div", { className: "flex flex-wrap gap-1", children: [addon.compatibleTemplates.slice(0, 3).map((templateId, i) => (_jsx("span", { className: "text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded", children: templateId }, i))), addon.compatibleTemplates.length > 3 && (_jsxs("span", { className: "text-xs text-[#64748B]", children: ["+", addon.compatibleTemplates.length - 3, " more"] }))] })] }), _jsxs("div", { className: "flex gap-2", children: [onPreview && (_jsx(Button, { onClick: onPreview, className: "flex-1 text-sm text-black border border-gray-300 rounded px-4 py-2 hover:bg-gray-50", children: "Preview" })), compatibility.isCompatible && onEnable && !isEnabled && (_jsx(Button, { onClick: onEnable, className: "flex-1 text-sm bg-[#22C55E] hover:bg-[#16A34A] text-white rounded px-4 py-2 font-semibold", children: "Enable" })), compatibility.requiredPlanUpgrade && (_jsx(Link, { href: "/pricing", className: "flex-1", children: _jsxs(Button, { className: "w-full text-sm bg-blue-600 hover:bg-blue-700 text-white rounded px-4 py-2 font-semibold", children: ["Upgrade to ", compatibility.requiredPlanUpgrade] }) }))] })] }));
}
