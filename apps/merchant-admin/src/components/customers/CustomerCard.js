import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { CustomerStatus } from "@vayva/shared";
import { Icon, Button } from "@vayva/ui";
export const CustomerCard = ({ customer, onSelect }) => {
    const getStatusBadge = (status) => {
        switch (status) {
            case CustomerStatus.VIP:
                return (_jsxs("span", { className: "bg-amber-100 text-amber-700 text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1", children: [_jsx(Icon, { name: "Crown", size: 10 }), " VIP"] }));
            case CustomerStatus.NEW:
                return (_jsx("span", { className: "bg-blue-50 text-blue-600 text-[10px] font-bold px-2 py-0.5 rounded-full", children: "New" }));
            case CustomerStatus.RETURNING:
                return (_jsx("span", { className: "bg-green-50 text-green-600 text-[10px] font-bold px-2 py-0.5 rounded-full", children: "Returning" }));
            default:
                return null;
        }
    };
    const formatCurrency = (amount) => {
        return new Intl.NumberFormat("en-NG", {
            style: "currency",
            currency: "NGN",
            maximumFractionDigits: 0,
        }).format(amount);
    };
    return (_jsxs("div", { onClick: () => onSelect(customer), className: "bg-white border border-gray-200 rounded-xl p-5 hover:border-gray-300 hover:shadow-md transition-all cursor-pointer group relative", children: [_jsxs("div", { className: "flex justify-between items-start mb-4", children: [_jsxs("div", { className: "flex items-center gap-3", children: [_jsx("div", { className: "w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center text-gray-500 font-bold text-lg", children: customer.name.charAt(0) }), _jsxs("div", { children: [_jsx("h3", { className: "font-bold text-gray-900 group-hover:text-blue-600 transition-colors", children: customer.name }), _jsx("p", { className: "text-xs text-gray-500 font-mono", children: customer.phone })] })] }), getStatusBadge(customer.status)] }), _jsxs("div", { className: "grid grid-cols-2 gap-4 py-3 border-t border-gray-50", children: [_jsxs("div", { children: [_jsx("p", { className: "text-[10px] uppercase text-gray-400 font-bold tracking-wider", children: "Spent" }), _jsx("p", { className: "font-mono font-medium text-sm", children: formatCurrency(customer.totalSpend) })] }), _jsxs("div", { children: [_jsx("p", { className: "text-[10px] uppercase text-gray-400 font-bold tracking-wider", children: "Orders" }), _jsx("p", { className: "font-mono font-medium text-sm", children: customer.totalOrders })] })] }), _jsxs("div", { className: "mt-2 flex items-center justify-between", children: [_jsxs("p", { className: "text-xs text-gray-400", children: ["Last active ", new Date(customer.lastSeenAt).toLocaleDateString()] }), _jsx(Button, { onClick: (e) => {
                            e.stopPropagation();
                            // Link logic would go here
                        }, className: "p-2 rounded-full bg-green-50 text-green-600 hover:bg-green-100 transition-colors", title: "Message on WhatsApp", children: _jsx(Icon, { name: "MessageCircle", size: 16 }) })] })] }));
};
