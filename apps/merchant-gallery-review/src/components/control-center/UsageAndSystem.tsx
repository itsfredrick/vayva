import React from "react";
import { ControlCenterState } from "@vayva/shared";
import { Icon, cn } from "@vayva/ui";

interface UsageAndSystemProps {
  usage: ControlCenterState["usage"];
  systemStatus: ControlCenterState["systemStatus"];
}

export const UsageAndSystem = ({
  usage,
  systemStatus,
}: UsageAndSystemProps) => {
  const renderProgressBar = (metric: any) => {
    const percentage =
      metric.limit === "unlimited" ? 0 : (metric.used / metric.limit) * 100;
    const isNearLimit = typeof metric.limit === "number" && percentage > 80;

    return (
      <div className="mb-4 last:mb-0">
        <div className="flex justify-between text-sm mb-1.5">
          <span className="font-medium text-gray-700">{metric.label}</span>
          <span className="text-gray-500">
            <strong className="text-gray-900">{metric.used}</strong> /{" "}
            {metric.limit === "unlimited" ? "∞" : metric.limit}
          </span>
        </div>
        <div className="h-2 w-full bg-gray-100 rounded-full overflow-hidden">
          <div
            className={cn(
              "h-full rounded-full transition-all duration-500",
              isNearLimit ? "bg-amber-500" : "bg-black",
            )}
            style={{ width: `${Math.min(percentage, 100)}%` }}
          />
        </div>
      </div>
    );
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 pb-12">
      {/* Usage Stats - Col 1 */}
      <div className="lg:col-span-1">
        <h3 className="text-sm font-bold text-gray-900 uppercase tracking-widest mb-4">
          Plan Usage
        </h3>
        <div className="bg-white rounded-2xl border border-gray-200 p-6">
          {renderProgressBar(usage.orders)}
          {renderProgressBar(usage.products)}
          {renderProgressBar(usage.templates)}

          <button className="w-full mt-6 py-2 text-sm font-bold text-indigo-600 hover:text-indigo-700 hover:bg-indigo-50 rounded-lg transition-colors">
            View Plan Details
          </button>
        </div>
      </div>

      {/* System Status - Col 2-3 */}
      <div className="lg:col-span-2">
        <h3 className="text-sm font-bold text-gray-900 uppercase tracking-widest mb-4">
          System Status Reference
        </h3>

        {systemStatus.issues.length === 0 ? (
          <div className="bg-green-50 rounded-2xl border border-green-100 p-6 flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-green-100 text-green-600 flex items-center justify-center shrink-0">
              <Icon name="Check" size={24} />
            </div>
            <div>
              <h4 className="font-bold text-green-900">
                All Systems Operational
              </h4>
              <p className="text-green-700 text-sm mt-1">
                Website, checkout, and integrations are running smoothly.
              </p>
            </div>
          </div>
        ) : (
          <div className="space-y-3">
            {systemStatus.issues.map((issue) => (
              <div
                key={issue.id}
                className={cn(
                  "rounded-xl border p-4 flex items-start gap-4",
                  issue.severity === "critical"
                    ? "bg-red-50 border-red-100"
                    : "bg-amber-50 border-amber-100",
                )}
              >
                <div
                  className={cn(
                    "mt-0.5",
                    issue.severity === "critical"
                      ? "text-red-600"
                      : "text-amber-600",
                  )}
                >
                  <Icon
                    name={issue.severity === "critical" ? "X" : "Info"}
                    size={20}
                  />
                </div>
                <div className="flex-1">
                  <p
                    className={cn(
                      "text-sm font-bold mb-0.5",
                      issue.severity === "critical"
                        ? "text-red-900"
                        : "text-amber-900",
                    )}
                  >
                    {issue.message}
                  </p>
                  {issue.actionUrl && (
                    <a
                      href={issue.actionUrl}
                      className="text-xs font-bold underline hover:no-underline opacity-80 hover:opacity-100 transition-opacity"
                    >
                      Fix Issue
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
