import React from "react";
import { Customer } from "@vayva/shared";
import { CustomerCard } from "./CustomerCard";
import { Icon } from "@vayva/ui";

interface CustomerGridProps {
  customers: Customer[];
  isLoading: boolean;
  onSelect: (customer: Customer) => void;
}

export const CustomerGrid = ({
  customers,
  isLoading,
  onSelect,
}: CustomerGridProps) => {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <div key={i} className="h-48 bg-gray-50 rounded-xl animate-pulse" />
        ))}
      </div>
    );
  }

  if (customers.length === 0) {
    return (
      <div className="text-center py-20 bg-gray-50 rounded-2xl border border-dashed border-gray-200">
        <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-4 text-gray-400 shadow-sm">
          <Icon name="Users" size={24} />
        </div>
        <h3 className="text-lg font-bold text-gray-900">
          You don't have any customers yet.
        </h3>
        <p className="text-gray-500 max-w-sm mx-auto mt-2">
          Customers appear here after someone places an order or booking. Share
          your store link to get started.
        </p>
        <button className="mt-6 px-6 py-2 bg-black text-white rounded-lg font-bold text-sm">
          Share Store Link
        </button>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {customers.map((customer) => (
        <CustomerCard
          key={customer.id}
          customer={customer}
          onSelect={onSelect}
        />
      ))}
    </div>
  );
};
