export const SITE_ORIGIN = "https://vayva.ng";
// ✅ allow-list (only these may be indexable)
export const INDEX_ALLOW_PREFIXES = [
    "/about",
    "/blog",
    "/compare",
    "/contact",
    "/help",
    "/how-vayva-works",
    "/legal",
    "/pricing",
    "/store-builder",
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
export function isHardNoindex(path) {
    return HARD_NOINDEX_PREFIXES.some((p) => path === p || path.startsWith(p + "/"));
}
export function isAllowIndex(path) {
    return INDEX_ALLOW_PREFIXES.some((p) => path === p || path.startsWith(p + "/"));
}
export function pageTypeFor(path) {
    if (path === "/")
        return "home";
    if (path === "/blog")
        return "blog_hub";
    if (path.startsWith("/blog/"))
        return "blog_post";
    if (path.startsWith("/compare/") || path === "/compare" || path.startsWith("/vs/"))
        return "compare_page";
    if (path.startsWith("/legal") || path === "/privacy" || path === "/terms")
        return "legal_page";
    if (path.startsWith("/help"))
        return "help_page";
    // default
    return "marketing_page";
}
