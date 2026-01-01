import React from "react";
import { UnifiedOrder } from "@vayva/shared";
import { OrderCard } from "./OrderCard";

interface RetailOrdersViewProps {
  orders: UnifiedOrder[];
  onSelect: (order: UnifiedOrder) => void;
}

export const RetailOrdersView = ({
  orders,
  onSelect,
}: RetailOrdersViewProps) => {
  return (
    <div className="space-y-3">
      {orders.length === 0 ? (
        <div className="text-center py-20 bg-gray-50 rounded-3xl border border-dashed border-gray-200 flex flex-col items-center">
          <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center mb-4 shadow-sm">
            <span className="text-2xl">📦</span>
          </div>
          <h3 className="font-bold text-gray-900 mb-1">No orders yet</h3>
          <p className="text-gray-500 max-w-xs mb-6 text-sm">
            Orders will appear here when you add them manually or when customers
            checkout on WhatsApp.
          </p>
          <div className="flex flex-col sm:flex-row gap-3">
            <button
              onClick={() =>
                (window.location.href = "/admin/orders/new?mode=test")
              }
              className="px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm font-bold text-gray-700 hover:bg-gray-50 hover:border-gray-300 transition-all shadow-sm"
            >
              Create Test Order
            </button>
            <button
              onClick={() => (window.location.href = "/onboarding/whatsapp")}
              className="px-4 py-2 bg-green-500 border border-green-600 rounded-lg text-sm font-bold text-white hover:bg-green-600 transition-all shadow-sm"
            >
              Connect WhatsApp
            </button>
          </div>
        </div>
      ) : (
        orders.map((order) => (
          <OrderCard key={order.id} order={order} onClick={onSelect} />
        ))
      )}
    </div>
  );
};
