/**
 * FEATURE MOAT DATA
 * High-intent feature pages for SEO capture.
 */

export interface FeatureData {
  slug: string;
  title: string;
  description: string;
  h1: string;
  intro: string;
  benefits: string[];
  primaryKeyword: string;
  relatedTemplateSlug: string;
}

export const FEATURES: Record<string, FeatureData> = {
  "paystack-payments": {
    slug: "paystack-payments",
    title: "Accept Paystack Payments Online | Vayva",
    description:
      "Integrate Paystack with your online store instantly. No coding required. Start accepting card and bank transfer payments in Nigeria.",
    h1: "Native Paystack Integration for Your Store",
    intro:
      "Stop struggling with complex API integrations. Vayva comes with Paystack built-in, so you can focus on selling.",
    benefits: [
      "Instant NGN payouts",
      "Card, Bank Transfer, and USSD support",
      "Zero platform transaction fees",
      "Automated payment confirmation",
    ],
    primaryKeyword: "Paystack online store",
    relatedTemplateSlug: "digital-products",
  },
  "whatsapp-commerce": {
    slug: "whatsapp-commerce",
    title: "Sell on WhatsApp with Automated Orders | Vayva",
    description:
      "Transform your WhatsApp into a high-performance sales channel. Automate order confirmations and delivery updates.",
    h1: "The WhatsApp Commerce Engine for Nigeria",
    intro:
      "Take orders on your website and manage them on WhatsApp. The best of both worlds.",
    benefits: [
      "Direct-to-WhatsApp order links",
      "Automated inventory sync",
      "Customer chat history",
      "WhatsApp payment links",
    ],
    primaryKeyword: "sell on WhatsApp Nigeria",
    relatedTemplateSlug: "food-service",
  },
  "digital-delivery": {
    slug: "digital-delivery",
    title: "Sell Ebooks & Digital Products in Nigeria | Vayva",
    description:
      "Automate your digital product delivery. Sell ebooks, courses, and software keys with instant download after payment.",
    h1: "Sell Anything Digital, Instantly",
    intro:
      "No more manual emailing of files. Your customers get their downloads immediately after Paystack checkout.",
    benefits: [
      "Secure expiring links",
      "PDF Watermarking",
      "Large file hosting",
      "License key management",
    ],
    primaryKeyword: "sell ebooks online Nigeria",
    relatedTemplateSlug: "online-courses",
  },
  "ticketing-qr-checkin": {
    slug: "ticketing-qr-checkin",
    title: "Event Ticketing & QR Check-in Platform | Vayva",
    description:
      "Sell event tickets online and manage entry with our QR scanner app. Perfect for concerts, classes, and conferences in Nigeria.",
    h1: "Professional Event Ticketing Made Easy",
    intro: "A complete ticketing system—from sales to front-of-house check-in.",
    benefits: [
      "Unique QR code tickets",
      "Mobile scanner for staff",
      "Real-time attendee stats",
      "Integrated guest list",
    ],
    primaryKeyword: "event ticketing platform Nigeria",
    relatedTemplateSlug: "event-ticketing",
  },
  "b2b-wholesale-pricing": {
    slug: "b2b-wholesale-pricing",
    title: "Wholesale B2B Ecommerce Platform | Vayva",
    description:
      "Launch a private wholesale portal. Manage tiered pricing, minimum order quantities (MOQ), and distributor approvals.",
    h1: "The B2B Ordering Portal for Distributors",
    intro:
      "Streamline your wholesale operations with a dedicated portal for your bulk buyers.",
    benefits: [
      "Login-protected pricing",
      "Volume-based tiers",
      "Request for Quote (RFQ) mode",
      "Invoice generation",
    ],
    primaryKeyword: "wholesale ecommerce Nigeria",
    relatedTemplateSlug: "wholesale",
  },
  "multi-vendor-payouts": {
    slug: "multi-vendor-payouts",
    title: "Multi-Vendor Marketplace Builder | Vayva",
    description:
      "Build your own marketplace like Jumia or Konga. Manage multiple sellers and automate commission-based payouts.",
    h1: "Launch a Multi-Vendor Marketplace",
    intro:
      "Create a platform where hundreds of vendors can list, sell, and get paid automatically.",
    benefits: [
      "Vendor dashboards",
      "Automated commission rules",
      "Paystack Split Payments",
      "Centralized inventory control",
    ],
    primaryKeyword: "marketplace builder Nigeria",
    relatedTemplateSlug: "marketplace",
  },
};
