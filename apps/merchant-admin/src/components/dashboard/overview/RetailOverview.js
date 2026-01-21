"use client";
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect, useState } from "react";
import { Icon, cn } from "@vayva/ui";
import Link from "next/link";
import { RevenueAreaChart, OrdersBreakdownChart, FulfillmentSpeed, } from "./DashboardCharts";
export const RetailOverview = () => {
    const [context, setContext] = useState(null);
    const [data, setData] = useState(null);
    const [activity, setActivity] = useState([]);
    const [loading, setLoading] = useState(true);
    useEffect(() => {
        const loadData = async () => {
            try {
                // In real app, use SWR or React Query
                const [ctxRes, metricsRes, activityRes] = await Promise.all([
                    fetch("/api/dashboard/context").then((r) => r.json()),
                    fetch("/api/dashboard/metrics").then((r) => r.json()),
                    fetch("/api/dashboard/activity").then((r) => r.json()),
                ]);
                setContext(ctxRes);
                setData(metricsRes);
                setActivity(activityRes);
            }
            catch (e) {
                console.error("Dashboard data load failed", e);
            }
            finally {
                setLoading(false);
            }
        };
        loadData();
    }, []);
    if (loading) {
        return (_jsx("div", { className: "p-12 text-center text-gray-400 font-medium", children: "Preparing your workspace..." }));
    }
    const StatusCard = ({ label, status, icon, healthy, detail, }) => (_jsxs("div", { className: cn("group flex items-center gap-3 p-4 rounded-2xl border transition-all cursor-pointer hover:scale-[1.02]", healthy
            ? "bg-white border-gray-100 hover:border-gray-200"
            : "bg-orange-50 border-orange-100"), children: [_jsx("div", { className: cn("w-10 h-10 rounded-xl flex items-center justify-center shrink-0 transition-colors", healthy
                    ? "bg-gray-50 text-gray-900 group-hover:bg-green-50 group-hover:text-green-600"
                    : "bg-white text-orange-600 shadow-sm"), children: _jsx(Icon, { name: icon, size: 18 }) }), _jsxs("div", { children: [_jsx("p", { className: "text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-0.5", children: label }), _jsxs("div", { className: "flex items-center gap-2", children: [_jsx("span", { className: cn("text-sm font-bold", healthy ? "text-gray-900" : "text-orange-700"), children: status }), !healthy && (_jsx("span", { className: "w-2 h-2 rounded-full bg-orange-500 animate-pulse" }))] }), detail && (_jsx("p", { className: "text-[10px] text-gray-400 mt-1 opacity-0 group-hover:opacity-100 transition-opacity", children: detail }))] })] }));
    return (_jsxs("div", { className: "space-y-8 animate-in fade-in duration-500 pb-20", children: [_jsx("section", { className: "flex flex-col md:flex-row md:items-end justify-between gap-4", children: _jsxs("div", { children: [_jsxs("h1", { className: "text-3xl font-heading font-bold text-gray-900 mb-2", children: ["Welcome back, ", context?.firstName, " \uD83D\uDC4B"] }), _jsx("p", { className: "text-gray-500 text-lg", children: "Here\u2019s what\u2019s happening in your business today." })] }) }), _jsxs("section", { className: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4", children: [_jsx(StatusCard, { label: "Storefront", status: context?.storeStatus === "LIVE" ? "Live" : "Draft", icon: "Store", healthy: context?.storeStatus === "LIVE", detail: "Last synced: 2m ago" }), _jsx(StatusCard, { label: "Payments", status: context?.paymentStatus === "CONNECTED" ? "Active" : "Pending", icon: "CreditCard", healthy: context?.paymentStatus === "CONNECTED", detail: "Last txn: 12:45 PM" }), _jsx(StatusCard, { label: "WhatsApp", status: context?.whatsappStatus === "CONNECTED" ? "Connected" : "Attention", icon: "MessageCircle", healthy: context?.whatsappStatus === "CONNECTED", detail: "Webhook: Active" }), _jsx(StatusCard, { label: "KYC", status: context?.kycStatus === "VERIFIED" ? "Verified" : "Action Required", icon: "ShieldCheck", healthy: context?.kycStatus === "VERIFIED", detail: "Level 2 Approved" })] }), _jsx("section", { children: _jsx("div", { className: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6", children: data?.metrics &&
                        Object.values(data.metrics).map((m, i) => (_jsxs("div", { className: "bg-white p-6 rounded-3xl border border-gray-100 shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow", children: [_jsx("p", { className: "text-xs font-bold text-gray-400 uppercase tracking-widest mb-2", children: m.label }), _jsxs("div", { className: "flex items-end justify-between", children: [_jsx("p", { className: "text-3xl font-bold text-gray-900", children: m.value }), _jsx("div", { className: cn("flex items-center text-xs font-bold px-2 py-1 rounded-full", m.trend === "up"
                                                ? "bg-green-50 text-green-700"
                                                : m.trend === "down"
                                                    ? "bg-red-50 text-red-700"
                                                    : "bg-gray-50 text-gray-600"), children: m.trend === "up" ? "↗" : m.trend === "down" ? "↘" : "–" })] })] }, i))) }) }), _jsxs("section", { className: "grid grid-cols-1 lg:grid-cols-3 gap-6", children: [_jsx("div", { className: "lg:col-span-2", children: data?.charts && _jsx(RevenueAreaChart, { data: data.charts.revenue }) }), _jsxs("div", { className: "space-y-6", children: [data?.charts && _jsx(FulfillmentSpeed, { ...data.charts.fulfillment }), data?.charts && (_jsx("div", { className: "h-48", children: _jsxs("div", { className: "bg-white p-6 rounded-3xl border border-gray-100 shadow-sm h-full flex flex-col justify-center items-center text-center", children: [_jsx("h3", { className: "text-sm font-bold text-gray-400 uppercase tracking-widest mb-2", children: "Pending Orders" }), _jsx("p", { className: "text-4xl font-bold text-orange-500", children: "3" }), _jsx("p", { className: "text-sm text-gray-500", children: "Needs attention" })] }) }))] })] }), _jsx("section", { className: "grid grid-cols-1 lg:grid-cols-2 gap-6 w-full", children: _jsx("div", { className: "w-full", children: data?.charts && _jsx(OrdersBreakdownChart, { data: data.charts.orders }) }) }), _jsxs("div", { className: "grid grid-cols-1 lg:grid-cols-3 gap-10", children: [_jsxs("div", { className: "lg:col-span-2 space-y-6", children: [_jsxs("div", { className: "flex items-center justify-between", children: [_jsx("h3", { className: "text-sm font-bold text-gray-400 uppercase tracking-widest", children: "Live Activity" }), _jsx(Link, { href: "/admin/activity", className: "text-sm font-bold text-gray-900 hover:underline", children: "View all" })] }), _jsx("div", { className: "bg-white rounded-[32px] border border-gray-100 shadow-sm overflow-hidden", children: activity.map((item, i) => (_jsxs("div", { className: cn("p-6 flex items-center gap-4 hover:bg-gray-50 transition-colors cursor-pointer", i !== activity.length - 1 && "border-b border-gray-50"), children: [_jsx("div", { className: cn("w-12 h-12 rounded-2xl flex items-center justify-center text-xl shrink-0", item.type === "ORDER"
                                                ? "bg-blue-50 text-blue-600"
                                                : item.type === "PAYMENT"
                                                    ? "bg-green-50 text-green-600"
                                                    : item.type === "WHATSAPP"
                                                        ? "bg-green-100 text-[#075E54]"
                                                        : "bg-gray-100 text-gray-600"), children: _jsx(Icon, { name: item.type === "ORDER"
                                                    ? "ShoppingBag"
                                                    : item.type === "PAYMENT"
                                                        ? "Banknote"
                                                        : item.type === "WHATSAPP"
                                                            ? "MessageCircle"
                                                            : "Calendar", size: 20 }) }), _jsxs("div", { className: "flex-1 min-w-0", children: [_jsx("p", { className: "text-sm font-bold text-gray-900 truncate", children: item.message }), _jsxs("p", { className: "text-xs text-gray-500 font-medium", children: [item.user, " \u2022 ", item.type] })] }), _jsx("span", { className: "text-xs font-bold text-gray-400 whitespace-nowrap", children: item.time })] }, item.id))) })] }), _jsxs("div", { className: "space-y-10", children: [_jsxs("section", { children: [_jsx("h3", { className: "text-sm font-bold text-gray-400 uppercase tracking-widest mb-6", children: "Action Required" }), _jsxs("div", { className: "bg-white p-6 rounded-3xl border border-orange-100 shadow-sm relative overflow-hidden group", children: [_jsx("div", { className: "absolute top-0 left-0 w-1 h-full bg-orange-500" }), _jsxs("div", { className: "mb-4", children: [_jsx("h4", { className: "font-bold text-gray-900", children: "2 Orders pending" }), _jsx("p", { className: "text-sm text-gray-500", children: "Awaiting your confirmation." })] }), _jsx(Link, { href: "/dashboard/orders", className: "block w-full text-center py-3 bg-gray-900 text-white rounded-xl text-sm font-bold hover:bg-black transition-colors", children: "Review Orders" })] })] }), _jsxs("section", { children: [_jsx("h3", { className: "text-sm font-bold text-gray-400 uppercase tracking-widest mb-6", children: "Quick Actions" }), _jsxs("div", { className: "grid grid-cols-2 gap-4", children: [_jsxs(Link, { href: "/dashboard/products/new", className: "p-4 bg-white border border-gray-100 rounded-2xl flex flex-col items-center justify-center gap-2 hover:border-gray-300 transition-all hover:shadow-sm", children: [_jsx(Icon, { name: "Plus", size: 24, className: "text-gray-900" }), _jsx("span", { className: "text-xs font-bold text-gray-600", children: "Add Product" })] }), _jsxs(Link, { href: "/dashboard/settings/store", className: "p-4 bg-white border border-gray-100 rounded-2xl flex flex-col items-center justify-center gap-2 hover:border-gray-300 transition-all hover:shadow-sm", children: [_jsx(Icon, { name: "Share", size: 20, className: "text-gray-900" }), _jsx("span", { className: "text-xs font-bold text-gray-600", children: "Share Store" })] }), _jsxs(Link, { href: "/dashboard/whatsapp", className: "p-4 bg-white border border-gray-100 rounded-2xl flex flex-col items-center justify-center gap-2 hover:border-gray-300 transition-all hover:shadow-sm", children: [_jsx(Icon, { name: "MessageCircle", size: 20, className: "text-gray-900" }), _jsx("span", { className: "text-xs font-bold text-gray-600", children: "WhatsApp" })] }), _jsxs(Link, { href: "/dashboard/settings", className: "p-4 bg-white border border-gray-100 rounded-2xl flex flex-col items-center justify-center gap-2 hover:border-gray-300 transition-all hover:shadow-sm", children: [_jsx(Icon, { name: "Settings", size: 20, className: "text-gray-900" }), _jsx("span", { className: "text-xs font-bold text-gray-600", children: "Settings" })] })] })] })] })] })] }));
};
