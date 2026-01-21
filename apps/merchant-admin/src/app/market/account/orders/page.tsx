
"use client";

import React, { useEffect, useState } from "react";
import { MarketShell } from "@/components/market/market-shell";
import { Button, Icon } from "@vayva/ui";
import Link from "next/link";

export default function BuyerOrdersPage() {
    const [orders, setOrders] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch("/api/market/account/orders")
            .then((res) => res.json())
            .then((data) => {
                if (Array.isArray(data)) setOrders(data);
            })
            .catch(console.error)
            .finally(() => setLoading(false));
    }, []);

    return (
        <MarketShell>
            <div className="max-w-4xl mx-auto px-4 py-8">
                <h1 className="text-2xl font-bold text-white mb-6">My Orders</h1>

                {loading ? (
                    <div className="text-white">Loading History...</div>
                ) : orders.length === 0 ? (
                    <div className="text-center py-16 border border-white/10 rounded-xl bg-white/5">
                        <Icon name="ShoppingBag" className="mx-auto text-gray-400 mb-4" size={48} />
                        <h3 className="text-lg text-white font-bold mb-2">No orders yet</h3>
                        <p className="text-gray-400 mb-6">Start shopping to see your orders here.</p>
                        <Link href="/market">
                            <Button>Browse Market</Button>
                        </Link>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {orders.map((order) => (
                            <div key={order.id} className="bg-white/5 border border-white/10 p-6 rounded-xl">
                                <div className="flex justify-between items-start border-b border-white/5 pb-4 mb-4">
                                    <div>
                                        <div className="text-sm text-gray-400">Order Placed</div>
                                        <div className="text-white font-bold">{new Date(order.date).toLocaleDateString()}</div>
                                    </div>
                                    <div>
                                        <div className="text-sm text-gray-400">Total</div>
                                        <div className="text-white font-bold">₦ {Number(order.total).toLocaleString()}</div>
                                    </div>
                                    <div>
                                        <div className="text-sm text-gray-400">Order #</div>
                                        <div className="text-white font-mono">{order.orderNumber}</div>
                                    </div>
                                </div>

                                <div className="flex gap-4 items-center">
                                    <div className="flex-1">
                                        <h4 className="text-lg font-bold text-white mb-1">{order.store}</h4>
                                        <div className="text-sm text-gray-400">{order.items} Items</div>

                                        <div className="mt-4 flex flex-wrap gap-2">
                                            {order.refundStatus ? (
                                                <div className="inline-flex items-center gap-2 px-3 py-1 bg-purple-500/20 text-purple-400 rounded-full text-sm font-bold">
                                                    <Icon name="RefreshCcw" size={14} />
                                                    Refund: {order.refundStatus}
                                                </div>
                                            ) : null}

                                            {order.shipment ? (
                                                <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-bold ${order.shipment.status === 'DELIVERY_FAILED' || order.shipment.status === 'CANCELLED' || order.shipment.status === 'RETURN_TO_SENDER' ? 'bg-red-500/20 text-red-500' :
                                                        order.shipment.status === 'DELIVERED' ? 'bg-green-500/20 text-green-500' :
                                                            'bg-blue-500/20 text-blue-400'
                                                    }`}>
                                                    <Icon name={
                                                        ['DELIVERY_FAILED', 'CANCELLED', 'RETURN_TO_SENDER'].includes(order.shipment.status) ? 'AlertCircle' :
                                                            order.shipment.status === 'DELIVERED' ? 'CheckCircle' : 'Truck'
                                                    } size={14} />
                                                    {order.shipment.status === 'DELIVERY_FAILED' ? 'Delivery Failed' :
                                                        order.shipment.status === 'RETURN_TO_SENDER' ? 'Returning to Seller' :
                                                            order.shipment.status === 'DELIVERED' ? 'Delivered' :
                                                                `In Transit (${order.shipment.status})`}
                                                </div>
                                            ) : (
                                                <div className="inline-flex items-center gap-2 px-3 py-1 bg-yellow-500/20 text-yellow-400 rounded-full text-sm font-bold">
                                                    <Icon name="Package" size={14} />
                                                    {order.status || "Processing"}
                                                </div>
                                            )}

                                            {['DELIVERY_FAILED', 'RETURN_TO_SENDER'].includes(order.shipment?.status) && (
                                                <div className="w-full text-xs text-red-400 mt-2 font-mono bg-red-950/30 p-2 rounded">
                                                    Action Required: Delivery could not be completed. Support has been notified.
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    <div className="flex flex-col gap-2">
                                        <Link href={`/market/orders/${order.id}`}>
                                            <Button variant="outline">View Details</Button>
                                        </Link>
                                        {order.status === 'DELIVERED' && !order.refundStatus && (
                                            <Button variant="ghost" className="text-xs text-gray-500 hover:text-white">
                                                Return / Refund
                                            </Button>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </MarketShell>
    );
}
