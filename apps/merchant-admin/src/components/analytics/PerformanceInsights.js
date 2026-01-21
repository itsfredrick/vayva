import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Icon, cn, Button } from "@vayva/ui";
export const PerformanceInsights = ({ insights, recommendation, }) => {
    return (_jsxs("div", { className: "space-y-6", children: [_jsxs("div", { className: "space-y-3", children: [_jsxs("h4", { className: "text-sm font-bold text-gray-900 flex items-center gap-2", children: [_jsx(Icon, { name: "Lightbulb", size: 16 }), " Key Insights"] }), insights.map((insight) => (_jsxs("div", { className: cn("p-4 rounded-xl border flex items-start gap-3", insight.type === "positive"
                            ? "bg-green-50 border-green-100"
                            : insight.type === "warning"
                                ? "bg-yellow-50 border-yellow-100"
                                : "bg-red-50 border-red-100"), children: [_jsx("div", { className: cn("mt-0.5 shrink-0", insight.type === "positive"
                                    ? "text-green-600"
                                    : insight.type === "warning"
                                        ? "text-yellow-600"
                                        : "text-red-500"), children: _jsx(Icon, { name: insight.type === "positive"
                                        ? "CircleCheck"
                                        : insight.type === "warning"
                                            ? "TriangleAlert"
                                            : "OctagonAlert", size: 16 }) }), _jsxs("div", { className: "flex-1", children: [_jsx("p", { className: cn("text-sm font-medium mb-1", insight.type === "positive"
                                            ? "text-green-900"
                                            : insight.type === "warning"
                                                ? "text-yellow-900"
                                                : "text-red-900"), children: insight.message }), _jsx(Button, { variant: "link", className: cn("text-xs font-bold underline decoration-dotted underline-offset-2 p-0 h-auto", insight.type === "positive"
                                            ? "text-green-700"
                                            : insight.type === "warning"
                                                ? "text-yellow-700"
                                                : "text-red-700"), children: insight.action })] })] }, insight.id)))] }), recommendation && (_jsxs("div", { className: "bg-gradient-to-br from-indigo-50 to-purple-50 border border-indigo-100 rounded-xl p-5 relative overflow-hidden", children: [_jsx("div", { className: "absolute top-0 right-0 p-4 opacity-10", children: _jsx(Icon, { name: "Sparkles", size: 64, className: "text-indigo-500" }) }), _jsxs("h4", { className: "text-sm font-bold text-indigo-900 mb-2 flex items-center gap-2", children: [_jsx(Icon, { name: "Sparkles", size: 14, className: "text-indigo-500" }), " AI Recommendation"] }), _jsx("p", { className: "text-indigo-800 text-sm mb-4 leading-relaxed", children: recommendation.reason }), _jsxs("div", { className: "flex items-center gap-4", children: [_jsxs("div", { className: "bg-white/60 rounded-lg px-3 py-1.5 backdrop-blur-sm border border-indigo-100", children: [_jsx("span", { className: "text-xs text-indigo-600 font-bold uppercase tracking-wide", children: "Potential Uplift" }), _jsxs("div", { className: "text-indigo-900 font-bold", children: ["+", recommendation.potential_uplift.orders, "% Orders"] })] }), _jsx(Button, { size: "sm", className: "bg-indigo-600 text-white hover:bg-indigo-700 shadow-sm transition-colors text-xs font-bold", children: "Preview Template" })] })] }))] }));
};
