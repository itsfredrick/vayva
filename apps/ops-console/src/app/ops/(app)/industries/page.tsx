"use client";

import React from "react";
import { useOpsQuery } from "@/hooks/useOpsQuery";
import { Globe, Store, DollarSign, TrendingUp, RefreshCw } from 'lucide-react';
import { Button } from "@vayva/ui";
import Link from "next/link";

interface IndustryData {
    industry: string;
    count: number;
    gmv: number;
    activeCount: number;
    avgOrderValue: number;
}

export default function IndustriesPage(): React.JSX.Element {
    const { data, isLoading, refetch } = useOpsQuery<{ industries: IndustryData[]; total: number }>(
        ["industries-breakdown"],
        () => fetch("/api/ops/industries").then(res => res.json())
    );

    const industries = data?.industries || [];
    const maxGMV = Math.max(...industries.map(i => i.gmv), 1);

    return (
        <div className="p-8 space-y-8">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
                        <Globe className="h-7 w-7 text-indigo-600" />
                        Industry Breakdown
                    </h1>
                    <p className="text-gray-500 text-sm mt-1">
                        Merchant distribution and performance by industry
                    </p>
                </div>
                <Button variant="ghost" size="icon" onClick={() => refetch()} className="rounded-full">
                    <RefreshCw className={`h-5 w-5 ${isLoading ? "animate-spin" : ""}`} />
                </Button>
            </div>

            {isLoading ? (
                <div className="space-y-4">
                    {[1, 2, 3, 4].map(i => (
                        <div key={i} className="h-20 bg-gray-100 rounded-xl animate-pulse" />
                    ))}
                </div>
            ) : (
                <div className="space-y-4">
                    {industries.map((ind) => (
                        <div key={ind.industry} className="bg-white rounded-xl border border-gray-200 p-5">
                            <div className="flex items-center justify-between mb-3">
                                <div className="flex items-center gap-3">
                                    <div className="p-2 bg-indigo-100 rounded-lg">
                                        <Globe className="h-5 w-5 text-indigo-600" />
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-gray-900 capitalize">
                                            {ind.industry.replace(/_/g, " ")}
                                        </h3>
                                        <div className="flex items-center gap-4 text-xs text-gray-500">
                                            <span className="flex items-center gap-1">
                                                <Store size={12} /> {ind.count} merchants
                                            </span>
                                            <span>{ind.activeCount} active</span>
                                        </div>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <div className="text-lg font-black text-green-600">
                                        ₦{(ind.gmv / 1000000).toFixed(1)}M
                                    </div>
                                    <div className="text-xs text-gray-500">
                                        Avg: ₦{ind.avgOrderValue.toLocaleString()}
                                    </div>
                                </div>
                            </div>
                            <div className="h-3 bg-gray-100 rounded-full overflow-hidden">
                                <div
                                    className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full transition-all duration-500"
                                    style={{ width: `${(ind.gmv / maxGMV) * 100}%` }}
                                />
                            </div>
                        </div>
                    ))}

                    {industries.length === 0 && (
                        <div className="text-center py-12 text-gray-400">No industry data available</div>
                    )}
                </div>
            )}
        </div>
    );
}
