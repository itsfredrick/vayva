import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { OrderCard } from "./OrderCard";
import { Icon } from "@vayva/ui";
export const RetailOrdersView = ({ orders, onSelect, }) => {
    if (orders.length === 0) {
        return (_jsxs("div", { className: "flex flex-col items-center justify-center py-20 bg-gray-50/50 rounded-3xl border border-dashed border-gray-200", children: [_jsx("div", { className: "w-12 h-12 bg-white rounded-xl flex items-center justify-center mb-4 shadow-sm", children: _jsx(Icon, { name: "Search", size: 20, className: "text-gray-400" }) }), _jsx("h3", { className: "text-gray-900 font-bold mb-1", children: "No orders found" }), _jsx("p", { className: "text-gray-500 text-sm max-w-[200px] text-center", children: "Try adjusting your filters or search terms." })] }));
    }
    return (_jsx("div", { className: "space-y-3", children: orders.map((order) => (_jsx(OrderCard, { order: order, onClick: onSelect }, order.id))) }));
};
