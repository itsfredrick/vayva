import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { OrderType } from "@vayva/shared";
import { Icon } from "@vayva/ui";
export const OrderSummary = ({ stats, type }) => {
    if (!stats)
        return _jsx("div", { className: "h-24 bg-gray-50 animate-pulse rounded-2xl mb-8" });
    const formatCurrency = (amount) => {
        return new Intl.NumberFormat("en-NG", {
            style: "currency",
            currency: "NGN",
            maximumFractionDigits: 0,
        }).format(amount);
    };
    const isService = type === OrderType.SERVICE;
    return (_jsxs("div", { className: "grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8", children: [_jsxs("div", { className: "bg-white p-5 rounded-2xl border border-gray-100 shadow-sm", children: [_jsx("p", { className: "text-xs font-bold text-gray-500 uppercase tracking-wider mb-1", children: isService ? "New Requests" : "New Orders" }), _jsxs("div", { className: "flex items-center justify-between", children: [_jsx("p", { className: "text-3xl font-bold text-gray-900", children: stats.countNew }), _jsx("div", { className: "bg-blue-50 text-blue-600 p-2 rounded-lg", children: _jsx(Icon, { name: "Bell", size: 20 }) })] })] }), _jsxs("div", { className: "bg-white p-5 rounded-2xl border border-gray-100 shadow-sm", children: [_jsx("p", { className: "text-xs font-bold text-gray-500 uppercase tracking-wider mb-1", children: isService ? "Upcoming" : "In Progress" }), _jsxs("div", { className: "flex items-center justify-between", children: [_jsx("p", { className: "text-3xl font-bold text-gray-900", children: stats.countInProgress }), _jsx("div", { className: "bg-orange-50 text-orange-600 p-2 rounded-lg", children: _jsx(Icon, { name: "Activity", size: 20 }) })] })] }), _jsxs("div", { className: "bg-white p-5 rounded-2xl border border-gray-100 shadow-sm", children: [_jsx("p", { className: "text-xs font-bold text-gray-500 uppercase tracking-wider mb-1", children: isService ? "Completed" : "Ready" }), _jsxs("div", { className: "flex items-center justify-between", children: [_jsx("p", { className: "text-3xl font-bold text-gray-900", children: stats.countCompleted }), _jsx("div", { className: "bg-green-50 text-green-600 p-2 rounded-lg", children: _jsx(Icon, { name: "CircleCheck", size: 20 }) })] })] }), _jsxs("div", { className: "bg-white p-5 rounded-2xl border border-gray-100 shadow-sm", children: [_jsx("p", { className: "text-xs font-bold text-gray-500 uppercase tracking-wider mb-1", children: isService ? "Pending Payment" : "Revenue Today" }), _jsxs("div", { className: "flex items-center justify-between", children: [isService ? (_jsx("p", { className: "text-3xl font-bold text-gray-900", children: stats.countPendingPayment })) : (_jsx("p", { className: "text-2xl font-bold text-gray-900", children: formatCurrency(stats.totalRevenue) })), _jsx("div", { className: "bg-gray-100 text-gray-600 p-2 rounded-lg", children: _jsx(Icon, { name: isService ? "CreditCard" : "TrendingUp", size: 20 }) })] })] })] }));
};
