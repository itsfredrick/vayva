import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { UnifiedOrderStatus } from "@vayva/shared";
import { OrderCard } from "./OrderCard";
import { cn } from "@vayva/ui";
export const FoodOrdersKanban = ({ orders, onSelect, }) => {
    const columns = [
        {
            id: UnifiedOrderStatus.NEW,
            label: "New",
            color: "bg-blue-50 text-blue-700",
        },
        {
            id: UnifiedOrderStatus.PROCESSING,
            label: "Cooking",
            color: "bg-orange-50 text-orange-700",
        },
        {
            id: UnifiedOrderStatus.READY,
            label: "Ready",
            color: "bg-green-50 text-green-700",
        },
        {
            id: UnifiedOrderStatus.COMPLETED,
            label: "Done",
            color: "bg-gray-100 text-gray-600",
        },
    ];
    return (_jsx("div", { className: "flex gap-4 overflow-x-auto pb-4 h-[calc(100vh-320px)] min-h-[500px]", children: columns.map((col) => {
            const colOrders = orders.filter((o) => o.status === col.id);
            return (_jsxs("div", { className: "min-w-[280px] w-[300px] flex flex-col bg-gray-50/50 rounded-2xl border border-gray-100/50", children: [_jsxs("div", { className: "p-3 sticky top-0 bg-gray-50/50 backdrop-blur-sm z-10 rounded-t-2xl border-b border-gray-100 flex justify-between items-center", children: [_jsx("span", { className: "font-bold text-sm text-gray-500 uppercase tracking-wide", children: col.label }), _jsx("span", { className: cn("text-xs font-bold px-2 py-0.5 rounded-full", col.color), children: colOrders.length })] }), _jsx("div", { className: "p-3 overflow-y-auto flex-1 custom-scrollbar", children: colOrders.length === 0 ? (_jsx("div", { className: "h-24 flex items-center justify-center text-xs text-gray-400 italic", children: "Empty" })) : (colOrders.map((order) => (_jsx(OrderCard, { order: order, onClick: onSelect, variant: "kanban" }, order.id)))) })] }, col.id));
        }) }));
};
