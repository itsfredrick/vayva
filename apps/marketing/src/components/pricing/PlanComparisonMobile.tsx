
"use client";

import React, { useState } from "react";
import { PLANS, FEES } from "@/config/pricing";

export const PlanComparisonMobile = () => {
    const [selectedPlan, setSelectedPlan] = useState<"free" | "growth" | "pro">(
        "growth",
    );

    return (
        <div className="space-y-8">
            {/* Plan Selector */}
            <div className="flex p-1 bg-gray-100 rounded-xl">
                {PLANS.map((plan) => (
                    <button
                        key={plan.key}
                        onClick={() => setSelectedPlan(plan.key)}
                        className={`flex-1 py-3 text-xs font-black uppercase tracking-widest rounded-lg transition-all ${selectedPlan === plan.key
                                ? "bg-white text-[#0F172A] shadow-sm"
                                : "text-gray-400 hover:text-gray-600"
                            }`}
                    >
                        {plan.key === "free"
                            ? "Free"
                            : plan.monthlyAmount === 30000
                                ? "₦30k"
                                : "₦40k"}
                    </button>
                ))}
            </div>

            {/* Feature List */}
            <div className="bg-white rounded-3xl border border-gray-100 p-8 shadow-xl">
                <h3 className="text-xl font-black text-[#0F172A] mb-6">
                    {PLANS.find((p) => p.key === selectedPlan)?.name} Details
                </h3>
                <div className="space-y-6">
                    {[
                        {
                            name: "Monthly Orders",
                            val:
                                selectedPlan === "free"
                                    ? "100"
                                    : selectedPlan === "growth"
                                        ? "1,000"
                                        : "Unlimited",
                        },
                        {
                            name: "Products / SKUs",
                            val:
                                selectedPlan === "free"
                                    ? "50"
                                    : selectedPlan === "growth"
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
                    ].map((feat) => (
                        <div
                            key={feat.name}
                            className="flex justify-between items-center py-4 border-b border-gray-50 last:border-0"
                        >
                            <span className="text-sm font-bold text-gray-400 uppercase tracking-widest">
                                {feat.name}
                            </span>
                            <div className="text-sm font-black text-[#0F172A]">
                                {typeof feat.val === "boolean" ? (
                                    feat.val ? (
                                        <svg
                                            className="w-5 h-5 text-[#22C55E]"
                                            fill="none"
                                            stroke="currentColor"
                                            viewBox="0 0 24 24"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth={3}
                                                d="M5 13l4 4L19 7"
                                            />
                                        </svg>
                                    ) : (
                                        <span className="text-gray-200">Not included</span>
                                    )
                                ) : (
                                    feat.val
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};
