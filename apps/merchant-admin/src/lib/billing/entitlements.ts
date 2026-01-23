import { PLANS } from "./plans";
export function getPlanDefinition(slug: any) {
    return PLANS[slug] || PLANS.growth; // Fallback to growth if unknown, or handle error
}
import { Gating } from "./gating";
/**
 * Checks access and returns boolean (Legacy/Simple check)
 */
export function checkFeatureAccess(entitlement: any, feature: any) {
    return gateFeatureAccess(entitlement, feature).ok;
}
/**
 * Checks access and returns detailed GateResult (For UI/Paywalls)
 */
export function gateFeatureAccess(entitlement: any, feature: any) {
    const plan = getPlanDefinition(entitlement.planKey);
    // 1. Status Check
    if (["past_due", "expired"].includes(entitlement.status)) {
        if (["approvals", "advancedAnalytics"].includes(feature)) {
            return Gating.deny("PAYMENT_REQUIRED", "Subscription is past-due. Please update payment method.", { currentPlan: entitlement.planKey });
        }
    }
    // 2. Feature Check
    if (!plan.features[feature]) {
        // Assume feature exists on Pro if not on Growth
        // (Naive specific logic, ideally we check if ANY plan has it, but here we assume Pro is the target)
        return Gating.requirePro(entitlement.planKey, feature);
    }
    return Gating.allow();
}
/**
 * Checks limit and returns boolean
 */
export function checkLimit(entitlement: any, limitName: any, currentUsage: any) {
    return gateLimit(entitlement, limitName, currentUsage).ok;
}
/**
 * Checks limit and returns detailed GateResult
 */
export function gateLimit(entitlement: any, limitName: any, currentUsage: any) {
    const plan = getPlanDefinition(entitlement.planKey);
    const limit = plan.limits[limitName];
    if (typeof limit === "number") {
        if (currentUsage >= limit) {
            return Gating.seatLimit(entitlement.planKey, limit);
        }
    }
    return Gating.allow();
}
