"use client";
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useUserPlan } from "../../../../hooks/useUserPlan";
import { PLANS } from "../../../../lib/billing/plans";
import { Card } from "@vayva/ui";
export default function ReportsPage() {
    const { plan, isLoading } = useUserPlan();
    if (isLoading)
        return _jsx("div", { className: "p-8", children: "Loading reports..." });
    const currentPlan = PLANS[plan?.slug || "free"];
    const canViewReports = currentPlan?.features.reports;
    if (!canViewReports) {
        return (_jsx("div", { className: "p-8", children: _jsxs(Card, { className: "p-6", children: [_jsx("h2", { className: "text-xl font-bold mb-4", children: "Upgrade Required" }), _jsx("p", { children: "You need to be on the Pro plan to view reports." })] }) }));
    }
    return (_jsxs("div", { className: "flex-1 space-y-4 p-8 pt-6", children: [_jsx("div", { className: "flex items-center justify-between space-y-2", children: _jsx("h2", { className: "text-3xl font-bold tracking-tight", children: "Reports" }) }), _jsxs("div", { className: "grid gap-4 md:grid-cols-2 lg:grid-cols-7", children: [_jsxs(Card, { className: "col-span-4 p-6", children: [_jsx("h3", { className: "text-lg font-bold mb-4", children: "Overview" }), _jsx("div", { className: "pl-2", children: _jsx("div", { className: "h-[200px] flex items-center justify-center bg-gray-50 rounded-md", children: "Chart Placeholder" }) })] }), _jsxs(Card, { className: "col-span-3 p-6", children: [_jsx("h3", { className: "text-lg font-bold mb-4", children: "Date Range" }), _jsx("div", { children: _jsx("input", { type: "date", className: "w-full p-2 border rounded" }) })] })] })] }));
}
