"use client";
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { use } from "react";
import { AccountNav } from "@/components/account/AccountNav";
export default function AccountLayout({ children, params, }) {
    const { lang } = use(params);
    const locale = (lang === "tr" ? "tr" : "en");
    return (_jsx("div", { className: "min-h-screen bg-gray-50 py-12 md:py-20", children: _jsx("div", { className: "max-w-6xl mx-auto px-4 sm:px-6 lg:px-8", children: _jsxs("div", { className: "grid grid-cols-1 md:grid-cols-4 gap-8", children: [_jsx("aside", { className: "md:col-span-1", children: _jsx("div", { className: "bg-white rounded-2xl p-4 shadow-sm border border-gray-100 sticky top-24", children: _jsx(AccountNav, { lang: locale }) }) }), _jsx("main", { className: "md:col-span-3", children: children })] }) }) }));
}
