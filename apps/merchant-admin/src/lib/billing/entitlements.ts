import { PLANS, PlanSlug } from "./plans";

export interface Entitlement {
  planSlug: PlanSlug;
  status: "active" | "past_due" | "cancelled" | "trial" | "expired";
}

export function getPlanDefinition(slug: string) {
  return PLANS[slug] || PLANS.growth; // Fallback to growth if unknown, or handle error
}

import { Gating, GateResult } from "./gating";

/**
 * Checks access and returns boolean (Legacy/Simple check)
 */
export function checkFeatureAccess(
  entitlement: Entitlement,
  feature: keyof typeof PLANS.growth.features,
): boolean {
  return gateFeatureAccess(entitlement, feature).ok;
}

/**
 * Checks access and returns detailed GateResult (For UI/Paywalls)
 */
export function gateFeatureAccess(
  entitlement: Entitlement,
  feature: keyof typeof PLANS.growth.features,
): GateResult {
  const plan = getPlanDefinition(entitlement.planSlug);

  // 1. Status Check
  if (["past_due", "expired"].includes(entitlement.status)) {
    if (["approvals", "advancedAnalytics"].includes(feature)) {
      return Gating.deny(
        "PAYMENT_REQUIRED",
        "Subscription is past-due. Please update payment method.",
        { currentPlan: entitlement.planSlug },
      );
    }
  }

  // 2. Feature Check
  if (!plan.features[feature]) {
    // Assume feature exists on Pro if not on Growth
    // (Naive specific logic, ideally we check if ANY plan has it, but here we assume Pro is the target)
    return Gating.requirePro(entitlement.planSlug, feature);
  }

  return Gating.allow();
}

/**
 * Checks limit and returns boolean
 */
export function checkLimit(
  entitlement: Entitlement,
  limitName: keyof typeof PLANS.growth.limits,
  currentUsage: number,
): boolean {
  return gateLimit(entitlement, limitName, currentUsage).ok;
}

/**
 * Checks limit and returns detailed GateResult
 */
export function gateLimit(
  entitlement: Entitlement,
  limitName: keyof typeof PLANS.growth.limits,
  currentUsage: number,
): GateResult {
  const plan = getPlanDefinition(entitlement.planSlug);
  const limit = plan.limits[limitName];

  if (typeof limit === "number") {
    if (currentUsage >= limit) {
      return Gating.seatLimit(entitlement.planSlug, limit);
    }
  }

  return Gating.allow();
}
