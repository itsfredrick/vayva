import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Icon, cn } from "@vayva/ui";
export const PaymentFunnelCard = ({ funnel }) => {
    const maxCount = Math.max(...funnel.steps.map((s) => s.count));
    return (_jsxs("div", { className: "bg-white border border-gray-200 rounded-2xl p-6 shadow-sm h-full", children: [_jsxs("h3", { className: "text-lg font-bold text-gray-900 mb-6 flex items-center gap-2", children: [_jsx(Icon, { name: "GitMerge", size: 20 }), " Checkout Funnel (30d)"] }), _jsxs("div", { className: "space-y-6 relative", children: [_jsx("div", { className: "absolute top-4 bottom-4 left-[15px] w-0.5 bg-gray-100 -z-10" }), funnel.steps.map((step, index) => {
                        const widthPercent = (step.count / maxCount) * 100;
                        return (_jsxs("div", { className: "relative", children: [_jsxs("div", { className: "flex items-center gap-4 mb-2", children: [_jsx("div", { className: cn("w-8 h-8 rounded-full flex items-center justify-center border-2 z-10 bg-white", index === 0
                                                ? "border-gray-200 text-gray-400"
                                                : index === funnel.steps.length - 1
                                                    ? "border-green-500 text-green-600 bg-green-50"
                                                    : "border-indigo-500 text-indigo-600 bg-indigo-50"), children: _jsx("span", { className: "text-xs font-bold", children: index + 1 }) }), _jsxs("div", { className: "flex-1", children: [_jsxs("div", { className: "flex justify-between items-center mb-1", children: [_jsx("span", { className: "text-sm font-bold text-gray-900", children: step.name }), _jsx("span", { className: "text-sm font-mono font-medium text-gray-600", children: step.count.toLocaleString() })] }), _jsx("div", { className: "h-2 bg-gray-100 rounded-full overflow-hidden w-full", children: _jsx("div", { className: cn("h-full rounded-full transition-all duration-1000", index === funnel.steps.length - 1
                                                            ? "bg-green-500"
                                                            : "bg-indigo-500"), style: { width: `${widthPercent}%` } }) }), step.dropoff > 0 && (_jsxs("p", { className: "text-xs text-red-400 mt-1 font-medium", children: [step.dropoff, "% drop-off"] }))] })] }), step.name === funnel.optimization_impact.step && (_jsxs("div", { className: "ml-12 mt-1 inline-flex items-center gap-1.5 bg-indigo-50 text-indigo-700 px-2 py-1 rounded text-[10px] font-bold border border-indigo-100", children: [_jsx(Icon, { name: "Sparkles", size: 10 }), "AI Improved this by ", funnel.optimization_impact.uplift] }))] }, index));
                    })] })] }));
};
