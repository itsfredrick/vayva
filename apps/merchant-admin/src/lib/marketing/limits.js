import { PLANS } from "../billing/plans";
export const MARKETING_LIMITS = {
    getCampaignSendLimit: (planKey) => {
        return PLANS[planKey]?.limits.monthlyCampaignSends || 0;
    },
};
