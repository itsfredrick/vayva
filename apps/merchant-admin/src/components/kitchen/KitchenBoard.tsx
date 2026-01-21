"use client";

import { useEffect, useState, useRef } from "react";
import { KitchenTicket } from "./KitchenTicket";
import { Button, Card, StatusChip } from "@vayva/ui";
import { Loader2, UtensilsCrossed } from "lucide-react";

export function KitchenBoard() {
    const [orders, setOrders] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const pollerRef = useRef<any>(null);

    const fetchOrders = async () => {
        try {
            const res = await fetch("/api/kitchen/orders");
            if (!res.ok) throw new Error("Failed to fetch orders");
            const data = await res.json();
            // The API returns an array directly or { orders: [] } 
            // Current MenuService returns array. KitchenTicket expects Order object.
            setOrders(Array.isArray(data) ? data : data.orders || []);
            setError(null);
        } catch (error: any) {
            console.error(error);
            setError(error.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchOrders();

        // Poll every 15 seconds
        pollerRef.current = setInterval(fetchOrders, 15000); // 15s

        return () => {
            if (pollerRef.current) clearInterval(pollerRef.current);
        };
    }, []);

    const handleStatusChange = () => {
        fetchOrders(); // Identify immediate update
    };

    if (loading && orders.length === 0) {
        return (
            <div className="flex h-screen items-center justify-center">
                <Loader2 className="animate-spin text-gray-400" size={48} />
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex flex-col items-center justify-center h-[60vh] text-center p-8 bg-red-50 border-2 border-dashed border-red-200 rounded-xl">
                <div className="p-4 bg-white rounded-full shadow-sm mb-4">
                    <Loader2 size={48} className="text-red-300" />
                </div>
                <h2 className="text-xl font-semibold text-red-900">Oops! Something went wrong</h2>
                <p className="text-red-500 mt-2">{error}</p>
                <Button onClick={fetchOrders} className="mt-4" variant="outline">Try Again</Button>
            </div>
        );
    }

    if (orders.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center h-[60vh] text-center p-8 bg-gray-50 border-2 border-dashed border-gray-200 rounded-xl">
                <div className="p-4 bg-white rounded-full shadow-sm mb-4">
                    <UtensilsCrossed size={48} className="text-gray-300" />
                </div>
                <h2 className="text-xl font-semibold text-gray-900">All caught up!</h2>
                <p className="text-gray-500 mt-2">There are no active orders at the moment. Relax, Chef!</p>
            </div>
        );
    }

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {orders.map((order) => (
                <KitchenTicket
                    key={order.id}
                    order={order}
                    onStatusChange={handleStatusChange}
                />
            ))}
        </div>
    );
}
