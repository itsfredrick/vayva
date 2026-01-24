import { PLANS } from "./plans";

export function getEntitlement(planSlug: any, featureKey: any) {
    const plan = (PLANS as any)[planSlug] || (PLANS as any).STARTER;
    return plan.features[featureKey];
}

export function getLimit(planSlug: any, limitKey: any) {
    const plan = (PLANS as any)[planSlug] || (PLANS as any).STARTER;
    return plan.limits[limitKey];
}
