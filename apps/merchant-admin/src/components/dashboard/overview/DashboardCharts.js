"use client";
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, Legend, } from "recharts";
import { cn } from "@vayva/ui";
export const RevenueAreaChart = ({ data }) => {
    return (_jsxs("div", { className: "bg-white p-6 rounded-3xl border border-gray-100 shadow-sm h-96", children: [_jsxs("div", { className: "flex items-center justify-between mb-6", children: [_jsxs("div", { children: [_jsx("h3", { className: "text-lg font-bold text-gray-900", children: "Revenue Performance" }), _jsx("p", { className: "text-sm text-gray-500", children: "Last 7 Days" })] }), _jsxs("div", { className: "flex gap-2", children: [_jsx("span", { className: "w-3 h-3 rounded-full bg-green-500" }), _jsx("span", { className: "text-xs text-gray-500 font-medium", children: "Revenue" })] })] }), _jsx("div", { className: "h-[300px] w-full", children: _jsx(ResponsiveContainer, { width: "100%", height: "100%", children: _jsxs(AreaChart, { data: data, margin: { top: 10, right: 10, left: -20, bottom: 0 }, children: [_jsx("defs", { children: _jsxs("linearGradient", { id: "colorRevenue", x1: "0", y1: "0", x2: "0", y2: "1", children: [_jsx("stop", { offset: "5%", stopColor: "#22c55e", stopOpacity: 0.1 }), _jsx("stop", { offset: "95%", stopColor: "#22c55e", stopOpacity: 0 })] }) }), _jsx(CartesianGrid, { vertical: false, stroke: "#E2E8F0", strokeDasharray: "3 3" }), _jsx(XAxis, { dataKey: "date", axisLine: false, tickLine: false, tick: { fill: "#94A3B8", fontSize: 12 }, dy: 10 }), _jsx(YAxis, { axisLine: false, tickLine: false, tick: { fill: "#94A3B8", fontSize: 12 }, tickFormatter: (value) => `₦${value / 1000}k` }), _jsx(Tooltip, { contentStyle: {
                                    backgroundColor: "#1E293B",
                                    border: "none",
                                    borderRadius: "12px",
                                    padding: "12px",
                                    boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1)",
                                }, itemStyle: { color: "#fff", fontSize: "12px", fontWeight: 600 }, labelStyle: {
                                    color: "#94A3B8",
                                    fontSize: "11px",
                                    marginBottom: "4px",
                                }, formatter: (value) => [
                                    `₦${(value || 0).toLocaleString()}`,
                                    "Revenue",
                                ] }), _jsx(Area, { type: "monotone", dataKey: "revenue", stroke: "#22c55e", strokeWidth: 3, fillOpacity: 1, fill: "url(#colorRevenue)" })] }) }) })] }));
};
export const OrdersBreakdownChart = ({ data }) => {
    return (_jsxs("div", { className: "bg-white p-6 rounded-3xl border border-gray-100 shadow-sm h-96 flex flex-col", children: [_jsx("div", { className: "flex items-center justify-between mb-6", children: _jsxs("div", { children: [_jsx("h3", { className: "text-lg font-bold text-gray-900", children: "Order Volume" }), _jsx("p", { className: "text-sm text-gray-500", children: "Daily Breakdown" })] }) }), _jsx("div", { className: "flex-1 w-full min-h-0", children: _jsx(ResponsiveContainer, { width: "100%", height: "100%", children: _jsxs(BarChart, { data: data, margin: { top: 20, right: 30, left: -20, bottom: 5 }, children: [_jsx(CartesianGrid, { vertical: false, stroke: "#E2E8F0", strokeDasharray: "3 3" }), _jsx(XAxis, { dataKey: "date", axisLine: false, tickLine: false, tick: { fill: "#94A3B8", fontSize: 12 }, dy: 10 }), _jsx(YAxis, { axisLine: false, tickLine: false, tick: { fill: "#94A3B8", fontSize: 12 } }), _jsx(Tooltip, { cursor: { fill: "#F1F5F9" }, contentStyle: {
                                    backgroundColor: "#fff",
                                    border: "1px solid #E2E8F0",
                                    borderRadius: "12px",
                                    boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
                                }, labelStyle: {
                                    color: "#64748B",
                                    fontSize: "11px",
                                    marginBottom: "4px",
                                }, itemStyle: { fontSize: "12px", fontWeight: 600 } }), _jsx(Legend, { wrapperStyle: { paddingTop: "20px" }, iconType: "circle", formatter: (value) => (_jsx("span", { className: "text-xs font-bold text-gray-500 ml-1", children: value })) }), _jsx(Bar, { dataKey: "completed", stackId: "a", fill: "#22c55e", radius: [0, 0, 4, 4], name: "Completed", barSize: 20 }), _jsx(Bar, { dataKey: "pending", stackId: "a", fill: "#F59E0B", name: "Pending", barSize: 20 }), _jsx(Bar, { dataKey: "cancelled", stackId: "a", fill: "#EF4444", radius: [4, 4, 0, 0], name: "Cancelled", barSize: 20 })] }) }) })] }));
};
export const FulfillmentSpeed = ({ avgTime, targetTime, percentage, status, }) => {
    const color = status === "OPTIMAL"
        ? "bg-green-500"
        : status === "SLOW"
            ? "bg-yellow-500"
            : "bg-red-500";
    const textColor = status === "OPTIMAL"
        ? "text-green-600"
        : status === "SLOW"
            ? "text-yellow-600"
            : "text-red-600";
    const bg = status === "OPTIMAL"
        ? "bg-green-50"
        : status === "SLOW"
            ? "bg-yellow-50"
            : "bg-red-50";
    return (_jsxs("div", { className: "bg-white p-6 rounded-3xl border border-gray-100 shadow-sm flex flex-col justify-center h-full", children: [_jsx("h3", { className: "text-sm font-bold text-gray-400 uppercase tracking-widest mb-4", children: "Fulfillment Speed" }), _jsxs("div", { className: "flex items-end gap-2 mb-2", children: [_jsx("span", { className: "text-4xl font-bold text-gray-900", children: avgTime }), _jsx("span", { className: "text-sm text-gray-500 mb-1", children: "avg. delivery" })] }), _jsx("div", { className: "w-full h-3 bg-gray-100 rounded-full overflow-hidden mb-3", children: _jsx("div", { className: cn("h-full rounded-full transition-all duration-1000", color), style: { width: `${percentage}%` } }) }), _jsxs("div", { className: "flex justify-between items-center text-xs", children: [_jsxs("span", { className: "text-gray-400", children: ["Target: ", targetTime] }), _jsx("span", { className: cn("font-bold px-2 py-0.5 rounded-full", bg, textColor), children: status })] })] }));
};
