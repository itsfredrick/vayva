"use client";
import React from "react";

import { useOpsQuery } from "@/hooks/useOpsQuery";
import {
    Users,
    DollarSign,
    AlertCircle,
    ArrowRight,
    Activity,
    TrendingUp,
    TrendingDown,
    Store,
    ShoppingBag,
    CreditCard,
    Package,
    Clock,
    CheckCircle,
    AlertTriangle,
    BarChart3,
    Globe,
    Zap,
} from 'lucide-react';
import Link from "next/link";
import { cn } from "@vayva/ui";

function GatewayHealthCard(): React.JSX.Element {
    const { data: health, isLoading } = useOpsQuery(["gateway-health"], () =>
        fetch("/api/ops/health/ping").then(res => res.json())
    );

    const isHealthy = health?.checks?.whatsapp_gateway === "UP";

    return (
        <div className={cn(
            "p-6 rounded-2xl border border-gray-100 shadow-sm transition-all",
            isLoading ? "bg-gray-50 animate-pulse" : isHealthy ? "bg-green-50/30" : "bg-red-50"
        )}>
            <div className="flex items-start justify-between mb-4">
                <div className={cn(
                    "p-2 rounded-lg",
                    isHealthy ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
                )}>
                    <Activity className="h-5 w-5" />
                </div>
                {!isLoading && (
                    <span className={cn(
                        "text-[10px] font-black uppercase tracking-widest px-2 py-1 rounded-full",
                        isHealthy ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
                    )}>
                        {isHealthy ? "Operational" : "Degraded"}
                    </span>
                )}
            </div>
            <div className="text-2xl font-black text-gray-900 mb-1">
                {isLoading ? "..." : isHealthy ? "99.9% Up" : "Gateway Down"}
            </div>
            <div className="text-sm text-gray-500 font-medium">WhatsApp Infrastructure</div>
        </div>
    );
}

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

