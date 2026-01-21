import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { ProductServiceType, } from "@vayva/shared";
import { Badge, Button, Icon, cn } from "@vayva/ui";
import { ResponsiveTable } from "@/components/ui/ResponsiveTable";
export const ProductList = ({ items, onEdit, onDelete, onCreate, isLoading, }) => {
    if (isLoading) {
        return (_jsx("div", { className: "p-8 text-center text-gray-500", children: "Loading products..." }));
    }
    if (items.length === 0) {
        return (_jsxs("div", { className: "p-16 text-center text-gray-500 flex flex-col items-center", children: [_jsx("div", { className: "w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mb-6 ring-8 ring-gray-50/50", children: _jsx(Icon, { name: "Package", size: 40, className: "text-gray-300" }) }), _jsx("h3", { className: "text-xl font-bold text-gray-900 mb-2", children: "Your product catalog is empty" }), _jsx("p", { className: "text-gray-500 max-w-sm mb-8", children: "Add products so Vayva can generate invoices, track inventory, and help customers order online." }), _jsxs(Button, { variant: "outline", className: "gap-2 touch-target", onClick: onCreate, children: [_jsx(Icon, { name: "Plus", size: 16 }), " Add your first product"] })] }));
    }
    const columns = [
        {
            key: "name",
            label: "Product",
            priority: "high",
            render: (item) => (_jsxs("div", { className: "flex items-center gap-3", children: [_jsx("div", { className: "w-10 h-10 md:w-12 md:h-12 rounded-lg bg-gray-100 border border-gray-200 flex items-center justify-center shrink-0 overflow-hidden", children: item.images?.[0] ? (_jsx("img", { src: item.images[0], alt: item.name, className: "w-full h-full object-cover rounded-lg" })) : (_jsx(Icon, { name: "Image", size: 20, className: "text-gray-400" })) }), _jsxs("div", { className: "min-w-0", children: [_jsx("div", { className: "font-medium text-gray-900 line-clamp-1", children: item.name }), _jsx("div", { className: "text-xs text-gray-500 line-clamp-1", children: item.description || "No description" })] })] })),
        },
        {
            key: "type",
            label: "Type",
            priority: "medium",
            render: (item) => (_jsx(Badge, { variant: (item.type === ProductServiceType.RETAIL
                    ? "default"
                    : item.type === ProductServiceType.FOOD
                        ? "warning"
                        : "secondary"), className: "uppercase text-[10px] tracking-wider", children: item.type })),
        },
        {
            key: "price",
            label: "Price",
            priority: "high",
            render: (item) => (_jsxs("span", { className: "font-mono text-sm text-gray-700", children: [item.currency, " ", item.price.toLocaleString()] })),
        },
        {
            key: "inventory",
            label: "Status / Stock",
            mobileLabel: "Stock",
            priority: "medium",
            render: (item) => {
                if (item.inventory?.enabled) {
                    return (_jsxs("div", { className: cn("flex items-center gap-2 text-sm", item.inventory.quantity <=
                            (item.inventory.lowStockThreshold || 5)
                            ? "text-orange-600"
                            : "text-gray-600"), children: [_jsx("span", { className: cn("w-2 h-2 rounded-full", item.inventory.quantity === 0
                                    ? "bg-red-500"
                                    : item.inventory.quantity <=
                                        (item.inventory.lowStockThreshold || 5)
                                        ? "bg-orange-500"
                                        : "bg-emerald-500") }), item.inventory.quantity, " in stock"] }));
                }
                return (_jsx("div", { className: "text-sm text-gray-500", children: item.type === ProductServiceType.SERVICE
                        ? "Booking Available"
                        : "Always in stock" }));
            },
        },
        {
            key: "actions",
            label: "Actions",
            priority: "high",
            render: (item) => (_jsxs("div", { className: "flex items-center justify-end gap-1", onClick: (e) => e.stopPropagation(), children: [_jsx(Button, { variant: "ghost", size: "icon", className: "h-8 w-8 text-gray-400 hover:text-black touch-target-sm", onClick: () => onEdit(item), children: _jsx(Icon, { name: "Pencil", size: 14 }) }), _jsx(Button, { variant: "ghost", size: "icon", className: "h-8 w-8 text-gray-400 hover:text-red-600 hover:bg-red-50 touch-target-sm", onClick: () => onDelete(item.id, item.name), children: _jsx(Icon, { name: "Trash2", size: 14 }) })] })),
        },
    ];
    return (_jsx(ResponsiveTable, { data: items, columns: columns, keyExtractor: (item) => item.id, onRowClick: onEdit, loading: isLoading, emptyMessage: "No products found" }));
};
