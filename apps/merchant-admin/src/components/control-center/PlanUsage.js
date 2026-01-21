import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Button } from "@vayva/ui";
import { SubscriptionPlan } from "@vayva/shared";
export const PlanUsage = ({ usage, plan }) => {
    if (!usage)
        return _jsx("div", { className: "animate-pulse h-20 bg-gray-50 rounded-xl" });
    const UsageBar = ({ label, current, max, unit, }) => {
        const percent = Math.min((current / max) * 100, 100);
        return (_jsxs("div", { className: "mb-4 last:mb-0", children: [_jsxs("div", { className: "flex justify-between text-xs mb-1.5", children: [_jsx("span", { className: "font-bold text-gray-700", children: label }), _jsxs("span", { className: "text-gray-500", children: [current, " / ", max, " ", unit] })] }), _jsx("div", { className: "h-2 w-full bg-gray-100 rounded-full overflow-hidden", children: _jsx("div", { className: "h-full bg-black rounded-full transition-all duration-500", style: { width: `${percent}%` } }) })] }));
    };
    return (_jsxs("div", { className: "bg-gray-50 border border-gray-200 rounded-2xl p-6", children: [_jsxs("div", { className: "flex justify-between items-center mb-6", children: [_jsxs("div", { children: [_jsx("p", { className: "text-xs font-bold text-gray-500 uppercase tracking-wider mb-1", children: "Current Plan" }), _jsx("h3", { className: "text-xl font-bold text-gray-900", children: plan })] }), plan === SubscriptionPlan.STARTER && (_jsx(Button, { variant: "primary", size: "sm", className: "hover:scale-105", children: "Upgrade to Pro" }))] }), _jsxs("div", { className: "space-y-2", children: [_jsx(UsageBar, { label: "Products", current: usage.products, max: plan === "STARTER" ? 50 : 1000 }), _jsx(UsageBar, { label: "Monthly Orders", current: usage.orders, max: plan === "STARTER" ? 100 : 5000 }), _jsx(UsageBar, { label: "Monthly AI Messages", current: usage.whatsappMessages, max: plan === "STARTER" ? 500 : 10000 })] })] }));
};
