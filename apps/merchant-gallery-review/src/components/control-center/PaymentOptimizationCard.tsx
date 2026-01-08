import React, { useState } from "react";
import { Icon, cn } from "@vayva/ui";
import { CheckoutOptimizationStatus } from "@/types/checkout";

export const PaymentOptimizationCard = ({
  status,
  onToggle,
}: {
  status: CheckoutOptimizationStatus;
  onToggle: (active: boolean) => void;
}) => {
  const [loading, setLoading] = useState(false);

  const handleToggle = async () => {
    setLoading(true);
    try {
      await onToggle(!status.active);
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
              name="Shield"
              size={20}
              className={status.active ? "text-indigo-500" : "text-gray-400"}
            />
            Checkout Protection & AI
          </h3>
          <p className="text-sm text-gray-500 mt-1">
            Smart retry logic and fraud prevention.
          </p>
        </div>
        <button
          onClick={handleToggle}
          disabled={loading}
          className={cn(
            "relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none",
            status.active ? "bg-indigo-500" : "bg-gray-200",
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
        <div className="space-y-6">
          {/* Key Metrics */}
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-indigo-50 border border-indigo-100 rounded-xl p-4">
              <p className="text-xs font-bold text-indigo-700 uppercase tracking-wide">
                Success Rate
              </p>
              <div className="flex items-end gap-2 mt-1">
                <span className="text-2xl font-bold text-indigo-900">
                  +{status.metrics.success_rate_uplift}%
                </span>
                <Icon
                  name="TrendingUp"
                  size={14}
                  className="text-indigo-600 mb-1"
                />
              </div>
            </div>
            <div className="bg-green-50 border border-green-100 rounded-xl p-4">
              <p className="text-xs font-bold text-green-700 uppercase tracking-wide">
                Failures Prevented
              </p>
              <div className="flex items-end gap-2 mt-1">
                <span className="text-2xl font-bold text-green-900">
                  {status.metrics.failed_transactions_prevented}
                </span>
                <Icon name="Shield" size={14} className="text-green-600 mb-1" />
              </div>
            </div>
          </div>

          {/* Active Rules */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-gray-500 uppercase">
              Active Protections
            </h4>
            {status.rules.map((rule) => (
              <div
                key={rule.id}
                className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-100 hover:bg-gray-100 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div
                    className={cn(
                      "w-8 h-8 rounded-full flex items-center justify-center",
                      rule.type === "retry"
                        ? "bg-amber-100 text-amber-600"
                        : rule.type === "ordering"
                          ? "bg-blue-100 text-blue-600"
                          : "bg-purple-100 text-purple-600",
                    )}
                  >
                    <Icon
                      name={
                        rule.type === "retry"
                          ? "RefreshCw"
                          : rule.type === "ordering"
                            ? "List"
                            : "Zap"
                      }
                      size={14}
                    />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-gray-900">
                      {rule.name}
                    </p>
                    <p className="text-xs text-gray-500">
                      {rule.type === "retry"
                        ? "Retries failed cards automatically"
                        : rule.type === "ordering"
                          ? "Prioritizes successful methods"
                          : "Simulates simplified flow"}
                    </p>
                  </div>
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
        </div>
      ) : (
        <div className="text-center py-8 bg-gray-50 rounded-xl border border-dashed border-gray-200">
          <Icon
            name="ShieldOff"
            size={32}
            className="text-gray-300 mx-auto mb-2"
          />
          <p className="text-sm text-gray-500 mb-2">
            Checkout protections disabled.
          </p>
        </div>
      )}
    </div>
  );
};
