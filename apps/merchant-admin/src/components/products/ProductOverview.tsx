import React from "react";
import { ProductServiceItem, ProductServiceStatus } from "@vayva/shared";
import { Icon } from "@vayva/ui";

interface ProductOverviewProps {
  items: ProductServiceItem[];
}

export const ProductOverview = ({ items }: ProductOverviewProps) => {
  const total = items.length;
  const active = items.filter(
    (i) => i.status === ProductServiceStatus.ACTIVE,
  ).length;
  const outOfStock = items.filter(
    (i) => i.status === ProductServiceStatus.OUT_OF_STOCK,
  ).length;
  const inactive = items.filter(
    (i) =>
      i.status === ProductServiceStatus.INACTIVE ||
      i.status === ProductServiceStatus.DRAFT,
  ).length;

  const stats = [
    {
      label: "Total Items",
      value: total,
      icon: "Package",
      color: "bg-blue-50 text-blue-600",
    },
    {
      label: "Active",
      value: active,
      icon: "CheckCircle",
      color: "bg-green-50 text-green-600",
    },
    {
      label: "Out of Stock",
      value: outOfStock,
      icon: "AlertCircle",
      color: "bg-red-50 text-red-600",
    },
    {
      label: "Inactive/Draft",
      value: inactive,
      icon: "FileText",
      color: "bg-gray-100 text-gray-600",
    },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
      {stats.map((stat) => (
        <div
          key={stat.label}
          className="bg-white border border-gray-200 rounded-xl p-4 flex items-center gap-3 shadow-sm"
        >
          <div
            className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${stat.color}`}
          >
            {/* @ts-ignore */}
            <Icon name={stat.icon} size={20} />
          </div>
          <div>
            <p className="text-xs text-gray-500">{stat.label}</p>
            <p className="font-bold text-lg text-gray-900">{stat.value}</p>
          </div>
        </div>
      ))}
    </div>
  );
};
