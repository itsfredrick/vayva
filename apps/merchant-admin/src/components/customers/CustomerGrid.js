import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { CustomerCard } from "./CustomerCard";
import { Icon, Button } from "@vayva/ui";
export const CustomerGrid = ({ customers, isLoading, onSelect, }) => {
    if (isLoading) {
        return (_jsx("div", { className: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4", children: [1, 2, 3, 4, 5, 6].map((i) => (_jsx("div", { className: "h-48 bg-gray-50 rounded-xl animate-pulse" }, i))) }));
    }
    if (customers.length === 0) {
        return (_jsxs("div", { className: "text-center py-20 bg-gray-50 rounded-2xl border border-dashed border-gray-200", children: [_jsx("div", { className: "w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-4 text-gray-400 shadow-sm", children: _jsx(Icon, { name: "Users", size: 24 }) }), _jsx("h3", { className: "text-lg font-bold text-gray-900", children: "You don't have any customers yet." }), _jsx("p", { className: "text-gray-500 max-w-sm mx-auto mt-2", children: "Customers appear here after someone places an order or booking. Share your store link to get started." }), _jsx(Button, { className: "mt-6 px-6 py-2 bg-black text-white rounded-lg font-bold text-sm", children: "Share Store Link" })] }));
    }
    return (_jsx("div", { className: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6", children: customers.map((customer) => (_jsx(CustomerCard, { customer: customer, onSelect: onSelect }, customer.id))) }));
};
