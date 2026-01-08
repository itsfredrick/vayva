import React from "react";
import { Icon, cn } from "@vayva/ui";

interface CustomerSegmentStripProps {
  activeFilter: string;
  onFilterChange: (filter: string) => void;
  stats?: {
    total: number;
    new: number;
    returning: number;
    vip: number;
    inactive: number;
  };
}

export const CustomerSegmentStrip = ({
  activeFilter,
  onFilterChange,
  stats,
}: CustomerSegmentStripProps) => {
  const segments = [
    {
      id: "all",
      label: "All Customers",
      count: stats?.total || 0,
      icon: "Users",
    },
    {
      id: "new",
      label: "New",
      count: stats?.new || 0,
      icon: "Sparkles",
      color: "blue",
    },
    {
      id: "returning",
      label: "Returning",
      count: stats?.returning || 0,
      icon: "RotateCcw",
      color: "indigo",
    },
    {
      id: "vip",
      label: "VIP",
      count: stats?.vip || 0,
      icon: "Crown",
      color: "amber",
    },
    {
      id: "inactive",
      label: "Inactive",
      count: stats?.inactive || 0,
      icon: "Moon",
      color: "gray",
    },
  ];

  return (
    <div className="flex gap-4 overflow-x-auto pb-4 mb-2 no-scrollbar">
      {segments.map((seg) => {
        const isActive = activeFilter === seg.id;

        return (
          <button
            key={seg.id}
            onClick={() => onFilterChange(seg.id)}
            className={cn(
              "flex items-center gap-3 p-3 pr-6 rounded-xl border transition-all min-w-[160px] cursor-pointer whitespace-nowrap",
              isActive
                ? "bg-black border-black text-white shadow-md ring-2 ring-offset-2 ring-gray-100"
                : "bg-white border-gray-200 text-gray-600 hover:border-gray-300 hover:shadow-sm",
            )}
          >
            <div
              className={cn(
                "w-8 h-8 rounded-lg flex items-center justify-center shrink-0",
                isActive
                  ? "bg-gray-800 text-white"
                  : "bg-gray-50 text-gray-500",
              )}
            >
              {/* @ts-ignore */}
              <Icon name={seg.icon} size={16} />
            </div>
            <div className="text-left">
              <p
                className={cn(
                  "text-xs font-medium uppercase",
                  isActive ? "text-gray-400" : "text-gray-500",
                )}
              >
                {seg.label}
              </p>
              <p className="text-lg font-bold leading-none mt-0.5">
                {seg.count}
              </p>
            </div>
          </button>
        );
      })}
    </div>
  );
};
