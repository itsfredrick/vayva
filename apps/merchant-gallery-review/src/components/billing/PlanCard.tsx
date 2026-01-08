import React from "react";
import { Button, GlassPanel, Icon } from "@vayva/ui";
import { PlanDetails, PlanTier } from "@/types/billing";
import { Spinner } from "@/components/Spinner";

interface PlanCardProps {
  plan: PlanDetails;
  currentPlanId: PlanTier;
  onSelect: (planId: PlanTier) => void;
  isLoading?: boolean;
}

export function PlanCard({
  plan,
  currentPlanId,
  onSelect,
  isLoading,
}: PlanCardProps) {
  const isCurrent = plan.id === currentPlanId;
  const isFree = plan.price === 0;

  return (
    <GlassPanel
      className={`flex flex-col p-6 rounded-3xl h-full relative ${isCurrent ? "border-primary ring-1 ring-primary/20 bg-primary/5" : ""}`}
    >
      {plan.isPopular && (
        <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-primary text-white text-[10px] uppercase font-bold px-3 py-1 rounded-full tracking-widest border border-white/10 shadow-sm">
          Most Popular
        </div>
      )}

      <div className="mb-6">
        <h3 className="text-xl font-bold mb-2 text-white">{plan.name}</h3>
        <div className="flex items-baseline gap-1">
          <span className="text-4xl font-bold text-white">
            {plan.formattedPrice}
          </span>
          {!isFree && (
            <span className="text-text-secondary text-sm">/month</span>
          )}
        </div>
        <p className="text-sm text-text-secondary mt-3 leading-relaxed">
          {plan.description}
        </p>
      </div>

      <div className="flex-1 space-y-4 mb-8">
        {plan.features.map((feature, i) => (
          <div key={i} className="flex items-start gap-3">
            <div className="p-0.5 rounded-full bg-green-500/10 text-green-500 shrink-0 mt-0.5">
              <Icon name="Check" size={12} />
            </div>
            <span className="text-sm text-text-secondary">{feature}</span>
          </div>
        ))}
      </div>

      <Button
        variant={isCurrent ? "outline" : "primary"}
        className="w-full justify-center"
        onClick={() => onSelect(plan.id)}
        disabled={isCurrent || isLoading}
      >
        {isLoading && <Spinner size="sm" className="mr-2" />}
        {isCurrent ? "Current Plan" : isFree ? "Downgrade" : "Upgrade"}
      </Button>
    </GlassPanel>
  );
}
