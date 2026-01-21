"use client";
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import React, { Suspense } from "react";
import { cn } from "@vayva/ui";
import { resolveLayout } from "@/lib/templates/layout-resolver";
export const TemplateMiniPreview = React.memo(({ layoutComponent, templateName, className, componentProps = {} }) => {
    const Component = resolveLayout(layoutComponent);
    if (!Component) {
        return (_jsx("div", { className: cn("w-full aspect-[16/9] bg-gray-100 flex items-center justify-center text-gray-400 text-xs", className), children: templateName }));
    }
    return (_jsxs("div", { className: cn("w-full aspect-[16/9] overflow-hidden relative bg-white select-none pointer-events-none", className), children: [_jsx(Suspense, { fallback: _jsxs("div", { className: "absolute inset-0 bg-gray-50 flex flex-col items-center justify-center gap-2 animate-pulse", children: [_jsx("div", { className: "w-10 h-10 bg-gray-200 rounded-full" }), _jsx("div", { className: "w-20 h-3 bg-gray-200 rounded" })] }), children: _jsx("div", { style: {
                        width: '400%',
                        height: '400%',
                        transform: 'scale(0.25)',
                        transformOrigin: 'top left',
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        zoom: 1 // For some legacy scale bugs
                    }, children: _jsx(Component, { storeName: templateName, storeSlug: "preview", ...componentProps }) }) }), _jsx("div", { className: "absolute inset-0 z-10" })] }));
});
TemplateMiniPreview.displayName = "TemplateMiniPreview";
