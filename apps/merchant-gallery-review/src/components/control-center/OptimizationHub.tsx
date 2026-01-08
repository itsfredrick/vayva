import React, { useState } from "react";
import { Icon, cn } from "@vayva/ui";
import { OptimizationStatus } from "@/types/intelligence";

export const OptimizationHub = ({
  status,
  onToggleActive,
}: {
  status: OptimizationStatus;
  onToggleActive: (active: boolean) => void;
}) => {
  const [loading, setLoading] = useState(false);

  const handleToggle = async () => {
    setLoading(true);
    try {
      await onToggleActive(!status.active);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
      <div className="flex items-start justify-between mb-6">
        <div>
          <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
            <Icon
              name="Zap"
              size={20}
              className={status.active ? "text-amber-500" : "text-gray-400"}
            />
            Auto-Optimization
          </h3>
          <p className="text-sm text-gray-500 mt-1">
            Automatically improve mobile layout and checkout flow.
          </p>
        </div>
        <button
          onClick={handleToggle}
          disabled={loading}
          className={cn(
            "relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none",
            status.active ? "bg-amber-500" : "bg-gray-200",
          )}
        >
          <span
            className={cn(
              "pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out",
              status.active ? "translate-x-5" : "translate-x-0",
            )}
          />
        </button>
      </div>

      {status.active ? (
        <div className="space-y-4">
          <div className="flex gap-4 p-4 bg-amber-50 border border-amber-100 rounded-xl">
            <div className="flex-1">
              <p className="text-xs font-bold text-amber-800 uppercase tracking-wide mb-1">
                Impact
              </p>
              <p className="text-2xl font-bold text-amber-900">
                +{status.metrics.uplift_rate}%
              </p>
              <p className="text-xs text-amber-700">Conversion Uplift</p>
            </div>
            <div className="w-px bg-amber-200" />
            <div className="flex-1">
              <p className="text-xs font-bold text-amber-800 uppercase tracking-wide mb-1">
                Safety
              </p>
              <p className="text-2xl font-bold text-amber-900">
                {status.metrics.prevented_dropoff}%
              </p>
              <p className="text-xs text-amber-700">Drop-off Prevented</p>
            </div>
          </div>

          <div className="space-y-2">
            <p className="text-xs font-bold text-gray-500 uppercase">
              Active Rules Applied
            </p>
            {status.applied_rules.map((rule) => (
              <div
                key={rule.id}
                className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-100"
              >
                <div className="flex items-center gap-2">
                  <Icon
                    name={
                      rule.type === "mobile" ? "Smartphone" : "ShoppingCart"
                    }
                    size={14}
                    className="text-gray-400"
                  />
                  <span className="text-sm font-medium text-gray-900">
                    {rule.name}
                  </span>
                </div>
                <span
                  className={cn(
                    "text-[10px] uppercase font-bold px-1.5 py-0.5 rounded",
                    rule.impact === "high"
                      ? "bg-green-100 text-green-700"
                      : "bg-gray-100 text-gray-600",
                  )}
                >
                  {rule.impact} Impact
                </span>
              </div>
            ))}
          </div>

          <button className="text-xs text-gray-400 underline decoration-dotted hover:text-gray-600">
            Revert all changes
          </button>
        </div>
      ) : (
        <div className="text-center py-6 bg-gray-50 rounded-xl border border-dashed border-gray-200">
          <p className="text-sm text-gray-500 mb-2">
            Auto-Optimization is paused.
          </p>
          <button
            onClick={handleToggle}
            className="text-sm font-bold text-amber-600 hover:text-amber-700"
          >
            Turn On &rarr;
          </button>
        </div>
      )}
    </div>
  );
};
