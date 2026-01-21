import { jsxs as _jsxs, jsx as _jsx } from "react/jsx-runtime";
import { UnifiedOrderStatus, OrderType } from "@vayva/shared";
import { Icon, cn, Button } from "@vayva/ui";
export const OrderCard = ({ order, onClick, variant = "list", }) => {
    const formatCurrency = (amount) => {
        return new Intl.NumberFormat("en-NG", {
            style: "currency",
            currency: "NGN",
            maximumFractionDigits: 0,
        }).format(amount);
    };
    const getStatusColor = (status) => {
        switch (status) {
            case UnifiedOrderStatus.NEW:
            case UnifiedOrderStatus.REQUESTED:
                return "bg-blue-50 text-blue-700 border-blue-100";
            case UnifiedOrderStatus.PROCESSING:
                return "bg-orange-50 text-orange-700 border-orange-100";
            case UnifiedOrderStatus.READY:
            case UnifiedOrderStatus.CONFIRMED:
                return "bg-purple-50 text-purple-700 border-purple-100";
            case UnifiedOrderStatus.COMPLETED:
                return "bg-green-50 text-green-700 border-green-100";
            default:
                return "bg-gray-50 text-gray-600 border-gray-200";
        }
    };
    if (variant === "kanban") {
        // Compact card for columns
        return (_jsxs("div", { onClick: () => onClick(order), className: "bg-white p-4 rounded-xl border border-gray-200 shadow-sm hover:shadow-md cursor-pointer transition-all mb-3", children: [_jsxs("div", { className: "flex justify-between items-start mb-2", children: [_jsxs("span", { className: "text-xs font-mono text-gray-500", children: ["#", order.id.split("_")[1]] }), _jsx("span", { className: "text-xs font-bold text-gray-400 bg-gray-50 px-1.5 py-0.5 rounded uppercase", children: order.timestamps?.createdAt
                                ? new Date(order.timestamps.createdAt).toLocaleTimeString([], {
                                    hour: "2-digit",
                                    minute: "2-digit",
                                })
                                : "Now" })] }), _jsx("h4", { className: "font-bold text-gray-900 mb-1 line-clamp-2", children: order.items.map((i) => `${i.quantity}x ${i.name}`).join(", ") }), order.items.some((i) => i.modifiers) && (_jsx("div", { className: "mb-3 flex flex-wrap gap-1", children: order.items
                        .flatMap((i) => i.modifiers || [])
                        .map((mod, idx) => (_jsx("span", { className: "text-[10px] bg-red-50 text-red-600 px-1.5 rounded border border-red-100", children: mod }, idx))) })), _jsxs("div", { className: "flex items-center justify-between mt-auto pt-3 border-t border-gray-50", children: [_jsxs("div", { className: "flex items-center gap-1.5", children: [_jsx("div", { className: cn("w-2 h-2 rounded-full", order.fulfillmentType === "pickup"
                                        ? "bg-orange-400"
                                        : "bg-blue-400") }), _jsx("span", { className: "text-xs font-medium text-gray-600 uppercase", children: order.fulfillmentType })] }), _jsx("span", { className: "text-sm font-bold", children: formatCurrency(order.totalAmount) })] })] }));
    }
    // Default List / Agenda View
    return (_jsxs("div", { onClick: () => onClick(order), className: "group bg-white p-5 rounded-2xl border border-studio-border hover:border-vayva-black hover:shadow-xl hover:shadow-black/5 cursor-pointer transition-all duration-300 flex flex-col md:flex-row md:items-center gap-4 animate-in fade-in slide-in-from-bottom-2", children: [_jsxs("div", { className: "flex items-center gap-4 min-w-[180px]", children: [_jsx("div", { className: cn("w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 text-xl transition-colors duration-300", order.type === OrderType.FOOD
                            ? "bg-orange-50 text-orange-600 group-hover:bg-orange-600 group-hover:text-white"
                            : "bg-studio-gray text-vayva-black group-hover:bg-vayva-green group-hover:text-white"), children: _jsx(Icon, { name: order.type === OrderType.RETAIL
                                ? "ShoppingBag"
                                : order.type === OrderType.FOOD
                                    ? "Utensils"
                                    : "Calendar", size: 24 }) }), _jsxs("div", { children: [_jsxs("p", { className: "font-mono text-[10px] text-gray-400 mb-1 uppercase tracking-widest font-bold", children: ["Ref: #", order.id.split("_")[1]] }), _jsx("h4", { className: "font-black text-vayva-black text-lg group-hover:translate-x-1 transition-transform", children: order.customer.name })] })] }), _jsxs("div", { className: "flex-1 md:border-l md:border-gray-100 md:pl-6 grid grid-cols-2 gap-4", children: [_jsxs("div", { children: [_jsx("p", { className: "text-xs text-gray-400 font-medium uppercase tracking-wider mb-1", children: "Items" }), _jsxs("p", { className: "text-sm font-medium text-gray-700 truncate max-w-[200px]", title: order.items.map((i) => i.name).join(", "), children: [order.items.length, " items \u2022 ", order.items[0]?.name, " ", order.items.length > 1 && `+${order.items.length - 1} more`] })] }), _jsxs("div", { children: [_jsx("p", { className: "text-xs text-gray-400 font-medium uppercase tracking-wider mb-1", children: "Total" }), _jsx("p", { className: "font-bold text-gray-900", children: formatCurrency(order.totalAmount) })] })] }), _jsxs("div", { className: "flex items-center justify-between md:justify-end gap-4 min-w-[200px]", children: [_jsx("div", { className: cn("px-3 py-1.5 rounded-lg text-xs font-bold border capitalize", getStatusColor(order.status)), children: order.status.replace("_", " ") }), _jsx(Button, { variant: "ghost", size: "icon", className: "w-8 h-8 rounded-full bg-studio-gray text-gray-400 group-hover:bg-vayva-green group-hover:text-white transition-colors p-0", children: _jsx(Icon, { name: "ChevronRight", size: 16 }) })] })] }));
};
