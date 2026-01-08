import { PLANS as CONFIG_PLANS, PlanKey } from "@/config/pricing";

export const PLAN_PRICING = {
  GROWTH: CONFIG_PLANS.find((p) => p.key === "growth")?.monthlyAmount || 25000,
  PRO: CONFIG_PLANS.find((p) => p.key === "pro")?.monthlyAmount || 40000,
};

export interface PlanLimits {
  teamSeats: number;
  templatesAvailable: "limited" | "all";
  monthlyCampaignSends: number;
}

export interface PlanFeatures {
  approvals: boolean;
  inboxOps: boolean;
  reports: boolean;
  advancedAnalytics: boolean;
}

export interface PlanDefinition {
  slug: PlanKey;
  name: string;
  priceNgn: number;
  limits: PlanLimits;
  features: PlanFeatures;
}

export const PLANS: Record<string, PlanDefinition> = {
  free: {
    slug: "free",
    name: "Free",
    priceNgn: 0,
    limits: {
      teamSeats: 1,
      templatesAvailable: "limited",
      monthlyCampaignSends: 100,
    },
    features: {
      approvals: false,
      inboxOps: true,
      reports: true,
      advancedAnalytics: false,
    },
  },
  growth: {
    slug: "growth",
    name: "₦25,000",
    priceNgn: PLAN_PRICING.GROWTH,
    limits: {
      teamSeats: 1,
      templatesAvailable: "limited",
      monthlyCampaignSends: 1000,
    },
    features: {
      approvals: false,
      inboxOps: true,
      reports: true,
      advancedAnalytics: false,
    },
  },
  pro: {
    slug: "pro",
    name: "₦40,000",
    priceNgn: PLAN_PRICING.PRO,
    limits: {
      teamSeats: 5,
      templatesAvailable: "all",
      monthlyCampaignSends: 10000,
    },
    features: {
      approvals: true,
      inboxOps: true,
      reports: true,
      advancedAnalytics: true,
    },
  },
};

export type { PlanKey };
export type PlanSlug = PlanKey;
