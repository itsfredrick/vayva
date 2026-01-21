import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { ProductCard } from "./ProductCard";
export const ProductGrid = ({ items, isLoading }) => {
    if (isLoading) {
        return (_jsx("div", { className: "grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6", children: [1, 2, 3, 4, 5, 6].map((i) => (_jsx("div", { className: "h-[280px] bg-gray-50 rounded-2xl animate-pulse" }, i))) }));
    }
    if (items.length === 0) {
        return (_jsxs("div", { className: "text-center py-20 bg-gray-50 rounded-2xl border border-dashed border-gray-200", children: [_jsx("h3", { className: "text-lg font-bold text-gray-900", children: "No items found" }), _jsx("p", { className: "text-gray-500", children: "Get started by adding your first product or service." })] }));
    }
    return (_jsx("div", { className: "grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6", children: items.map((item) => (_jsx(ProductCard, { item: item }, item.id))) }));
};
