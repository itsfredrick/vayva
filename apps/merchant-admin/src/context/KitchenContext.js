"use client";
import { jsx as _jsx } from "react/jsx-runtime";
import { createContext, useContext, useEffect, useState } from "react";
const KitchenContext = createContext(undefined);
export function KitchenProvider({ children }) {
    const [orders, setOrders] = useState([]);
    const [metrics, setMetrics] = useState({
        ordersToday: 0,
        ordersInQueue: 0,
        avgPrepTime: 0,
        throughput: 0
    });
    useEffect(() => {
        // Note: Direct service calls from client will fail due to 'db' usage.
        // This context should ideally fetch from /api/kitchen/metrics
        const fetchMetrics = async () => {
            try {
                const res = await fetch("/api/kitchen/orders"); // Or a metrics specific endpoint
                const data = await res.json();
                // map data if needed
            }
            catch (e) { }
        };
        fetchMetrics();
    }, []);
    const updateStatus = async (id, status) => {
        try {
            await fetch(`/api/kitchen/orders/${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ status })
            });
        }
        catch (e) { }
    };
    const refresh = () => {
        // client-side refresh logic using fetch
    };
    return (_jsx(KitchenContext.Provider, { value: { orders, metrics, updateStatus, refresh }, children: children }));
}
export const useKitchen = () => {
    const context = useContext(KitchenContext);
    if (!context)
        throw new Error("useKitchen must be used within KitchenProvider");
    return context;
};
