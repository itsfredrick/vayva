import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { ProductServiceStatus } from "@vayva/shared";
import { Icon } from "@vayva/ui";
export const ProductOverview = ({ items }) => {
    const total = items.length;
    const active = items.filter((i) => i.status === ProductServiceStatus.ACTIVE).length;
    const outOfStock = items.filter((i) => i.status === ProductServiceStatus.OUT_OF_STOCK).length;
    const inactive = items.filter((i) => i.status === ProductServiceStatus.INACTIVE ||
        i.status === ProductServiceStatus.DRAFT).length;
    const stats = [
        {
            label: "Total Items",
            value: total,
            icon: "Package",
            color: "bg-blue-50 text-blue-600",
        },
        {
            label: "Active",
            value: active,
            icon: "CheckCircle",
            color: "bg-green-50 text-green-600",
        },
        {
            label: "Out of Stock",
            value: outOfStock,
            icon: "AlertCircle",
            color: "bg-red-50 text-red-600",
        },
        {
            label: "Inactive/Draft",
            value: inactive,
            icon: "FileText",
            color: "bg-gray-100 text-gray-600",
        },
    ];
    return (_jsx("div", { className: "grid grid-cols-2 md:grid-cols-4 gap-4 mb-8", children: stats.map((stat) => (_jsxs("div", { className: "bg-white border border-gray-200 rounded-xl p-4 flex items-center gap-3 shadow-sm", children: [_jsx("div", { className: `w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${stat.color}`, children: _jsx(Icon, { name: stat.icon, size: 20 }) }), _jsxs("div", { children: [_jsx("p", { className: "text-xs text-gray-500", children: stat.label }), _jsx("p", { className: "font-bold text-lg text-gray-900", children: stat.value })] })] }, stat.label))) }));
};
