import { LegalDocument } from "../types";

export const cookiePolicy: LegalDocument = {
  slug: "cookies",
  title: "Cookie Policy",
  lastUpdated: "December 17, 2025",
  summary:
    "Information about how we use cookies to improve your experience on Vayva.",
  sections: [
    {
      heading: "1. What are Cookies?",
      content: [
        "Cookies are small text files stored on your device (computer or mobile) when you visit certain websites. They help the website recognize your device and remember information about your visit.",
      ],
    },
    {
      heading: "2. How We Use Cookies",
      content: [
        "We use cookies for the following purposes:",
        "**Essential Cookies**: Necessary for the operation of the website (e.g., keeping you logged in).",
        "**Functional Cookies**: Enable us to remember your preferences (e.g., language or region).",
        "**Analytics Cookies**: Help us understand how visitors interact with our website by collecting and reporting information anonymously.",
      ],
    },
    {
      heading: "3. Managing Cookies",
      content: [
        "Most web browsers automatically accept cookies, but you can usually modify your browser setting to decline cookies if you prefer. This may prevent you from taking full advantage of the website.",
      ],
    },
    {
      heading: "4. Updates to This Policy",
      content: [
        "We may update this Cookie Policy from time to time. We encourage you to review this policy periodically for any changes.",
      ],
    },
  ],
};
