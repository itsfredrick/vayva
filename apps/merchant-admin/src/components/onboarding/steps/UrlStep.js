"use client";
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useOnboarding } from "../OnboardingContext";
import { Button, Input, Label } from "@vayva/ui";
import { useState } from "react";
export default function UrlStep() {
    const { nextStep, prevStep, updateData, state, isSaving } = useOnboarding();
    const [slug, setSlug] = useState(state.business?.slug || "");
    const handleContinue = () => {
        if (!slug)
            return;
        updateData({
            business: {
                ...state.business,
                slug
            }
        });
        nextStep();
    };
    return (_jsxs("div", { className: "space-y-6", children: [_jsxs("div", { className: "space-y-1", children: [_jsx("h2", { className: "text-2xl font-bold", children: "Store URL" }), _jsx("p", { className: "text-gray-500", children: "Choose a unique link for your store." })] }), _jsx("div", { className: "space-y-4", children: _jsxs("div", { className: "space-y-2", children: [_jsx(Label, { htmlFor: "slug", children: "Store Link" }), _jsxs("div", { className: "flex items-center", children: [_jsx("span", { className: "bg-gray-100 border border-r-0 rounded-l px-3 py-2 text-gray-500 text-sm", children: "vayva.shop/" }), _jsx(Input, { id: "slug", className: "rounded-l-none", placeholder: "my-store", value: slug, onChange: (e) => setSlug(e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, "")) })] }), _jsx("p", { className: "text-xs text-gray-400", children: "You can add a custom domain later." })] }) }), _jsxs("div", { className: "pt-4 flex gap-3", children: [_jsx(Button, { variant: "outline", onClick: prevStep, disabled: isSaving, children: "Back" }), _jsx(Button, { className: "flex-1", onClick: handleContinue, disabled: !slug || isSaving, children: "Continue" })] })] }));
}
