"use client";
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
const TABS = [
    { label: "Delivery", href: "/settings/store/delivery" },
    { label: "Pickup Locations", href: "/settings/store/pickup" },
];
export default function StoreSettingsLayout({ children }) {
    const pathname = usePathname();
    return (_jsxs("div", { className: "flex flex-col gap-6", children: [_jsx("div", { className: "flex items-center gap-4 border-b", children: TABS.map((tab) => {
                    const isActive = pathname === tab.href;
                    return (_jsx(Link, { href: tab.href, className: cn("pb-2 border-b-2 text-sm font-medium transition-colors hover:text-primary", isActive ? "border-primary text-primary" : "border-transparent text-muted-foreground"), children: tab.label }, tab.href));
                }) }), children] }));
}
