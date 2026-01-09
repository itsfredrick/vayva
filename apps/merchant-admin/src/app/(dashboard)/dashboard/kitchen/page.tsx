"use client";

import React, { useState, useEffect } from "react";
import { Icon, Button, EmptyState } from "@vayva/ui";
import { toast } from "sonner";
import { formatDistanceToNow } from "date-fns";

export default function KitchenPage() {
    const [orders, setOrders] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    // Poll for new orders every 30 seconds
    useEffect(() => {
        fetchOrders();
        const interval = setInterval(fetchOrders, 30000);
        return () => clearInterval(interval);
    }, []);

    const fetchOrders = async () => {
        try {
            const res = await fetch("/api/kitchen/orders");
            const data = await res.json();
            if (Array.isArray(data)) {
                setOrders(data);
            }
        } catch (error) {
            // Silent fail on polling, toast on initial load optionally
        } finally {
            setLoading(false);
        }
    };

    const handleStatusUpdate = async (orderId: string, status: string) => {
        try {
            await fetch(`/api/orders/${orderId}/status`, {
                method: "POST",
                body: JSON.stringify({ status })
            });
            toast.success(`Order marked as ${status}`);
            fetchOrders(); // Refresh
        } catch (e) {
            toast.error("Failed to update status");
        }
    };

    if (loading) return <div className="p-8 text-white">Loading KDS...</div>;

    return (
        <div className="h-full bg-gray-900 text-white p-4 flex flex-col">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold flex items-center gap-3">
                    <Icon name="ChefHat" className="text-orange-500" />
                    Kitchen Display System
                </h1>
                <div className="flex items-center gap-4">
                    <span className="text-sm text-gray-400">Live Updates • {orders.length} Active Tickets</span>
                    <Button variant="outline" className="border-gray-700 text-white hover:bg-gray-800" onClick={fetchOrders}>
                        <Icon name="RefreshCw" size={16} />
                    </Button>
                </div>
            </div>

            {orders.length === 0 ? (
                <div className="flex-1 flex items-center justify-center">
                    <div className="text-center opacity-50">
                        <Icon name="Utensils" size={64} className="mx-auto mb-4" />
                        <h2 className="text-xl font-bold">All Clear, Chef!</h2>
                        <p>No active orders in the queue.</p>
                    </div>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4 overflow-auto pb-20">
                    {orders.map((order) => (
                        <div key={order.id} className="bg-gray-800 rounded-lg border-l-4 border-orange-500 overflow-hidden flex flex-col shadow-lg animate-in fade-in zoom-in-95 duration-300">
                            <div className="p-3 bg-gray-750 border-b border-gray-700 flex justify-between items-start">
                                <div>
                                    <span className="font-mono text-xl font-bold text-orange-400">#{order.orderNumber?.slice(-4)}</span>
                                    <div className="text-xs text-gray-400 mt-1">{formatDistanceToNow(new Date(order.createdAt))} ago</div>
                                </div>
                                <span className="px-2 py-1 rounded bg-orange-500/20 text-orange-300 text-xs font-bold uppercase">{order.type || "Dine-in"}</span>
                            </div>

                            <div className="p-3 flex-1 overflow-y-auto max-h-[300px] space-y-3">
                                {order.items?.map((item: any, idx: number) => (
                                    <div key={idx} className="flex gap-3 text-sm">
                                        <span className="font-bold text-lg w-6 h-6 flex items-center justify-center bg-gray-700 rounded text-white">{item.quantity}</span>
                                        <div className="flex-1">
                                            <div className="font-medium text-gray-200">{item.name}</div>
                                            {item.notes && <div className="text-xs text-yellow-400 mt-1 italic">Note: {item.notes}</div>}
                                            {item.options && (
                                                <div className="text-xs text-gray-400 mt-1">
                                                    {item.options.map((opt: any) => opt.value).join(", ")}
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <div className="p-3 bg-gray-750 border-t border-gray-700 flex gap-2">
                                <Button className="flex-1 bg-green-600 hover:bg-green-700 text-white font-bold" onClick={() => handleStatusUpdate(order.id, 'READY')}>
                                    READY
                                </Button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
