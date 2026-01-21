"use client";
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { Button } from "@vayva/ui";
import { LayoutDashboard, Users, ShieldAlert, Scale, Receipt, AlertTriangle, MessageSquare, LogOut, ChevronLeft, ChevronRight, Terminal, DollarSign, BadgeCheck, Star, Package, Shield, } from "lucide-react";
const MENU_ITEMS = [
    {
        header: "Overview", items: [
            { label: "Dashboard", href: "/ops", icon: LayoutDashboard },
            { label: "System Health", href: "/ops/health", icon: ShieldAlert },
        ]
    },
    {
        header: "Operations", items: [
            { label: "Orders & Payments", href: "/ops/orders", icon: Receipt },
            { label: "Deliveries", href: "/ops/deliveries", icon: AlertTriangle },
            { label: "Webhooks", href: "/ops/webhooks", icon: Scale },
        ]
    },
    {
        header: "Merchants", items: [
            { label: "Merchants", href: "/ops/merchants", icon: Users },
            { label: "KYC Queue", href: "/ops/kyc", icon: BadgeCheck },
        ]
    },
    {
        header: "Sourcing", items: [
            { label: "Aggregation Partners", href: "/ops/china/suppliers", icon: Users },
            { label: "China Catalog", href: "/ops/china/catalog", icon: Terminal },
            { label: "Sourcing Queue", href: "/ops/china/sourcing", icon: MessageSquare },
            { label: "Import Orders", href: "/ops/china/orders", icon: Package },
            { label: "Escrow Oversight", href: "/ops/china/escrow", icon: Shield },
            { label: "Dispute Center", href: "/ops/china/disputes", icon: AlertTriangle },
            { label: "Scoreboard", href: "/ops/china/suppliers/scoreboard", icon: Star },
        ]
    },
    {
        header: "Support", items: [
            { label: "Inbox", href: "/ops/inbox", icon: MessageSquare },
        ]
    },
    {
        header: "Governance", items: [
            { label: "Audit Log", href: "/ops/audit", icon: ShieldAlert },
            { label: "Disputes", href: "/ops/disputes", icon: DollarSign },
            { label: "Security", href: "/ops/security", icon: ShieldAlert },
        ]
    },
    {
        header: "Rescue", items: [
            { label: "Rescue Console", href: "/ops/rescue", icon: AlertTriangle },
        ]
    },
    {
        header: "Admin", items: [
            { label: "Team", href: "/ops/users", icon: Users },
            { label: "System Tools", href: "/ops/tools", icon: Terminal },
        ]
    },
];
export function OpsSidebar({ isCollapsed, onToggle }) {
    const pathname = usePathname();
    return (_jsxs("div", { className: `${isCollapsed ? "w-20" : "w-64"} bg-white border-r border-gray-200 h-screen flex flex-col fixed left-0 top-0 z-50 transition-all duration-300`, children: [_jsxs("div", { className: "h-16 flex items-center justify-between px-6 border-b border-gray-100", children: [!isCollapsed && (_jsxs("div", { className: "flex items-center gap-3 px-2", children: [_jsx(Image, { src: "/vayva-logo.png", alt: "Vayva Ops", width: 28, height: 28, className: "rounded-md object-contain" }), _jsxs("div", { className: "flex flex-col leading-none", children: [_jsx("span", { className: "font-bold text-sm tracking-tight text-gray-900", children: "Vayva Ops" }), _jsx("span", { className: "text-[10px] font-bold text-white bg-black px-1.5 py-0.5 rounded w-fit mt-0.5", children: "ADMIN" })] })] })), _jsx(Button, { onClick: onToggle, variant: "ghost", size: "icon", className: `rounded-lg border border-gray-100 hover:bg-gray-50 text-gray-400 hover:text-gray-600 transition-colors ${isCollapsed ? "mx-auto" : ""}`, "aria-label": isCollapsed ? "Expand sidebar" : "Collapse sidebar", children: isCollapsed ? _jsx(ChevronRight, { size: 16 }) : _jsx(ChevronLeft, { size: 16 }) })] }), _jsx("nav", { className: "flex-1 overflow-y-auto p-4 space-y-6", children: MENU_ITEMS.map((section, idx) => (_jsxs("div", { children: [!isCollapsed && (_jsx("div", { className: "text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2 px-3 whitespace-nowrap", children: section.header })), _jsx("div", { className: "space-y-1", children: section.items.map((item) => {
                                const isActive = pathname === item.href ||
                                    (item.href !== "/ops" && pathname.startsWith(item.href));
                                const Icon = item.icon;
                                return (_jsxs(Link, { href: item.href, title: isCollapsed ? item.label : "", className: `flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${isActive
                                        ? "bg-black text-white"
                                        : "text-gray-600 hover:bg-gray-50 hover:text-black"} ${isCollapsed ? "justify-center px-0" : ""}`, children: [_jsx(Icon, { size: 18, className: "shrink-0" }), !isCollapsed && _jsx("span", { className: "whitespace-nowrap", children: item.label })] }, item.href));
                            }) })] }, idx))) }), _jsx("div", { className: "p-4 border-t border-gray-100", children: _jsxs(Link, { href: "/api/ops/auth/signout", title: isCollapsed ? "Sign Out" : "", className: `flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium text-red-600 hover:bg-red-50 transition-colors ${isCollapsed ? "justify-center px-0" : ""}`, children: [_jsx(LogOut, { size: 18, className: "shrink-0" }), !isCollapsed && _jsx("span", { children: "Sign Out" })] }) })] }));
}
