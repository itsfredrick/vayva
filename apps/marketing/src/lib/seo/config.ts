export const SEO_CONFIG = {
  siteName: "Vayva",
  siteUrl: process.env.NEXT_PUBLIC_APP_URL || "https://vayva.ng", // Enforced per Directive Section 4
  twitterHandle: "@vayva_hq",
  titleSeparator: "|",
  defaultTitle: "Vayva | Commerce Infrastructure for Africa",
  defaultDescription:
    "Launch your online store, manage orders on WhatsApp, and accept payments instantly in Nigeria.",
  locale: "en_NG",

  // Strict Limits from Directive
  limits: {
    title: 60,
    description: 155,
  },
} as const;

export type PageType =
  | "homepage"
  | "template"
  | "market_category"
  | "store"
  | "product"
  | "pricing"
  | "blog"
  | "legal"
  | "contact"
  | "status"
  | "comparison"
  | "dashboard"
  | "auth"
  | "preview"
  | "admin"
  | "designer"
  | "control_center"
  | "ops"
  | "invite"
  | "api";

// Defined in Directive Section 2.1
export const INDEXABLE_TYPES: PageType[] = [
  "homepage",
  "template",
  "market_category",
  "store",
  "product",
  "pricing",
  "blog",
  "legal",
  "contact",
  "status",
  "comparison",
];

// Defined in Directive Section 2.2
export const NO_INDEX_TYPES: PageType[] = [
  "dashboard",
  "auth",
  "preview",
  "admin",
  "designer",
  "control_center",
  "ops",
  "invite",
  "api",
];
