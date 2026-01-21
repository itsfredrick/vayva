import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { SettlementStatus } from "@vayva/shared";
import { Icon, cn } from "@vayva/ui";
export const SettlementList = ({ settlements, isLoading, }) => {
    if (isLoading)
        return (_jsx("div", { className: "py-10 text-center text-gray-400", children: "Loading settlements..." }));
    if (settlements.length === 0) {
        return (_jsxs("div", { className: "text-center py-16 text-gray-400 border border-dashed border-gray-200 rounded-xl bg-gray-50/50", children: [_jsx(Icon, { name: "CheckCircle2", size: 48, className: "mx-auto mb-4 opacity-20" }), _jsx("p", { children: "No pending settlements. You're all caught up!" })] }));
    }
    return (_jsxs("div", { className: "space-y-4", children: [_jsx("div", { className: "flex justify-between items-center bg-yellow-50 p-4 rounded-xl border border-yellow-100", children: _jsxs("div", { className: "flex gap-3", children: [_jsx("div", { className: "w-10 h-10 bg-yellow-100 rounded-full flex items-center justify-center text-yellow-700 shrink-0", children: _jsx(Icon, { name: "Clock", size: 20 }) }), _jsxs("div", { children: [_jsx("h3", { className: "font-bold text-gray-900", children: "Pending Settlements" }), _jsx("p", { className: "text-xs text-gray-600", children: "Funds from recent orders clearing via banking partners." })] })] }) }), _jsx("div", { className: "border border-gray-200 rounded-xl overflow-hidden", children: _jsxs("table", { className: "w-full text-sm text-left", children: [_jsx("thead", { className: "bg-gray-50 text-gray-500 font-medium border-b border-gray-200", children: _jsxs("tr", { children: [_jsx("th", { className: "px-4 py-3", children: "Reference" }), _jsx("th", { className: "px-4 py-3", children: "Expected Date" }), _jsx("th", { className: "px-4 py-3", children: "Amount" }), _jsx("th", { className: "px-4 py-3", children: "Status" })] }) }), _jsx("tbody", { className: "divide-y divide-gray-100", children: settlements.map((item) => (_jsxs("tr", { className: "hover:bg-gray-50/50", children: [_jsxs("td", { className: "px-4 py-3", children: [_jsx("div", { className: "font-bold text-gray-900", children: item.description }), _jsx("div", { className: "text-xs text-gray-400 font-mono", children: item.referenceId })] }), _jsx("td", { className: "px-4 py-3 text-gray-600", children: new Date(item.payoutDate).toLocaleDateString(undefined, {
                                            weekday: "short",
                                            month: "short",
                                            day: "numeric",
                                        }) }), _jsx("td", { className: "px-4 py-3 font-bold font-mono", children: new Intl.NumberFormat("en-NG", {
                                            style: "currency",
                                            currency: item.currency,
                                        }).format(item.amount) }), _jsx("td", { className: "px-4 py-3", children: _jsx("span", { className: cn("px-2 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider", item.status === SettlementStatus.DELAYED
                                                ? "bg-red-50 text-red-600"
                                                : item.status === SettlementStatus.PENDING
                                                    ? "bg-yellow-50 text-yellow-600"
                                                    : "bg-green-50 text-green-600"), children: item.status }) })] }, item.id))) })] }) })] }));
};
