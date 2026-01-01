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
  const [metrics, setMetrics] = useState<KitchenMetrics>(
    KitchenService.getMetrics(),
  );

  useEffect(() => {
    // Subscribe to singleton updates
    const unsubscribe = KitchenService.subscribe((newOrders) => {
      setOrders([...newOrders]); // Force new reference
      setMetrics(KitchenService.getMetrics());
    });
    return unsubscribe;
  }, []);

  const updateStatus = (id: string, status: OrderStatus) => {
    KitchenService.updateStatus(id, status);
  };

  const refresh = () => {
    setOrders([...KitchenService.getOrders()]);
    setMetrics(KitchenService.getMetrics());
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
