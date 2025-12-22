'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { AdminShell } from '@/components/admin-shell';
import { OrdersService, Order } from '@/services/orders';
import { Button, Icon, cn } from '@vayva/ui';
import { motion } from 'framer-motion';
import { FulfillmentDrawer } from '@/components/orders/fulfillment-drawer';

// --- Components ---

const StatusBadge = ({ status, type = 'status' }: { status: string, type?: 'status' | 'payment' | 'fulfillment' }) => {
    let colors = "bg-gray-50 text-gray-600";
    const s = status?.toLowerCase();

    if (type === 'payment') {
        if (s === 'success' || s === 'paid') colors = "bg-green-50 text-green-700";
        else if (s === 'pending' || s === 'initiated') colors = "bg-orange-50 text-orange-700";
        else if (s === 'failed' || s === 'unpaid') colors = "bg-red-50 text-red-700";
    } else if (type === 'fulfillment') {
        if (s === 'fulfilled') colors = "bg-green-50 text-green-700";
        else if (s === 'unfulfilled') colors = "bg-gray-50 text-gray-700";
        else if (s === 'processing' || s === 'dispatched') colors = "bg-blue-50 text-blue-700";
    } else {
        // Order Status
        if (s === 'delivered' || s === 'paid') colors = "bg-green-50 text-green-700";
        else if (s === 'pending_payment') colors = "bg-orange-50 text-orange-700";
        else if (s === 'processing' || s === 'fulfilling') colors = "bg-blue-50 text-blue-700";
        else if (s === 'cancelled') colors = "bg-red-50 text-red-700";
    }

    return (
        <span className={cn("px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider", colors)}>
            {status?.replace('_', ' ')}
        </span>
    );
};

export default function OrdersPage() {
    const router = useRouter();
    const [orders, setOrders] = useState<Order[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    // Fulfillment State
    const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
    const [isFulfillmentOpen, setIsFulfillmentOpen] = useState(false);

    const openFulfillment = (e: React.MouseEvent, order: Order) => {
        e.stopPropagation();
        setSelectedOrder(order);
        setIsFulfillmentOpen(true);
    };

    const fetchOrders = async () => {
        setIsLoading(true);
        try {
            const data = await OrdersService.getOrders({});
            setOrders(data);
        } catch (err) {
            console.error('Fetch orders error', err);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchOrders();
    }, []);

    return (
        <AdminShell title="Orders">
            <div className="flex flex-col gap-6">

                {/* Header Actions */}
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 max-w-md w-full">
                        <div className="relative flex-1">
                            <Icon name={"Search" as any} size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                            <input
                                type="text"
                                placeholder="Search orders..."
                                className="w-full h-10 pl-10 pr-4 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-black/5"
                            />
                        </div>
                        <Button variant="outline"><Icon name={"Filter" as any} size={16} className="mr-2" /> Filters</Button>
                    </div>
                </div>

                {/* Orders Table */}
                <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden min-h-[400px]">
                    <table className="w-full text-left text-sm">
                        <thead className="bg-gray-50 border-b border-gray-100 text-xs uppercase text-gray-500 font-medium">
                            <tr>
                                <th className="px-6 py-4">Ref Code</th>
                                <th className="px-6 py-4">Date</th>
                                <th className="px-6 py-4">Customer</th>
                                <th className="px-6 py-4">Statuses</th>
                                <th className="px-6 py-4">Total</th>
                                <th className="px-6 py-4 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {isLoading ? (
                                Array.from({ length: 5 }).map((_, i) => (
                                    <tr key={i}>
                                        <td className="px-6 py-4"><div className="h-4 w-16 bg-gray-100 rounded animate-pulse" /></td>
                                        <td className="px-6 py-4"><div className="h-4 w-24 bg-gray-100 rounded animate-pulse" /></td>
                                        <td className="px-6 py-4"><div className="h-4 w-32 bg-gray-100 rounded animate-pulse" /></td>
                                        <td className="px-6 py-4"><div className="h-4 w-20 bg-gray-100 rounded animate-pulse" /></td>
                                        <td className="px-6 py-4"><div className="h-4 w-16 bg-gray-100 rounded animate-pulse" /></td>
                                        <td className="px-6 py-4"></td>
                                    </tr>
                                ))
                            ) : orders.length === 0 ? (
                                <tr>
                                    <td colSpan={6} className="px-6 py-12 text-center text-gray-500">
                                        <div className="flex flex-col items-center gap-2">
                                            <Icon name={"ShoppingBag" as any} size={32} className="text-gray-300" />
                                            <p>No orders found.</p>
                                        </div>
                                    </td>
                                </tr>
                            ) : (
                                orders.map((order) => (
                                    <motion.tr
                                        key={order.id}
                                        whileHover={{ backgroundColor: "#F9FAFB" }}
                                        onClick={() => router.push(`/admin/orders/${order.id}`)}
                                        className="cursor-pointer group"
                                    >
                                        <td className="px-6 py-4 font-bold text-[#0B0B0B]">{order.refCode}</td>
                                        <td className="px-6 py-4 text-[#525252]">{new Date(order.createdAt).toLocaleDateString()}</td>
                                        <td className="px-6 py-4 text-[#0B0B0B]">{order.customer?.name || 'Guest'}</td>
                                        <td className="px-6 py-4">
                                            <div className="flex flex-wrap gap-1 items-start">
                                                <StatusBadge status={order.status} />
                                                <StatusBadge status={order.paymentStatus} type="payment" />
                                                <StatusBadge status={order.fulfillmentStatus} type="fulfillment" />
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 font-bold text-[#0B0B0B]">₦ {Number(order.total).toLocaleString()}</td>
                                        <td className="px-6 py-4 text-right flex justify-end gap-2">
                                            <Button
                                                size="sm"
                                                variant="outline"
                                                className="opacity-0 group-hover:opacity-100 transition-opacity"
                                                onClick={(e: React.MouseEvent) => openFulfillment(e, order)}
                                            >
                                                Fulfill
                                            </Button>
                                            <button className="p-2 hover:bg-gray-100 rounded-full text-gray-400 hover:text-black opacity-0 group-hover:opacity-100 transition-opacity">
                                                <Icon name={"ChevronRight" as any} size={16} />
                                            </button>
                                        </td>
                                    </motion.tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>

            </div>

            {selectedOrder && (
                <FulfillmentDrawer
                    isOpen={isFulfillmentOpen}
                    onClose={() => setIsFulfillmentOpen(false)}
                    order={selectedOrder}
                    onUpdate={() => {
                        fetchOrders();
                    }}
                />
            )}
        </AdminShell>
    );
}
