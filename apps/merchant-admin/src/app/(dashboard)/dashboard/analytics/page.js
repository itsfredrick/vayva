"use client";
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip } from "recharts";
import { ArrowUpRight, DollarSign, Users, ShoppingBag } from "lucide-react";
import { PermissionGate } from "@/components/auth/PermissionGate";
import { PERMISSIONS } from "@/lib/core/permissions";
export default function AnalyticsPage() {
    const [range, setRange] = useState("7d");
    const [data, setData] = useState(null);
    const [insights, setInsights] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    useEffect(() => {
        fetchData();
        fetchInsights();
    }, [range]);
    const fetchData = async () => {
        setIsLoading(true);
        try {
            const res = await fetch(`/api/analytics/overview?range=${range}`);
            if (!res.ok)
                throw new Error("Failed");
            const json = await res.json();
            setData(json);
        }
        catch (error) {
            toast.error("Failed to load analytics");
        }
        finally {
            setIsLoading(false);
        }
    };
    const fetchInsights = async () => {
        try {
            const res = await fetch("/api/analytics/insights");
            if (res.ok) {
                const json = await res.json();
                setInsights(json.insights || []);
            }
        }
        catch (e) {
            // silent fail
        }
    };
    return (_jsxs("div", { className: "space-y-6", children: [_jsxs("div", { className: "flex justify-between items-center", children: [_jsx("h2", { className: "text-3xl font-bold tracking-tight", children: "Overview" }), _jsx("div", { className: "flex items-center space-x-2", children: _jsxs(Select, { value: range, onValueChange: setRange, children: [_jsx(SelectTrigger, { className: "w-[180px]", children: _jsx(SelectValue, { placeholder: "Select Range" }) }), _jsxs(SelectContent, { children: [_jsx(SelectItem, { value: "7d", children: "Last 7 Days" }), _jsx(SelectItem, { value: "30d", children: "Last 30 Days" }), _jsx(SelectItem, { value: "90d", children: "Last 90 Days" })] })] }) })] }), _jsxs("div", { className: "grid gap-4 md:grid-cols-2 lg:grid-cols-4", children: [_jsx(PermissionGate, { permission: PERMISSIONS.FINANCE_VIEW, children: _jsx(MetricCard, { title: "Total Revenue", value: data ? `₦${data.totalSales.toLocaleString()}` : "...", icon: DollarSign, loading: isLoading }) }), _jsx(MetricCard, { title: "Orders", value: data ? data.totalOrders : "...", icon: ShoppingBag, loading: isLoading }), _jsx(MetricCard, { title: "Active Customers", value: data ? data.activeCustomers : "...", icon: Users, loading: isLoading }), _jsx(PermissionGate, { permission: PERMISSIONS.FINANCE_VIEW, children: _jsx(MetricCard, { title: "Avg Order Value", value: data ? `₦${Math.round(data.aov).toLocaleString()}` : "...", icon: ArrowUpRight, subtext: "Average per order", loading: isLoading }) })] }), _jsxs("div", { className: "grid gap-4 md:grid-cols-2 lg:grid-cols-7", children: [_jsxs(Card, { className: "col-span-4 transition-all hover:shadow-md", children: [_jsx(CardHeader, { children: _jsx(CardTitle, { children: "Sales Overview" }) }), _jsxs(CardContent, { className: "pl-2", children: [isLoading ? (_jsx(Skeleton, { className: "h-[350px] w-full" })) : (_jsx("div", { className: "h-[350px]", children: _jsx(ResponsiveContainer, { width: "100%", height: "100%", children: _jsxs(BarChart, { data: data?.chartData || [], children: [_jsx(XAxis, { dataKey: "date", stroke: "#888888", fontSize: 12, tickLine: false, axisLine: false }), _jsx(YAxis, { stroke: "#888888", fontSize: 12, tickLine: false, axisLine: false, tickFormatter: (value) => `₦${value}` }), _jsx(Tooltip, { cursor: { fill: 'transparent' }, contentStyle: { borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' } }), _jsx(Bar, { dataKey: "sales", fill: "#000000", radius: [4, 4, 0, 0] })] }) }) })), data?.chartData?.length === 0 && !isLoading && (_jsx("div", { className: "flex h-full items-center justify-center text-gray-500", children: "No data available" }))] })] }), _jsxs(Card, { className: "col-span-3 transition-all hover:shadow-md", children: [_jsx(CardHeader, { children: _jsx(CardTitle, { children: "AI Insights" }) }), _jsx(CardContent, { children: isLoading ? (_jsxs("div", { className: "space-y-2", children: [_jsx(Skeleton, { className: "h-4 w-full" }), _jsx(Skeleton, { className: "h-4 w-[80%]" })] })) : insights.length > 0 ? (_jsx("div", { className: "space-y-4", children: insights.map((insight, i) => (_jsxs("div", { className: "flex items-start gap-4 p-3 bg-gray-50 rounded-lg text-sm", children: [_jsx("div", { className: "mt-1", children: "\u2728" }), _jsx("p", { children: insight.text })] }, i))) })) : (_jsx("div", { className: "text-sm text-gray-500 text-center py-8", children: "No significant trends detected yet." })) })] })] })] }));
}
function MetricCard({ title, value, icon: Icon, subtext, loading }) {
    return (_jsxs(Card, { children: [_jsxs(CardHeader, { className: "flex flex-row items-center justify-between space-y-0 pb-2", children: [_jsx(CardTitle, { className: "text-sm font-medium", children: title }), _jsx(Icon, { className: "h-4 w-4 text-muted-foreground" })] }), _jsxs(CardContent, { children: [loading ? _jsx(Skeleton, { className: "h-8 w-20" }) : _jsx("div", { className: "text-2xl font-bold", children: value }), subtext && _jsx("p", { className: "text-xs text-muted-foreground", children: subtext })] })] }));
}
