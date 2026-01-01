import React from "react";
import { SubscriptionPlan } from "@vayva/shared";

interface PlanUsageProps {
  usage:
    | {
        products: number;
        orders: number;
        whatsappMessages: number;
        storageUsed: string;
      }
    | undefined;
  plan: SubscriptionPlan;
}

export const PlanUsage = ({ usage, plan }: PlanUsageProps) => {
  if (!usage)
    return <div className="animate-pulse h-20 bg-gray-50 rounded-xl" />;

  const UsageBar = ({
    label,
    current,
    max,
    unit,
  }: {
    label: string;
    current: number;
    max: number;
    unit?: string;
  }) => {
    const percent = Math.min((current / max) * 100, 100);
    return (
      <div className="mb-4 last:mb-0">
        <div className="flex justify-between text-xs mb-1.5">
          <span className="font-bold text-gray-700">{label}</span>
          <span className="text-gray-500">
            {current} / {max} {unit}
          </span>
        </div>
        <div className="h-2 w-full bg-gray-100 rounded-full overflow-hidden">
          <div
            className="h-full bg-black rounded-full transition-all duration-500"
            style={{ width: `${percent}%` }}
          />
        </div>
      </div>
    );
  };

  return (
    <div className="bg-gray-50 border border-gray-200 rounded-2xl p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">
            Current Plan
          </p>
          <h3 className="text-xl font-bold text-gray-900">{plan}</h3>
        </div>
        {plan === SubscriptionPlan.STARTER && (
          <button className="px-4 py-2 bg-black text-white rounded-lg text-xs font-bold hover:scale-105 transition-transform">
            Upgrade to Pro
          </button>
        )}
      </div>

      <div className="space-y-2">
        <UsageBar
          label="Products"
          current={usage.products}
          max={plan === "STARTER" ? 50 : 1000}
        />
        <UsageBar
          label="Monthly Orders"
          current={usage.orders}
          max={plan === "STARTER" ? 100 : 5000}
        />
        <UsageBar
          label="Monthly AI Messages"
          current={usage.whatsappMessages}
          max={plan === "STARTER" ? 500 : 10000}
        />
      </div>
    </div>
  );
};
