export const Gating = {
    allow: () => ({ ok: true }),
    deny: (code: unknown, message: unknown, context: unknown) => {
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
    requirePro: (currentPlan: unknown, featureName: unknown) => {
        return Gating.deny("PLAN_REQUIRED", `${featureName} is only available on the Pro plan.`, { requiredPlan: "PRO", currentPlan });
    },
    seatLimit: (currentPlan: unknown, limit: unknown) => {
        return Gating.deny("SEAT_LIMIT", `You have reached the limit of ${limit} seats on your ${currentPlan} plan.`, { requiredPlan: "PRO", currentPlan, details: { limit } });
    },
};
