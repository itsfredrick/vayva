"use client";
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from "react";
import { PLANS, FEES } from "@/config/pricing";
import { Button } from "@vayva/ui";
import { cn } from "@/lib/utils";
export const PlanComparisonMobile = () => {
    const [selectedPlan, setSelectedPlan] = useState("starter");
    return (_jsxs("div", { className: "space-y-8", children: [_jsx("div", { className: "flex p-1 bg-gray-100 rounded-xl", children: PLANS.map((plan) => (_jsx(Button, { onClick: () => setSelectedPlan(plan.key), variant: "ghost", className: cn("flex-1 py-3 text-xs font-black uppercase tracking-widest rounded-lg transition-all h-auto", selectedPlan === plan.key
                        ? "bg-white text-[#0F172A] shadow-sm hover:bg-white"
                        : "text-gray-400 hover:text-gray-600 hover:bg-transparent"), children: plan.key === "free"
                        ? "Free"
                        : `₦${plan.baseAmount / 1000}k` }, plan.key))) }), _jsxs("div", { className: "bg-white rounded-3xl border border-gray-100 p-8 shadow-xl", children: [_jsxs("h3", { className: "text-xl font-black text-[#0F172A] mb-6", children: [PLANS.find((p) => p.key === selectedPlan)?.name, " Details"] }), _jsx("div", { className: "space-y-6", children: [
                            {
                                name: "Monthly Orders",
                                val: selectedPlan === "free"
                                    ? "100"
                                    : selectedPlan === "starter"
                                        ? "1,000"
                                        : "Unlimited",
                            },
                            {
                                name: "Products / SKUs",
                                val: selectedPlan === "free"
                                    ? "50"
                                    : selectedPlan === "starter"
                                        ? "500"
                                        : "Unlimited",
                            },
                            { name: "Team Seats", val: selectedPlan === "pro" ? "5" : "1" },
                            {
                                name: "Blueprint Templates",
                                val: selectedPlan === "free" ? "Basic" : "All",
                            },
                            { name: "Inventory tracking", val: selectedPlan !== "free" },
                            { name: "Audit Logs", val: selectedPlan === "pro" },
                            { name: "Priority Support", val: selectedPlan === "pro" },
                            { name: "Withdrawal Fee", val: `${FEES.WITHDRAWAL_PERCENTAGE}%` },
                        ].map((feat) => (_jsxs("div", { className: "flex justify-between items-center py-4 border-b border-gray-50 last:border-0", children: [_jsx("span", { className: "text-sm font-bold text-gray-400 uppercase tracking-widest", children: feat.name }), _jsx("div", { className: "text-sm font-black text-[#0F172A]", children: typeof feat.val === "boolean" ? (feat.val ? (_jsx("svg", { className: "w-5 h-5 text-[#22C55E]", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", children: _jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 3, d: "M5 13l4 4L19 7" }) })) : (_jsx("span", { className: "text-gray-200", children: "Not included" }))) : (feat.val) })] }, feat.name))) })] })] }));
};
