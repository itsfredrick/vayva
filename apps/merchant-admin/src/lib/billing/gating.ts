export const Gating = {
    allow: () => ({ ok: true }),
    deny: (code: any, message: any, context: any) => {
        return {
            ok: false,
            error: {
                code,
                message,
                requiredPlan: context?.requiredPlan,
                currentPlan: context?.currentPlan,
                // Default upgrade URL, can be overridden if we have specific flows
                upgradeUrl: `/dashboard/billing?upgrade=${context?.requiredPlan || "PRO"}`,
                details: context?.details,
            },
        };
    },
    requirePro: (currentPlan: any, featureName: any) => {
        return Gating.deny("PLAN_REQUIRED", `${featureName} is only available on the Pro plan.`, { requiredPlan: "PRO", currentPlan });
    },
    seatLimit: (currentPlan: any, limit: any) => {
        return Gating.deny("SEAT_LIMIT", `You have reached the limit of ${limit} seats on your ${currentPlan} plan.`, { requiredPlan: "PRO", currentPlan, details: { limit } });
    },
};
