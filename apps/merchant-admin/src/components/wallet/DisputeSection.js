import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Icon, Button } from "@vayva/ui";
export const DisputeSection = () => {
    // Test Dispute Data
    const disputes = [
        {
            id: "disp_001",
            orderId: "#1024",
            amount: "₦15,000",
            reason: "Item not received",
            status: "OPEN",
            dueDate: "Dec 26",
        },
    ];
    if (disputes.length === 0)
        return null;
    return (_jsxs("div", { className: "bg-red-50 border border-red-100 rounded-2xl p-6 mb-8", children: [_jsxs("div", { className: "flex justify-between items-center mb-4", children: [_jsxs("h3", { className: "font-bold text-red-900 flex items-center gap-2", children: [_jsx(Icon, { name: "Info", size: 18 }), " Action Required: 1 Open Dispute"] }), _jsx(Button, { variant: "link", className: "text-xs font-bold text-red-700 hover:underline h-auto p-0", children: "View All Disputes" })] }), _jsx("div", { className: "space-y-3", children: disputes.map((disp) => (_jsxs("div", { className: "bg-white border border-red-100 rounded-xl p-4 flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-sm", children: [_jsxs("div", { className: "flex items-start gap-3", children: [_jsx("div", { className: "w-10 h-10 bg-red-100 rounded-full flex items-center justify-center text-red-600 shrink-0", children: _jsx(Icon, { name: "Scale", size: 18 }) }), _jsxs("div", { children: [_jsxs("p", { className: "font-bold text-gray-900 text-sm", children: ["Order ", disp.orderId, " - ", disp.reason] }), _jsxs("p", { className: "text-xs text-red-600 mt-1", children: ["Amount held: ", disp.amount, " \u2022 Respond by ", disp.dueDate] })] })] }), _jsxs("div", { className: "flex gap-2", children: [_jsx(Button, { className: "px-3 py-2 bg-red-600 text-white rounded-lg text-xs font-bold hover:bg-red-700 h-auto", children: "Submit Evidence" }), _jsx(Button, { variant: "outline", className: "px-3 py-2 border border-gray-200 rounded-lg text-xs font-bold text-gray-700 hover:bg-gray-50 h-auto", children: "View Details" })] })] }, disp.id))) })] }));
};
