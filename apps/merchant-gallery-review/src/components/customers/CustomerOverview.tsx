import React from "react";
import { Customer, CustomerStatus } from "@vayva/shared";
import { Icon } from "@vayva/ui";

interface CustomerOverviewProps {
  customers: Customer[];
}

export const CustomerOverview = ({ customers }: CustomerOverviewProps) => {
  const total = customers.length;
  const returning = customers.filter(
    (c) =>
      c.status === CustomerStatus.RETURNING || c.status === CustomerStatus.VIP,
  ).length;
  const newCustomers = customers.filter(
    (c) => c.status === CustomerStatus.NEW,
  ).length;
  // Test sort by spend for 'Top'
  const topCustomer = [...customers].sort(
    (a, b) => b.totalSpend - a.totalSpend,
  )[0];

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
      <div className="bg-white border border-gray-200 rounded-xl p-4 flex items-center gap-3 shadow-sm hover:shadow-md transition-shadow">
        <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center text-blue-600">
          <Icon name="Users" size={20} />
        </div>
        <div>
          <p className="text-xs text-gray-500">Total Customers</p>
          <p className="font-bold text-lg text-gray-900">{total}</p>
        </div>
      </div>

      <div className="bg-white border border-gray-200 rounded-xl p-4 flex items-center gap-3 shadow-sm hover:shadow-md transition-shadow">
        <div className="w-10 h-10 rounded-full bg-green-50 flex items-center justify-center text-green-600">
          <Icon name="Repeat" size={20} />
        </div>
        <div>
          <p className="text-xs text-gray-500">Repeat Customers</p>
          <p className="font-bold text-lg text-gray-900">{returning}</p>
        </div>
      </div>

      <div className="bg-white border border-gray-200 rounded-xl p-4 flex items-center gap-3 shadow-sm hover:shadow-md transition-shadow">
        <div className="w-10 h-10 rounded-full bg-purple-50 flex items-center justify-center text-purple-600">
          <Icon name="UserPlus" size={20} />
        </div>
        <div>
          <p className="text-xs text-gray-500">New this week</p>
          <p className="font-bold text-lg text-gray-900">{newCustomers}</p>
        </div>
      </div>

      {topCustomer && (
        <div className="bg-white border border-gray-200 rounded-xl p-4 flex items-center gap-3 shadow-sm hover:shadow-md transition-shadow cursor-pointer">
          <div className="w-10 h-10 rounded-full bg-amber-50 flex items-center justify-center text-amber-600">
            <Icon name="Crown" size={20} />
          </div>
          <div>
            <p className="text-xs text-gray-500">Top Customer</p>
            <p className="font-bold text-sm text-gray-900 truncate max-w-[120px]">
              {topCustomer.name}
            </p>
          </div>
        </div>
      )}
    </div>
  );
};
