"use client";

import React from "react";
import { useUserPlan } from "../../../../hooks/useUserPlan";
import { PLANS } from "../../../../lib/billing/plans";
import { Card } from "@vayva/ui";

export default function ReportsPage() {
    const { plan, isLoading } = useUserPlan();

    if (isLoading) return <div className="p-8">Loading reports...</div>;

    const currentPlan = PLANS[plan?.slug || "free"];
    const canViewReports = currentPlan?.features.reports;

    if (!canViewReports) {
        return (
            <div className="p-8">
                <Card className="p-6">
                    <h2 className="text-xl font-bold mb-4">Upgrade Required</h2>
                    <p>You need to be on the Pro plan to view reports.</p>
                </Card>
            </div>
        );
    }

    return (
        <div className="flex-1 space-y-4 p-8 pt-6">
            <div className="flex items-center justify-between space-y-2">
                <h2 className="text-3xl font-bold tracking-tight">Reports</h2>
            </div>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
                <Card className="col-span-4 p-6">
                    <h3 className="text-lg font-bold mb-4">Overview</h3>
                    <div className="pl-2">
                        <div className="h-[200px] flex items-center justify-center bg-gray-50 rounded-md">
                            Chart Placeholder
                        </div>
                    </div>
                </Card>
                <Card className="col-span-3 p-6">
                    <h3 className="text-lg font-bold mb-4">Date Range</h3>
                    <div>
                        <input type="date" className="w-full p-2 border rounded" />
                    </div>
                </Card>
            </div>
        </div>
    );
}
