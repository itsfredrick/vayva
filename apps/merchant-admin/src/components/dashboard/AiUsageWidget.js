"use client";
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect, useState } from "react";
import { Button, Icon, cn } from "@vayva/ui";
export const AiUsageWidget = () => {
    const [usage, setUsage] = useState(null);
    const [loading, setLoading] = useState(true);
    useEffect(() => {
        fetch("/api/ai/usage")
            .then((res) => res.json())
            .then((res) => {
            if (res.success) {
                setUsage(res.data.current);
            }
            setLoading(false);
        })
            .catch(() => setLoading(false));
    }, []);
    if (loading)
        return _jsx("div", { className: "h-32 bg-gray-50 animate-pulse rounded-xl" });
    if (!usage)
        return null;
    const percentage = Math.min(Math.round((usage.messagesUsed / usage.messageLimit) * 100), 100);
    const isCritical = percentage > 80;
    const isTrial = usage.planKey === "STARTER";
    return (_jsxs("div", { className: "bg-white border border-gray-100 rounded-xl p-6 shadow-sm", children: [_jsxs("div", { className: "flex justify-between items-center mb-4", children: [_jsxs("div", { className: "flex items-center gap-2", children: [_jsx("div", { className: "w-8 h-8 bg-green-50 text-green-600 rounded-lg flex items-center justify-center", children: _jsx(Icon, { name: "Zap", size: 16 }) }), _jsxs("div", { children: [_jsx("h3", { className: "font-bold text-black text-sm", children: "AI Messages" }), _jsx("p", { className: "text-[10px] text-gray-500 uppercase tracking-wider font-medium", children: isTrial ? "Free Trial Allocation" : `${usage.planKey} Plan` })] })] }), usage.isOverLimit ? (_jsx("span", { className: "bg-red-100 text-red-700 text-[10px] font-bold px-2 py-0.5 rounded-full", children: "LIMIT EXCEEDED" })) : isCritical ? (_jsx("span", { className: "bg-orange-100 text-orange-700 text-[10px] font-bold px-2 py-0.5 rounded-full", children: "NEAR LIMIT" })) : (_jsx("span", { className: "bg-green-100 text-green-700 text-[10px] font-bold px-2 py-0.5 rounded-full", children: "HEALTHY" }))] }), _jsxs("div", { className: "space-y-4", children: [_jsxs("div", { children: [_jsxs("div", { className: "flex justify-between text-xs mb-1.5", children: [_jsx("span", { className: "text-gray-600 font-medium", children: "Messages Used" }), _jsxs("span", { className: cn("font-bold", isCritical ? "text-orange-600" : "text-black"), children: [usage.messagesUsed, " / ", usage.messageLimit] })] }), _jsx("div", { className: "h-2 bg-gray-100 rounded-full overflow-hidden", children: _jsx("div", { className: cn("h-full transition-all duration-500", usage.isOverLimit
                                        ? "bg-red-500"
                                        : isCritical
                                            ? "bg-orange-600"
                                            : "bg-green-600"), style: { width: `${percentage}%` } }) })] }), _jsx("div", { className: "bg-gray-50 p-3 rounded-lg border border-dashed border-gray-200", children: _jsx("p", { className: "text-[11px] text-black font-medium leading-relaxed", children: isTrial
                                ? usage.isOverLimit
                                    ? "Trial complete! Your AI Assistant has handled its first 20 customers beautifully. To keep selling on autopilot, upgrade to a Growth plan today."
                                    : isCritical
                                        ? `You're getting popular! You’ve used ${usage.messagesUsed} of your 20 trial messages. Upgrade to Growth now to keep the conversation going without interruption.`
                                        : usage.messagesUsed === 0
                                            ? "Welcome to the future of sales! Your Vayva Assistant is ready to work. You have 20 free messages to see the magic in action. No credit card required."
                                            : "Your Vayva Assistant is live and selling. Upgrade to Growth for 2,000 monthly messages and Vision support."
                                : isCritical
                                    ? "You're nearing your monthly message limit. Buy a ₦5,000 extra pack to ensure uninterrupted service."
                                    : `Your ${usage.planKey} plan is healthy. Remaining messages reset in 12 days.` }) }), _jsxs("div", { className: "flex flex-col gap-2", children: [(isTrial || usage.isOverLimit) && (_jsx(Button, { className: "w-full bg-[#0B0B0B] text-white font-bold text-xs h-9 rounded-lg shadow-sm hover:shadow-md transition-all", onClick: () => (window.location.href = "/dashboard/settings/billing"), children: isTrial ? "Upgrade to Growth" : "Manage Subscription" })), !isTrial && isCritical && (_jsx(Button, { variant: "outline", className: "w-full border-green-600 text-green-700 hover:bg-green-50 font-bold text-xs h-9 rounded-lg", children: "Buy \u20A65,000 Extra Pack" }))] })] })] }));
};
