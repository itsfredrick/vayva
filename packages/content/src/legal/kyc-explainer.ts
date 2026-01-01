import { LegalDocument } from "../types";

export const kycExplainer: LegalDocument = {
  slug: "kyc-explainer",
  title: "Why We Ask for KYC (BVN/NIN)",
  lastUpdated: "December 17, 2025",
  summary: "Understanding our identity verification process.",
  sections: [
    {
      heading: "1. Why is Verification Required?",
      content: [
        "Vayva is a financial technology platform. To process payouts to your bank account, we are required by the Central Bank of Nigeria (CBN) and our banking partners to verify the identity of all merchants. This helps effectively prevent fraud, money laundering, and identity theft.",
      ],
      type: "callout-nigeria",
    },
    {
      heading: "2. What Data Do We Need?",
      content: [
        "We typically request:",
        "• **BVN (Bank Verification Number)**: To verify your identity against the central banking database.",
        "• **NIN (National Identity Number)**: As a secondary verification if required.",
      ],
    },
    {
      heading: "3. Is My Data Safe?",
      content: [
        'Yes. Your BVN and NIN are handled with the highest level of encryption. We do NOT have access to your bank account balances or allow withdrawals based on this information. We only use it to confirm "You are who you say you are."',
      ],
    },
    {
      heading: "4. What Happens If I Don't Verify?",
      content: [
        "You can still create a store and list products, but **you will not be able to withdraw any funds** from your Vayva Wallet until verification is complete. This is a strict regulatory requirement.",
      ],
      type: "callout-important",
    },
  ],
};
