/**
 * Vayva Pricing Configuration
 * DO NOT MODIFY PRICING WITHOUT EXPLICIT PRODUCT APPROVAL.
 * 
 * This file is the single source of truth for all pricing, plans, and fees
 * across the Vayva platform (marketing, dashboard, and legal).
 */

export const PRICING_VERSION = "2025-12-26_v2";
export const CURRENCY = "NGN";

// Transaction Fees
export const FEES = {
    WITHDRAWAL_PERCENTAGE: 5, // 5% fee on every withdrawal
};

export type PlanKey = "free" | "growth" | "pro";

export type Plan = {
    key: PlanKey;
    name: string;
    monthlyAmount: number; // NGN
    tagline: string;
    trialDays?: number;
    bullets: string[];
    ctaLabel: string;
    featured?: boolean;
};

export const PLANS: Plan[] = [
    {
        key: "free",
        name: "Free",
        monthlyAmount: 0,
        trialDays: 7,
        tagline: "Perfect for testing ideas.",
        bullets: [
            "4 Included Templates", // User mentioned '4 Included'
            "Basic Storefront",
            "Vayva Branding",
            "Standard Analytics"
        ],
        ctaLabel: "Start Free",
    },
    {
        key: "growth",
        name: "Growth",
        monthlyAmount: 30000,
        tagline: "For growing brands.",
        bullets: [
            "9 Included Templates",
            "Growth Templates",
            "Service & Digital Modules",
            "Remove Branding"
        ],
        ctaLabel: "Upgrade to Growth",
        featured: true,
    },
    {
        key: "pro",
        name: "Pro",
        monthlyAmount: 40000,
        tagline: "High volume scaling.",
        bullets: [
            "All Templates (Any Choice)",
            "B2B & Wholesale",
            "Multi-vendor",
            "Dedicated Support"
        ],
        ctaLabel: "Upgrade to Pro",
    },
];

export function formatNGN(amount: number): string {
    return new Intl.NumberFormat("en-NG", {
        style: "currency",
        currency: "NGN",
        maximumFractionDigits: 0,
    }).format(amount);
}

export function calculateWithdrawalFee(amount: number): number {
    return (amount * FEES.WITHDRAWAL_PERCENTAGE) / 100;
}
