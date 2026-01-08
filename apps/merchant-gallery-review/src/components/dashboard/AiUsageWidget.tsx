"use client";

import React, { useEffect, useState } from "react";
import { Icon, Button, cn } from "@vayva/ui";

interface UsageData {
  messagesUsed: number;
  messageLimit: number;
  isOverLimit: boolean;
  planKey: "STARTER" | "GROWTH" | "PRO";
  status: string;
}

export const AiUsageWidget = () => {
  const [usage, setUsage] = useState<UsageData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/ai/usage")
      .then((res) => res.json())
      .then((res) => {
        if (res.success) {
          setUsage(res.data.current);
        }
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  if (loading)
    return <div className="h-32 bg-gray-50 animate-pulse rounded-xl" />;
  if (!usage) return null;

  const percentage = Math.min(
    Math.round((usage.messagesUsed / usage.messageLimit) * 100),
    100,
  );
  const isCritical = percentage > 80;
  const isTrial = usage.planKey === "STARTER";

  return (
    <div className="bg-white border border-gray-100 rounded-xl p-6 shadow-sm">
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-green-50 text-green-600 rounded-lg flex items-center justify-center">
            <Icon name="Zap" size={16} />
          </div>
          <div>
            <h3 className="font-bold text-[#0B0B0B] text-sm">AI Messages</h3>
            <p className="text-[10px] text-gray-500 uppercase tracking-wider font-medium">
              {isTrial ? "Free Trial Allocation" : `${usage.planKey} Plan`}
            </p>
          </div>
        </div>
        {usage.isOverLimit ? (
          <span className="bg-red-100 text-red-700 text-[10px] font-bold px-2 py-0.5 rounded-full">
            LIMIT EXCEEDED
          </span>
        ) : isCritical ? (
          <span className="bg-orange-100 text-orange-700 text-[10px] font-bold px-2 py-0.5 rounded-full">
            NEAR LIMIT
          </span>
        ) : (
          <span className="bg-green-100 text-green-700 text-[10px] font-bold px-2 py-0.5 rounded-full">
            HEALTHY
          </span>
        )}
      </div>

      <div className="space-y-4">
        <div>
          <div className="flex justify-between text-xs mb-1.5">
            <span className="text-gray-600 font-medium">Messages Used</span>
            <span
              className={cn(
                "font-bold",
                isCritical ? "text-orange-600" : "text-[#0B0B0B]",
              )}
            >
              {usage.messagesUsed} / {usage.messageLimit}
            </span>
          </div>
          <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
            <div
              className={cn(
                "h-full transition-all duration-500",
                usage.isOverLimit
                  ? "bg-red-500"
                  : isCritical
                    ? "bg-orange-600"
                    : "bg-green-600",
              )}
              style={{ width: `${percentage}%` }}
            />
          </div>
        </div>

        {/* Verbatim Copy Matrix Implementation */}
        <div className="bg-gray-50 p-3 rounded-lg border border-dashed border-gray-200">
          <p className="text-[11px] text-[#0B0B0B] font-medium leading-relaxed">
            {isTrial
              ? usage.isOverLimit
                ? "Trial complete! Your AI Assistant has handled its first 20 customers beautifully. To keep selling on autopilot, upgrade to a Growth plan today."
                : isCritical
                  ? `You're getting popular! You’ve used ${usage.messagesUsed} of your 20 trial messages. Upgrade to Growth now to keep the conversation going without interruption.`
                  : usage.messagesUsed === 0
                    ? "Welcome to the future of sales! Your Vayva Assistant is ready to work. You have 20 free messages to see the magic in action. No credit card required."
                    : "Your Vayva Assistant is live and selling. Upgrade to Growth for 2,000 monthly messages and Vision support."
              : isCritical
                ? "You're nearing your monthly message limit. Buy a ₦5,000 extra pack to ensure uninterrupted service."
                : `Your ${usage.planKey} plan is healthy. Remaining messages reset in 12 days.`}
          </p>
        </div>

        <div className="flex flex-col gap-2">
          {(isTrial || usage.isOverLimit) && (
            <Button
              className="w-full bg-[#0B0B0B] text-white font-bold text-xs h-9 rounded-lg shadow-sm hover:shadow-md transition-all"
              onClick={() => (window.location.href = "/dashboard/settings/billing")}
            >
              {isTrial ? "Upgrade to Growth" : "Manage Subscription"}
            </Button>
          )}

          {!isTrial && isCritical && (
            <Button
              variant="outline"
              className="w-full border-green-600 text-green-700 hover:bg-green-50 font-bold text-xs h-9 rounded-lg"
            >
              Buy ₦5,000 Extra Pack
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};
