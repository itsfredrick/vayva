import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Icon, Button } from "@vayva/ui";
export const PayoutSummary = () => {
    // Hardcoded for test based on API spec
    const nextPayout = {
        date: "Tomorrow, Dec 24",
        amount: "₦250,000",
    };
    const lastPayout = {
        date: "Dec 21, 2025",
        amount: "₦500,000",
    };
    return (_jsxs("div", { className: "bg-white border border-gray-200 rounded-2xl p-6 shadow-sm", children: [_jsxs("h3", { className: "font-bold text-gray-900 mb-6 flex items-center gap-2", children: [_jsx(Icon, { name: "Banknote", size: 18 }), " Payout Schedule"] }), _jsxs("div", { className: "space-y-6 relative", children: [_jsx("div", { className: "absolute left-[7px] top-2 bottom-2 w-0.5 bg-gray-100" }), _jsxs("div", { className: "relative pl-6", children: [_jsx("div", { className: "absolute left-0 top-1.5 w-4 h-4 rounded-full bg-blue-100 border-2 border-blue-500 z-10" }), _jsx("p", { className: "text-xs font-bold text-blue-600 uppercase tracking-wide mb-1", children: "Next Payout" }), _jsxs("div", { className: "flex justify-between items-baseline", children: [_jsx("p", { className: "font-bold text-gray-900", children: nextPayout.date }), _jsx("p", { className: "font-mono text-gray-600", children: nextPayout.amount })] }), _jsx("p", { className: "text-xs text-gray-400 mt-1", children: "Est. processing time: 24h" })] }), _jsxs("div", { className: "relative pl-6", children: [_jsx("div", { className: "absolute left-0 top-1.5 w-4 h-4 rounded-full bg-gray-200 border-2 border-white z-10" }), _jsx("p", { className: "text-xs font-bold text-gray-400 uppercase tracking-wide mb-1", children: "Last Payout" }), _jsxs("div", { className: "flex justify-between items-baseline", children: [_jsx("p", { className: "font-medium text-gray-500", children: lastPayout.date }), _jsx("p", { className: "font-mono text-gray-400", children: lastPayout.amount })] }), _jsxs("div", { className: "flex items-center gap-1 mt-1 text-green-600 text-[10px] font-bold", children: [_jsx(Icon, { name: "CheckCheck", size: 12 }), " SENT TO BANK"] })] })] }), _jsx(Button, { variant: "outline", className: "w-full mt-6 py-2 border border-gray-200 rounded-lg text-xs font-bold text-gray-700 hover:bg-gray-50 transition-colors h-auto", children: "Manage Payout Settings" })] }));
};
