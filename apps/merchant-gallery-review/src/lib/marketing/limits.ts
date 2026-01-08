import { PLANS, PlanKey } from "../billing/plans";

export const MARKETING_LIMITS = {
    getCampaignSendLimit: (planSlug: PlanKey) => {
        return PLANS[planSlug]?.limits.monthlyCampaignSends || 0;
    },
};
