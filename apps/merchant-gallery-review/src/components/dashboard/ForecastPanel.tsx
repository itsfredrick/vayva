import React from "react";
import { Icon, cn } from "@vayva/ui";

interface RevenueForecast {
  period: string;
  range_min: number;
  range_max: number;
  trend_direction: "up" | "down";
  trend_percentage: number;
}

interface CashflowForecast {
  expected_available: number;
  message: string;
  withdrawable_date: string;
}

interface RiskForecast {
  primary_risk: string;
  probability: number;
  message: string;
}

export const ForecastPanel = ({
  revenue,
  cashflow,
  risk,
}: {
  revenue: RevenueForecast;
  cashflow: CashflowForecast;
  risk: RiskForecast;
}) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {/* Revenue Forecast */}
      <div className="bg-white border border-gray-200 rounded-2xl p-5 shadow-sm">
        <div className="flex items-center gap-2 mb-3 text-gray-500">
          <Icon name="ChartBar" size={16} />
          <span className="text-xs font-bold uppercase tracking-wide">
            30d Revenue Forecast
          </span>
        </div>
        <div className="mb-2">
          <span className="text-lg font-bold text-gray-900">
            ₦{(revenue.range_min / 1000).toFixed(0)}k – ₦
            {(revenue.range_max / 1000).toFixed(0)}k
          </span>
        </div>
        <div
          className={cn(
            "text-xs font-bold flex items-center gap-1",
            revenue.trend_direction === "up"
              ? "text-green-600"
              : "text-red-600",
          )}
        >
          <Icon
            name={
              revenue.trend_direction === "up" ? "TrendingUp" : "TrendingDown"
            }
            size={12}
          />
          {revenue.trend_percentage}% vs last 30d
        </div>
      </div>

      {/* Cashflow Forecast */}
      <div className="bg-white border border-gray-200 rounded-2xl p-5 shadow-sm">
        <div className="flex items-center gap-2 mb-3 text-gray-500">
          <Icon name="Wallet" size={16} />
          <span className="text-xs font-bold uppercase tracking-wide">
            Cashflow Prediction
          </span>
        </div>
        <div className="mb-2">
          <span className="text-lg font-bold text-gray-900">
            ₦{(cashflow.expected_available / 1000).toFixed(0)}k
          </span>
          <span className="text-xs text-gray-500 ml-1">
            likely withdrawable
          </span>
        </div>
        <p className="text-xs text-purple-600 font-medium bg-purple-50 px-2 py-1 rounded-lg inline-block">
          {cashflow.message}
        </p>
      </div>

      {/* Risk Forecast */}
      <div className="bg-white border border-gray-200 rounded-2xl p-5 shadow-sm relative overflow-hidden">
        <div className="absolute top-0 right-0 w-16 h-16 bg-red-50 rounded-bl-full -mr-8 -mt-8" />
        <div className="flex items-center gap-2 mb-3 text-gray-500">
          <Icon name="ShieldAlert" size={16} />
          <span className="text-xs font-bold uppercase tracking-wide">
            Risk Monitor
          </span>
        </div>
        <div className="mb-2 flex items-center gap-2">
          <span className="text-lg font-bold text-gray-900">
            {(risk.probability * 100).toFixed(0)}%
          </span>
          <span className="text-xs text-gray-500">
            probability of {risk.primary_risk}
          </span>
        </div>
        <p className="text-[10px] text-gray-600 font-medium leading-relaxed">
          {risk.message}
        </p>
      </div>
    </div>
  );
};
