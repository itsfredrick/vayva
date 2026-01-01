import { LegalDocument } from "../types";

export const refundPolicy: LegalDocument = {
  slug: "refund-policy",
  title: "Vayva Subscription Refund Policy",
  lastUpdated: "December 17, 2025",
  summary: "Details regarding refunds for Vayva platform subscription fees.",
  sections: [
    {
      heading: "1. Scope",
      content: [
        "This policy applies ONLY to subscription fees paid to Vayva for use of the Platform (e.g., Growth or Pro plans). It does NOT cover refunds for goods purchased from Merchants on Vayva Storefronts (see individual Store policies for that).",
      ],
      type: "callout-important",
    },
    {
      heading: "2. Free Trials",
      content: [
        "If you sign up for a plan with a free trial (e.g., 7 days), you will not be charged if you cancel before the trial period ends.",
      ],
    },
    {
      heading: "3. Subscription Refunds",
      content: [
        "Vayva generally does not offer refunds for partial months of service. If you cancel your subscription, you will continue to have access to paid features until the end of your current billing cycle.",
        "Exceptions may be made in cases of technical error (e.g., double billing). Please contact billing@vayva.shop within 7 days of the charge.",
      ],
    },
    {
      heading: "4. Charge Disputes",
      content: [
        "If you believe a charge was made in error, please contact us immediately. Initiating a chargeback with your bank without contacting us first may result in the suspension of your Vayva account.",
      ],
    },
  ],
};
