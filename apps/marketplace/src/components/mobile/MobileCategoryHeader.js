"use client";
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { usePathname, useRouter } from "next/navigation";
import { ChevronDown, SlidersHorizontal, ArrowLeft } from "lucide-react";
import { Button } from "@vayva/ui";
const CATEGORIES = [
    { label: "All", slug: "all" },
    { label: "Food", slug: "food" },
    { label: "Vehicles", slug: "vehicles" },
    { label: "Property", slug: "property" },
    { label: "Electronics", slug: "electronics" },
    { label: "Fashion", slug: "fashion" },
];
export function MobileCategoryHeader({ title, activeSubcategory = "All" }) {
    const router = useRouter();
    const pathname = usePathname();
    return (_jsxs("div", { className: "sticky top-0 z-40 bg-white border-b border-gray-100", children: [_jsxs("div", { className: "flex items-center justify-between px-4 h-14", children: [_jsx(Button, { onClick: () => router.back(), variant: "ghost", size: "icon", className: "-ml-2 rounded-full", "aria-label": "Go back", title: "Go back", children: _jsx(ArrowLeft, { className: "h-5 w-5" }) }), _jsxs("div", { className: "font-bold text-lg flex items-center gap-1", children: [title, _jsx(ChevronDown, { className: "h-4 w-4 text-gray-400" })] }), _jsx(Button, { variant: "ghost", size: "icon", className: "-mr-2 rounded-full", "aria-label": "Filter", title: "Filter", children: _jsx(SlidersHorizontal, { className: "h-5 w-5" }) })] }), _jsx("div", { className: "flex gap-2 px-4 pb-3 overflow-x-auto no-scrollbar", children: CATEGORIES.map((cat) => (_jsx(Button, { onClick: () => router.push(`/category/${cat.slug}`), variant: pathname.includes(cat.slug) || (title.toLowerCase() === cat.label.toLowerCase()) ? "primary" : "secondary", size: "sm", className: "rounded-full text-xs whitespace-nowrap", children: cat.label }, cat.slug))) })] }));
}
