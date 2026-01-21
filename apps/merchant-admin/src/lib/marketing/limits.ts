import { PLANS, PlanKey } from "../billing/plans";

export const MARKETING_LIMITS = {
    getCampaignSendLimit: (planKey: PlanKey) => {
        return PLANS[planKey]?.limits.monthlyCampaignSends || 0;
    },
};
