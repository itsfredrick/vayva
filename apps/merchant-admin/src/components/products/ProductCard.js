import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { ProductServiceType, ProductServiceStatus, } from "@vayva/shared";
import { Icon, cn, Button } from "@vayva/ui";
export const ProductCard = ({ item }) => {
    const getStatusColor = (status) => {
        switch (status) {
            case ProductServiceStatus.ACTIVE:
                return "bg-green-100 text-green-700";
            case ProductServiceStatus.DRAFT:
                return "bg-gray-100 text-gray-600";
            case ProductServiceStatus.INACTIVE:
                return "bg-gray-100 text-gray-600";
            case ProductServiceStatus.OUT_OF_STOCK:
                return "bg-red-100 text-red-700";
            case ProductServiceStatus.SCHEDULED:
                return "bg-blue-100 text-blue-700";
            default:
                return "bg-gray-100 text-gray-600";
        }
    };
    const formatCurrency = (amount, currency) => {
        return new Intl.NumberFormat("en-NG", {
            style: "currency",
            currency,
        }).format(amount);
    };
    return (_jsxs("div", { className: "bg-white border border-gray-200 rounded-2xl overflow-hidden hover:shadow-md transition-shadow group flex flex-col", children: [_jsxs("div", { className: "h-40 bg-gray-100 relative flex items-center justify-center text-gray-300", children: [item.images && item.images.length > 0 ? (_jsx("img", { src: item.images[0], alt: item.name, className: "w-full h-full object-cover" })) : (_jsx(Icon, { name: "Image", size: 32 })), _jsx("div", { className: cn("absolute top-3 left-3 px-2 py-0.5 rounded text-xs font-bold uppercase tracking-wide", getStatusColor(item.status)), children: item.status.replace("_", " ") }), _jsx("div", { className: "absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity", children: _jsx(Button, { className: "w-8 h-8 bg-white rounded-full shadow flex items-center justify-center text-gray-600 hover:text-black", variant: "ghost", children: _jsx(Icon, { name: "MoveHorizontal", size: 16 }) }) })] }), _jsxs("div", { className: "p-4 flex-1 flex flex-col", children: [_jsx("h3", { className: "font-bold text-gray-900 mb-1 line-clamp-1", children: item.name }), _jsx("p", { className: "text-gray-900 font-mono text-sm mb-3 font-medium", children: formatCurrency(item.price, item.currency) }), _jsxs("div", { className: "mt-auto pt-3 border-t border-gray-50 text-xs text-gray-500 space-y-1", children: [item.type === ProductServiceType.RETAIL && (_jsxs("div", { className: "flex justify-between items-center", children: [_jsx("span", { children: "Inventory:" }), item.inventory?.enabled ? (_jsxs("span", { className: cn("font-medium", item.inventory.quantity === 0
                                            ? "text-red-600"
                                            : "text-gray-700"), children: [item.inventory.quantity, " in stock"] })) : (_jsx("span", { className: "text-gray-400 italic", children: "Not tracked" }))] })), item.type === ProductServiceType.SERVICE && item.availability && (_jsxs("div", { className: "flex justify-between items-center", children: [_jsx("span", { children: "Availability:" }), _jsxs("span", { className: "text-gray-700", children: [item.availability.days.length, " days/week"] })] })), item.type === ProductServiceType.FOOD && item.isTodaysSpecial && (_jsxs("div", { className: "flex items-center gap-1 text-orange-600 font-bold", children: [_jsx(Icon, { name: "Star", size: 12, fill: "currentColor" }), " Today's Special"] }))] }), _jsxs("div", { className: "flex items-center gap-2 mt-4 pt-2", children: [_jsxs(Button, { className: "flex-1 py-1.5 border border-gray-200 rounded-lg text-xs font-bold text-gray-700 hover:bg-gray-50 flex items-center justify-center gap-1", variant: "outline", children: [_jsx(Icon, { name: "Pencil", size: 12 }), " Edit"] }), _jsx(Button, { className: "p-1.5 border border-gray-200 rounded-lg text-gray-500 hover:bg-gray-50 hover:text-gray-900", title: "Duplicate", variant: "outline", children: _jsx(Icon, { name: "Copy", size: 12 }) })] })] })] }));
};
