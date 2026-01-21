"use client";
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowUpRight, ArrowDownRight, TrendingUp, DollarSign, Package, CreditCard } from "lucide-react";
import { Area, AreaChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
export default function RevenueDashboardPage() {
    const [data, setData] = useState(null);
    const [chartData, setChartData] = useState([]);
    const [loading, setLoading] = useState(true);
    useEffect(() => {
        Promise.all([
            fetch("/api/revenue/summary").then((res) => res.json()),
            fetch("/api/revenue/historical").then((res) => res.json()),
        ])
            .then(([summaryData, historicalData]) => {
            setData(summaryData);
            setChartData(historicalData);
        })
            .catch((err) => console.error(err))
            .finally(() => setLoading(false));
    }, []);
    if (loading) {
        return (_jsx("div", { className: "flex items-center justify-center min-h-[400px]", children: _jsx("div", { className: "animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900" }) }));
    }
    if (!data) {
        return _jsx("div", { children: "Failed to load revenue data" });
    }
    const formatCurrency = (amount) => {
        return `₦${amount.toLocaleString()}`;
    };
    const formatPercent = (value) => {
        return `${(value * 100).toFixed(1)}%`;
    };
    const metrics = [
        {
            title: "MRR",
            value: formatCurrency(data.summary.mrr),
            change: formatPercent(data.summary.growth.subscriptions),
            positive: data.summary.growth.subscriptions > 0,
            icon: TrendingUp,
            description: "Monthly Recurring Revenue",
        },
        {
            title: "Delivery Revenue",
            value: formatCurrency(data.summary.deliveryRevenue),
            change: `${data.delivery.totalDeliveries} deliveries`,
            positive: true,
            icon: Package,
            description: "This month",
        },
        {
            title: "Withdrawal Fees",
            value: formatCurrency(data.summary.withdrawalFees),
            change: `${data.withdrawals.count} withdrawals`,
            positive: true,
            icon: CreditCard,
            description: "1.5% platform fee",
        },
        {
            title: "Total Revenue",
            value: formatCurrency(data.summary.totalRevenue),
            change: "This month",
            positive: true,
            icon: DollarSign,
            description: "All revenue streams",
        },
    ];
    return (_jsxs("div", { className: "space-y-8 p-8", children: [_jsxs("div", { children: [_jsx("h1", { className: "text-3xl font-bold tracking-tight", children: "Platform Revenue" }), _jsx("p", { className: "text-muted-foreground", children: "Track subscription, delivery, and withdrawal fee revenue." })] }), _jsx("div", { className: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6", children: metrics.map((metric) => {
                    const Icon = metric.icon;
                    return (_jsxs(Card, { children: [_jsxs(CardHeader, { className: "flex flex-row items-center justify-between pb-2", children: [_jsx(CardTitle, { className: "text-sm font-medium text-muted-foreground", children: metric.title }), _jsx(Icon, { className: "h-4 w-4 text-muted-foreground" })] }), _jsxs(CardContent, { children: [_jsx("div", { className: "text-2xl font-bold", children: metric.value }), _jsxs("div", { className: "flex items-center gap-1 text-xs text-muted-foreground mt-1", children: [metric.positive ? (_jsx(ArrowUpRight, { className: "h-3 w-3 text-green-600" })) : (_jsx(ArrowDownRight, { className: "h-3 w-3 text-red-600" })), _jsx("span", { children: metric.change })] }), _jsx("p", { className: "text-xs text-muted-foreground mt-1", children: metric.description })] })] }, metric.title));
                }) }), _jsxs(Card, { children: [_jsxs(CardHeader, { children: [_jsx(CardTitle, { children: "Revenue Breakdown" }), _jsx(CardDescription, { children: "Monthly revenue by source" })] }), _jsx(CardContent, { children: _jsx(ResponsiveContainer, { width: "100%", height: 300, children: _jsxs(AreaChart, { data: chartData, children: [_jsx(XAxis, { dataKey: "month" }), _jsx(YAxis, {}), _jsx(Tooltip, { formatter: (value) => value ? formatCurrency(value) : "₦0", contentStyle: { background: "#fff", border: "1px solid #ccc" } }), _jsx(Area, { type: "monotone", dataKey: "subscriptions", stackId: "1", stroke: "#8884d8", fill: "#8884d8", name: "Subscriptions" }), _jsx(Area, { type: "monotone", dataKey: "delivery", stackId: "1", stroke: "#82ca9d", fill: "#82ca9d", name: "Delivery" }), _jsx(Area, { type: "monotone", dataKey: "withdrawal", stackId: "1", stroke: "#ffc658", fill: "#ffc658", name: "Withdrawal Fees" })] }) }) })] }), _jsxs("div", { className: "grid grid-cols-1 md:grid-cols-3 gap-6", children: [_jsxs(Card, { children: [_jsx(CardHeader, { children: _jsx(CardTitle, { children: "Subscription Health" }) }), _jsxs(CardContent, { className: "space-y-2", children: [_jsxs("div", { className: "flex justify-between text-sm", children: [_jsx("span", { className: "text-muted-foreground", children: "Active Merchants" }), _jsx("span", { className: "font-semibold", children: data.subscriptions.activeCount })] }), _jsxs("div", { className: "flex justify-between text-sm", children: [_jsx("span", { className: "text-muted-foreground", children: "Free Users" }), _jsx("span", { className: "font-semibold", children: data.subscriptions.planDistribution.FREE || 0 })] }), _jsxs("div", { className: "flex justify-between text-sm", children: [_jsx("span", { className: "text-muted-foreground", children: "Starter Plan" }), _jsx("span", { className: "font-semibold", children: data.subscriptions.planDistribution.STARTER || 0 })] }), _jsxs("div", { className: "flex justify-between text-sm", children: [_jsx("span", { className: "text-muted-foreground", children: "Pro Plan" }), _jsx("span", { className: "font-semibold", children: data.subscriptions.planDistribution.PRO || 0 })] }), _jsxs("div", { className: "flex justify-between text-sm pt-2 border-t", children: [_jsx("span", { className: "text-muted-foreground", children: "ARR" }), _jsx("span", { className: "font-bold", children: formatCurrency(data.summary.arr) })] })] })] }), _jsxs(Card, { children: [_jsx(CardHeader, { children: _jsx(CardTitle, { children: "Delivery Economics" }) }), _jsxs(CardContent, { className: "space-y-2", children: [_jsxs("div", { className: "flex justify-between text-sm", children: [_jsx("span", { className: "text-muted-foreground", children: "Total Deliveries" }), _jsx("span", { className: "font-semibold", children: data.delivery.totalDeliveries })] }), _jsxs("div", { className: "flex justify-between text-sm", children: [_jsx("span", { className: "text-muted-foreground", children: "Avg Fee" }), _jsx("span", { className: "font-semibold", children: formatCurrency(data.delivery.avgFee) })] }), _jsxs("div", { className: "flex justify-between text-sm pt-2 border-t", children: [_jsx("span", { className: "text-muted-foreground", children: "Total Revenue" }), _jsx("span", { className: "font-bold", children: formatCurrency(data.delivery.totalRevenue) })] })] })] }), _jsxs(Card, { children: [_jsx(CardHeader, { children: _jsx(CardTitle, { children: "Withdrawal Activity" }) }), _jsxs(CardContent, { className: "space-y-2", children: [_jsxs("div", { className: "flex justify-between text-sm", children: [_jsx("span", { className: "text-muted-foreground", children: "Total Volume" }), _jsx("span", { className: "font-semibold", children: formatCurrency(data.withdrawals.totalVolume) })] }), _jsxs("div", { className: "flex justify-between text-sm", children: [_jsx("span", { className: "text-muted-foreground", children: "Avg Withdrawal" }), _jsx("span", { className: "font-semibold", children: formatCurrency(data.withdrawals.avgWithdrawal) })] }), _jsxs("div", { className: "flex justify-between text-sm pt-2 border-t", children: [_jsx("span", { className: "text-muted-foreground", children: "Platform Fee (1.5%)" }), _jsx("span", { className: "font-bold", children: formatCurrency(data.withdrawals.feeRevenue) })] })] })] })] })] }));
}
