import { PLANS, formatNGN } from "@/config/pricing";
const growthPlan = PLANS.find((p) => p.key === "GROWTH");
const proPlan = PLANS.find((p) => p.key === "PRO");
export const GROWTH_PRICE_NUM = growthPlan?.monthlyAmount || 25000;
export const PRO_PRICE_NUM = proPlan?.monthlyAmount || 40000;
export const GROWTH_PRICE = formatNGN(GROWTH_PRICE_NUM);
export const PRO_PRICE = formatNGN(PRO_PRICE_NUM);
export const PLANS_DETAILS = {
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
            "3% transaction fee",
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
