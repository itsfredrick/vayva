import { LegalDocument } from "../types";

export const privacyPolicy: LegalDocument = {
  slug: "privacy",
  title: "Privacy Policy",
  lastUpdated: "December 17, 2025",
  summary:
    "How we collect, use, and protect your personal data when you use the Vayva platform.",
  sections: [
    {
      heading: "1. Introduction",
      content: [
        'Vayva Technologies Limited ("Vayva") allows merchants to build online stores. This Privacy Policy outlines how we collect, use, and share your personal information when you use our Platform.',
      ],
    },
    {
      heading: "2. Information We Collect",
      content: [
        "We collect the following types of information:",
        "**Account Data**: Name, email address, phone number, and password provided during sign-up.",
        "**Store Data**: Information about your business, products, and orders.",
        "**KYC Data**: Bank Verification Number (BVN), National ID (NIN), and date of birth required for identity verification.",
        "**Usage Data**: Information about how you interact with our Platform, including device information and IP address.",
      ],
    },
    {
      heading: "3. Why We Collect Data",
      content: [
        "We use your data to:",
        "1. Provide and maintain the Platform services.",
        "2. Process transactions and settlements.",
        "3. Verify your identity and prevent fraud (KYC/AML).",
        "4. Communicate with you about your account and updates.",
        "5. improve our AI and recommendation systems.",
      ],
    },
    {
      heading: "4. KYC and Sensitive Data Handling",
      content: [
        "We take the security of your sensitive data seriously. BVN and NIN information is encrypted and transmitted securely to our verification partners. We do not store your full raw BVN details longer than necessary for verification purposes.",
      ],
      type: "callout-important",
    },
    {
      heading: "5. Sharing Your Information",
      content: [
        "We may share your information with:",
        "**Payment Processors**: (e.g., Paystack) to facilitate payments and payouts.",
        "**Logistics Partners**: To help you fulfill deliveries.",
        "**Service Providers**: Hosting, analytics, and messaging services (e.g., WhatsApp BSPs) that sustain our Platform.",
      ],
    },
    {
      heading: "6. Cookies",
      content: [
        "We use cookies and similar technologies to track activity on our Platform and hold certain information. You can instruct your browser to refuse all cookies, but some parts of our Platform may not function properly.",
      ],
    },
    {
      heading: "7. Data Retention",
      content: [
        "We retain your personal data only for as long as is necessary for the purposes set out in this Privacy Policy. We will retain and use your data to the extent necessary to comply with our legal obligations (e.g., keeping transaction records for tax compliance).",
      ],
    },
    {
      heading: "8. Security",
      content: [
        "We implement industry-standard security measures to protect your data. However, remember that no method of transmission over the Internet is 100% secure.",
      ],
    },
    {
      heading: "9. Your Rights",
      content: [
        "Under Nigerian Data Protection regulations, you have the right to access, correct, or request deletion of your personal data. You can manage most of your data directly within your Merchant Dashboard.",
      ],
      type: "callout-nigeria",
    },
    {
      heading: "10. Children's Privacy",
      content: [
        "Our Services are not addressed to anyone under the age of 18. We do not knowingly collect personal identifiable information from children.",
      ],
    },
    {
      heading: "11. Contact Us",
      content: [
        "For any privacy-related questions or to exercise your rights, please contact our Data Protection Officer at privacy@vayva.shop.",
      ],
    },
  ],
};
