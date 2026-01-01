import { PLANS, formatNGN } from "@/config/pricing";

export type PlanTier = "STARTER" | "GROWTH" | "PRO";

export interface PlanDetails {
  id: PlanTier;
  name: string;
  price: number; // in Naira
  formattedPrice: string;
  transactionFee: number; // percentage, e.g. 5 for 5%
  productLimit: number; // -1 for unlimited
  staffLimit: number;
  description: string;
  features: string[];
  isPopular?: boolean;
}

export interface Subscription {
  status: "active" | "past_due" | "canceled" | "trialing";
  planId: PlanTier;
  currentPeriodEnd: string; // ISO date
  cancelAtPeriodEnd: boolean;
  paymentMethod?: {
    brand: string; // e.g. 'visa'
    last4: string;
    expiryMonth: number;
    expiryYear: number;
  };
  trialEndsAt?: string;
}

export interface Invoice {
  id: string;
  date: string;
  amount: number;
  status: "paid" | "pending" | "failed";
  pdfUrl: string;
  billingReason:
  | "subscription_create"
  | "subscription_cycle"
  | "subscription_update";
}

export interface UsageStats {
  productsCount: number;
  productsLimit: number;
  staffCount: number;
  staffLimit: number;
  waConversationsCount: number;
  waTrialEndsAt?: string;
  marketplaceListed: boolean;
}

export interface AddOn {
  id: string;
  name: string;
  description: string;
  price: number;
  formattedPrice: string;
  isActive: boolean;
  isIncludedInPlan: boolean; // if true, price is 0/strikethrough
  featureKey: string; // e.g. 'custom_domain'
}

const growthPlan = PLANS.find((p) => p.key === "growth");
const proPlan = PLANS.find((p) => p.key === "pro");

export const GROWTH_PRICE_NUM = growthPlan?.monthlyAmount || 25000;
export const PRO_PRICE_NUM = proPlan?.monthlyAmount || 40000;

export const GROWTH_PRICE = formatNGN(GROWTH_PRICE_NUM);
export const PRO_PRICE = formatNGN(PRO_PRICE_NUM);

export const PLANS_DETAILS: Record<PlanTier, PlanDetails> = {
  STARTER: {
    id: "STARTER",
    name: "Starter",
    price: 0,
    formattedPrice: "Free",
    transactionFee: 5,
    productLimit: 5,
    staffLimit: 1, // Self only
    description: "For new businesses starting out.",
    features: [
      "5% transaction fee",
      "5 product limit",
      "vayva.shop subdomain",
      "Basic store builder",
      "4-day WhatsApp AI trial",
      "No marketplace listing",
    ],
  },
  GROWTH: {
    id: "GROWTH",
    name: "Growth",
    price: GROWTH_PRICE_NUM,
    formattedPrice: `${GROWTH_PRICE}/mo`,
    transactionFee: 2,
    productLimit: 20,
    staffLimit: 2, // Assumption
    description: "For growing brands needing more power.",
    features: [
      "2% transaction fee",
      "20 product limit",
      "vayva.ng subdomain",
      "Custom domain add-on available",
      "Full WhatsApp AI support",
      "Listed on Vayva Market",
      "Abandoned cart recovery",
    ],
    isPopular: true,
  },
  PRO: {
    id: "PRO",
    name: "Pro",
    price: PRO_PRICE_NUM,
    formattedPrice: `${PRO_PRICE}/mo`,
    transactionFee: 1,
    productLimit: -1,
    staffLimit: 5,
    description: "For high-volume sellers.",
    features: [
      "1% transaction fee",
      "Unlimited products",
      "5 staff accounts",
      "Free custom domain",
      "Verified seller badge fast-track",
      "Dedicated account manager",
      "Lowest shipping rates",
    ],
  },
};
