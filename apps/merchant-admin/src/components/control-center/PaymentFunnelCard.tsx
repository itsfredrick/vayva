import React from "react";
import { Icon, cn } from "@vayva/ui";
import { PaymentFunnel } from "@/types/checkout";

export const PaymentFunnelCard = ({ funnel }: { funnel: PaymentFunnel }) => {
  const maxCount = Math.max(...funnel.steps.map((s) => s.count));

  return (
    <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm h-full">
      <h3 className="text-lg font-bold text-gray-900 mb-6 flex items-center gap-2">
        <Icon name="GitMerge" size={20} /> Checkout Funnel (30d)
      </h3>

      <div className="space-y-6 relative">
        {/* Connecting line */}
        <div className="absolute top-4 bottom-4 left-[15px] w-0.5 bg-gray-100 -z-10" />

        {funnel.steps.map((step, index) => {
          const widthPercent = (step.count / maxCount) * 100;
          return (
            <div key={index} className="relative">
              <div className="flex items-center gap-4 mb-2">
                <div
                  className={cn(
                    "w-8 h-8 rounded-full flex items-center justify-center border-2 z-10 bg-white",
                    index === 0
                      ? "border-gray-200 text-gray-400"
                      : index === funnel.steps.length - 1
                        ? "border-green-500 text-green-600 bg-green-50"
                        : "border-indigo-500 text-indigo-600 bg-indigo-50",
                  )}
                >
                  <span className="text-xs font-bold">{index + 1}</span>
                </div>
                <div className="flex-1">
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-sm font-bold text-gray-900">
                      {step.name}
                    </span>
                    <span className="text-sm font-mono font-medium text-gray-600">
                      {step.count.toLocaleString()}
                    </span>
                  </div>
                  <div className="h-2 bg-gray-100 rounded-full overflow-hidden w-full">
                    <div
                      className={cn(
                        "h-full rounded-full transition-all duration-1000",
                        index === funnel.steps.length - 1
                          ? "bg-green-500"
                          : "bg-indigo-500",
                      )}
                      style={{ width: `${widthPercent}%` }}
                    />
                  </div>
                  {step.dropoff > 0 && (
                    <p className="text-xs text-red-400 mt-1 font-medium">
                      {step.dropoff}% drop-off
                    </p>
                  )}
                </div>
              </div>

              {/* AI Impact Annotation */}
              {step.name === funnel.optimization_impact.step && (
                <div className="ml-12 mt-1 inline-flex items-center gap-1.5 bg-indigo-50 text-indigo-700 px-2 py-1 rounded text-[10px] font-bold border border-indigo-100">
                  <Icon name="Sparkles" size={10} />
                  AI Improved this by {funnel.optimization_impact.uplift}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
