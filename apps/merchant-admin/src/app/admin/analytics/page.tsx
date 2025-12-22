'use client';

import React, { useState, useEffect } from 'react';
import { AdminShell } from '@/components/admin-shell';
import { Button, Icon, cn } from '@vayva/ui';
import { api } from '@/services/api';

export default function AnalyticsDashboardPage() {
    const [data, setData] = useState<any>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [range, setRange] = useState('30d');

    const fetchData = async () => {
        setIsLoading(true);
        try {
            const res = await api.get(`/analytics/overview?range=${range}`);
            setData(res.data);
        } catch (err) {
            console.error(err);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, [range]);

    if (isLoading || !data) {
        return (
            <AdminShell title="Analytics">
                <div className="flex items-center justify-center h-96 text-gray-400">Loading analytics...</div>
            </AdminShell>
        );
    }

    const kpis = data.kpis || {};
    const healthScore = data.healthScore || 0;

    return (
        <AdminShell title="Analytics">
            <div className="flex flex-col gap-8">

                {/* Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold text-[#0B1220]">Business Overview</h1>
                        <p className="text-[#525252]">Track your store's performance and health.</p>
                    </div>
                    <div className="flex gap-2">
                        {['7d', '30d', '90d'].map(r => (
                            <button
                                key={r}
                                onClick={() => setRange(r)}
                                className={cn(
                                    "px-4 py-2 rounded-lg text-sm font-medium transition-all",
                                    range === r
                                        ? "bg-[#22C55E] text-white shadow-sm"
                                        : "bg-white border border-gray-200 text-[#525252] hover:border-gray-300"
                                )}
                            >
                                {r === '7d' ? 'Last 7 Days' : r === '30d' ? 'Last 30 Days' : 'Last 90 Days'}
                            </button>
                        ))}
                    </div>
                </div>

                {/* KPI Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    <KPICard
                        title="Net Sales"
                        value={`₦ ${Number(kpis.netSales || 0).toLocaleString()}`}
                        icon={"TrendingUp" as any}
                        color="bg-green-50 text-green-600"
                    />
                    <KPICard
                        title="Orders"
                        value={kpis.orders || 0}
                        icon={"ShoppingBag" as any}
                        color="bg-blue-50 text-blue-600"
                    />
                    <KPICard
                        title="Payment Success"
                        value={`${kpis.paymentSuccessRate || 0}%`}
                        icon={"CreditCard" as any}
                        color="bg-purple-50 text-purple-600"
                    />
                    <KPICard
                        title="Delivery Success"
                        value={`${Number(kpis.deliverySuccessRate || 0).toFixed(1)}%`}
                        icon={"Truck" as any}
                        color="bg-orange-50 text-orange-600"
                    />
                    <KPICard
                        title="Refund Rate"
                        value={`${kpis.refundRate || 0}%`}
                        icon={"RotateCcw" as any}
                        color="bg-red-50 text-red-600"
                    />
                    <KPICard
                        title="WhatsApp Response"
                        value={`${Math.round((kpis.whatsappResponseTime || 0) / 60)}m`}
                        icon={"MessageCircle" as any}
                        color="bg-green-50 text-green-600"
                    />
                </div>

                {/* Health Score */}
                <div className="bg-gradient-to-br from-green-50 to-blue-50 rounded-2xl p-8 border border-green-100">
                    <div className="flex items-center justify-between">
                        <div>
                            <h3 className="text-sm font-medium text-[#525252] mb-2">Business Health Score</h3>
                            <div className="flex items-baseline gap-2">
                                <span className="text-5xl font-bold text-[#0B1220]">{healthScore}</span>
                                <span className="text-2xl text-[#525252]">/ 100</span>
                            </div>
                            <p className="text-sm text-[#525252] mt-2">
                                {healthScore >= 80 ? '🎉 Excellent performance!' : healthScore >= 60 ? '👍 Good, room for improvement' : '⚠️ Needs attention'}
                            </p>
                        </div>
                        <div className="w-32 h-32 rounded-full bg-white/50 backdrop-blur-sm flex items-center justify-center border border-green-200">
                            <Icon name={"Activity" as any} size={48} className="text-green-600" />
                        </div>
                    </div>
                </div>

                {/* Quick Links */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <QuickLink href="/admin/analytics/reports" icon={"BarChart" as any} title="View Reports" />
                    <QuickLink href="/admin/analytics/goals" icon={"Target" as any} title="Manage Goals" />
                    <QuickLink href="/admin/analytics/insights" icon={"Lightbulb" as any} title="AI Insights" />
                </div>

            </div>
        </AdminShell>
    );
}

function KPICard({ title, value, icon, color }: any) {
    return (
        <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm flex items-center justify-between">
            <div>
                <p className="text-sm font-medium text-[#525252] mb-1">{title}</p>
                <h3 className="text-2xl font-bold text-[#0B1220]">{value}</h3>
            </div>
            <div className={cn("w-12 h-12 rounded-xl flex items-center justify-center", color)}>
                <Icon name={icon as any} size={24} />
            </div>
        </div>
    );
}

function QuickLink({ href, icon, title }: any) {
    return (
        <a
            href={href}
            className="bg-white rounded-xl p-4 border border-gray-100 hover:border-green-200 hover:shadow-md transition-all flex items-center gap-3 group"
        >
            <div className="w-10 h-10 bg-gray-50 group-hover:bg-green-50 rounded-lg flex items-center justify-center transition-all">
                <Icon name={icon as any} size={20} className="text-gray-600 group-hover:text-green-600 transition-all" />
            </div>
            <span className="font-medium text-[#0B1220] group-hover:text-green-600 transition-all">{title}</span>
        </a>
    );
}
