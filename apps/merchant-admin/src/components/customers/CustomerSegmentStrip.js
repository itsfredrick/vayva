import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Icon, cn, Button } from "@vayva/ui";
export const CustomerSegmentStrip = ({ activeFilter, onFilterChange, stats, }) => {
    const segments = [
        {
            id: "all",
            label: "All Customers",
            count: stats?.total || 0,
            icon: "Users",
        },
        {
            id: "new",
            label: "New",
            count: stats?.new || 0,
            icon: "Sparkles",
            color: "blue",
        },
        {
            id: "returning",
            label: "Returning",
            count: stats?.returning || 0,
            icon: "RotateCcw",
            color: "indigo",
        },
        {
            id: "vip",
            label: "VIP",
            count: stats?.vip || 0,
            icon: "Crown",
            color: "amber",
        },
        {
            id: "inactive",
            label: "Inactive",
            count: stats?.inactive || 0,
            icon: "Moon",
            color: "gray",
        },
    ];
    return (_jsx("div", { className: "flex gap-4 overflow-x-auto pb-4 mb-2 no-scrollbar", children: segments.map((seg) => {
            const isActive = activeFilter === seg.id;
            return (_jsxs(Button, { onClick: () => onFilterChange(seg.id), className: cn("flex items-center gap-3 p-3 pr-6 rounded-xl border transition-all min-w-[160px] cursor-pointer whitespace-nowrap", isActive
                    ? "bg-black border-black text-white shadow-md ring-2 ring-offset-2 ring-gray-100"
                    : "bg-white border-gray-200 text-gray-600 hover:border-gray-300 hover:shadow-sm"), children: [_jsx("div", { className: cn("w-8 h-8 rounded-lg flex items-center justify-center shrink-0", isActive
                            ? "bg-gray-800 text-white"
                            : "bg-gray-50 text-gray-500"), children: _jsx(Icon, { name: seg.icon, size: 16 }) }), _jsxs("div", { className: "text-left", children: [_jsx("p", { className: cn("text-xs font-medium uppercase", isActive ? "text-gray-400" : "text-gray-500"), children: seg.label }), _jsx("p", { className: "text-lg font-bold leading-none mt-0.5", children: seg.count })] })] }, seg.id));
        }) }));
};
