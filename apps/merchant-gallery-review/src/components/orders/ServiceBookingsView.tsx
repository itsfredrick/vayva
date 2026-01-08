import React from "react";
import { UnifiedOrder } from "@vayva/shared";
import { OrderCard } from "./OrderCard";

interface ServiceBookingsViewProps {
  orders: UnifiedOrder[];
  onSelect: (order: UnifiedOrder) => void;
}

export const ServiceBookingsView = ({
  orders,
  onSelect,
}: ServiceBookingsViewProps) => {
  // Group by Date for Agenda View
  const getGroupedOrders = () => {
    // Test grouping logic - simple list for now as per prompt "Agenda-style list"
    return orders;
  };

  return (
    <div className="space-y-6">
      <h3 className="font-bold text-lg text-gray-900 sticky top-0 bg-[#F8F9FA] py-2 z-10">
        Today
      </h3>
      <div className="space-y-3">
        {orders.length === 0 ? (
          <div className="text-center py-20 bg-gray-50 rounded-3xl border border-dashed border-gray-200">
            <p className="text-gray-400 font-medium">No bookings for today.</p>
          </div>
        ) : (
          orders.map((order) => (
            <OrderCard key={order.id} order={order} onClick={onSelect} />
          ))
        )}
      </div>
    </div>
  );
};
