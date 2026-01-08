import React from "react";
import { Customer, CustomerStatus } from "@vayva/shared";
import { Icon, cn, Button } from "@vayva/ui";
import { WhatsAppAction } from "./WhatsAppAction";

interface CustomerListProps {
  customers: Customer[];
  isLoading: boolean;
  onSelectCustomer: (customer: Customer) => void;
}

export const CustomerList = ({
  customers,
  isLoading,
  onSelectCustomer,
}: CustomerListProps) => {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-NG", {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-NG", {
      style: "currency",
      currency: "NGN",
      minimumFractionDigits: 0,
    }).format(amount);
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-20 bg-gray-50 rounded-xl animate-pulse" />
        ))}
      </div>
    );
  }

  if (customers.length === 0) {
    return (
      <div className="text-center py-20 bg-white rounded-2xl border border-dashed border-gray-200">
        <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4 text-gray-300">
          <Icon name="Users" size={32} />
        </div>
        <h3 className="text-lg font-bold text-gray-900">No customers found</h3>
        <p className="text-gray-500 text-sm">
          Try adjusting your filters or search.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-sm">
      <table className="w-full text-left border-collapse">
        <thead className="bg-gray-50 border-b border-gray-200 text-xs text-gray-500 font-medium uppercase tracking-wider hidden md:table-header-group">
          <tr>
            <th className="px-6 py-4">Customer</th>
            <th className="px-6 py-4">Status</th>
            <th className="px-6 py-4">Orders</th>
            <th className="px-6 py-4">Total Spent</th>
            <th className="px-6 py-4">Last Active</th>
            <th className="px-6 py-4 text-right">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100">
          {customers.map((customer) => (
            <tr
              key={customer.id}
              onClick={() => onSelectCustomer(customer)}
              className="group hover:bg-gray-50 transition-colors cursor-pointer flex flex-col md:table-row p-4 md:p-0 relative"
            >
              {/* Mobile: Top Row */}
              <td className="md:px-6 md:py-4 flex items-center gap-3 mb-2 md:mb-0">
                <div
                  className={cn(
                    "w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold shrink-0",
                    customer.status === "vip"
                      ? "bg-amber-100 text-amber-700"
                      : "bg-gray-100 text-gray-700",
                  )}
                >
                  {customer.name.charAt(0)}
                </div>
                <div>
                  <div className="font-bold text-gray-900 text-sm md:text-base">
                    {customer.name}
                  </div>
                  <div className="text-xs text-gray-500 font-mono">
                    {customer.phone}
                  </div>
                </div>
              </td>

              {/* Mobile: Badges inline */}
              <td className="md:px-6 md:py-4 mb-2 md:mb-0 flex md:table-cell">
                <span
                  className={cn(
                    "px-2 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider inline-flex items-center gap-1",
                    customer.status === CustomerStatus.VIP
                      ? "bg-amber-100 text-amber-700"
                      : customer.status === CustomerStatus.NEW
                        ? "bg-blue-100 text-blue-700"
                        : "bg-gray-100 text-gray-600",
                  )}
                >
                  {customer.status === CustomerStatus.VIP && (
                    <Icon name="Crown" size={10} />
                  )}
                  {customer.status}
                </span>
              </td>

              {/* Stats */}
              <td className="md:px-6 md:py-4 text-sm text-gray-600 hidden md:table-cell">
                {customer.totalOrders} orders
              </td>
              <td className="md:px-6 md:py-4 font-mono font-bold text-gray-900 mb-2 md:mb-0 md:table-cell hidden">
                {formatCurrency(customer.totalSpend)}
              </td>

              {/* Mobile: Stats Row */}
              <td className="md:hidden text-xs text-gray-500 mb-4 flex gap-4">
                <span>{customer.totalOrders} orders</span>
                <span className="font-bold text-gray-900">
                  {formatCurrency(customer.totalSpend)}
                </span>
              </td>

              <td className="md:px-6 md:py-4 text-xs text-gray-400 md:table-cell hidden">
                {formatDate(customer.lastSeenAt)}
              </td>

              <td
                className="md:px-6 md:py-4 text-right md:table-cell"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="flex items-center justify-end gap-2 md:opacity-0 group-hover:opacity-100 transition-opacity">
                  <WhatsAppAction
                    phone={customer.phone}
                    name={customer.name}
                    variant="icon"
                  />
                  <Button
                    size="sm"
                    variant="ghost"
                    className="text-gray-400 hover:text-gray-900"
                    onClick={() => onSelectCustomer(customer)}
                  >
                    <Icon name="ChevronRight" size={16} />
                  </Button>
                </div>
                {/* Mobile Action: Absolute positioned */}
                <div className="absolute top-4 right-4 md:hidden">
                  <WhatsAppAction
                    phone={customer.phone}
                    name={customer.name}
                    variant="icon"
                  />
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
