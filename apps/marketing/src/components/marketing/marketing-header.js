"use client";
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from "react";
import Link from "next/link";
import { Button } from "@vayva/ui";
import { APP_URL } from "@/lib/constants";
import { useUserPlan } from "@/hooks/useUserPlan";
import { Logo } from "@/components/Logo";
import { Menu, X } from "lucide-react";
const NAV_LINKS = [
    { href: "/how-vayva-works", label: "How it Works" },
    { href: "/pricing", label: "Pricing" },
    { href: "/blog", label: "Blog" },
    { href: "/help", label: "Help" },
];
export function MarketingHeader() {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    return (_jsxs("header", { className: "sticky top-0 z-50 bg-white border-b border-[#E5E7EB]", children: [_jsxs("div", { className: "max-w-7xl mx-auto px-4 lg:px-6 h-20 flex items-center justify-between", children: [_jsx(Logo, { href: "/", size: "sm", showText: true }), _jsx("nav", { className: "hidden lg:flex items-center gap-8", children: NAV_LINKS.map((link) => (_jsxs(Link, { href: link.href, className: "text-[#0F172A] hover:text-[#22C55E] transition-colors font-medium flex items-center gap-1", children: [link.label, link.label === "Help" && (_jsx("span", { className: "w-2 h-2 bg-[#22C55E] rounded-full animate-pulse-green", "aria-label": "New: Ask Vayva AI available in Help", title: "New AI Assistant" }))] }, link.href))) }), _jsxs("div", { className: "flex items-center gap-4", children: [_jsx("div", { className: "hidden sm:block", children: _jsx(HeaderActions, {}) }), _jsx(Button, { className: "lg:hidden p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors", onClick: () => setMobileMenuOpen(!mobileMenuOpen), children: mobileMenuOpen ? _jsx(X, { size: 24 }) : _jsx(Menu, { size: 24 }) })] })] }), mobileMenuOpen && (_jsxs("div", { className: "lg:hidden absolute top-full left-0 w-full bg-white border-b border-gray-200 shadow-xl py-6 px-4 flex flex-col gap-4 animate-in slide-in-from-top-2 duration-200", children: [_jsx("nav", { className: "flex flex-col gap-2", children: NAV_LINKS.map((link) => (_jsxs(Link, { href: link.href, onClick: () => setMobileMenuOpen(false), className: "text-[#0F172A] hover:text-[#22C55E] hover:bg-gray-50 px-4 py-3 rounded-xl transition-all font-bold text-lg flex items-center justify-between group", children: [link.label, link.label === "Help" && (_jsx("span", { className: "text-[10px] bg-green-100 text-green-700 px-2 py-0.5 rounded-full uppercase tracking-wide", children: "New" })), _jsx("span", { className: "text-gray-300 group-hover:text-[#22C55E]", children: "\u2192" })] }, link.href))) }), _jsx("div", { className: "h-px bg-gray-100 my-2" }), _jsx("div", { className: "flex flex-col gap-3 px-2", children: _jsx("div", { className: "flex justify-center w-full", onClick: () => setMobileMenuOpen(false), children: _jsx(HeaderActions, {}) }) })] }))] }));
}
function HeaderActions() {
    const { isAuthenticated, loading } = useUserPlan();
    if (loading) {
        return (_jsxs("div", { className: "flex items-center gap-4 animate-pulse", children: [_jsx("div", { className: "h-10 w-20 bg-gray-100 rounded-lg hidden sm:block" }), _jsx("div", { className: "h-10 w-32 bg-gray-100 rounded-lg" })] }));
    }
    if (isAuthenticated) {
        return (_jsx("a", { href: `${APP_URL}/dashboard`, className: "w-full sm:w-auto", children: _jsx(Button, { className: "w-full sm:w-auto bg-[#22C55E] hover:bg-[#16A34A] text-white font-medium", children: "Go to Dashboard" }) }));
    }
    return (_jsxs("div", { className: "flex w-full sm:w-auto items-center gap-3", children: [_jsx("a", { href: `${APP_URL}/signin`, className: "flex-1 sm:flex-none", children: _jsx(Button, { variant: "ghost", className: "w-full sm:w-auto text-[#0F172A] border border-gray-200 sm:border-transparent", children: "Login" }) }), _jsx("a", { href: `${APP_URL}/signup`, className: "flex-1 sm:flex-none", children: _jsx(Button, { className: "w-full sm:w-auto bg-[#22C55E] hover:bg-[#16A34A] text-white shadow-lg shadow-green-100", children: "Get Started" }) })] }));
}
