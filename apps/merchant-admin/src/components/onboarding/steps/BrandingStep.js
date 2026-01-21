"use client";
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useOnboarding } from "../OnboardingContext";
import { Button, Icon, cn, Label } from "@vayva/ui";
import { useState } from "react";
const VAYVA_PALETTE = [
    { name: "Emerald", hex: "#10B981" },
    { name: "Sapphire", hex: "#3B82F6" },
    { name: "Violet", hex: "#8B5CF6" },
    { name: "Rose", hex: "#F43F5E" },
    { name: "Amber", hex: "#F59E0B" },
    { name: "Ink", hex: "#000000" },
];
export default function BrandingStep() {
    const { nextStep, prevStep, updateData, state, isSaving } = useOnboarding();
    const [brandColor, setBrandColor] = useState(state.branding?.brandColor || "#10B981");
    const handleContinue = () => {
        updateData({
            branding: {
                ...state.branding,
                brandColor
            }
        });
        nextStep();
    };
    return (_jsxs("div", { className: "space-y-8 animate-in fade-in slide-in-from-right-4 duration-500", style: { "--brand-color": brandColor }, children: [_jsxs("div", { className: "space-y-1", children: [_jsx("h2", { className: "text-2xl font-black text-black", children: "Your Brand Identity" }), _jsx("p", { className: "text-gray-500", children: "Express your brand through colors and style." })] }), _jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-8", children: [_jsxs("div", { className: "space-y-6", children: [_jsxs("div", { className: "space-y-3", children: [_jsx(Label, { children: "Select Primary Brand Color" }), _jsx("div", { className: "grid grid-cols-3 gap-3", children: VAYVA_PALETTE.map((color) => (_jsxs(Button, { variant: "ghost", onClick: () => setBrandColor(color.hex), className: cn("h-12 w-full rounded-xl border-2 transition-all p-0 flex items-center justify-center relative overflow-hidden", brandColor === color.hex
                                                ? "border-black scale-105 shadow-sm ring-2 ring-black/5"
                                                : "border-gray-100 hover:border-gray-200"), title: color.name, children: [_jsx("div", { className: cn("absolute inset-1 rounded-lg shadow-inner"), style: { backgroundColor: color.hex } }), brandColor === color.hex && (_jsx(Icon, { name: "Check", className: "relative text-white h-4 w-4 drop-shadow-md" }))] }, color.hex))) })] }), _jsxs("div", { className: "space-y-3", children: [_jsx(Label, { children: "Custom Color" }), _jsxs("div", { className: "flex gap-4 items-center p-3 border border-gray-100 rounded-xl bg-gray-50/50", children: [_jsx("input", { type: "color", "aria-label": "Brand Color", value: brandColor, onChange: (e) => setBrandColor(e.target.value), className: "h-10 w-10 border-0 rounded-lg cursor-pointer bg-transparent" }), _jsx("span", { className: "text-sm font-mono font-medium text-gray-600 uppercase", children: brandColor })] })] })] }), _jsxs("div", { className: "space-y-3", children: [_jsx(Label, { children: "Store Preview" }), _jsxs("div", { className: "aspect-square rounded-3xl border border-gray-100 bg-white shadow-2xl p-6 flex flex-col items-center justify-center text-center space-y-4 relative overflow-hidden group", children: [_jsx("div", { className: "absolute top-0 left-0 w-full h-2 bg-[var(--brand-color)]" }), _jsx("div", { className: "w-16 h-16 rounded-2xl flex items-center justify-center mb-2 shadow-lg transition-transform group-hover:rotate-6 bg-[var(--brand-color)]/20 text-[var(--brand-color)]", children: _jsx(Icon, { name: "Store", size: 32 }) }), _jsx("h4", { className: "font-black text-xl text-gray-900", children: state.business?.storeName || "Your Store" }), _jsxs("div", { className: "space-y-2 w-full max-w-[140px]", children: [_jsx("div", { className: "h-2 w-full bg-gray-50 rounded-full" }), _jsx("div", { className: "h-2 w-2/3 bg-gray-50 rounded-full mx-auto" })] }), _jsx(Button, { size: "sm", className: "w-full mt-4 h-9 shadow-lg text-white font-bold bg-[var(--brand-color)]", children: "Visit Store" })] })] })] }), _jsxs("div", { className: "pt-4 flex gap-3 border-t border-gray-100", children: [_jsx(Button, { variant: "outline", className: "px-8 h-12", onClick: prevStep, disabled: isSaving, children: "Back" }), _jsx(Button, { className: "flex-1 h-12 bg-vayva-green text-white hover:bg-vayva-green/90 shadow-xl shadow-green-500/20 font-bold", onClick: handleContinue, disabled: isSaving, children: "Confirm & Finish" })] })] }));
}
