"use client";
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useOnboarding } from "../OnboardingContext";
import { Button, Input, Label, Icon } from "@vayva/ui";
import { useState } from "react";
export default function IdentityStep() {
    const { nextStep, updateData, state, isSaving } = useOnboarding();
    const [name, setName] = useState(state.identity?.fullName || "");
    const [phone, setPhone] = useState(state.identity?.phone || "");
    const handleContinue = () => {
        if (!name || !phone)
            return;
        updateData({
            identity: {
                ...state.identity,
                fullName: name,
                phone: phone
            }
        });
        nextStep();
    };
    return (_jsxs("div", { className: "space-y-8 animate-in fade-in slide-in-from-right-4 duration-500", children: [_jsxs("div", { className: "space-y-2", children: [_jsx("div", { className: "w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center mb-4", children: _jsx(Icon, { name: "User", className: "text-primary", size: 24 }) }), _jsx("h2", { className: "text-2xl font-black text-black", children: "Account Identity" }), _jsx("p", { className: "text-gray-500 text-lg", children: "Help us secure your account and verify your business." })] }), _jsxs("div", { className: "space-y-6", children: [_jsxs("div", { className: "space-y-2", children: [_jsx(Label, { htmlFor: "fullName", children: "Full Name" }), _jsx(Input, { id: "fullName", placeholder: "e.g. Adeola Johnson", value: name, onChange: (e) => setName(e.target.value), className: "h-12" })] }), _jsxs("div", { className: "space-y-2", children: [_jsx(Label, { htmlFor: "phone", children: "Phone Number" }), _jsxs("div", { className: "relative", children: [_jsx("div", { className: "absolute left-4 top-1/2 -translate-y-1/2 flex items-center gap-2 pr-3 border-r border-gray-100", children: _jsx("span", { className: "text-sm font-bold text-gray-500", children: "+234" }) }), _jsx(Input, { id: "phone", placeholder: "801 234 5678", value: phone, onChange: (e) => setPhone(e.target.value), className: "h-12 pl-16 font-medium" })] })] })] }), _jsx("div", { className: "pt-6", children: _jsx(Button, { className: "w-full h-12 shadow-xl shadow-primary/10", onClick: handleContinue, disabled: !name || !phone || isSaving, children: "Continue to Business Setup" }) })] }));
}
