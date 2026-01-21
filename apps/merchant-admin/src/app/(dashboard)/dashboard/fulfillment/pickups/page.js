"use client";
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from "react";
import { Button } from "@vayva/ui";
import { PackageCheck } from "lucide-react";
export default function PickupsPage() {
    const [activeTab, setActiveTab] = useState("READY");
    return (_jsxs("div", { className: "space-y-6", children: [_jsx("div", { className: "flex items-center justify-between", children: _jsxs("div", { children: [_jsx("h1", { className: "text-2xl font-bold tracking-tight text-slate-900", children: "Pickups" }), _jsx("p", { className: "text-slate-500", children: "Manage orders waiting for customer collection." })] }) }), _jsxs("div", { className: "flex items-center gap-4 border-b border-slate-200", children: [_jsx(Tab, { label: "Ready for Pickup", active: activeTab === "READY", onClick: () => setActiveTab("READY"), count: 0 }), _jsx(Tab, { label: "Completed", active: activeTab === "COMPLETED", onClick: () => setActiveTab("COMPLETED") }), _jsx(Tab, { label: "Cancelled", active: activeTab === "CANCELLED", onClick: () => setActiveTab("CANCELLED") })] }), _jsxs("div", { className: "bg-white rounded-xl shadow-sm border border-slate-200 min-h-[300px] flex flex-col items-center justify-center p-12 text-center", children: [_jsx("div", { className: "h-16 w-16 bg-slate-50 rounded-full flex items-center justify-center mb-4", children: _jsx(PackageCheck, { className: "h-8 w-8 text-slate-300" }) }), _jsx("h3", { className: "text-lg font-medium text-slate-900 mb-1", children: "No pickups found" }), _jsx("p", { className: "text-slate-500 max-w-sm mx-auto", children: activeTab === "READY"
                            ? "There are no orders currently waiting for pickup. New pickup orders will appear here."
                            : `No ${activeTab.toLowerCase()} pickup orders found.` })] })] }));
}
function Tab({ label, active, onClick, count }) {
    return (_jsxs(Button, { onClick: onClick, className: `pb-3 px-1 text-sm font-medium border-b-2 transition-colors flex items-center gap-2 ${active
            ? "border-indigo-600 text-indigo-600"
            : "border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300"}`, children: [label, count !== undefined && (_jsx("span", { className: `px-1.5 py-0.5 rounded-full text-[10px] ${active ? "bg-indigo-100 text-indigo-700" : "bg-slate-100 text-slate-600"}`, children: count }))] }));
}
