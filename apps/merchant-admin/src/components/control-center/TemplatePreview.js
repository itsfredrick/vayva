"use client";
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from "react";
import { Icon, cn, Button } from "@vayva/ui";
export const TemplatePreview = ({ template, onClose, onUse, userPlan, }) => {
    const [viewMode, setViewMode] = useState("desktop");
    const [loading, setLoading] = useState(true);
    // Determine lock state
    const planLevels = ["starter", "growth", "pro"];
    const userLevelIndex = planLevels.indexOf(userPlan);
    const requiredLevelIndex = planLevels.indexOf(template.tier || template.planLevel);
    const isLocked = requiredLevelIndex > userLevelIndex;
    // Point to internal renderer page
    const iframeSrc = `/preview/${template.id}?mode=${viewMode}`;
    return (_jsxs("div", { className: "fixed inset-0 z-50 bg-gray-900/95 backdrop-blur-sm flex flex-col animate-in fade-in duration-200", children: [_jsxs("div", { className: "h-16 bg-white border-b border-gray-200 flex items-center justify-between px-6 shadow-sm z-10", children: [_jsxs("div", { className: "flex items-center gap-4", children: [_jsx(Button, { onClick: onClose, className: "p-2 hover:bg-gray-100", children: _jsx(Icon, { name: "X", size: 20 }) }), _jsxs("div", { children: [_jsx("h2", { className: "font-bold text-gray-900 text-lg leading-none", children: template.name }), _jsxs("span", { className: "text-xs text-gray-500", children: ["v", template.currentVersion, " \u2022 by ", template.author] })] })] }), _jsxs("div", { className: "flex items-center gap-2 bg-gray-100 p-1 rounded-xl", children: [_jsx(Button, { onClick: () => setViewMode("desktop"), className: cn("p-2 rounded-lg transition-all", viewMode === "desktop"
                                    ? "bg-white text-black shadow-sm"
                                    : "text-gray-400 hover:text-gray-600"), children: _jsx(Icon, { name: "Monitor", size: 20 }) }), _jsx(Button, { onClick: () => setViewMode("mobile"), className: cn("p-2 rounded-lg transition-all", viewMode === "mobile"
                                    ? "bg-white text-black shadow-sm"
                                    : "text-gray-400 hover:text-gray-600"), children: _jsx(Icon, { name: "Smartphone", size: 20 }) })] }), _jsx("div", { className: "flex items-center gap-3", children: isLocked ? (_jsxs("div", { className: "flex items-center gap-2 text-sm font-bold text-gray-500 bg-gray-100 px-3 py-1.5 rounded-lg", children: [_jsx(Icon, { name: "Lock", size: 14 }), " Available on", " ", template.tier || template.planLevel] })) : (_jsx(Button, { onClick: () => onUse(template), variant: "primary", className: "px-6 py-2.5 text-sm shadow-lg", children: "Use Template" })) })] }), _jsxs("div", { className: "flex-1 bg-gray-100 overflow-hidden flex items-center justify-center relative", children: [loading && (_jsx("div", { className: "absolute inset-0 flex items-center justify-center", children: _jsx("div", { className: "animate-spin rounded-full h-12 w-12 border-b-2 border-black" }) })), _jsx("div", { className: cn("transition-all duration-500 ease-in-out bg-white shadow-2xl overflow-hidden", viewMode === "mobile"
                            ? "w-[375px] h-[812px] rounded-[40px] border-[8px] border-gray-900"
                            : "w-full h-full"), children: _jsx("iframe", { src: iframeSrc, className: "w-full h-full border-0", title: "Template Preview", onLoad: () => setLoading(false) }) })] })] }));
};
