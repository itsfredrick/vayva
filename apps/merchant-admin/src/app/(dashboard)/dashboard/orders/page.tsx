"use client";

import { EmptyState, Button } from "@vayva/ui";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

export default function OrdersPage() {
    const [orders, setOrders] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
        fetchOrders();
    }, []);

    const fetchOrders = async () => {
        try {
            const res = await fetch("/api/orders");
            const data = await res.json();
            if (data.success) {
                setOrders(data.data || []);
            }
        } catch (error) {
            toast.error("Failed to load orders");
        } finally {
            setLoading(false);
        }
    };

    const handleShareStore = async () => {
        const shareData = {
            title: 'My Vayva Store',
            text: 'Check out my store on Vayva!',
            url: window.location.origin, // Ideally this should be the actual store URL
        };

        if (navigator.share) {
            try {
                await navigator.share(shareData);
            } catch (err) {
                // Share cancelled or failed
            }
        } else {
            // Fallback
            try {
                await navigator.clipboard.writeText(shareData.url);
                toast.success("Store URL copied to clipboard");
            } catch (e) {
                toast.error("Could not share store");
            }
        }
    };

    if (loading) {
        return (
            <div className="p-6 space-y-6">
                <div className="h-8 w-48 bg-gray-100 rounded animate-pulse" />
                <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
                    <div className="h-12 bg-gray-50 border-b border-gray-100" />
                    {[1, 2, 3, 4, 5].map((i) => (
                        <div key={i} className="h-16 border-b border-gray-100 flex items-center px-6 gap-4">
                            <div className="h-4 w-24 bg-gray-50 rounded animate-pulse" />
                            <div className="h-4 w-32 bg-gray-50 rounded animate-pulse" />
                            <div className="h-4 w-16 bg-gray-50 rounded animate-pulse ml-auto" />
                            <div className="h-6 w-20 bg-gray-50 rounded-full animate-pulse" />
                        </div>
                    ))}
                </div>
            </div>
        );
    }

    if (orders.length === 0) {
        return (
            <div className="p-6">
                <h1 className="text-2xl font-bold mb-6 text-gray-900">Orders</h1>
                <EmptyState
                    title="No orders yet"
                    icon="ShoppingBag"
                    description="When you receive your first order, it will appear here. Share your store link to get started!"
                    action={<Button className="px-8" onClick={handleShareStore}>Share Store Link</Button>}
                />
            </div>
        );
    }

    return (
        <div className="p-6">
            <h1 className="text-2xl font-bold mb-6 text-gray-900">Orders</h1>
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                <table className="w-full text-left text-sm">
                    <thead className="bg-gray-50 text-gray-500 font-medium border-b border-gray-100">
                        <tr>
                            <th className="px-6 py-4">Order ID</th>
                            <th className="px-6 py-4">Customer</th>
                            <th className="px-6 py-4">Total</th>
                            <th className="px-6 py-4">Status</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {orders.map((order: any) => (
                            <tr key={order.id} className="hover:bg-gray-50 transition-colors cursor-pointer" onClick={() => router.push(`/dashboard/orders/${order.id}`)}>
                                <td className="px-6 py-4 font-bold text-gray-900">#{order.orderNumber || order.id.slice(0, 8)}</td>
                                <td className="px-6 py-4 text-gray-600">{order.customer?.firstName || "Guest"}</td>
                                <td className="px-6 py-4 font-medium text-gray-900">{order.currency} {order.total}</td>
                                <td className="px-6 py-4">
                                    <span className={`px-2 py-1 rounded-full text-xs font-bold ${order.status === 'PAID' ? 'bg-green-100 text-green-700' :
                                        order.status === 'PENDING' ? 'bg-yellow-100 text-yellow-700' : 'bg-gray-100 text-gray-600'
                                        }`}>
                                        {order.status}
                                    </span>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
