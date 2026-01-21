import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect, useState } from "react";
import { Icon, cn, Button } from "@vayva/ui";
export const CustomerDetailPanel = ({ customer, onClose, }) => {
    const [history, setHistory] = useState([]);
    const [loading, setLoading] = useState(false);
    useEffect(() => {
        if (!customer)
            return;
        const fetchDetails = async () => {
            setLoading(true);
            try {
                const res = await fetch(`/api/customers/details?id=${customer.id}`);
                const data = await res.json();
                if (data.history)
                    setHistory(data.history);
            }
            catch (e) {
                console.error(e);
            }
            finally {
                setLoading(false);
            }
        };
        fetchDetails();
    }, [customer]);
    if (!customer)
        return null;
    const formatCurrency = (amount) => new Intl.NumberFormat("en-NG", {
        style: "currency",
        currency: "NGN",
    }).format(amount);
    return (_jsxs("div", { className: "fixed inset-y-0 right-0 w-[400px] bg-white shadow-2xl z-50 transform transition-transform duration-300 flex flex-col border-l border-gray-100", children: [_jsxs("div", { className: "p-6 border-b border-gray-100 flex items-start justify-between bg-gray-50/50", children: [_jsxs("div", { className: "flex items-center gap-4", children: [_jsx("div", { className: "w-14 h-14 rounded-full bg-white border border-gray-200 flex items-center justify-center text-gray-700 font-bold text-xl shadow-sm", children: customer.name.charAt(0) }), _jsxs("div", { children: [_jsx("h2", { className: "font-bold text-xl text-gray-900", children: customer.name }), _jsx("p", { className: "text-sm text-gray-500 font-mono", children: customer.phone })] })] }), _jsx(Button, { onClick: onClose, className: "p-2 hover:bg-gray-200 rounded-full text-gray-500 transition-colors", children: _jsx(Icon, { name: "X", size: 20 }) })] }), _jsxs("div", { className: "flex-1 overflow-y-auto p-6 space-y-8", children: [_jsxs("div", { className: "grid grid-cols-3 gap-2 text-center p-4 bg-gray-50 rounded-xl border border-gray-100", children: [_jsxs("div", { children: [_jsx("p", { className: "text-[10px] text-gray-400 font-bold uppercase", children: "Orders" }), _jsx("p", { className: "font-bold text-gray-900", children: customer.totalOrders })] }), _jsxs("div", { className: "border-x border-gray-200", children: [_jsx("p", { className: "text-[10px] text-gray-400 font-bold uppercase", children: "LTV" }), _jsx("p", { className: "font-bold text-gray-900", children: formatCurrency(customer.totalSpend) })] }), _jsxs("div", { children: [_jsx("p", { className: "text-[10px] text-gray-400 font-bold uppercase", children: "Active" }), _jsxs("p", { className: "font-bold text-gray-900", children: [Math.ceil((Date.now() - new Date(customer.firstSeenAt).getTime()) /
                                                (1000 * 60 * 60 * 24)), "d"] })] })] }), _jsxs("div", { children: [_jsxs(Button, { className: "w-full py-3 bg-green-600 text-white rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-green-700 transition-colors mb-3 shadow-lg shadow-green-100", children: [_jsx(Icon, { name: "MessageCircle", size: 18 }), " Message on WhatsApp"] }), _jsxs("div", { className: "grid grid-cols-2 gap-3", children: [_jsx(Button, { className: "py-2.5 border border-gray-200 rounded-lg text-sm font-bold text-gray-700 hover:bg-gray-50", children: "Create Order" }), _jsx(Button, { className: "py-2.5 border border-gray-200 rounded-lg text-sm font-bold text-gray-700 hover:bg-gray-50", children: "Book Appt" })] })] }), _jsxs("div", { children: [_jsxs("h3", { className: "font-bold text-gray-900 mb-4 flex items-center gap-2", children: [_jsx(Icon, { name: "Clock", size: 16 }), " Recent Activity"] }), loading ? (_jsxs("div", { className: "space-y-3", children: [_jsx("div", { className: "h-12 bg-gray-50 rounded animate-pulse" }), _jsx("div", { className: "h-12 bg-gray-50 rounded animate-pulse" })] })) : (_jsx("div", { className: "space-y-4", children: history.map((item) => (_jsxs("div", { className: "flex items-center justify-between py-2 border-b border-gray-50 last:border-0 hover:bg-gray-50 px-2 -mx-2 rounded transition-colors cursor-pointer", children: [_jsxs("div", { className: "flex items-center gap-3", children: [_jsx("div", { className: cn("w-8 h-8 rounded-full flex items-center justify-center", item.type === "order"
                                                        ? "bg-blue-50 text-blue-600"
                                                        : "bg-purple-50 text-purple-600"), children: _jsx(Icon, { name: item.type === "order" ? "ShoppingBag" : "Calendar", size: 14 }) }), _jsxs("div", { children: [_jsxs("p", { className: "text-sm font-bold text-gray-900 capitalize", children: [item.type, " #", item.id.split("_")[1]] }), _jsx("p", { className: "text-xs text-gray-500", children: new Date(item.date).toLocaleDateString() })] })] }), _jsxs("div", { className: "text-right", children: [_jsx("p", { className: "text-sm font-mono font-medium", children: item.amount ? formatCurrency(item.amount) : "-" }), _jsx("span", { className: "text-[10px] uppercase font-bold text-green-600", children: item.status })] })] }, item.id))) }))] })] })] }));
};
