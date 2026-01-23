"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { KitchenOrder, KitchenMetrics, OrderStatus } from "@/types/kds";
import { KitchenService } from "@/services/KitchenService";

interface KitchenContextType {
  orders: KitchenOrder[];
  metrics: KitchenMetrics;
  updateStatus: (id: string, status: OrderStatus) => void;
  refresh: () => void;
}

const KitchenContext = createContext<KitchenContextType | undefined>(undefined);

export function KitchenProvider({ children }: { children: React.ReactNode }) {
  const [orders, setOrders] = useState<KitchenOrder[]>([]);
  const [metrics, setMetrics] = useState<KitchenMetrics>({
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
      } catch (_error) {
    // Intentionally empty
  }
    }
    fetchMetrics();
  }, []);

  const updateStatus = async (id: string, status: OrderStatus) => {
    try {
      await fetch(`/api/kitchen/orders/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status })
      });
    } catch (_error) {
    // Intentionally empty
  }
  };

  const refresh = () => {
    // client-side refresh logic using fetch
  };

  return (
    <KitchenContext.Provider value={{ orders, metrics, updateStatus, refresh }}>
      {children}
    </KitchenContext.Provider>
  );
}

export const useKitchen = () => {
  const context = useContext(KitchenContext);
  if (!context)
    throw new Error("useKitchen must be used within KitchenProvider");
  return context;
};
