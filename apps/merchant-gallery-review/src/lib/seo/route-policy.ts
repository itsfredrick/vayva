// src/lib/seo/route-policy.ts
export type PageType =
  | "home"
  | "marketing_page"
  | "blog_hub"
  | "blog_post"
  | "templates_hub"
  | "template_detail"
  | "compare_page"
  | "market_category"
  | "market_products"
  | "market_search"
  | "market_sellers"
  | "storefront"
  | "legal_page"
  | "help_page"
  | "private_page";

export const SITE_ORIGIN = "https://vayva.ng";

// ✅ allow-list (only these may be indexable)
export const INDEX_ALLOW_PREFIXES = [
  "/about",
  "/blog",
  "/careers",
  "/community",
  "/compare",
  "/contact",
  "/features",
  "/help",
  "/how-vayva-works",
  "/legal",
  "/pricing",
  "/store-builder",
  "/templates",
  "/trust",
  "/market/categories",
  "/market/products",
  "/market/search",
  "/market/sellers",
  "/store",
];

// ❌ hard noindex
export const HARD_NOINDEX_PREFIXES = [
  "/api",
  "/market/cart",
  "/market/checkout",
  "/market/order-confirmation",
  "/dashboard",
  "/auth",
  "/login",
  "/dashboard",
  "/onboarding",
  "/preview",
  "/designer",
  "/control-center",
  "/ops",
  "/invite",
];

// special duplicate
export const DUPLICATE_MARKETPLACE_PATH = "/marketplace"; // (marketing)/marketplace route path
export const CANONICAL_MARKETPLACE_TARGET = "/market/categories";

export function isHardNoindex(path: string) {
  return HARD_NOINDEX_PREFIXES.some(
    (p) => path === p || path.startsWith(p + "/"),
  );
}

export function isAllowIndex(path: string) {
  return INDEX_ALLOW_PREFIXES.some(
    (p) => path === p || path.startsWith(p + "/"),
  );
}

export function pageTypeFor(path: string): PageType {
  if (path === "/") return "home";
  if (path === "/templates") return "templates_hub";
  if (path.startsWith("/templates/")) return "template_detail";
  if (path === "/blog") return "blog_hub";
  if (path.startsWith("/blog/")) return "blog_post";
  if (path.startsWith("/compare/") || path === "/compare")
    return "compare_page";
  if (path.startsWith("/market/categories/")) return "market_category";
  if (path.startsWith("/market/products")) return "market_products";
  if (path.startsWith("/market/search")) return "market_search";
  if (path.startsWith("/market/sellers")) return "market_sellers";
  if (path.startsWith("/store/")) return "storefront";
  if (path.startsWith("/legal") || path === "/privacy" || path === "/terms")
    return "legal_page";
  if (path.startsWith("/help")) return "help_page";
  // default
  return "marketing_page";
}
