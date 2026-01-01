
"use client";

import React from "react";
import { PLANS, FEES } from "@/config/pricing";

interface FeatureRow {
    name: string;
    free: string | boolean;
    growth: string | boolean;
    pro: string | boolean;
    tooltip?: string;
    isComingSoon?: boolean;
}

const COMPARISON_DATA: FeatureRow[] = [
    { name: "Monthly Orders", free: "100", growth: "1,000", pro: "Unlimited" },
    { name: "Products / SKUs", free: "50", growth: "500", pro: "Unlimited" },
    { name: "Team members", free: "1 seat", growth: "1 seat", pro: "5 seats" },
    {
        name: "WhatsApp order capture",
        free: true,
        growth: true,
        pro: true,
        tooltip: "Automated extraction of orders from WhatsApp chats.",
    },
    { name: "Blueprint templates", free: "Basic", growth: "All", pro: "All" },
    { name: "Inventory tracking", free: false, growth: true, pro: true },
    { name: "Custom domain", free: false, growth: true, pro: true },
    { name: "Advanced Audit logs", free: false, growth: false, pro: true },
    { name: "Priority Support", free: false, growth: false, pro: true },
    {
        name: "Withdrawal Transaction Fee",
        free: `${FEES.WITHDRAWAL_PERCENTAGE}%`,
        growth: `${FEES.WITHDRAWAL_PERCENTAGE}%`,
        pro: `${FEES.WITHDRAWAL_PERCENTAGE}%`,
        tooltip: "Charged on every payout to your bank account.",
    },
];

export const PlanComparisonTable = () => {
    return (
        <div className="hidden lg:block w-full overflow-hidden rounded-3xl border border-gray-100 bg-white shadow-2xl shadow-gray-200/50">
            <table className="w-full text-left border-collapse">
                <thead>
                    <tr className="bg-gray-50 border-b border-gray-100">
                        <th className="p-8 text-sm font-black text-gray-400 uppercase tracking-widest w-1/4">
                            Features
                        </th>
                        {PLANS.map((plan) => (
                            <th
                                key={plan.key}
                                className={`p-8 text-xl font-black text-[#0F172A] text-center ${plan.featured ? "bg-green-50/30" : ""}`}
                            >
                                {plan.name}
                            </th>
                        ))}
                    </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                    {COMPARISON_DATA.map((row) => (
                        <tr
                            key={row.name}
                            className="hover:bg-gray-50/50 transition-colors"
                        >
                            <td className="p-6">
                                <div className="flex items-center gap-2 group relative px-2">
                                    <span className="text-sm font-bold text-gray-700">
                                        {row.name}
                                    </span>
                                    {row.tooltip && (
                                        <div className="relative">
                                            <span className="cursor-help text-gray-300 hover:text-[#22C55E] transition-colors">
                                                <svg
                                                    className="w-4 h-4"
                                                    fill="none"
                                                    stroke="currentColor"
                                                    viewBox="0 0 24 24"
                                                >
                                                    <path
                                                        strokeLinecap="round"
                                                        strokeLinejoin="round"
                                                        strokeWidth={2}
                                                        d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                                                    />
                                                </svg>
                                            </span>
                                        </div>
                                    )}
                                </div>
                            </td>
                            <td className="p-6 text-center">{renderValue(row.free)}</td>
                            <td className="p-6 text-center bg-green-50/10">
                                {renderValue(row.growth)}
                            </td>
                            <td className="p-6 text-center">{renderValue(row.pro)}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

function renderValue(val: string | boolean) {
    if (typeof val === "boolean") {
        return val ? (
            <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-green-50 text-[#22C55E]">
                <svg
                    className="w-5 h-5"
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
            </span>
        ) : (
            <span className="text-gray-200">—</span>
        );
    }
    return <span className="text-sm font-black text-[#0F172A]">{val}</span>;
}
