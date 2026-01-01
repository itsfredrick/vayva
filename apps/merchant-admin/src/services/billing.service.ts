import {
  AddOn,
  Invoice,
  PLANS_DETAILS,
  PlanDetails,
  PlanTier,
  Subscription,
  UsageStats,
} from "@/types/billing";

// Test Data
let currentPlan: PlanTier = "STARTER";
let currentSubscription: Subscription = {
  status: "active",
  planId: "STARTER",
  currentPeriodEnd: new Date(
    Date.now() + 30 * 24 * 60 * 60 * 1000,
  ).toISOString(),
  cancelAtPeriodEnd: false,
  trialEndsAt: new Date(Date.now() + 4 * 24 * 60 * 60 * 1000).toISOString(), // 4 day trial
};

const invoices: Invoice[] = [
  {
    id: "inv_12345",
    date: new Date().toISOString(),
    amount: 0,
    status: "paid",
    pdfUrl: "#",
    billingReason: "subscription_create",
  },
];

const ADDONS: AddOn[] = [
  {
    id: "1",
    name: "Custom Domain",
    description: "Connect your own .com or .ng domain",
    price: 5000,
    formattedPrice: "₦5,000/yr",
    isActive: false,
    isIncludedInPlan: false,
    featureKey: "custom_domain",
  },
  {
    id: "2",
    name: "Additional WhatsApp Number",
    description: "Add another WA number for support",
    price: 3000,
    formattedPrice: "₦3,000/mo",
    isActive: false,
    isIncludedInPlan: false,
    featureKey: "extra_wa",
  },
  {
    id: "3",
    name: "Verified Seller Badge",
    description: "Build trust with a verified badge",
    price: 15000,
    formattedPrice: "₦15,000/yr",
    isActive: false,
    isIncludedInPlan: false,
    featureKey: "verified_badge",
  },
];

export const BillingService = {
  getSubscription: async (): Promise<Subscription> => {
    await new Promise((resolve) => setTimeout(resolve, 500));
    return currentSubscription;
  },

  getPlans: async (): Promise<PlanDetails[]> => {
    return Object.values(PLANS_DETAILS);
  },

  changePlan: async (planId: PlanTier): Promise<void> => {
    await new Promise((resolve) => setTimeout(resolve, 1000));
    currentPlan = planId;
    currentSubscription = {
      ...currentSubscription,
      planId,
      status: "active",
      // Update trial status based on plan requirements
      trialEndsAt: undefined,
    };

    // Add invoice if paid
    const plan = PLANS_DETAILS[planId];
    if (plan && plan.price > 0) {
      invoices.unshift({
        id: `inv_${Math.floor(Math.random() * 10000)}`,
        date: new Date().toISOString(),
        amount: plan.price,
        status: "paid",
        pdfUrl: "#",
        billingReason: "subscription_update",
      });
    }
  },

  getInvoices: async (): Promise<Invoice[]> => {
    await new Promise((resolve) => setTimeout(resolve, 600));
    return invoices;
  },

  getUsage: async (): Promise<UsageStats> => {
    await new Promise((resolve) => setTimeout(resolve, 400));
    const plan = PLANS_DETAILS[currentPlan];
    return {
      productsCount: 3,
      productsLimit: plan.productLimit,
      staffCount: 1,
      staffLimit: plan.staffLimit,
      waConversationsCount: 12,
      waTrialEndsAt:
        currentPlan === "STARTER" ? currentSubscription.trialEndsAt : undefined,
      marketplaceListed: currentPlan !== "STARTER",
    };
  },

  getAddons: async (): Promise<AddOn[]> => {
    await new Promise((resolve) => setTimeout(resolve, 500));
    // Logic to show "included" for Pro
    return ADDONS.map((addon) => {
      if (currentPlan === "PRO" && addon.featureKey === "custom_domain") {
        return { ...addon, isActive: true, isIncludedInPlan: true };
      }
      return addon;
    });
  },

  toggleAddon: async (addonId: string): Promise<void> => {
    await new Promise((resolve) => setTimeout(resolve, 800));
    const addon = ADDONS.find((a) => a.id === addonId);
    if (addon) {
      addon.isActive = !addon.isActive;
    }
  },
};