export default function OpsDashboardPage(): React.JSX.Element {
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

    const { merchants, revenue, operations, marketplace, subscriptions } = data || {};

    return (
        <div className="p-8 max-w-7xl mx-auto space-y-8">
            {/* Header */}
            <div className="flex justify-between items-start">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Command Center</h1>
                    <p className="text-gray-500 text-sm mt-1">
                        Real-time platform monitoring and control
                    </p>
                </div>
                <div className="flex items-center gap-2 text-xs">
                    <div className="flex items-center gap-1.5 px-3 py-1.5 bg-green-50 text-green-700 rounded-full font-medium">
                        <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                        All Systems Operational
                    </div>
                </div>
            </div>

            {/* Primary KPIs */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <MetricCard
                    title="Platform GMV (30d)"
                    value={revenue ? `₦${(revenue.total / 1000000).toFixed(1)}M` : "₦0"}
                    icon={(DollarSign as any)}
                    trend={revenue?.growth ? `${revenue.growth > 0 ? "+" : ""}${revenue.growth}%` : undefined}
                    trendUp={revenue?.growth > 0}
                    color="bg-gradient-to-br from-green-50 to-emerald-50"
                />
                <MetricCard
                    title="Active Merchants"
                    value={merchants?.total || 0}
                    icon={(Store as any)}
                    trend={merchants?.delta}
                    trendUp={true}
                    color="bg-gradient-to-br from-blue-50 to-indigo-50"
                />
                <MetricCard
                    title="MRR"
                    value={subscriptions?.mrr ? `₦${subscriptions.mrr.toLocaleString()}` : "₦0"}
                    icon={(CreditCard as any)}
                    color="bg-gradient-to-br from-purple-50 to-pink-50"
                />
                <GatewayHealthCard />
            </div>

            {/* Secondary KPIs */}
            <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
                <Link href="/ops/orders" className="block p-4 bg-white border border-gray-200 rounded-xl hover:border-indigo-200 transition-colors">
                    <div className="flex items-center gap-2 text-gray-500 mb-2">
                        <ShoppingBag size={16} />
                        <span className="text-xs font-medium">Orders (24h)</span>
                    </div>
                    <div className="text-2xl font-black text-gray-900">{operations?.orders24h || 0}</div>
                </Link>

                <Link href="/ops/marketplace/listings" className="block p-4 bg-white border border-gray-200 rounded-xl hover:border-yellow-200 transition-colors">
                    <div className="flex items-center gap-2 text-gray-500 mb-2">
                        <Package size={16} />
                        <span className="text-xs font-medium">Pending Listings</span>
                    </div>
                    <div className="text-2xl font-black text-yellow-600">{marketplace?.pendingListings || 0}</div>
                </Link>

                <Link href="/ops/kyc" className="block p-4 bg-white border border-gray-200 rounded-xl hover:border-orange-200 transition-colors">
                    <div className="flex items-center gap-2 text-gray-500 mb-2">
                        <Clock size={16} />
                        <span className="text-xs font-medium">KYC Queue</span>
                    </div>
                    <div className="text-2xl font-black text-orange-600">{operations?.pendingKYC || 0}</div>
                </Link>

                <Link href="/ops/subscriptions" className="block p-4 bg-white border border-gray-200 rounded-xl hover:border-blue-200 transition-colors">
                    <div className="flex items-center gap-2 text-gray-500 mb-2">
                        <Clock size={16} />
                        <span className="text-xs font-medium">Expiring Trials</span>
                    </div>
                    <div className="text-2xl font-black text-blue-600">{subscriptions?.expiringTrials || 0}</div>
                </Link>

                <Link href="/ops/inbox" className="block p-4 bg-white border border-gray-200 rounded-xl hover:border-purple-200 transition-colors">
                    <div className="flex items-center gap-2 text-gray-500 mb-2">
                        <AlertCircle size={16} />
                        <span className="text-xs font-medium">Open Tickets</span>
                    </div>
                    <div className="text-2xl font-black text-purple-600">{operations?.tickets || 0}</div>
                </Link>

                <Link href="/ops/alerts" className="block p-4 bg-white border border-gray-200 rounded-xl hover:border-red-200 transition-colors">
                    <div className="flex items-center gap-2 text-gray-500 mb-2">
                        <AlertTriangle size={16} />
                        <span className="text-xs font-medium">Active Alerts</span>
                    </div>
                    <div className="text-2xl font-black text-red-600">{operations?.alerts || 0}</div>
                </Link>
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
                        <Link href="/ops/audit" className="text-xs font-semibold text-indigo-600 hover:underline">
                            View Audit Log
                        </Link>
                    </div>

                    <div className="space-y-6">
                        {data?.recentActivity?.length > 0 ? (
                            data.recentActivity.map((activity: any, i: number) => (
                                <div key={i} className="flex gap-4 items-start">
                                    <div className="h-2 w-2 mt-2 rounded-full bg-indigo-400 shrink-0"></div>
                                    <div>
                                        <p className="text-sm text-gray-900 font-medium">
                                            {(activity as any).message}
                                        </p>
                                        <p className="text-xs text-gray-500">{(activity as any).timestamp}</p>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="text-center py-8 text-gray-500">
                                <p className="text-sm">No recent activity</p>
                            </div>
                        )}
                    </div>
                </div>

                {/* Quick Actions */}
                <div className="space-y-4">
                    <h3 className="font-bold text-gray-900 text-sm uppercase tracking-wider">Quick Actions</h3>
                    
                    <Link href="/ops/analytics" className="block p-4 bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-xl hover:from-indigo-600 hover:to-purple-700 transition-colors group">
                        <div className="flex justify-between items-center">
                            <div className="flex items-center gap-3">
                                <BarChart3 className="h-5 w-5" />
                                <span className="font-medium">Platform Analytics</span>
                            </div>
                            <ArrowRight className="h-4 w-4 opacity-70 group-hover:opacity-100" />
                        </div>
                    </Link>

                    <Link href="/ops/merchants" className="block p-4 bg-white border border-gray-200 rounded-xl hover:border-indigo-300 transition-colors group">
                        <div className="flex justify-between items-center">
                            <div className="flex items-center gap-3">
                                <Store className="h-5 w-5 text-gray-500" />
                                <span className="font-medium text-gray-700 group-hover:text-indigo-700">Manage Merchants</span>
                            </div>
                            <ArrowRight className="h-4 w-4 text-gray-400 group-hover:text-indigo-500" />
                        </div>
                    </Link>

                    <Link href="/ops/marketplace/listings" className="block p-4 bg-white border border-gray-200 rounded-xl hover:border-yellow-300 transition-colors group">
                        <div className="flex justify-between items-center">
                            <div className="flex items-center gap-3">
                                <Package className="h-5 w-5 text-gray-500" />
                                <span className="font-medium text-gray-700 group-hover:text-yellow-700">Moderate Listings</span>
                            </div>
                            <ArrowRight className="h-4 w-4 text-gray-400 group-hover:text-yellow-500" />
                        </div>
                    </Link>

                    <Link href="/ops/rescue" className="block p-4 bg-red-50 border border-red-100 rounded-xl hover:bg-red-100 transition-colors group">
                        <div className="flex justify-between items-center">
                            <div className="flex items-center gap-3">
                                <Zap className="h-5 w-5 text-red-500" />
                                <span className="font-medium text-red-900">Rescue Console</span>
                            </div>
                            <ArrowRight className="h-4 w-4 text-red-400 group-hover:text-red-600" />
                        </div>
                    </Link>
                </div>
            </div>

            {/* Platform Modules */}
            <div>
                <h3 className="font-bold text-gray-900 text-sm uppercase tracking-wider mb-4">Platform Modules</h3>
                <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                    <Link href="/ops/subscriptions" className="block p-4 bg-white border border-gray-200 rounded-xl hover:border-emerald-300 transition-colors group">
                        <CreditCard className="h-5 w-5 text-emerald-500 mb-2" />
                        <div className="font-medium text-gray-700 group-hover:text-emerald-700">Subscriptions</div>
                        <div className="text-xs text-gray-500">SaaS Revenue</div>
                    </Link>

                    <Link href="/ops/industries" className="block p-4 bg-white border border-gray-200 rounded-xl hover:border-blue-300 transition-colors group">
                        <Globe className="h-5 w-5 text-blue-500 mb-2" />
                        <div className="font-medium text-gray-700 group-hover:text-blue-700">Industries</div>
                        <div className="text-xs text-gray-500">Breakdown</div>
                    </Link>

                    <Link href="/ops/payouts" className="block p-4 bg-white border border-gray-200 rounded-xl hover:border-green-300 transition-colors group">
                        <DollarSign className="h-5 w-5 text-green-500 mb-2" />
                        <div className="font-medium text-gray-700 group-hover:text-green-700">Payouts</div>
                        <div className="text-xs text-gray-500">Withdrawals</div>
                    </Link>

                    <Link href="/ops/users" className="block p-4 bg-white border border-gray-200 rounded-xl hover:border-purple-300 transition-colors group">
                        <Users className="h-5 w-5 text-purple-500 mb-2" />
                        <div className="font-medium text-gray-700 group-hover:text-purple-700">Ops Team</div>
                        <div className="text-xs text-gray-500">Admin Access</div>
                    </Link>

                    <Link href="/ops/security" className="block p-4 bg-white border border-gray-200 rounded-xl hover:border-red-300 transition-colors group">
                        <AlertTriangle className="h-5 w-5 text-red-500 mb-2" />
                        <div className="font-medium text-gray-700 group-hover:text-red-700">Security</div>
                        <div className="text-xs text-gray-500">Risk & Fraud</div>
                    </Link>
                </div>
            </div>
        </div>
    );
}
