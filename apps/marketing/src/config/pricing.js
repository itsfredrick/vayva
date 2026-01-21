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
    WITHDRAWAL_PERCENTAGE: 3, // 3% fee on every withdrawal
};
export const PLANS = [
    {
        key: "free",
        name: "Free",
        baseAmount: 0,
        vatAmount: 0,
        monthlyAmount: 0,
        trialDays: 7,
        tagline: "Perfect for testing ideas.",
        bullets: [
            "4 Included Templates",
            "Basic Storefront",
            "Vayva Branding",
            "Standard Analytics",
        ],
        ctaLabel: "Start Free",
    },
    {
        key: "starter",
        name: "Starter",
        baseAmount: 30000,
        vatAmount: 2250,
        monthlyAmount: 32250,
        tagline: "For growing brands.",
        bullets: [
            "9 Included Templates",
            "Growth Templates",
            "Service & Digital Modules",
            "Remove Branding",
        ],
        ctaLabel: "Upgrade to Starter",
        featured: true,
    },
    {
        key: "pro",
        name: "Pro",
        baseAmount: 40000,
        vatAmount: 3000,
        monthlyAmount: 43000,
        tagline: "High volume scaling.",
        bullets: [
            "All Templates (Any Choice)",
            "B2B & Wholesale",
            "Multi-vendor",
            "Dedicated Support",
        ],
        ctaLabel: "Upgrade to Pro",
    },
];
export function formatNGN(amount) {
    return new Intl.NumberFormat("en-NG", {
        style: "currency",
        currency: "NGN",
        maximumFractionDigits: 0,
    }).format(amount);
}
export function calculateWithdrawalFee(amount) {
    return (amount * FEES.WITHDRAWAL_PERCENTAGE) / 100;
}
