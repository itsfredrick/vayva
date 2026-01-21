"use client";
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useOnboarding } from "../OnboardingContext";
import { Button, Input, Label } from "@vayva/ui";
import { useState } from "react";
export default function BusinessStep() {
    const { nextStep, prevStep, updateData, state, isSaving } = useOnboarding();
    const [storeName, setStoreName] = useState(state.business?.storeName || "");
    const [phone, setPhone] = useState(state.business?.phone || "");
    const handleContinue = () => {
        if (!storeName || !phone)
            return;
        updateData({
            business: {
                ...state.business, // Force unwrapping is risky usually but we init emptiness
                storeName,
                phone,
                // Defaults
                name: storeName,
                slug: state.business?.slug || storeName.toLowerCase().replace(/[^a-z0-9]/g, "-"),
                country: "NG",
                state: state.business?.state || "Lagos",
                city: state.business?.city || "Lagos",
                email: state.business?.email || "",
                businessRegistrationType: "individual"
            }
        });
        nextStep();
    };
    return (_jsxs("div", { className: "space-y-6", children: [_jsxs("div", { className: "space-y-1", children: [_jsx("h2", { className: "text-2xl font-bold", children: "Business Basics" }), _jsx("p", { className: "text-gray-500", children: "Tell us about your store." })] }), _jsxs("div", { className: "space-y-4", children: [_jsxs("div", { className: "space-y-2", children: [_jsx(Label, { htmlFor: "storeName", children: "Store Name" }), _jsx(Input, { id: "storeName", placeholder: "e.g. Adeola's Fashion", value: storeName, onChange: (e) => setStoreName(e.target.value) })] }), _jsxs("div", { className: "space-y-2", children: [_jsx(Label, { htmlFor: "phone", children: "Business Phone Number" }), _jsx(Input, { id: "phone", placeholder: "e.g. 08012345678", value: phone, onChange: (e) => setPhone(e.target.value) })] })] }), _jsxs("div", { className: "pt-4 flex gap-3", children: [_jsx(Button, { variant: "outline", onClick: prevStep, disabled: isSaving, children: "Back" }), _jsx(Button, { className: "flex-1", onClick: handleContinue, disabled: !storeName || !phone || isSaving, children: "Continue" })] })] }));
}
