import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Icon, cn } from "@vayva/ui";
export const ActivePerformanceCard = ({ data, }) => {
    const Metric = ({ label, value, delta, prefix = "", suffix = "", }) => (_jsxs("div", { className: "p-4 bg-gray-50 rounded-xl border border-gray-100", children: [_jsx("p", { className: "text-xs text-gray-500 font-medium mb-1", children: label }), _jsxs("div", { className: "flex items-end gap-2", children: [_jsxs("span", { className: "text-xl font-heading font-bold text-gray-900", children: [prefix, value, suffix] }), delta !== undefined && (_jsxs("span", { className: cn("text-xs font-bold mb-1 flex items-center", delta >= 0 ? "text-green-600" : "text-red-500"), children: [_jsx(Icon, { name: delta >= 0 ? "TrendingUp" : "TrendingDown", size: 12, className: "mr-0.5" }), Math.abs(delta), "%"] }))] })] }));
    const getHealthColor = (score) => {
        if (score >= 80)
            return "text-green-500";
        if (score >= 60)
            return "text-yellow-500";
        return "text-red-500";
    };
    return (_jsxs("div", { className: "bg-white border border-gray-200 rounded-2xl p-6 shadow-sm", children: [_jsxs("div", { className: "flex items-start justify-between mb-6", children: [_jsxs("div", { children: [_jsx("h3", { className: "text-lg font-bold text-gray-900", children: "Active Template Health" }), _jsx("p", { className: "text-xs text-gray-500", children: "Based on speed, conversion, and usability." })] }), _jsxs("div", { className: "text-center", children: [_jsx("div", { className: cn("text-3xl font-heading font-bold", getHealthColor(data.health_score)), children: data.health_score }), _jsx("div", { className: "text-[10px] font-bold text-gray-400 uppercase tracking-widest", children: "Score" })] })] }), _jsxs("div", { className: "grid grid-cols-2 md:grid-cols-4 gap-4", children: [_jsx(Metric, { label: "Conversion Rate", value: data.metrics.conversion_rate, delta: data.delta.conversion_rate, suffix: "%" }), _jsx(Metric, { label: "Revenue", value: data.metrics.revenue.toLocaleString(), delta: data.delta.revenue, prefix: "\u20A6" }), _jsx(Metric, { label: "Orders", value: data.metrics.orders, delta: data.delta.orders }), _jsx(Metric, { label: "Avg Order Value", value: data.metrics.aov?.toLocaleString() || 0, delta: data.delta.aov, prefix: "\u20A6" })] })] }));
};
