import { PLANS } from "../billing/plans";
export const MARKETING_LIMITS = {
    getCampaignSendLimit: (planKey: unknown) => {
        return PLANS[planKey]?.limits.monthlyCampaignSends || 0;
    },
};
