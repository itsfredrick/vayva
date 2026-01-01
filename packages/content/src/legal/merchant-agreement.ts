import { LegalDocument } from "../types";

export const merchantAgreement: LegalDocument = {
  slug: "merchant-agreement",
  title: "Merchant Agreement",
  lastUpdated: "December 17, 2025",
  summary: "Specific obligations and terms for Merchants selling on Vayva.",
  sections: [
    {
      heading: "1. Merchant Obligations",
      content: [
        "By selling on Vayva, you agree to:",
        "• Fulfill orders within the timeframes specified in your Shipping Policy.",
        "• Process returns and refunds in accordance with your Store Policy and Nigerian consumer protection laws.",
        "• Treat customers with respect and professionalism.",
        "• Maintain the security of customer data accessed through the Platform.",
      ],
    },
    {
      heading: "2. Chargebacks and Disputes",
      content: [
        "You are responsible for all chargebacks and disputes arising from your sales. If Vayva incurs losses due to your failure to deliver goods or fraudulent activity, we reserve the right to recover these funds from your payout balance or registered bank account.",
      ],
      type: "callout-important",
    },
    {
      heading: "3. Marketplace Listings",
      content: [
        "For Merchants on Growth or Pro plans, your products may be eligible for listing on the Vayva Marketplace. We reserve the right to curate, rank, or remove listings at our discretion.",
      ],
    },
    {
      heading: "4. Termination",
      content: [
        "We may terminate your Merchant status if you violate this Agreement, our Terms of Service, or receive excessive negative feedback/disputes.",
      ],
    },
  ],
};
