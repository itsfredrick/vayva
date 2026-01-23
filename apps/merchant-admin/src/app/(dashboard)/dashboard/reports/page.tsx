"use client";

import React, { useEffect, useState } from "react";
import { useUserPlan } from "../../../../hooks/useUserPlan";
import { PLANS } from "../../../../lib/billing/plans";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    AreaChart,
    Area
} from "recharts";
import { toast } from "sonner";
import { Button } from "@vayva/ui";
import { Loader2, TrendingUp, DollarSign, ShoppingBag } from "lucide-react";

interface ReportData {
    totalSales: number;
    totalOrders: number;
    aov: number;
    activeCustomers: number;
    chartData: Array<{ date: string; sales: number; orders: number }>;
}

export default function ReportsPage() {
    const { plan, isLoading: planLoading } = useUserPlan();
    const [data, setData] = useState<ReportData | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [range, setRange] = useState("30d");

    useEffect(() => {
        const fetchReport = async () => {
            setIsLoading(true);
            try {
                const res = await fetch(`/api/analytics/overview?range=${range}`);
                if (!res.ok) throw new Error("Failed to fetch");
                const json = await res.json();
                setData(json);
            } catch (e) {
                toast.error("Failed to load report data");
            } finally {
                setIsLoading(false);
            }
        };

        if (plan?.slug && (PLANS as any)[plan.slug]?.features.reports) {
            fetchReport();
        }
    }, [plan, range]);

    if (planLoading) return <div className="p-12 text-center text-gray-500 flex items-center justify-center gap-2"><Loader2 className="animate-spin h-5 w-5" /> Loading...</div>;

    const currentPlan = (PLANS as any)[plan?.slug || "free"];
    const canViewReports = currentPlan?.features.reports;

    if (!canViewReports) {
        return (
            <div className="p-8 max-w-2xl mx-auto text-center space-y-6">
                <div className="bg-amber-50 border border-amber-100 rounded-2xl p-12">
                    <TrendingUp className="mx-auto h-12 w-12 text-amber-500 mb-4" />
                    <h2 className="text-2xl font-black text-gray-900 mb-2">Upgrade to Pro</h2>
                    <p className="text-gray-600 mb-8">Detailed sales analytics and custom reports are available on our Pro plan.</p>
                    <Button
                        onClick={() => window.location.href = "/pricing"}
                        className="bg-black text-white px-8 py-3 rounded-full font-bold hover:bg-gray-800 transition-colors"
                    >
                        View Pricing
                    </Button>
                </div>
            </div>
        );
    }

    return (
        <div className="flex-1 space-y-8 p-8 max-w-7xl mx-auto animate-in fade-in duration-700">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-black tracking-tight text-gray-900">Sales Reports</h1>
                    <p className="text-gray-500 mt-1">Deep dive into your store's performance metrics.</p>
                </div>
                <div className="flex bg-gray-100 p-1 rounded-full">
                    {["7d", "30d", "90d"].map((r) => (
                        <Button
                            key={r}
                            variant="ghost"
                            onClick={() => setRange(r)}
                            className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all h-auto ${range === r ? "bg-white text-black shadow-sm" : "text-gray-500 hover:text-gray-700 hover:bg-transparent"}`}
                        >
                            {r.toUpperCase()}
                        </Button>
                    ))}
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <MetricCard
                    title="Gross Revenue"
                    value={data ? `₦${data.totalSales.toLocaleString()}` : "₦0"}
                    trend="+12%"
                    icon={DollarSign}
                    loading={isLoading}
                />
                <MetricCard
                    title="Total Orders"
                    value={data ? data.totalOrders : "0"}
                    trend="+5%"
                    icon={ShoppingBag}
                    loading={isLoading}
                />
                <MetricCard
                    title="Avg. Ticket"
                    value={data ? `₦${Math.round(data.aov).toLocaleString()}` : "₦0"}
                    trend="-2%"
                    icon={TrendingUp}
                    loading={isLoading}
                />
            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-7">
                <Card className="col-span-4 rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
                    <CardHeader className="bg-gray-50/50 p-6 border-b border-gray-100/50">
                        <CardTitle className="text-lg font-bold">Revenue Timeline</CardTitle>
                        <CardDescription>Daily gross sales across the selected period.</CardDescription>
                    </CardHeader>
                    <CardContent className="p-6">
                        <div className="h-[350px] w-full">
                            {isLoading ? (
                                <div className="h-full w-full bg-gray-50 animate-pulse rounded-2xl flex items-center justify-center">
                                    <Loader2 className="animate-spin text-gray-200" />
                                </div>
                            ) : (
                                <ResponsiveContainer width="100%" height="100%">
                                    <AreaChart data={data?.chartData || []}>
                                        <defs>
                                            <linearGradient id="colorSales" x1="0" y1="0" x2="0" y2="1">
                                                <stop offset="5%" stopColor="#000000" stopOpacity={0.1} />
                                                <stop offset="95%" stopColor="#000000" stopOpacity={0} />
                                            </linearGradient>
                                        </defs>
                                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                                        <XAxis
                                            dataKey="date"
                                            axisLine={false}
                                            tickLine={false}
                                            tick={{ fill: '#9CA3AF', fontSize: 10 }}
                                            dy={10}
                                        />
                                        <YAxis
                                            axisLine={false}
                                            tickLine={false}
                                            tick={{ fill: '#9CA3AF', fontSize: 10 }}
                                            tickFormatter={(val) => `₦${val}`}
                                        />
                                        <Tooltip
                                            contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }}
                                            labelStyle={{ fontWeight: 'bold', marginBottom: '4px' }}
                                        />
                                        <Area
                                            type="monotone"
                                            dataKey="sales"
                                            stroke="#000000"
                                            strokeWidth={3}
                                            fillOpacity={1}
                                            fill="url(#colorSales)"
                                            animationDuration={1500}
                                        />
                                    </AreaChart>
                                </ResponsiveContainer>
                            )}
                        </div>
                    </CardContent>
                </Card>

                <Card className="col-span-3 rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
                    <CardHeader className="bg-gray-50/50 p-6 border-b border-gray-100/50">
                        <CardTitle className="text-lg font-bold">Order Volume</CardTitle>
                        <CardDescription>Number of transactions per day.</CardDescription>
                    </CardHeader>
                    <CardContent className="p-6">
                        <div className="h-[350px] w-full">
                            {isLoading ? (
                                <div className="h-full w-full bg-gray-50 animate-pulse rounded-2xl flex items-center justify-center">
                                    <Loader2 className="animate-spin text-gray-200" />
                                </div>
                            ) : (
                                <ResponsiveContainer width="100%" height="100%">
                                    <LineChart data={data?.chartData || []}>
                                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                                        <XAxis
                                            dataKey="date"
                                            axisLine={false}
                                            tickLine={false}
                                            tick={{ fill: '#9CA3AF', fontSize: 10 }}
                                            dy={10}
                                        />
                                        <YAxis
                                            axisLine={false}
                                            tickLine={false}
                                            tick={{ fill: '#9CA3AF', fontSize: 10 }}
                                        />
                                        <Tooltip
                                            contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }}
                                        />
                                        <Line
                                            type="stepAfter"
                                            dataKey="orders"
                                            stroke="#6366F1"
                                            strokeWidth={3}
                                            dot={{ r: 4, fill: '#6366F1', strokeWidth: 2, stroke: '#FFFFFF' }}
                                            activeDot={{ r: 6 }}
                                            animationDuration={1500}
                                        />
                                    </LineChart>
                                </ResponsiveContainer>
                            )}
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}

function MetricCard({ title, value, trend, icon: Icon, loading }: { title: string, value: string | number, trend: string, icon: any, loading: boolean }) {
    return (
        <Card className="rounded-3xl border border-gray-100 shadow-sm overflow-hidden p-6 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-gray-50 rounded-2xl text-gray-600">
                    <Icon size={20} />
                </div>
                <span className={`text-xs font-bold px-2 py-1 rounded-full ${trend.startsWith('+') ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-600'}`}>
                    {trend}
                </span>
            </div>
            <div className="space-y-1">
                <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">{title}</p>
                {loading ? (
                    <div className="h-8 w-24 bg-gray-100 animate-pulse rounded-lg" />
                ) : (
                    <h3 className="text-2xl font-black text-gray-900">{value}</h3>
                )}
            </div>
        </Card>
    );
}
