import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Icon, cn, Button } from "@vayva/ui";
export const InsightHub = ({ insights }) => {
    return (_jsxs("div", { className: "space-y-4", children: [_jsxs("h3", { className: "text-lg font-bold text-gray-900 flex items-center gap-2", children: [_jsx(Icon, { name: "Zap", size: 20, className: "text-amber-500 fill-amber-500" }), " ", "Actionable Insights"] }), _jsx("div", { className: "grid grid-cols-1 gap-4", children: insights.map((insight) => (_jsxs("div", { className: "bg-white border border-gray-200 rounded-xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:shadow-md transition-shadow", children: [_jsxs("div", { className: "flex items-start gap-4", children: [_jsx("div", { className: cn("w-10 h-10 rounded-full flex items-center justify-center shrink-0", insight.type === "conversion"
                                        ? "bg-blue-50 text-blue-600"
                                        : insight.type === "finance"
                                            ? "bg-green-50 text-green-600"
                                            : "bg-purple-50 text-purple-600"), children: _jsx(Icon, { name: insight.type === "conversion"
                                            ? "TrendingUp"
                                            : insight.type === "finance"
                                                ? "Wallet"
                                                : "Settings", size: 20 }) }), _jsxs("div", { children: [_jsxs("h4", { className: "font-bold text-gray-900 text-sm flex items-center gap-2", children: [insight.title, insight.impact === "high" && (_jsx("span", { className: "bg-red-100 text-red-700 text-[10px] px-2 py-0.5 rounded-full uppercase tracking-wide", children: "High Impact" }))] }), _jsx("p", { className: "text-xs text-gray-500 mt-1", children: insight.description })] })] }), _jsxs("div", { className: "flex items-center gap-2 sm:self-center self-end", children: [_jsx(Button, { size: "sm", className: "text-gray-400 hover:text-gray-600", children: "Dismiss" }), _jsx(Button, { variant: "primary", size: "sm", className: "whitespace-nowrap", children: insight.action_label })] })] }, insight.id))) })] }));
};
