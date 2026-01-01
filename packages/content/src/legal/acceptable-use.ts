import { LegalDocument } from "../types";

export const acceptableUse: LegalDocument = {
  slug: "acceptable-use",
  title: "Acceptable Use Policy",
  lastUpdated: "December 17, 2025",
  summary: "Guidelines for using the Vayva platform responsibly and safely.",
  sections: [
    {
      heading: "1. General Principles",
      content: [
        'Vayva is dedicated to providing a safe, reliable, and trustworthy platform for commerce. This Acceptable Use Policy ("AUP") sets out the rules for participating in the Vayva community.',
      ],
    },
    {
      heading: "2. Prohibited Actions",
      content: [
        "You agree not to misuse the Vayva services. For example, you must not:",
        "• Use the Platform for any unlawful purpose.",
        "• Buy or sell any Prohibited Items (see our Prohibited Items Policy).",
        "• Engage in fraudulent activity, including using stolen credit cards or impersonating others.",
        "• Harass, abuse, or harm another person or group.",
        "• Interfere with the proper working of the Platform (e.g., hacking, scraping, or spamming).",
      ],
    },
    {
      heading: "3. WhatsApp AI Usage",
      content: [
        "Our WhatsApp AI tools are designed to assist with customer service. You must not use them to:",
        "• Send unsolicited mass messages (spam).",
        "• Deceive customers about the nature of the AI (i.e., pretending it is a human when it is not, although typically it acts as a clearly automated assistant).",
        "• Collect sensitive personal information inappropriately.",
      ],
    },
    {
      heading: "4. Enforcement",
      content: [
        "Violation of this AUP may result in the immediate suspension or termination of your account, blocking of your funds for investigation, and reporting to legal authorities if necessary.",
      ],
      type: "callout-important",
    },
  ],
};
