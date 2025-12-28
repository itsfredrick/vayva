'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Icon, Button, Badge } from '@vayva/ui';
import { format } from 'date-fns';

interface Order {
    id: string;
    refCode: string;
    //    orderNumber: string;
    customerEmail: string;
    total: number;
    currency: string;
    status: string; // PAID, PENDING, etc
    paymentStatus: string;
    fulfillmentStatus: string;
    createdAt: string;
    OrderItem: any[];
}

export function OrdersPageClient() {
    const [orders, setOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState(true);
    const [pagination, setPagination] = useState({ page: 1, total: 0, pages: 1 });

    // Simple local search state
    const [searchTerm, setSearchTerm] = useState('');

    const fetchOrders = async () => {
        setLoading(true);
        try {
            const params = new URLSearchParams();
            params.set('page', pagination.page.toString());
            if (searchTerm) params.set('search', searchTerm);

            const res = await fetch(`/api/admin/orders?${params.toString()}`);
            const data = await res.json();
            setOrders(data.orders);
            setPagination(prev => ({ ...prev, ...data.pagination }));
        } catch (error) {
            console.error("Failed to fetch orders", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchOrders();
    }, [pagination.page]); // simplified dep

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        setPagination(p => ({ ...p, page: 1 }));
        fetchOrders(); // Trigger manually
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'PAID': return 'success';
            case 'PENDING': return 'warning';
            case 'CANCELLED': return 'destructive';
            default: return 'secondary';
        }
    }

    return (
        <div className="space-y-6 pb-20 md:pb-0">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Orders</h1>
                    <p className="text-gray-500">Manage and fulfill your store orders</p>
                </div>
                {/* Search */}
                <form onSubmit={handleSearch} className="flex gap-2 w-full md:w-auto">
                    <div className="relative flex-1 md:w-64">
                        <Icon name="Search" size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Search order ref or email..."
                            className="w-full pl-9 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
                            value={searchTerm}
                            onChange={e => setSearchTerm(e.target.value)}
                        />
                    </div>
                    <Button type="submit" variant="secondary">Filter</Button>
                </form>
            </div>

            {loading ? (
                <div className="flex justify-center py-20">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
                </div>
            ) : orders.length === 0 ? (
                <div className="text-center py-20 bg-white rounded-xl border border-dashed border-gray-300">
                    <Icon name="ShoppingBag" size={48} className="mx-auto text-gray-300 mb-4" />
                    <h3 className="text-lg font-medium text-gray-900">No orders yet</h3>
                    <p className="text-gray-500">Share your store link to start getting sales!</p>
                </div>
            ) : (
                <>
                    {/* DESKTOP TABLE */}
                    <div className="hidden md:block bg-white border border-gray-200 rounded-xl overflow-hidden">
                        <table className="w-full text-left text-sm">
                            <thead className="bg-gray-50 border-b border-gray-100">
                                <tr>
                                    <th className="px-6 py-4 font-medium text-gray-500">Order Ref</th>
                                    <th className="px-6 py-4 font-medium text-gray-500">Date</th>
                                    <th className="px-6 py-4 font-medium text-gray-500">Customer</th>
                                    <th className="px-6 py-4 font-medium text-gray-500">Payment</th>
                                    <th className="px-6 py-4 font-medium text-gray-500">Fulfillment</th>
                                    <th className="px-6 py-4 font-medium text-gray-500 text-right">Total</th>
                                    <th className="px-6 py-4 font-medium text-gray-500"></th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {orders.map(order => (
                                    <tr key={order.id} className="hover:bg-gray-50 transition-colors group">
                                        <td className="px-6 py-4 font-medium text-gray-900">
                                            #{order.refCode}
                                        </td>
                                        <td className="px-6 py-4 text-gray-600">
                                            {format(new Date(order.createdAt), 'MMM d, yyyy')}
                                            <span className="block text-xs text-gray-400">{format(new Date(order.createdAt), 'h:mm a')}</span>
                                        </td>
                                        <td className="px-6 py-4 text-gray-600">
                                            {order.customerEmail || 'Guest'}
                                        </td>
                                        <td className="px-6 py-4">
                                            <Badge variant={order.paymentStatus === 'SUCCESS' ? 'success' : 'default'}>
                                                {order.paymentStatus}
                                            </Badge>
                                        </td>
                                        <td className="px-6 py-4">
                                            <Badge variant="default">
                                                {order.fulfillmentStatus}
                                            </Badge>
                                        </td>
                                        <td className="px-6 py-4 text-right font-medium text-gray-900">
                                            {order.currency} {Number(order.total).toLocaleString()}
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <Button variant="ghost" size="sm" className="opacity-0 group-hover:opacity-100">
                                                View
                                            </Button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {/* MOBILE CARDS */}
                    <div className="md:hidden space-y-4">
                        {orders.map(order => (
                            <div key={order.id} className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm">
                                <div className="flex justify-between items-start mb-3">
                                    <div>
                                        <h3 className="font-bold text-gray-900">#{order.refCode}</h3>
                                        <p className="text-xs text-gray-500">{format(new Date(order.createdAt), 'MMM d, h:mm a')}</p>
                                    </div>
                                    <p className="font-bold text-gray-900">
                                        {order.currency} {Number(order.total).toLocaleString()}
                                    </p>
                                </div>

                                <div className="flex gap-2 mb-4">
                                    <Badge variant={order.paymentStatus === 'SUCCESS' ? 'success' : 'default'} className="text-xs">
                                        {order.paymentStatus}
                                    </Badge>
                                    <Badge variant="default" className="text-xs">
                                        {order.fulfillmentStatus}
                                    </Badge>
                                </div>

                                <div className="flex justify-between items-center border-t border-gray-100 pt-3">
                                    <span className="text-sm text-gray-500 truncate max-w-[150px]">
                                        {order.customerEmail}
                                    </span>
                                    <Button variant="outline" size="sm">
                                        View Details
                                    </Button>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Simple Pagination */}
                    <div className="flex justify-center gap-2 mt-6">
                        <Button
                            variant="outline"
                            disabled={pagination.page <= 1}
                            onClick={() => setPagination(p => ({ ...p, page: p.page - 1 }))}
                        >
                            Previous
                        </Button>
                        <span className="flex items-center px-4 text-sm text-gray-600">
                            Page {pagination.page} of {pagination.pages || 1}
                        </span>
                        <Button
                            variant="outline"
                            disabled={pagination.page >= pagination.pages}
                            onClick={() => setPagination(p => ({ ...p, page: p.page + 1 }))}
                        >
                            Next
                        </Button>
                    </div>
                </>
            )}
        </div>
    );
}
