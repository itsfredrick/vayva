"use client";
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useEffect } from "react";
import { Badge, Button, Card } from "@vayva/ui";
import { Users, TrendingUp, AlertCircle, Sparkles, Mail } from "lucide-react";
import { logger, ErrorCategory } from "@/lib/logger";
export default function InsightsPage() {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    useEffect(() => {
        const fetchInsights = async () => {
            try {
                const res = await fetch("/api/customers/insights");
                const json = await res.json();
                if (json.stats)
                    setData(json);
            }
            catch (e) {
                logger.error("Failed to load customer insights", ErrorCategory.API, e);
            }
            finally {
                setLoading(false);
            }
        };
        fetchInsights();
    }, []);
    const segments = [
        {
            id: "vip",
            title: "VIP Customers",
            icon: Sparkles,
            color: "text-yellow-500",
            bg: "bg-yellow-500/10",
        },
        {
            id: "loyal",
            title: "Loyal Regulars",
            icon: Users,
            color: "text-blue-500",
            bg: "bg-blue-500/10",
        },
        {
            id: "new",
            title: "Recent & Promising",
            icon: TrendingUp,
            color: "text-green-500",
            bg: "bg-green-500/10",
        },
        {
            id: "atRisk",
            title: "At Risk",
            icon: AlertCircle,
            color: "text-red-500",
            bg: "bg-red-500/10",
        },
    ];
    if (loading)
        return _jsx("div", { className: "p-10 text-center", children: "Loading Insights..." });
    return (_jsxs("div", { className: "space-y-8", children: [_jsxs("div", { className: "flex items-center justify-between", children: [_jsxs("div", { children: [_jsx("h1", { className: "text-2xl font-headings font-bold", children: "Smart Insights" }), _jsx("p", { className: "text-text-secondary", children: "AI-driven segmentation to boost your retention." })] }), _jsxs("div", { className: "flex items-center gap-2 px-3 py-1 bg-gradient-to-r from-purple-500/20 to-blue-500/20 border border-purple-500/30 rounded-full text-xs font-bold text-purple-300", children: [_jsx(Sparkles, { size: 12 }), "PREMIUM FEATURE"] })] }), _jsxs("div", { className: "grid grid-cols-3 gap-4", children: [_jsxs(Card, { className: "p-6 space-y-2", children: [_jsx("div", { className: "text-sm text-text-secondary", children: "Total Processed Revenue" }), _jsxs("div", { className: "text-3xl font-bold font-mono", children: ["\u20BA", data?.stats?.totalRevenue?.toLocaleString()] })] }), _jsxs(Card, { className: "p-6 space-y-2", children: [_jsx("div", { className: "text-sm text-text-secondary", children: "Total Orders" }), _jsx("div", { className: "text-3xl font-bold font-mono", children: data?.stats?.totalOrders })] }), _jsxs(Card, { className: "p-6 space-y-2", children: [_jsx("div", { className: "text-sm text-text-secondary", children: "Average Order Value" }), _jsxs("div", { className: "text-3xl font-bold font-mono", children: ["\u20BA", Math.round(data?.stats?.averageOrderValue || 0).toLocaleString()] })] })] }), _jsx("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-6", children: segments.map((s) => {
                    const segData = data?.segments?.[s.id] || { count: 0, revenue: 0 };
                    return (_jsxs(Card, { className: "p-6 flex flex-col justify-between h-48 hover:border-primary/40 transition-colors group", children: [_jsxs("div", { className: "flex justify-between items-start", children: [_jsx("div", { className: `p-3 rounded-xl ${s.bg} ${s.color}`, children: _jsx(s.icon, { size: 24 }) }), _jsxs(Badge, { variant: "default", className: "bg-white/5", children: [segData.count, " Customers"] })] }), _jsxs("div", { children: [_jsx("h3", { className: "text-lg font-bold", children: s.title }), _jsxs("p", { className: "text-sm text-text-secondary", children: ["Est. Value: \u20BA", segData.revenue.toLocaleString()] })] }), _jsxs(Button, { variant: "ghost", className: "w-full justify-between group-hover:bg-white/5", onClick: () => {
                                    const csvContent = "data:text/csv;charset=utf-8," +
                                        "Segment,Count,Revenue\n" +
                                        `${s.title},${segData.count},${segData.revenue}`;
                                    const encodedUri = encodeURI(csvContent);
                                    const link = document.createElement("a");
                                    link.setAttribute("href", encodedUri);
                                    link.setAttribute("download", `${s.id}_segment_export.csv`);
                                    document.body.appendChild(link);
                                    link.click();
                                    document.body.removeChild(link);
                                }, children: [_jsx("span", { children: "Export List" }), _jsx(Mail, { size: 16 })] })] }, s.id));
                }) })] }));
}
