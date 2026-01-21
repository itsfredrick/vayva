"use client";

import React from "react";
import { Check, X, Minus } from "lucide-react";

export function ComparisonTable() {
    return (
        <section className="py-24 px-4 bg-white">
            <div className="max-w-4xl mx-auto">
                <h2 className="text-3xl font-bold text-center mb-12">The arithmetic doesn't lie.</h2>

                <div className="overflow-hidden border border-gray-200 rounded-2xl shadow-sm">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-gray-50 border-b border-gray-200">
                                <th className="p-6 text-gray-500 font-medium">Feature</th>
                                <th className="p-6 text-[#0F172A] font-bold text-xl w-1/3">Vayva 🇳🇬</th>
                                <th className="p-6 text-gray-400 font-medium w-1/3">Shopify 🇺🇸</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            <tr>
                                <td className="p-6 font-medium text-gray-900">Monthly Cost</td>
                                <td className="p-6 text-green-600 font-bold bg-green-50/30">₦0 <span className="text-xs text-gray-500 font-normal">/ month</span></td>
                                <td className="p-6 text-gray-500">~$29 <span className="text-xs text-gray-400">/ month (~₦45k)</span></td>
                            </tr>
                            <tr>
                                <td className="p-6 font-medium text-gray-900">Transaction Fees</td>
                                <td className="p-6 text-green-600 font-bold bg-green-50/30">3% Flat</td>
                                <td className="p-6 text-gray-500">2.0% + $0.30</td>
                            </tr>
                            <tr>
                                <td className="p-6 font-medium text-gray-900">Payments</td>
                                <td className="p-6 text-green-600 font-bold bg-green-50/30">
                                    <div className="flex items-center gap-2">
                                        <Check className="w-4 h-4" /> Native Paystack
                                    </div>
                                </td>
                                <td className="p-6 text-gray-500">Requires 3rd Party</td>
                            </tr>
                            <tr>
                                <td className="p-6 font-medium text-gray-900">WhatsApp AI</td>
                                <td className="p-6 text-green-600 font-bold bg-green-50/30">
                                    <div className="flex items-center gap-2">
                                        <Check className="w-4 h-4" /> Built-in
                                    </div>
                                </td>
                                <td className="p-6 text-gray-500">
                                    <div className="flex items-center gap-2">
                                        <X className="w-4 h-4 text-red-400" /> No
                                    </div>
                                </td>
                            </tr>
                            <tr>
                                <td className="p-6 font-medium text-gray-900">Local Logistics</td>
                                <td className="p-6 text-green-600 font-bold bg-green-50/30">
                                    <div className="flex items-center gap-2">
                                        <Check className="w-4 h-4" /> Integrated (Kwik)
                                    </div>
                                </td>
                                <td className="p-6 text-gray-500">Manual Entry</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </section>
    );
}
