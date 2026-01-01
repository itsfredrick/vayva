"use client";

import { useOpsQuery } from "@/hooks/useOpsQuery";
import {
    Users,
    DollarSign,
    AlertCircle,
    ShieldAlert,
    ArrowRight,
    Activity
} from "lucide-react";
import Link from "next/link";
// import { formatCurrency } from "@/lib/utils"; 

const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-NG", {
        style: "currency",
        currency: "NGN",
        minimumFractionDigits: 0,
    }).format(amount);
};

function MetricCard({
    title,
    value,
    icon: Icon,
    trend,
    trendUp,
    color = "bg-white"
}: any) {
    return (
        <div className={`${color} p-6 rounded-2xl border border-gray-100 shadow-sm`}>
            <div className="flex items-start justify-between mb-4">
                <div className="p-2 bg-white/50 rounded-lg">
                    <Icon className="h-5 w-5 text-gray-700" />
                </div>
                {trend && (
                    <span className={`text-xs font-medium px-2 py-1 rounded-full ${trendUp ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
                        }`}>
                        {trend}
                    </span>
                )}
            </div>
            <div className="text-3xl font-bold text-gray-900 mb-1">{value}</div>
            <div className="text-sm text-gray-500 font-medium">{title}</div>
        </div>
    );
}

export default function OpsDashboardPage() {
    const { data, isLoading: loading } = useOpsQuery(
        ["dashboard-stats"],
        () => fetch("/api/ops/dashboard/stats").then(res => res.json())
    );

    // Skeleton loader
    if (loading) {
        return (
            <div className="p-8 max-w-7xl mx-auto space-y-8 animate-pulse">
                <div className="h-8 w-48 bg-gray-200 rounded-lg"></div>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                    {[1, 2, 3, 4].map(i => (
                        <div key={i} className="h-40 bg-gray-100 rounded-2xl"></div>
                    ))}
                </div>
            </div>
        );
    }

    const { merchants, revenue, operations } = data || {};

    return (
        <div className="p-8 max-w-7xl mx-auto space-y-8">
            {/* Header */}
            <div>
                <h1 className="text-2xl font-bold text-gray-900">Overview</h1>
                <p className="text-gray-500 text-sm mt-1">
                    Platform performance and operational alerts.
                </p>
            </div>

            {/* KPI Grid */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <MetricCard
                    title="Total Revenue"
                    value={revenue ? `₦${(revenue.total).toLocaleString()}` : "₦0"}
                    icon={DollarSign}
                    trend="+12% vs last month"
                    trendUp={true}
                    color="bg-gradient-to-br from-green-50 to-emerald-50"
                />
                <MetricCard
                    title="Active Merchants"
                    value={merchants?.total || 0}
                    icon={Users}
                    trend={merchants?.delta}
                    trendUp={true}
                />
                <MetricCard
                    title="Open Tickets"
                    value={operations?.tickets || 0}
                    icon={AlertCircle}
                    color="bg-orange-50"
                />
                <MetricCard
                    title="Pending Disputes"
                    value={operations?.disputes || 0}
                    icon={ShieldAlert}
                    color="bg-red-50"
                />
            </div>

            {/* Quick Actions & Feed */}
            <div className="grid md:grid-cols-3 gap-8">
                {/* Recent Activity Feed */}
                <div className="md:col-span-2 bg-white rounded-2xl border border-gray-200 p-6 h-fit">
                    <div className="flex items-center justify-between mb-6">
                        <h3 className="font-bold text-gray-900 flex items-center gap-2">
                            <Activity className="h-5 w-5 text-indigo-600" />
                            Recent Activity
                        </h3>
                        <Link href="/ops/admin/audit" className="text-xs font-semibold text-indigo-600 hover:underline">
                            View Audit Log
                        </Link>
                    </div>

                    <div className="space-y-6">
                        {[1, 2, 3].map((_, i) => (
                            <div key={i} className="flex gap-4 items-start">
                                <div className="h-2 w-2 mt-2 rounded-full bg-indigo-400 shrink-0"></div>
                                <div>
                                    <p className="text-sm text-gray-900 font-medium">
                                        System scheduled maintenance completed.
                                    </p>
                                    <p className="text-xs text-gray-500">2 hours ago</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Primary Actions */}
                <div className="space-y-4">
                    <Link href="/ops/merchants" className="block p-4 bg-white border border-gray-200 rounded-xl hover:border-indigo-300 transition-colors group">
                        <div className="flex justify-between items-center">
                            <span className="font-medium text-gray-700 group-hover:text-indigo-700">Manage Merchants</span>
                            <ArrowRight className="h-4 w-4 text-gray-400 group-hover:text-indigo-500" />
                        </div>
                    </Link>

                    <Link href="/ops/rescue" className="block p-4 bg-indigo-50 border border-indigo-100 rounded-xl hover:bg-indigo-100 transition-colors group">
                        <div className="flex justify-between items-center">
                            <span className="font-medium text-indigo-900">Rescue Dashboard</span>
                            <ArrowRight className="h-4 w-4 text-indigo-400 group-hover:text-indigo-600" />
                        </div>
                    </Link>
                </div>
            </div>

            {/* Extended Quick Links */}
            <div>
                <h3 className="font-bold text-gray-900 text-sm uppercase tracking-wider mb-4">Platform Modules</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <Link href="/ops/admin/team" className="block p-4 bg-white border border-gray-200 rounded-xl hover:border-purple-300 transition-colors group">
                        <div className="font-medium text-gray-700 group-hover:text-purple-700 mb-2">Team Access</div>
                        <div className="text-xs text-gray-500">Invite & manage admins</div>
                    </Link>

                    <Link href="/ops/financials/subscriptions" className="block p-4 bg-white border border-gray-200 rounded-xl hover:border-emerald-300 transition-colors group">
                        <div className="font-medium text-gray-700 group-hover:text-emerald-700 mb-2">Billing</div>
                        <div className="text-xs text-gray-500">SaaS Revenue Monitor</div>
                    </Link>

                    <Link href="/ops/growth/campaigns" className="block p-4 bg-white border border-gray-200 rounded-xl hover:border-orange-300 transition-colors group">
                        <div className="font-medium text-gray-700 group-hover:text-orange-700 mb-2">Campaigns</div>
                        <div className="text-xs text-gray-500">Flash Sales Tracker</div>
                    </Link>

                    <Link href="/ops/partners" className="block p-4 bg-white border border-gray-200 rounded-xl hover:border-blue-300 transition-colors group">
                        <div className="font-medium text-gray-700 group-hover:text-blue-700 mb-2">Partners</div>
                        <div className="text-xs text-gray-500">Affiliate network</div>
                    </Link>
                </div>
            </div>
        </div>
    );
}
