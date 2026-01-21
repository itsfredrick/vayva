"use client";
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect, useState } from "react";
import { MarketShell } from "@/components/market/market-shell";
import { Button, Icon } from "@vayva/ui"; // Mock UI
export default function MarketOrdersPage() {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [shippingId, setShippingId] = useState(null);
    useEffect(() => {
        fetch("/api/market/orders")
            .then((res) => res.json())
            .then((data) => {
            if (Array.isArray(data))
                setOrders(data);
        })
            .catch(console.error)
            .finally(() => setLoading(false));
    }, []);
    const handleShip = async (orderId) => {
        setShippingId(orderId);
        try {
            const res = await fetch(`/api/market/orders/${orderId}/ship`, { method: "POST" });
            const data = await res.json();
            if (data.success) {
                alert(`Order shipped! Tracking: ${data.tracking.jobId}`);
                // Refresh
                const updated = orders.map(o => o.id === orderId ? {
                    ...o,
                    status: "FULFILLED",
                    shipment: { status: "REQUESTED", trackingCode: data.tracking.jobId }
                } : o);
                setOrders(updated);
            }
            else {
                alert("Shipping Failed: " + (data.error || "Unknown"));
            }
        }
        catch (err) {
            alert("Failed to connect to shipping service");
        }
        finally {
            setShippingId(null);
        }
    };
    return (_jsx(MarketShell, { children: _jsxs("div", { className: "max-w-6xl mx-auto px-4 py-8", children: [_jsx("h1", { className: "text-2xl font-bold text-white mb-6", children: "Market Orders" }), loading ? (_jsx("div", { className: "text-white", children: "Loading Orders..." })) : orders.length === 0 ? (_jsx("div", { className: "text-gray-400 p-12 text-center border border-white/10 rounded-xl", children: "No active orders found." })) : (_jsx("div", { className: "space-y-4", children: orders.map((order) => (_jsxs("div", { className: "bg-white/5 border border-white/10 p-6 rounded-xl flex flex-col md:flex-row gap-6 justify-between items-start", children: [_jsxs("div", { className: "flex-1", children: [_jsxs("div", { className: "flex items-center gap-3 mb-2", children: [_jsxs("h3", { className: "text-lg font-bold text-white", children: ["Order #", order.orderNumber] }), _jsx("span", { className: `px-2 py-0.5 rounded text-xs font-bold ${order.status === 'FULFILLED' ? 'bg-green-500/20 text-green-400' : 'bg-yellow-500/20 text-yellow-500'}`, children: order.status })] }), _jsxs("div", { className: "text-sm text-gray-400 mb-4", children: [new Date(order.date).toLocaleDateString(), " \u2022 ", order.customer.name, " \u2022 ", order.customer.address] }), _jsx("div", { className: "space-y-2", children: order.items.map((item, i) => (_jsxs("div", { className: "flex justify-between text-sm text-gray-300 border-b border-white/5 pb-1", children: [_jsxs("span", { children: [item.qty, "x ", item.name] }), _jsxs("span", { children: ["\u20A6 ", Number(item.price).toLocaleString()] })] }, i))) }), _jsxs("div", { className: "mt-3 flex justify-between text-white font-bold", children: [_jsx("span", { children: "Total" }), _jsxs("span", { children: ["\u20A6 ", Number(order.total).toLocaleString()] })] })] }), _jsxs("div", { className: "w-full md:w-64 bg-black/20 p-4 rounded-lg border border-white/5", children: [_jsx("h4", { className: "text-xs font-bold text-gray-400 uppercase mb-3", children: "Fulfillment" }), order.shipment ? (_jsxs("div", { children: [_jsxs("div", { className: "text-green-400 text-sm font-bold flex items-center gap-2 mb-2", children: [_jsx(Icon, { name: "Truck", size: 16 }), "In Transit"] }), _jsxs("div", { className: "text-xs text-gray-500", children: ["Tracking ID:", _jsx("div", { className: "font-mono text-white mt-1 select-all", children: order.shipment.trackingCode })] })] })) : (_jsxs("div", { className: "space-y-3", children: [_jsx(Button, { onClick: () => handleShip(order.id), disabled: !!shippingId, className: "w-full bg-primary text-black font-bold", children: shippingId === order.id ? "Booking..." : "Ship with Kwik" }), _jsx("p", { className: "text-[10px] text-gray-500 text-center", children: "Calls Kwik Bike \u2022 Estimate: 2h" })] }))] })] }, order.id))) }))] }) }));
}
