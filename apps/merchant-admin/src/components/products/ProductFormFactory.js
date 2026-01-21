"use client";
import { jsx as _jsx } from "react/jsx-runtime";
import { useAuth } from "@/context/AuthContext";
import { INDUSTRY_CONFIG } from "@/config/industry";
import { DynamicResourceForm } from "@/components/resources/DynamicResourceForm";
import { Button, EmptyState } from "@vayva/ui";
import Link from "next/link";
/**
 * UNIFIED RESOURCE FORM FACTORY
 * Replaces old static form switchers with dynamic config-driven forms.
 */
export function ProductFormFactory({ productId }) {
    const { merchant } = useAuth();
    const industrySlug = merchant?.industrySlug || "retail";
    const config = INDUSTRY_CONFIG[industrySlug];
    const mode = productId ? "edit" : "create";
    if (!config) {
        return (_jsx(EmptyState, { title: "Unknown Industry Config", description: `No configuration found for ${industrySlug}.`, action: _jsx(Link, { href: "/dashboard", children: _jsx(Button, { children: "Go Back" }) }) }));
    }
    // Default to the industry's primary object
    // If we want to support secondary objects (e.g. Retail creating a "Service" item), 
    // we would need props to specify 'objectType'. 
    // For now, adhering to strict industry primary object.
    return (_jsx(DynamicResourceForm, { primaryObject: config.primaryObject, mode: mode, initialData: productId ? { id: productId } : undefined }));
}
