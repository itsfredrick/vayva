import React from "react";
import { Icon, cn } from "@vayva/ui";

export const StatusStrip = () => {
  const statuses = [
    {
      label: "Payments",
      status: "Active",
      type: "success",
      icon: "CreditCard",
    },
    {
      label: "Payouts",
      status: "Enabled",
      type: "success",
      icon: "Banknote",
    },
    {
      label: "KYC",
      status: "Verified",
      type: "success",
      icon: "ShieldCheck",
    },
    {
      label: "Disputes",
      status: "0 Open",
      type: "neutral",
      icon: "AlertCircle", // Using AlertCircle instead of Scale since Scale might not exist
    },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
      {statuses.map((item) => (
        <div
          key={item.label}
          className="bg-white border border-gray-200 rounded-xl p-4 flex items-center gap-3 shadow-sm hover:shadow-md transition-shadow cursor-default"
        >
          <div
            className={cn(
              "w-10 h-10 rounded-full flex items-center justify-center shrink-0",
              item.type === "success"
                ? "bg-green-50 text-green-600"
                : "bg-gray-50 text-gray-500",
            )}
          >
            {/* @ts-ignore */}
            <Icon name={item.icon} size={20} />
          </div>
          <div>
            <p className="text-xs text-gray-500">{item.label}</p>
            <p
              className={cn(
                "font-bold text-sm",
                item.type === "success" ? "text-green-700" : "text-gray-900",
              )}
            >
              {item.status}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
};
