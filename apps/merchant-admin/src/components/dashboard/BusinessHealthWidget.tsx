import React from "react";
import { Icon, cn } from "@vayva/ui";

interface BusinessHealthData {
  score: number;
  status: "healthy" | "watch" | "risk";
  trend: "up" | "down" | "stable";
  factors: {
    id: string;
    text: string;
    sentiment: "positive" | "warning" | "negative";
  }[];
  primary_risk?: { text: string; severity: "medium" | "high" };
}

export const BusinessHealthWidget = ({
  data,
}: {
  data: BusinessHealthData;
}) => {
  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-green-600 bg-green-50 border-green-100";
    if (score >= 60) return "text-amber-600 bg-amber-50 border-amber-100";
    return "text-red-600 bg-red-50 border-red-100";
  };

  return (
    <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
      <div className="flex justify-between items-start mb-4">
        <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
          <Icon name="Activity" size={20} /> Business Health
        </h3>
        <span className="text-xs text-gray-400">Updated just now</span>
      </div>

      <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 mb-6 text-center sm:text-left">
        <div
          className={cn(
            "w-24 h-24 rounded-full flex flex-col items-center justify-center border-4 shrink-0",
            getScoreColor(data.score),
          )}
        >
          <span className="text-3xl font-heading font-bold">{data.score}</span>
          <span className="text-[10px] font-bold uppercase tracking-wider">
            {data.status}
          </span>
        </div>

        <div className="flex-1 w-full">
          <p className="text-sm text-gray-500 mb-2">Primary Drivers:</p>
          <ul className="space-y-2">
            {data.factors.map((factor) => (
              <li
                key={factor.id}
                className="flex items-start gap-2 text-xs font-medium text-gray-700 justify-center sm:justify-start"
              >
                <Icon
                  name={
                    factor.sentiment === "positive"
                      ? "TrendingUp"
                      : factor.sentiment === "warning"
                        ? "CircleAlert"
                        : "ArrowDown"
                  }
                  size={14}
                  className={cn(
                    "mt-0.5",
                    factor.sentiment === "positive"
                      ? "text-green-500"
                      : factor.sentiment === "warning"
                        ? "text-amber-500"
                        : "text-red-500",
                  )}
                />
                {factor.text}
              </li>
            ))}
          </ul>
        </div>
      </div>

      {data.primary_risk && (
        <div className="bg-red-50 border border-red-100 rounded-xl p-3 flex items-start gap-3">
          <Icon
            name="TriangleAlert"
            size={16}
            className="text-red-600 mt-0.5"
          />
          <div>
            <p className="text-xs font-bold text-red-800 uppercase tracking-wide mb-1">
              Risk Alert
            </p>
            <p className="text-sm font-medium text-red-900">
              {data.primary_risk.text}
            </p>
          </div>
        </div>
      )}
    </div>
  );
};
