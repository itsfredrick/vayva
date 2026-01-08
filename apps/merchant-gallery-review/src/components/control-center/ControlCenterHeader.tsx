import React from "react";
import { Icon, cn } from "@vayva/ui";

interface ControlCenterHeaderProps {
  healthy: boolean;
}

export const ControlCenterHeader = ({ healthy }: ControlCenterHeaderProps) => {
  return (
    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
      <div>
        <h1 className="text-2xl font-heading font-bold text-gray-900">
          Control Center
        </h1>
        <p className="text-gray-500 mt-1">
          Manage how your store looks, connects, and operates.
        </p>
      </div>

      <div
        className={cn(
          "flex items-center gap-3 px-4 py-2 rounded-full border text-sm font-medium transition-colors cursor-help",
          healthy
            ? "bg-green-50 border-green-200 text-green-700"
            : "bg-amber-50 border-amber-200 text-amber-700",
        )}
        title={healthy ? "All systems operational" : "Attention needed"}
      >
        <div
          className={cn(
            "w-2 h-2 rounded-full",
            healthy ? "bg-green-500" : "bg-amber-500 animate-pulse",
          )}
        />
        {healthy ? "All systems operational" : "Attention needed"}
      </div>
    </div>
  );
};
