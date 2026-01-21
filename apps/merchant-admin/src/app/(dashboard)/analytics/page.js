import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { requireAuth } from "@/lib/auth/session";
import { AnalyticsService } from "@/lib/analytics/service";
import { TrendChart } from "@/components/trend-chart";
import { Icon } from "@vayva/ui";
export default async function AnalyticsPage() {
    const session = await requireAuth();
    const storeId = session.user.storeId;
    const range = {
        from: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), // Last 30 days
        to: new Date()
    };
    const [funnel, dailyRevenue, eventCounts] = await Promise.all([
        AnalyticsService.getCheckoutFunnel(storeId, range),
        AnalyticsService.getDailyRevenue(storeId, range),
        AnalyticsService.getEventCounts(storeId, range)
    ]);
    const totalRevenue = dailyRevenue.reduce((acc, curr) => acc + curr, 0);
    return (_jsxs("div", { className: "p-6 md:p-8 max-w-7xl mx-auto space-y-8", children: [_jsxs("div", { children: [_jsx("h1", { className: "text-2xl font-bold", children: "Analytics" }), _jsx("p", { className: "text-gray-500 text-sm", children: "Performance insights for the last 30 days" })] }), _jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-6", children: [_jsxs("div", { className: "bg-white p-6 rounded-2xl border border-gray-100 shadow-sm md:col-span-2", children: [_jsxs("div", { className: "flex justify-between items-end mb-6", children: [_jsxs("div", { children: [_jsx("p", { className: "text-sm font-medium text-gray-400 uppercase tracking-wider mb-1", children: "Total Revenue (30d)" }), _jsxs("h2", { className: "text-3xl font-bold font-mono", children: ["\u20A6", totalRevenue.toLocaleString()] })] }), _jsxs("div", { className: "flex items-center gap-1 text-green-600 font-bold text-sm bg-green-50 px-2 py-1 rounded-full", children: [_jsx(Icon, { name: "TrendingUp", size: 14 }), _jsx("span", { children: "Live" })] })] }), _jsx("div", { className: "h-64", children: _jsx(TrendChart, { data: dailyRevenue, color: "#10B981", height: 250 }) })] }), _jsxs("div", { className: "bg-white p-6 rounded-2xl border border-gray-100 shadow-sm", children: [_jsx("h3", { className: "text-lg font-bold mb-6", children: "Conversion Funnel" }), _jsx("div", { className: "space-y-4", children: funnel.map((step, i) => (_jsxs("div", { className: "relative", children: [_jsxs("div", { className: "flex justify-between text-sm font-medium mb-1", children: [_jsx("span", { children: step.step }), _jsx("span", { children: step.count })] }), _jsx("div", { className: "h-2 bg-gray-100 rounded-full overflow-hidden", children: _jsx("div", { className: "h-full bg-blue-600 rounded-full", style: { width: `${Math.max(5, (step.count / (funnel[0].count || 1)) * 100)}%` } }) }), i < funnel.length - 1 && (_jsx("div", { className: "absolute left-4 -bottom-4 z-10 text-gray-300", children: "\u2193" }))] }, step.step))) })] }), _jsxs("div", { className: "bg-white p-6 rounded-2xl border border-gray-100 shadow-sm", children: [_jsx("h3", { className: "text-lg font-bold mb-6", children: "Top Store Events" }), _jsxs("div", { className: "space-y-3", children: [eventCounts.slice(0, 5).map((event, i) => (_jsxs("div", { className: "flex justify-between items-center p-3 hover:bg-gray-50 rounded-lg transition-colors border border-transparent hover:border-gray-100", children: [_jsxs("div", { className: "flex items-center gap-3", children: [_jsx("div", { className: "w-8 h-8 rounded-full bg-indigo-50 flex items-center justify-center text-indigo-600 font-bold text-xs", children: i + 1 }), _jsxs("div", { children: [_jsx("p", { className: "font-medium text-sm text-gray-900", children: event.action }), _jsx("p", { className: "text-xs text-gray-500", children: event.category })] })] }), _jsx("span", { className: "font-mono font-bold text-sm", children: event.count })] }, i))), eventCounts.length === 0 && (_jsx("p", { className: "text-gray-400 text-sm text-center py-4", children: "No events recorded yet." }))] })] })] })] }));
}
