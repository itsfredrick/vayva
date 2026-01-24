import React from "react";
import { UnifiedOrder } from "@vayva/shared";
import { OrderCard } from "./OrderCard";
import { Icon } from "@vayva/ui";

interface ServiceBookingsViewProps {
  orders: UnifiedOrder[];
  onSelect: (order: UnifiedOrder) => void;
}

export const ServiceBookingsView = ({
  orders,
  onSelect,
}: ServiceBookingsViewProps) => {
  if (orders.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 bg-gray-50/50 rounded-3xl border border-dashed border-gray-200">
        <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center mb-4 shadow-sm">
          <Icon name="Calendar" size={20} className="text-gray-400" />
        </div>
        <h3 className="text-gray-900 font-bold mb-1">No bookings found</h3>
        <p className="text-gray-500 text-sm max-w-[200px] text-center">
          Try adjusting your filters or search terms.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h3 className="font-bold text-lg text-gray-900 sticky top-0 bg-[#F8F9FA] py-2 z-10">
        Today
      </h3>
      <div className="space-y-3">
        {orders.map((order: any) => (
          <OrderCard key={order.id} order={order} onClick={onSelect} />
        ))}
      </div>
    </div>
  );
};
