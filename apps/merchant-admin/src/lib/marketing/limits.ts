
export const PLAN_LIMITS = {
    STARTER: {
        slug: "STARTER",
        name: "Starter",
        priceNgn: 0,
        limits: {
            teamSeats: 1,
            templatesAvailable: "basic_only",
            monthlyCampaignSends: 100,
        },
        features: {
            approvals: false,
            inboxOps: false,
            reports: false,
            advancedAnalytics: false,
        }
    },
    GROWTH: {
        slug: "GROWTH",
        name: "Growth",
        priceNgn: 15000,
        limits: {
            teamSeats: 5,
            templatesAvailable: "all",
            monthlyCampaignSends: 5000,
        },
        features: {
            approvals: false,
            inboxOps: true,
            reports: true,
            advancedAnalytics: true,
        }
    },
    PRO: {
        slug: "PRO",
        name: "Pro",
        priceNgn: 45000,
        limits: {
            teamSeats: 20,
            templatesAvailable: "all",
            monthlyCampaignSends: 50000,
        },
        features: {
            approvals: true,
            inboxOps: true,
            reports: true,
            advancedAnalytics: true,
        }
    }
};

export const getPlanLimits = (slug: any) => {
    return (PLAN_LIMITS as any)[slug] || PLAN_LIMITS.STARTER;
};
