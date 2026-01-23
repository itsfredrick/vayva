import { SITE_ORIGIN, isAllowIndex, isHardNoindex, pageTypeFor, DUPLICATE_MARKETPLACE_PATH, CANONICAL_MARKETPLACE_TARGET, } from "./route-policy";
import { buildJsonLdFor } from "./schema/index";
export function canonicalFor(path: any) {
    // normalize
    const normalized = path === "" ? "/" : path;
    return `${SITE_ORIGIN}${normalized}`;
}
export function robotsFor(path: any) {
    if (isHardNoindex(path))
        return { index: false, follow: true };
    if (!isAllowIndex(path))
        return { index: false, follow: true };
    return { index: true, follow: true };
}
export function metadataFor(path: any, ctx: any) {
    // Duplicate marketplace handling: marketing /marketplace must not compete with /market/*
    const isDupMarketplace = path === DUPLICATE_MARKETPLACE_PATH;
    const robots = robotsFor(path);
    const canonicalPath = isDupMarketplace ? CANONICAL_MARKETPLACE_TARGET : path;
    const title = computeTitle(path, ctx);
    const description = computeDescription(path, ctx);
    return {
        title,
        description,
        alternates: { canonical: canonicalFor(canonicalPath) },
        robots: {
            index: robots.index,
            follow: robots.follow,
            googleBot: { index: robots.index, follow: robots.follow },
        },
        openGraph: {
            title,
            description,
            url: canonicalFor(canonicalPath),
            siteName: "Vayva",
            type: "website",
        },
        twitter: {
            card: "summary_large_image",
            title,
            description,
        },
    };
}
function computeTitle(path: any, ctx: any) {
    const pt = pageTypeFor(path);
    switch (pt) {
        case "home":
            return "Vayva | Build, Sell & Scale Online in Nigeria";
        case "templates_hub":
            return "Website Templates for Online Selling | Vayva";
        case "template_detail":
            return `${ctx?.templateName ?? "Online Store Template"} | Vayva`;
        case "compare_page":
            return `${ctx?.compareTitle ?? "Vayva Comparisons"} | Vayva`;
        case "market_category":
            return `${ctx?.categoryName ?? "Marketplace Category"} Stores in Nigeria | Vayva`;
        case "storefront":
            return `${ctx?.storeName ?? "Store"} on Vayva`;
        case "blog_hub":
            return "Vayva Blog | Guides for Selling Online";
        case "blog_post":
            return `${ctx?.postTitle ?? "Guide"} | Vayva Blog`;
        default:
            return `${ctx?.pageTitle ?? "Vayva"} | Vayva`;
    }
}
function computeDescription(path: any, ctx: any) {
    const pt = pageTypeFor(path);
    switch (pt) {
        case "home":
            return "Launch a professional online store with payments, delivery, and mobile-first templates built for Nigeria.";
        case "template_detail":
            return (ctx?.templateDescription ??
                "Launch a fast, mobile-first storefront with payments and a conversion-focused design.");
        case "storefront":
            return (ctx?.storeDescription ??
                "Shop products, pay securely, and get delivery updates—powered by Vayva.");
        default:
            return (ctx?.pageDescription ??
                "Build, sell, and grow with Vayva—Nigeria-first ecommerce infrastructure.");
    }
}
export function jsonLdFor(path: any, ctx: any) {
    return buildJsonLdFor(path, ctx);
}
