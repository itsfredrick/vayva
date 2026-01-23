
"use client";

import React, { useEffect, useState } from "react";
import { MarketShell } from "@/components/market/market-shell";
import { Button, Card, Icon } from "@vayva/ui"; // Mock UI

export default function MarketOrdersPage() {
    const [orders, setOrders] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [shippingId, setShippingId] = useState<string | null>(null);

    useEffect(() => {
        fetch("/api/market/orders")
            .then((res: unknown) => res.json())
            .then((data: unknown) => {
                if (Array.isArray(data)) setOrders(data);
            })
            .catch(console.error)
            .finally(() => setLoading(false));
    }, []);

    const handleShip = async (orderId: string) => {
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
            } else {
                alert("Shipping Failed: " + (data.error || "Unknown"));
            }
        } catch (err) {
            alert("Failed to connect to shipping service");
        } finally {
            setShippingId(null);
        }
    };

    return (
        <MarketShell>
            <div className="max-w-6xl mx-auto px-4 py-8">
                <h1 className="text-2xl font-bold text-white mb-6">Market Orders</h1>

                {loading ? (
                    <div className="text-white">Loading Orders...</div>
                ) : orders.length === 0 ? (
                    <div className="text-gray-400 p-12 text-center border border-white/10 rounded-xl">
                        No active orders found.
                    </div>
                ) : (
                    <div className="space-y-4">
                        {orders.map((order: unknown) => (
                            <div key={order.id} className="bg-white/5 border border-white/10 p-6 rounded-xl flex flex-col md:flex-row gap-6 justify-between items-start">
                                {/* Summary */}
                                <div className="flex-1">
                                    <div className="flex items-center gap-3 mb-2">
                                        <h3 className="text-lg font-bold text-white">Order #{order.orderNumber}</h3>
                                        <span className={`px-2 py-0.5 rounded text-xs font-bold ${order.status === 'FULFILLED' ? 'bg-green-500/20 text-green-400' : 'bg-yellow-500/20 text-yellow-500'
                                            }`}>
                                            {order.status}
                                        </span>
                                    </div>
                                    <div className="text-sm text-gray-400 mb-4">
                                        {new Date(order.date).toLocaleDateString()} • {order.customer.name} • {order.customer.address}
                                    </div>

                                    {/* Items */}
                                    <div className="space-y-2">
                                        {order.items.map((item: unknown, i: number) => (
                                            <div key={i} className="flex justify-between text-sm text-gray-300 border-b border-white/5 pb-1">
                                                <span>{item.qty}x {item.name}</span>
                                                <span>₦ {Number(item.price).toLocaleString()}</span>
                                            </div>
                                        ))}
                                    </div>

                                    <div className="mt-3 flex justify-between text-white font-bold">
                                        <span>Total</span>
                                        <span>₦ {Number(order.total).toLocaleString()}</span>
                                    </div>
                                </div>

                                {/* Actions */}
                                <div className="w-full md:w-64 bg-black/20 p-4 rounded-lg border border-white/5">
                                    <h4 className="text-xs font-bold text-gray-400 uppercase mb-3">Fulfillment</h4>

                                    {order.shipment ? (
                                        <div>
                                            <div className="text-green-400 text-sm font-bold flex items-center gap-2 mb-2">
                                                <Icon name="Truck" size={16} />
                                                In Transit
                                            </div>
                                            <div className="text-xs text-gray-500">
                                                Tracking ID:
                                                <div className="font-mono text-white mt-1 select-all">{order.shipment.trackingCode}</div>
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="space-y-3">
                                            <Button
                                                onClick={() => handleShip(order.id)}
                                                disabled={!!shippingId}
                                                className="w-full bg-primary text-black font-bold"
                                            >
                                                {shippingId === order.id ? "Booking..." : "Ship with Kwik"}
                                            </Button>
                                            <p className="text-[10px] text-gray-500 text-center">
                                                Calls Kwik Bike • Estimate: 2h
                                            </p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </MarketShell>
    );
}
