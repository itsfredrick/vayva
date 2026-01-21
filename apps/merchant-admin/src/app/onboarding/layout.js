"use client";
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { OnboardingProvider } from "@/components/onboarding/OnboardingContext";
import { Toaster } from "sonner";
export default function OnboardingLayout({ children, }) {
    return (_jsx(OnboardingProvider, { children: _jsxs("div", { className: "min-h-screen bg-gray-50 flex flex-col", children: [_jsxs("header", { className: "bg-white border-b px-6 py-4 flex items-center justify-between sticky top-0 z-10", children: [_jsxs("div", { className: "flex items-center gap-2", children: [_jsx("div", { className: "bg-black text-white p-1 rounded font-bold text-lg tracking-tighter", children: "V." }), _jsx("span", { className: "font-semibold text-gray-900", children: "Vayva Platform" })] }), _jsx("div", { className: "text-sm text-gray-500", children: "Store Setup" })] }), _jsx("main", { className: "flex-1 flex flex-col items-center justify-center p-6 md:p-12", children: _jsx("div", { className: "w-full max-w-2xl", children: children }) }), _jsx(Toaster, { position: "bottom-right" })] }) }));
}
