"use client";

import React from "react";
import Link from "next/link";
import { Icon } from "@vayva/ui";

const ACTIONS = [
  {
    label: "New Product",
    icon: "Plus",
    href: "/dashboard/products/new",
    available: true,
  },
  { label: "Create Discount", icon: "Tag", href: "#", available: false },
  {
    label: "Create Invoice",
    icon: "FileText",
    href: "/dashboard/finance",
    available: true,
  },
  { label: "Send Broadcast", icon: "Send", href: "#", available: false },
  {
    label: "Delivery Task",
    icon: "Truck",
    href: "/dashboard/orders",
    available: true,
  },
  {
    label: "View Reports",
    icon: "BarChart2",
    href: "/dashboard/analytics",
    available: true,
  }, // Mapped to analytics
];

export const QuickActions = () => {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
      {ACTIONS.map((action) => (
        <Link
          key={action.label}
          href={action.available ? action.href : "#"}
          className={`block group ${!action.available ? "cursor-not-allowed opacity-50" : ""}`}
          onClick={(e) => !action.available && e.preventDefault()}
        >
          <div className="bg-[#0A0F0D] border border-white/5 rounded-xl p-4 flex flex-col items-center gap-3 hover:border-primary/30 hover:bg-white/5 transition-all text-center h-full">
            <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-white group-hover:scale-110 transition-transform group-hover:bg-primary group-hover:text-black">
              {/* @ts-ignore */}
              <Icon name={action.icon} size={20} />
            </div>
            <span className="text-xs font-medium text-text-secondary group-hover:text-white transition-colors">
              {action.label}
            </span>
            {!action.available && (
              <span className="text-[10px] text-primary/50 uppercase tracking-wider font-bold">
                Soon
              </span>
            )}
          </div>
        </Link>
      ))}
    </div>
  );
};
