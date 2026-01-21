import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from "react";
import { Icon, cn, Button } from "@vayva/ui";
export const PaymentOptimizationCard = ({ status, onToggle, }) => {
    const [loading, setLoading] = useState(false);
    const handleToggle = async () => {
        setLoading(true);
        try {
            await onToggle(!status.active);
        }
        finally {
            setLoading(false);
        }
    };
    return (_jsxs("div", { className: "bg-white border border-gray-200 rounded-2xl p-6 shadow-sm", children: [_jsxs("div", { className: "flex items-start justify-between mb-6", children: [_jsxs("div", { children: [_jsxs("h3", { className: "text-lg font-bold text-gray-900 flex items-center gap-2", children: [_jsx(Icon, { name: "Shield", size: 20, className: status.active ? "text-indigo-500" : "text-gray-400" }), "Checkout Protection & AI"] }), _jsx("p", { className: "text-sm text-gray-500 mt-1", children: "Smart retry logic and fraud prevention." })] }), _jsx(Button, { onClick: handleToggle, disabled: loading, className: cn("relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none", status.active ? "bg-indigo-500" : "bg-gray-200"), children: _jsx("span", { className: cn("pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out", status.active ? "translate-x-5" : "translate-x-0") }) })] }), status.active ? (_jsxs("div", { className: "space-y-6", children: [_jsxs("div", { className: "grid grid-cols-2 gap-4", children: [_jsxs("div", { className: "bg-indigo-50 border border-indigo-100 rounded-xl p-4", children: [_jsx("p", { className: "text-xs font-bold text-indigo-700 uppercase tracking-wide", children: "Success Rate" }), _jsxs("div", { className: "flex items-end gap-2 mt-1", children: [_jsxs("span", { className: "text-2xl font-bold text-indigo-900", children: ["+", status.metrics.success_rate_uplift, "%"] }), _jsx(Icon, { name: "TrendingUp", size: 14, className: "text-indigo-600 mb-1" })] })] }), _jsxs("div", { className: "bg-green-50 border border-green-100 rounded-xl p-4", children: [_jsx("p", { className: "text-xs font-bold text-green-700 uppercase tracking-wide", children: "Failures Prevented" }), _jsxs("div", { className: "flex items-end gap-2 mt-1", children: [_jsx("span", { className: "text-2xl font-bold text-green-900", children: status.metrics.failed_transactions_prevented }), _jsx(Icon, { name: "Shield", size: 14, className: "text-green-600 mb-1" })] })] })] }), _jsxs("div", { className: "space-y-3", children: [_jsx("h4", { className: "text-xs font-bold text-gray-500 uppercase", children: "Active Protections" }), status.rules.map((rule) => (_jsxs("div", { className: "flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-100 hover:bg-gray-100 transition-colors", children: [_jsxs("div", { className: "flex items-center gap-3", children: [_jsx("div", { className: cn("w-8 h-8 rounded-full flex items-center justify-center", rule.type === "retry"
                                                    ? "bg-amber-100 text-amber-600"
                                                    : rule.type === "ordering"
                                                        ? "bg-blue-100 text-blue-600"
                                                        : "bg-purple-100 text-purple-600"), children: _jsx(Icon, { name: rule.type === "retry"
                                                        ? "RefreshCw"
                                                        : rule.type === "ordering"
                                                            ? "List"
                                                            : "Zap", size: 14 }) }), _jsxs("div", { children: [_jsx("p", { className: "text-sm font-bold text-gray-900", children: rule.name }), _jsx("p", { className: "text-xs text-gray-500", children: rule.type === "retry"
                                                            ? "Retries failed cards automatically"
                                                            : rule.type === "ordering"
                                                                ? "Prioritizes successful methods"
                                                                : "Simulates simplified flow" })] })] }), _jsxs("span", { className: cn("text-[10px] uppercase font-bold px-1.5 py-0.5 rounded", rule.impact === "high"
                                            ? "bg-green-100 text-green-700"
                                            : "bg-gray-100 text-gray-600"), children: [rule.impact, " Impact"] })] }, rule.id)))] })] })) : (_jsxs("div", { className: "text-center py-8 bg-gray-50 rounded-xl border border-dashed border-gray-200", children: [_jsx(Icon, { name: "ShieldOff", size: 32, className: "text-gray-300 mx-auto mb-2" }), _jsx("p", { className: "text-sm text-gray-500 mb-2", children: "Checkout protections disabled." })] }))] }));
};
