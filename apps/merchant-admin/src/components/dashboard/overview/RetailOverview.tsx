'use client';

import React, { useEffect, useState } from 'react';
import { Icon, cn } from '@vayva/ui';
import { api } from '@/services/api';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { RevenueAreaChart, OrdersBreakdownChart, FulfillmentSpeed } from './DashboardCharts';

// Mock types for the new structure
interface DashboardContext {
    firstName: string;
    initials: string;
    storeStatus: 'LIVE' | 'DRAFT';
    paymentStatus: 'CONNECTED' | 'PENDING';
    whatsappStatus: 'CONNECTED' | 'ATTENTION';
    kycStatus: 'VERIFIED' | 'REVIEW' | 'ACTION';
}

interface Metric {
    label: string;
    value: string;
    trend: 'up' | 'down' | 'stable';
}

interface DashMetrics {
    metrics: { [key: string]: Metric };
    charts: {
        revenue: any[];
        orders: any[];
        fulfillment: any;
    };
}

interface ActivityItem {
    id: number;
    type: 'ORDER' | 'PAYMENT' | 'WHATSAPP' | 'BOOKING';
    message: string;
    user: string;
    time: string;
}

export const RetailOverview = () => {
    const [context, setContext] = useState<DashboardContext | null>(null);
    const [data, setData] = useState<DashMetrics | null>(null);
    const [activity, setActivity] = useState<ActivityItem[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadData = async () => {
            try {
                // In real app, use SWR or React Query
                const [ctxRes, metricsRes, activityRes] = await Promise.all([
                    fetch('/api/dashboard/context').then(r => r.json()),
                    fetch('/api/dashboard/metrics').then(r => r.json()),
                    fetch('/api/dashboard/activity').then(r => r.json())
                ]);

                setContext(ctxRes);
                setData(metricsRes);
                setActivity(activityRes);
            } catch (e) {
                console.error("Dashboard data load failed", e);
            } finally {
                setLoading(false);
            }
        };

        loadData();
    }, []);

    if (loading) {
        return <div className="p-12 text-center text-gray-400 font-medium">Preparing your workspace...</div>;
    }

    const StatusCard = ({ label, status, icon, healthy, detail }: { label: string, status: string, icon: any, healthy: boolean, detail?: string }) => (
        <div className={cn(
            "group flex items-center gap-3 p-4 rounded-2xl border transition-all cursor-pointer hover:scale-[1.02]",
            healthy ? "bg-white border-gray-100 hover:border-gray-200" : "bg-orange-50 border-orange-100"
        )}>
            <div className={cn(
                "w-10 h-10 rounded-xl flex items-center justify-center shrink-0 transition-colors",
                healthy ? "bg-gray-50 text-gray-900 group-hover:bg-green-50 group-hover:text-green-600" : "bg-white text-orange-600 shadow-sm"
            )}>
                <Icon name={icon} size={18} />
            </div>
            <div>
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-0.5">{label}</p>
                <div className="flex items-center gap-2">
                    <span className={cn("text-sm font-bold", healthy ? "text-gray-900" : "text-orange-700")}>
                        {status}
                    </span>
                    {!healthy && <span className="w-2 h-2 rounded-full bg-orange-500 animate-pulse"></span>}
                </div>
                {detail && (
                    <p className="text-[10px] text-gray-400 mt-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        {detail}
                    </p>
                )}
            </div>
        </div>
    );

    return (
        <div className="space-y-8 animate-in fade-in duration-500 pb-20">

            {/* SECTION 1: WELCOME & CONTEXT */}
            <section className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-heading font-bold text-gray-900 mb-2">
                        Welcome back, {context?.firstName} 👋
                    </h1>
                    <p className="text-gray-500 text-lg">Here’s what’s happening in your business today.</p>
                </div>
            </section>

            {/* SECTION 2: SYSTEM HEALTH (Enhanced) */}
            <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <StatusCard
                    label="Storefront"
                    status={context?.storeStatus === 'LIVE' ? 'Live' : 'Draft'}
                    icon="Store"
                    healthy={context?.storeStatus === 'LIVE'}
                    detail="Last synced: 2m ago"
                />
                <StatusCard
                    label="Payments"
                    status={context?.paymentStatus === 'CONNECTED' ? 'Active' : 'Pending'}
                    icon="CreditCard"
                    healthy={context?.paymentStatus === 'CONNECTED'}
                    detail="Last txn: 12:45 PM"
                />
                <StatusCard
                    label="WhatsApp"
                    status={context?.whatsappStatus === 'CONNECTED' ? 'Connected' : 'Attention'}
                    icon="MessageCircle"
                    healthy={context?.whatsappStatus === 'CONNECTED'}
                    detail="Webhook: Active"
                />
                <StatusCard
                    label="KYC"
                    status={context?.kycStatus === 'VERIFIED' ? 'Verified' : 'Action Required'}
                    icon="ShieldCheck"
                    healthy={context?.kycStatus === 'VERIFIED'}
                    detail="Level 2 Approved"
                />
            </section>

            {/* SECTION 3: KEY METRICS */}
            <section>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {data?.metrics && Object.values(data.metrics).map((m, i) => (
                        <div key={i} className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow">
                            <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">{m.label}</p>
                            <div className="flex items-end justify-between">
                                <p className="text-3xl font-bold text-gray-900">{m.value}</p>
                                <div className={cn(
                                    "flex items-center text-xs font-bold px-2 py-1 rounded-full",
                                    m.trend === 'up' ? "bg-green-50 text-green-700" :
                                        m.trend === 'down' ? "bg-red-50 text-red-700" : "bg-gray-50 text-gray-600"
                                )}>
                                    {m.trend === 'up' ? '↗' : m.trend === 'down' ? '↘' : '–'}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            {/* SECTION 4: PERFORMANCE CHARTS (New) */}
            <section className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2">
                    {data?.charts && <RevenueAreaChart data={data.charts.revenue} />}
                </div>
                <div className="space-y-6">
                    {data?.charts && <FulfillmentSpeed {...data.charts.fulfillment} />}
                    {data?.charts && (
                        <div className="h-48">
                            {/* Short Orders Chart for sidebar */}
                            {/* Reusing stacked bar but restricting height/layout ideally or creating mini version. 
                                For now, putting OrdersBreakdown in a wider slot below or here. 
                                Let's put Orders Breakdown in a separate row if space allows, or use the 3rd col for Gauge only.
                                Let's put Order Breakdown in next row.
                             */}
                            <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm h-full flex flex-col justify-center items-center text-center">
                                <h3 className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-2">Pending Orders</h3>
                                <p className="text-4xl font-bold text-orange-500">3</p>
                                <p className="text-sm text-gray-500">Needs attention</p>
                            </div>
                        </div>
                    )}
                </div>
            </section>

            {/* SECTION 5: SECONDARY CHARTS */}
            <section className="grid grid-cols-1 lg:grid-cols-2 gap-6 w-full">
                <div className="w-full">
                    {data?.charts && <OrdersBreakdownChart data={data.charts.orders} />}
                </div>
                {/* Empty slot for future use or Activity Feed moving here? 
                     Let's keep Activity Feed big.
                  */}
            </section>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
                {/* SECTION 6: LIVE ACTIVITY FEED (Left Main) */}
                <div className="lg:col-span-2 space-y-6">
                    <div className="flex items-center justify-between">
                        <h3 className="text-sm font-bold text-gray-400 uppercase tracking-widest">Live Activity</h3>
                        <Link href="/admin/activity" className="text-sm font-bold text-gray-900 hover:underline">View all</Link>
                    </div>

                    <div className="bg-white rounded-[32px] border border-gray-100 shadow-sm overflow-hidden">
                        {activity.map((item, i) => (
                            <div key={item.id} className={cn(
                                "p-6 flex items-center gap-4 hover:bg-gray-50 transition-colors cursor-pointer",
                                i !== activity.length - 1 && "border-b border-gray-50"
                            )}>
                                <div className={cn(
                                    "w-12 h-12 rounded-2xl flex items-center justify-center text-xl shrink-0",
                                    item.type === 'ORDER' ? "bg-blue-50 text-blue-600" :
                                        item.type === 'PAYMENT' ? "bg-green-50 text-green-600" :
                                            item.type === 'WHATSAPP' ? "bg-green-100 text-[#075E54]" : "bg-gray-100 text-gray-600"
                                )}>
                                    <Icon name={
                                        item.type === 'ORDER' ? "ShoppingBag" :
                                            item.type === 'PAYMENT' ? "Banknote" :
                                                item.type === 'WHATSAPP' ? "MessageCircle" : "Calendar"
                                    } size={20} />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="text-sm font-bold text-gray-900 truncate">{item.message}</p>
                                    <p className="text-xs text-gray-500 font-medium">{item.user} • {item.type}</p>
                                </div>
                                <span className="text-xs font-bold text-gray-400 whitespace-nowrap">{item.time}</span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Right Column: Alerts & Quick Actions */}
                <div className="space-y-10">

                    {/* SECTION 7: ACTION REQUIRED */}
                    <section>
                        <h3 className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-6">Action Required</h3>
                        <div className="bg-white p-6 rounded-3xl border border-orange-100 shadow-sm relative overflow-hidden group">
                            <div className="absolute top-0 left-0 w-1 h-full bg-orange-500"></div>
                            <div className="mb-4">
                                <h4 className="font-bold text-gray-900">2 Orders pending</h4>
                                <p className="text-sm text-gray-500">Awaiting your confirmation.</p>
                            </div>
                            <Link href="/admin/orders" className="block w-full text-center py-3 bg-gray-900 text-white rounded-xl text-sm font-bold hover:bg-black transition-colors">
                                Review Orders
                            </Link>
                        </div>
                    </section>

                    {/* SECTION 8: QUICK ACTIONS */}
                    <section>
                        <h3 className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-6">Quick Actions</h3>
                        <div className="grid grid-cols-2 gap-4">
                            <Link href="/admin/products/new" className="p-4 bg-white border border-gray-100 rounded-2xl flex flex-col items-center justify-center gap-2 hover:border-gray-300 transition-all hover:shadow-sm">
                                <Icon name="Plus" size={24} className="text-gray-900" />
                                <span className="text-xs font-bold text-gray-600">Add Product</span>
                            </Link>
                            <Link href="/admin/settings/store" className="p-4 bg-white border border-gray-100 rounded-2xl flex flex-col items-center justify-center gap-2 hover:border-gray-300 transition-all hover:shadow-sm">
                                <Icon name="Share" size={20} className="text-gray-900" />
                                <span className="text-xs font-bold text-gray-600">Share Store</span>
                            </Link>
                            <Link href="/admin/whatsapp" className="p-4 bg-white border border-gray-100 rounded-2xl flex flex-col items-center justify-center gap-2 hover:border-gray-300 transition-all hover:shadow-sm">
                                <Icon name="MessageCircle" size={20} className="text-gray-900" />
                                <span className="text-xs font-bold text-gray-600">WhatsApp</span>
                            </Link>
                            <Link href="/admin/settings" className="p-4 bg-white border border-gray-100 rounded-2xl flex flex-col items-center justify-center gap-2 hover:border-gray-300 transition-all hover:shadow-sm">
                                <Icon name="Settings" size={20} className="text-gray-900" />
                                <span className="text-xs font-bold text-gray-600">Settings</span>
                            </Link>
                        </div>
                    </section>
                </div>
            </div>
        </div>
    );
};
