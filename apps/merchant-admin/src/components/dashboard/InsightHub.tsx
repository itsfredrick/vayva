import React from "react";
import { Icon, cn } from "@vayva/ui";

interface Insight {
  id: string;
  title: string;
  description: string;
  impact: "high" | "medium" | "low";
  action_label: string;
  type: "conversion" | "finance" | "ops";
}

export const InsightHub = ({ insights }: { insights: Insight[] }) => {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
        <Icon name="Zap" size={20} className="text-amber-500 fill-amber-500" />{" "}
        Actionable Insights
      </h3>

      <div className="grid grid-cols-1 gap-4">
        {insights.map((insight) => (
          <div
            key={insight.id}
            className="bg-white border border-gray-200 rounded-xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:shadow-md transition-shadow"
          >
            <div className="flex items-start gap-4">
              <div
                className={cn(
                  "w-10 h-10 rounded-full flex items-center justify-center shrink-0",
                  insight.type === "conversion"
                    ? "bg-blue-50 text-blue-600"
                    : insight.type === "finance"
                      ? "bg-green-50 text-green-600"
                      : "bg-purple-50 text-purple-600",
                )}
              >
                <Icon
                  name={
                    insight.type === "conversion"
                      ? "TrendingUp"
                      : insight.type === "finance"
                        ? "Wallet"
                        : "Settings"
                  }
                  size={20}
                />
              </div>
              <div>
                <h4 className="font-bold text-gray-900 text-sm flex items-center gap-2">
                  {insight.title}
                  {insight.impact === "high" && (
                    <span className="bg-red-100 text-red-700 text-[10px] px-2 py-0.5 rounded-full uppercase tracking-wide">
                      High Impact
                    </span>
                  )}
                </h4>
                <p className="text-xs text-gray-500 mt-1">
                  {insight.description}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 sm:self-center self-end">
              <button className="text-xs font-bold text-gray-400 hover:text-gray-600 px-3 py-2">
                Dismiss
              </button>
              <button className="bg-black text-white text-xs font-bold px-4 py-2 rounded-lg hover:bg-gray-800 transition-colors whitespace-nowrap">
                {insight.action_label}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
