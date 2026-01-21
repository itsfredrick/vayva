import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Icon, cn } from "@vayva/ui";
export const BusinessHealthWidget = ({ data, }) => {
    const getScoreColor = (score) => {
        if (score >= 80)
            return "text-green-600 bg-green-50 border-green-100";
        if (score >= 60)
            return "text-amber-600 bg-amber-50 border-amber-100";
        return "text-red-600 bg-red-50 border-red-100";
    };
    return (_jsxs("div", { className: "bg-white border border-gray-200 rounded-2xl p-6 shadow-sm", children: [_jsxs("div", { className: "flex justify-between items-start mb-4", children: [_jsxs("h3", { className: "text-lg font-bold text-gray-900 flex items-center gap-2", children: [_jsx(Icon, { name: "Activity", size: 20 }), " Business Health"] }), _jsx("span", { className: "text-xs text-gray-400", children: "Updated just now" })] }), _jsxs("div", { className: "flex flex-col sm:flex-row items-center sm:items-start gap-6 mb-6 text-center sm:text-left", children: [_jsxs("div", { className: cn("w-24 h-24 rounded-full flex flex-col items-center justify-center border-4 shrink-0", getScoreColor(data.score)), children: [_jsx("span", { className: "text-3xl font-heading font-bold", children: data.score }), _jsx("span", { className: "text-[10px] font-bold uppercase tracking-wider", children: data.status })] }), _jsxs("div", { className: "flex-1 w-full", children: [_jsx("p", { className: "text-sm text-gray-500 mb-2", children: "Primary Drivers:" }), _jsx("ul", { className: "space-y-2", children: data.factors.map((factor) => (_jsxs("li", { className: "flex items-start gap-2 text-xs font-medium text-gray-700 justify-center sm:justify-start", children: [_jsx(Icon, { name: factor.sentiment === "positive"
                                                ? "TrendingUp"
                                                : factor.sentiment === "warning"
                                                    ? "CircleAlert"
                                                    : "ArrowDown", size: 14, className: cn("mt-0.5", factor.sentiment === "positive"
                                                ? "text-green-500"
                                                : factor.sentiment === "warning"
                                                    ? "text-amber-500"
                                                    : "text-red-500") }), factor.text] }, factor.id))) })] })] }), data.primary_risk && (_jsxs("div", { className: "bg-red-50 border border-red-100 rounded-xl p-3 flex items-start gap-3", children: [_jsx(Icon, { name: "TriangleAlert", size: 16, className: "text-red-600 mt-0.5" }), _jsxs("div", { children: [_jsx("p", { className: "text-xs font-bold text-red-800 uppercase tracking-wide mb-1", children: "Risk Alert" }), _jsx("p", { className: "text-sm font-medium text-red-900", children: data.primary_risk.text })] })] }))] }));
};
