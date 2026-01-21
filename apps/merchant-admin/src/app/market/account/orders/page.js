"use client";
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect, useState } from "react";
import { MarketShell } from "@/components/market/market-shell";
import { Button, Icon } from "@vayva/ui";
import Link from "next/link";
export default function BuyerOrdersPage() {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    useEffect(() => {
        fetch("/api/market/account/orders")
            .then((res) => res.json())
            .then((data) => {
            if (Array.isArray(data))
                setOrders(data);
        })
            .catch(console.error)
            .finally(() => setLoading(false));
    }, []);
    return (_jsx(MarketShell, { children: _jsxs("div", { className: "max-w-4xl mx-auto px-4 py-8", children: [_jsx("h1", { className: "text-2xl font-bold text-white mb-6", children: "My Orders" }), loading ? (_jsx("div", { className: "text-white", children: "Loading History..." })) : orders.length === 0 ? (_jsxs("div", { className: "text-center py-16 border border-white/10 rounded-xl bg-white/5", children: [_jsx(Icon, { name: "ShoppingBag", className: "mx-auto text-gray-400 mb-4", size: 48 }), _jsx("h3", { className: "text-lg text-white font-bold mb-2", children: "No orders yet" }), _jsx("p", { className: "text-gray-400 mb-6", children: "Start shopping to see your orders here." }), _jsx(Link, { href: "/market", children: _jsx(Button, { children: "Browse Market" }) })] })) : (_jsx("div", { className: "space-y-4", children: orders.map((order) => (_jsxs("div", { className: "bg-white/5 border border-white/10 p-6 rounded-xl", children: [_jsxs("div", { className: "flex justify-between items-start border-b border-white/5 pb-4 mb-4", children: [_jsxs("div", { children: [_jsx("div", { className: "text-sm text-gray-400", children: "Order Placed" }), _jsx("div", { className: "text-white font-bold", children: new Date(order.date).toLocaleDateString() })] }), _jsxs("div", { children: [_jsx("div", { className: "text-sm text-gray-400", children: "Total" }), _jsxs("div", { className: "text-white font-bold", children: ["\u20A6 ", Number(order.total).toLocaleString()] })] }), _jsxs("div", { children: [_jsx("div", { className: "text-sm text-gray-400", children: "Order #" }), _jsx("div", { className: "text-white font-mono", children: order.orderNumber })] })] }), _jsxs("div", { className: "flex gap-4 items-center", children: [_jsxs("div", { className: "flex-1", children: [_jsx("h4", { className: "text-lg font-bold text-white mb-1", children: order.store }), _jsxs("div", { className: "text-sm text-gray-400", children: [order.items, " Items"] }), _jsxs("div", { className: "mt-4 flex flex-wrap gap-2", children: [order.refundStatus ? (_jsxs("div", { className: "inline-flex items-center gap-2 px-3 py-1 bg-purple-500/20 text-purple-400 rounded-full text-sm font-bold", children: [_jsx(Icon, { name: "RefreshCcw", size: 14 }), "Refund: ", order.refundStatus] })) : null, order.shipment ? (_jsxs("div", { className: `inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-bold ${order.shipment.status === 'DELIVERY_FAILED' || order.shipment.status === 'CANCELLED' || order.shipment.status === 'RETURN_TO_SENDER' ? 'bg-red-500/20 text-red-500' :
                                                            order.shipment.status === 'DELIVERED' ? 'bg-green-500/20 text-green-500' :
                                                                'bg-blue-500/20 text-blue-400'}`, children: [_jsx(Icon, { name: ['DELIVERY_FAILED', 'CANCELLED', 'RETURN_TO_SENDER'].includes(order.shipment.status) ? 'AlertCircle' :
                                                                    order.shipment.status === 'DELIVERED' ? 'CheckCircle' : 'Truck', size: 14 }), order.shipment.status === 'DELIVERY_FAILED' ? 'Delivery Failed' :
                                                                order.shipment.status === 'RETURN_TO_SENDER' ? 'Returning to Seller' :
                                                                    order.shipment.status === 'DELIVERED' ? 'Delivered' :
                                                                        `In Transit (${order.shipment.status})`] })) : (_jsxs("div", { className: "inline-flex items-center gap-2 px-3 py-1 bg-yellow-500/20 text-yellow-400 rounded-full text-sm font-bold", children: [_jsx(Icon, { name: "Package", size: 14 }), order.status || "Processing"] })), ['DELIVERY_FAILED', 'RETURN_TO_SENDER'].includes(order.shipment?.status) && (_jsx("div", { className: "w-full text-xs text-red-400 mt-2 font-mono bg-red-950/30 p-2 rounded", children: "Action Required: Delivery could not be completed. Support has been notified." }))] })] }), _jsxs("div", { className: "flex flex-col gap-2", children: [_jsx(Link, { href: `/market/orders/${order.id}`, children: _jsx(Button, { variant: "outline", children: "View Details" }) }), order.status === 'DELIVERED' && !order.refundStatus && (_jsx(Button, { variant: "ghost", className: "text-xs text-gray-500 hover:text-white", children: "Return / Refund" }))] })] })] }, order.id))) }))] }) }));
}
