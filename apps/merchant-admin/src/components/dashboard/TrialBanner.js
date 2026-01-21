"use client";
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Button } from "@vayva/ui";
import { AlertTriangle, ArrowRight } from "lucide-react";
import Link from "next/link";
export function TrialBanner() {
    return (_jsx("div", { className: "bg-indigo-600 text-white px-4 py-3 shadow-md relative z-50", children: _jsxs("div", { className: "container mx-auto flex flex-col md:flex-row items-center justify-between gap-4", children: [_jsxs("div", { className: "flex items-center gap-3", children: [_jsx("span", { className: "bg-white/20 p-1.5 rounded-full", children: _jsx(AlertTriangle, { className: "w-4 h-4 text-indigo-100" }) }), _jsxs("div", { children: [_jsx("p", { className: "font-semibold text-sm", children: "You are in Trial Mode" }), _jsx("p", { className: "text-xs text-indigo-100 hidden md:block", children: "Store is active but payments are disabled until you complete verification." })] })] }), _jsx(Link, { href: "/onboarding", children: _jsxs(Button, { size: "sm", variant: "secondary", className: "whitespace-nowrap font-medium text-xs h-8", children: ["Complete Setup ", _jsx(ArrowRight, { className: "ml-2 w-3 h-3" })] }) })] }) }));
}
