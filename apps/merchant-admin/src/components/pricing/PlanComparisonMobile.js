"use client";
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from "react";
import { PLANS, FEES } from "@/config/pricing";
import { Button, cn } from "@vayva/ui";
export const PlanComparisonMobile = () => {
    const [selectedPlan, setSelectedPlan] = useState("GROWTH");
    return (_jsxs("div", { className: "space-y-8", children: [_jsx("div", { className: "flex p-1 bg-gray-100 rounded-xl", children: PLANS.map((plan) => (_jsx(Button, { onClick: () => setSelectedPlan(plan.key), variant: "ghost", className: cn("flex-1 py-3 h-auto text-xs font-black uppercase tracking-widest rounded-lg transition-all", selectedPlan === plan.key
                        ? "bg-white text-black shadow-sm hover:bg-white"
                        : "text-gray-400 hover:text-gray-600 bg-transparent"), children: plan.key === "STARTER"
                        ? "Free"
                        : plan.monthlyAmount === 30000
                            ? "₦30k"
                            : "₦40k" }, plan.key))) }), _jsxs("div", { className: "bg-white rounded-3xl border border-gray-100 p-8 shadow-xl", children: [_jsxs("h3", { className: "text-xl font-black text-black mb-6", children: [PLANS.find((p) => p.key === selectedPlan)?.name, " Details"] }), _jsx("div", { className: "space-y-6", children: [
                            {
                                name: "Monthly Orders",
                                val: selectedPlan === "STARTER"
                                    ? "100"
                                    : selectedPlan === "GROWTH"
                                        ? "1,000"
                                        : "Unlimited",
                            },
                            {
                                name: "Products / SKUs",
                                val: selectedPlan === "STARTER"
                                    ? "50"
                                    : selectedPlan === "GROWTH"
                                        ? "500"
                                        : "Unlimited",
                            },
                            { name: "Team Seats", val: selectedPlan === "PRO" ? "5" : "1" },
                            {
                                name: "Blueprint Templates",
                                val: selectedPlan === "STARTER" ? "Basic" : "All",
                            },
                            { name: "Inventory tracking", val: selectedPlan !== "STARTER" },
                            { name: "Audit Logs", val: selectedPlan === "PRO" },
                            { name: "Priority Support", val: selectedPlan === "PRO" },
                            { name: "Withdrawal Fee", val: `${FEES.WITHDRAWAL_PERCENTAGE}%` },
                        ].map((feat) => (_jsxs("div", { className: "flex justify-between items-center py-4 border-b border-gray-50 last:border-0", children: [_jsx("span", { className: "text-sm font-bold text-gray-400 uppercase tracking-widest", children: feat.name }), _jsx("div", { className: "text-sm font-black text-black", children: typeof feat.val === "boolean" ? (feat.val ? (_jsx("svg", { className: "w-5 h-5 text-[#22C55E]", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", children: _jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 3, d: "M5 13l4 4L19 7" }) })) : (_jsx("span", { className: "text-gray-200", children: "Not included" }))) : (feat.val) })] }, feat.name))) })] })] }));
};
