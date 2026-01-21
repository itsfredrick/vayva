"use client";
import { jsx as _jsx } from "react/jsx-runtime";
import React from "react";
import { SimpleRetailTemplate } from "@/components/templates/retail/SimpleRetail";
export function TemplateRenderer({ templateId, config, storeName, isDemo, }) {
    // 1. Resolve Template
    // In a real app, this Registry might be larger or dynamically imported.
    // For V1, we map the canonical IDs to the Components we have.
    let Component = SimpleRetailTemplate; // Default
    switch (templateId) {
        case "simple-retail":
        case "vayva_light_glass_store_v1": // Handle legacy ID mapping if needed
            Component = SimpleRetailTemplate;
            break;
        // Add other cases as you build them:
        // case 'perfume-luxury': Component = PerfumeLuxuryTemplate; break;
        default:
            // Fallback or Error component
            console.warn(`Template ID ${templateId} not found, using SimpleRetail.`);
            Component = SimpleRetailTemplate;
    }
    // 2. Normalize Config
    // The component expects certain props. We map the raw JSON config into them.
    // Ideally, the components themselves should accept the raw config object prop.
    // For now, we pass basic props.
    return (_jsx(React.Suspense, { fallback: _jsx("div", { className: "h-screen w-full flex items-center justify-center", children: "Loading Store..." }), children: _jsx(Component, { businessName: storeName, demoMode: isDemo }) }));
}
