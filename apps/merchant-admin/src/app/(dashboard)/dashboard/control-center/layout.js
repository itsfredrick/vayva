"use client";
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { DashboardHeader } from "@/components/dashboard/dashboard-header";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Link from "next/link";
export default function ControlCenterLayout({ children }) {
    return (_jsxs("div", { className: "flex flex-col h-full space-y-6", children: [_jsx(DashboardHeader, { heading: "Control Center", text: "Manage your storefront appearance and configuration.", action: _jsx("div", {}) }), _jsx("div", { className: "px-6", children: _jsx(Tabs, { value: "templates", className: "w-full", children: _jsx(TabsList, { children: _jsx(Link, { href: "/dashboard/control-center", children: _jsx(TabsTrigger, { value: "templates", children: "Templates" }) }) }) }) }), _jsx("div", { className: "flex-1 px-6 pb-6", children: children })] }));
}
