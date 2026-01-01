import { LegalDocument } from "../types";

export const termsOfService: LegalDocument = {
  slug: "terms",
  title: "Terms of Service",
  lastUpdated: "December 17, 2025",
  summary:
    "These terms govern your use of the Vayva platform, including merchant services, storefronts, and tools.",
  sections: [
    {
      heading: "1. Introduction",
      content: [
        'Welcome to Vayva ("We", "Us", "Our"). These Terms of Service ("Terms") constitute a legally binding agreement between you ("User", "Merchant") and Vayva Technologies Limited regarding your access to and use of the Vayva website, mobile application, and related services (collectively, the "Platform").',
        "By registering a Vayva account, you agree to be bound by these Terms. If you do not agree to these Terms, you must not use our Platform.",
      ],
      type: "text",
    },
    {
      heading: "2. Definitions",
      content: [],
      list: [
        "**Merchant**: A registered user who utilizes Vayva to create a Storefront and sell goods or services.",
        "**Buyer**: A customer who purchases goods or services from a Merchant via a Vayva Storefront.",
        "**Storefront**: The personalized e-commerce store created by a Merchant on the Platform.",
        "**Marketplace**: The aggregated listing of Merchant products available to Buyers on Vayva.",
        "**AI Agent**: Our WhatsApp-based automation tool that assists Merchants with customer interactions.",
        "**Payment Provider**: Third-party payment processors (e.g., Paystack) used to facilitate transactions.",
      ],
      type: "definitions",
    },
    {
      heading: "3. Eligibility and Registration",
      content: [
        "To use Vayva, you must be at least 18 years old and capable of forming a binding contract under Nigerian law. If you are registering on behalf of a business, you represent that you have the authority to bind that entity to these Terms.",
        "You agree to provide accurate, current, and complete information during the registration process and to update such information to keep it accurate, current, and complete.",
      ],
    },
    {
      heading: "4. Platform Services",
      content: [
        "Vayva provides tools for Merchants to build online stores, manage inventory, process payments, and engage customers via WhatsApp. We act as a technical service provider and are not a party to any transaction between Merchants and Buyers.",
      ],
    },
    {
      heading: "5. Fees and Payments",
      content: [
        "Vayva charges fees for the use of its Platform:",
        "**Subscription Fees**: Access to premium features (Growth, Pro plans) is charged on a monthly or annual basis.",
        "**Transaction Fees**: We charge a percentage fee on every successful sale made through your Storefront:",
      ],
      list: [
        "Starter Plan: 5% per transaction",
        "Growth Plan: 2% per transaction",
        "Pro Plan: 1% per transaction",
      ],
      type: "list",
    },
    {
      heading: "6. Payouts and Settlements",
      content: [
        "Funds from your sales are settled into your Vayva Wallet after a holding period determined by our Payment Provider and risk policies (typically T+1 for local transactions).",
        "You may withdraw available funds to your verified Nigerian bank account. Withdrawals are subject to minimum limits and may incur bank processing fees.",
      ],
    },
    {
      heading: "7. KYC and Account Verification",
      content: [
        "To comply with CBN regulations and anti-money laundering (AML) laws, we require all Merchants to complete Know Your Customer (KYC) verification. This includes providing your Bank Verification Number (BVN) and/or National Identity Number (NIN).",
        "Failure to complete KYC will restrict your ability to withdraw funds and may lead to account suspension.",
      ],
      type: "callout-nigeria",
    },
    {
      heading: "8. Merchant Responsibilities",
      content: [
        'As a Merchant, you are the "Seller of Record" for all items sold on your Storefront. You are solely responsible for:',
        "1. Ensuring all product descriptions and prices are accurate.",
        "2. Fulfilling orders promptly and handling shipping.",
        "3. Handling customer returns, refunds, and complaints.",
        "4. Ensuring your products do not violate any laws or our Prohibited Items Policy.",
      ],
    },
    {
      heading: "9. WhatsApp AI Agent",
      content: [
        "Our AI Agent may draft responses to customer inquiries on your behalf. While we strive for accuracy, AI may occasionally generate incorrect or inappropriate suggestions.",
        "You acknowledge that you are responsible for reviewing and approving all AI-generated actions or messages before they are sent to customers. Vayva is not liable for miscommunications arising from the use of the AI Agent.",
      ],
      type: "callout-important",
    },
    {
      heading: "10. Prohibited Activities",
      content: [
        "You may not use Vayva to sell illegal goods, including but not limited to narcotics, weapons, counterfeit items, or anything that violates Nigerian law. We reserve the right to suspend or terminate any shop found violating this policy immediately.",
      ],
    },
    {
      heading: "11. Intellectual Property",
      content: [
        "You retain ownership of the content (photos, text) you upload to your Storefront. By uploading content, you grant Vayva a license to use it for the purpose of operating and promoting the Platform (e.g., featuring your store in our Marketplace).",
      ],
    },
    {
      heading: "12. Disclaimer of Warranties",
      content: [
        'The Platform is provided "as is" and "as available" without warranties of any kind. We do not guarantee that the Platform will be uninterrupted or error-free.',
      ],
    },
    {
      heading: "13. Limitation of Liability",
      content: [
        "To the fullest extent permitted by law, Vayva shall not be liable for any indirect, incidental, special, consequential, or punitive damages, or any loss of profits or revenues.",
      ],
    },
    {
      heading: "14. Indemnification",
      content: [
        "You agree to indemnify and hold Vayva harmless from any claims, damages, liabilities, and expenses arising out of your use of the Platform or your violation of these Terms.",
      ],
    },
    {
      heading: "15. Governing Law and Dispute Resolution",
      content: [
        "These Terms are governed by the laws of the Federal Republic of Nigeria. Any disputes arising from these Terms shall be resolved through binding arbitration in Lagos, Nigeria.",
      ],
      type: "callout-nigeria",
    },
    {
      heading: "16. Contact Us",
      content: [
        "If you have any questions about these Terms, please contact us at support@vayva.shop.",
      ],
    },
  ],
};
