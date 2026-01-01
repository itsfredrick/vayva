import { PlanSlug } from "./plans";

export type GateErrorCode =
  | "PLAN_REQUIRED"
  | "PAYMENT_REQUIRED"
  | "SEAT_LIMIT"
  | "FEATURE_DISABLED";

export interface GateResult {
  ok: boolean;
  error?: {
    code: GateErrorCode;
    message: string;
    requiredPlan?: PlanSlug;
    currentPlan?: PlanSlug;
    upgradeUrl: string;
    details?: Record<string, any>;
  };
}

export const Gating = {
  allow: (): GateResult => ({ ok: true }),

  deny: (
    code: GateErrorCode,
    message: string,
    context?: {
      requiredPlan?: PlanSlug;
      currentPlan?: PlanSlug;
      details?: Record<string, any>;
    },
  ): GateResult => {
    return {
      ok: false,
      error: {
        code,
        message,
        requiredPlan: context?.requiredPlan,
        currentPlan: context?.currentPlan,
        // Default upgrade URL, can be overridden if we have specific flows
        upgradeUrl: `/dashboard/billing?upgrade=${context?.requiredPlan || "pro"}`,
        details: context?.details,
      },
    };
  },

  requirePro: (currentPlan: PlanSlug, featureName: string): GateResult => {
    return Gating.deny(
      "PLAN_REQUIRED",
      `${featureName} is only available on the Pro plan.`,
      { requiredPlan: "pro", currentPlan },
    );
  },

  seatLimit: (currentPlan: PlanSlug, limit: number): GateResult => {
    return Gating.deny(
      "SEAT_LIMIT",
      `You have reached the limit of ${limit} seats on your ${currentPlan} plan.`,
      { requiredPlan: "pro", currentPlan, details: { limit } },
    );
  },
};
