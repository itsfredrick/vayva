"use client";
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect, useState, useRef } from "react";
import { KitchenTicket } from "./KitchenTicket";
import { Button } from "@vayva/ui";
import { Loader2, UtensilsCrossed } from "lucide-react";
export function KitchenBoard() {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const pollerRef = useRef(null);
    const fetchOrders = async () => {
        try {
            const res = await fetch("/api/kitchen/orders");
            if (!res.ok)
                throw new Error("Failed to fetch orders");
            const data = await res.json();
            // The API returns an array directly or { orders: [] } 
            // Current MenuService returns array. KitchenTicket expects Order object.
            setOrders(Array.isArray(data) ? data : data.orders || []);
            setError(null);
        }
        catch (error) {
            console.error(error);
            setError(error.message);
        }
        finally {
            setLoading(false);
        }
    };
    useEffect(() => {
        fetchOrders();
        // Poll every 15 seconds
        pollerRef.current = setInterval(fetchOrders, 15000); // 15s
        return () => {
            if (pollerRef.current)
                clearInterval(pollerRef.current);
        };
    }, []);
    const handleStatusChange = () => {
        fetchOrders(); // Identify immediate update
    };
    if (loading && orders.length === 0) {
        return (_jsx("div", { className: "flex h-screen items-center justify-center", children: _jsx(Loader2, { className: "animate-spin text-gray-400", size: 48 }) }));
    }
    if (error) {
        return (_jsxs("div", { className: "flex flex-col items-center justify-center h-[60vh] text-center p-8 bg-red-50 border-2 border-dashed border-red-200 rounded-xl", children: [_jsx("div", { className: "p-4 bg-white rounded-full shadow-sm mb-4", children: _jsx(Loader2, { size: 48, className: "text-red-300" }) }), _jsx("h2", { className: "text-xl font-semibold text-red-900", children: "Oops! Something went wrong" }), _jsx("p", { className: "text-red-500 mt-2", children: error }), _jsx(Button, { onClick: fetchOrders, className: "mt-4", variant: "outline", children: "Try Again" })] }));
    }
    if (orders.length === 0) {
        return (_jsxs("div", { className: "flex flex-col items-center justify-center h-[60vh] text-center p-8 bg-gray-50 border-2 border-dashed border-gray-200 rounded-xl", children: [_jsx("div", { className: "p-4 bg-white rounded-full shadow-sm mb-4", children: _jsx(UtensilsCrossed, { size: 48, className: "text-gray-300" }) }), _jsx("h2", { className: "text-xl font-semibold text-gray-900", children: "All caught up!" }), _jsx("p", { className: "text-gray-500 mt-2", children: "There are no active orders at the moment. Relax, Chef!" })] }));
    }
    return (_jsx("div", { className: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6", children: orders.map((order) => (_jsx(KitchenTicket, { order: order, onStatusChange: handleStatusChange }, order.id))) }));
}
