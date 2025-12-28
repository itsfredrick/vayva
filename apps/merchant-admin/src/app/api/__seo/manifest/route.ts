import { NextResponse } from "next/server";
import { metadataFor, robotsFor, canonicalFor, jsonLdFor } from "@/lib/seo/seo-engine";
import { pageTypeFor, SITE_ORIGIN, DUPLICATE_MARKETPLACE_PATH, CANONICAL_MARKETPLACE_TARGET } from "@/lib/seo/route-policy";
import { TEMPLATE_KEYWORD_MAPS } from "@/lib/seo/keywords/templates";
import { COMPETITORS } from "@/lib/seo/comparisons";
import { FEATURES } from "@/lib/seo/features-data";
import { TEMPLATES } from "@/lib/templates-registry";
import { prisma } from "@vayva/db";

export const dynamic = "force-dynamic";

/**
 * SEO DEBUG MANIFEST V2 (DB-BACKED)
 * Enumerates real routes from DB and computes quality signals.
 */
export async function GET() {
    if (process.env.NODE_ENV === "production" && process.env.SEO_DEBUG_ENABLED !== "true") {
        return NextResponse.json({ error: "Access denied" }, { status: 403 });
    }

    // 1. Static Marketing Routes (Indexable)
    const staticMarketingRoutes = [
        "/",
        "/about",
        "/blog",
        "/careers",
        "/community",
        "/contact",
        "/how-vayva-works",
        "/legal",
        "/pricing",
        "/store-builder",
        "/templates",
        "/trust",
    ];

    // 2. Specialized SEO Attack/Feature Hubs
    const attackRoutes = [
        ...Object.keys(COMPETITORS).map(slug => `/compare/${slug}`),
        ...Object.keys(FEATURES).map(slug => `/features/${slug}`),
    ];

    // 3. Special Cases
    const specialRoutes = [
        DUPLICATE_MARKETPLACE_PATH, // /marketplace
    ];

    // 4. Market Specific Routes
    const marketRoutes = [
        "/market/search",
        "/market/cart",
        "/market/checkout",
        "/market/order-confirmation",
    ];

    // 5. Dynamic Families (Placeholder only, mark indexable:false)
    const dynamicFamilyPlaceholders = [
        "/store/*",
        "/market/categories/*",
        "/market/sellers/*",
        "/market/products/*",
        "/templates/*",
        "/blog/*",
    ];

    // 6. DB Enumeration (The V2 Core)
    const enumeratedRoutes: string[] = [];

    try {
        // Fetch real stores
        const stores = await prisma.store.findMany({
            where: { isLive: true, onboardingCompleted: true },
            select: { slug: true },
            take: 50
        });
        stores.forEach(s => enumeratedRoutes.push(`/store/${s.slug}`));

        // Fetch market categories
        const categories = await prisma.marketplaceListing.groupBy({
            by: ['category'],
            where: { status: 'LISTED' },
            _count: { productId: true }
        });
        categories.forEach(c => {
            if (c.category) {
                const catSlug = c.category.toLowerCase().replace(/\s+/g, '-');
                enumeratedRoutes.push(`/market/categories/${catSlug}`);
            }
        });

        // Add templates from registry
        TEMPLATES.forEach(t => enumeratedRoutes.push(`/templates/${t.slug}`));

    } catch (e) {
        console.error("SEO Manifest DB Query failed:", e);
        // Fallback or empty is fine, validators will catch if we expected data
    }

    const allRoutes = [
        ...staticMarketingRoutes,
        ...attackRoutes,
        ...specialRoutes,
        ...marketRoutes,
        ...dynamicFamilyPlaceholders,
        ...enumeratedRoutes
    ];

    const manifest = await Promise.all(allRoutes.map(async (path) => {
        const isFamily = path.endsWith("/*");
        const pt = pageTypeFor(isFamily ? path.replace("/*", "/sample") : path);

        let ctx: Record<string, any> = {
            pageTitle: "Vayva",
            pageDescription: "Vayva - Commerce Infrastructure for Africa",
        };

        // Initialize signals
        let signals = {
            bodyTextChars: 1400,
            faqCount: 4,
            featureCount: 8,
            internalLinks: 10,
            sections: 4,
        };

        // DB Data fetching for signals
        if (pt === "storefront" && !isFamily) {
            const slug = path.split('/').pop();
            const store = await prisma.store.findUnique({
                where: { slug },
                include: {
                    _count: { select: { products: { where: { status: "ACTIVE" } }, collections: true } }
                }
            });

            if (store) {
                ctx.storeName = store.name;
                const prodCount = store._count.products;
                const catCount = store._count.collections;
                const hasLogo = !!store.logoUrl;

                signals.bodyTextChars = 500 + (prodCount * 150);
                signals.featureCount = prodCount >= 5 ? 7 : 4;
                signals.faqCount = 3;
                signals.internalLinks = prodCount + catCount;
                signals.sections = 5;
            } else {
                signals = { bodyTextChars: 0, faqCount: 0, featureCount: 0, internalLinks: 0, sections: 0 };
            }
        }

        if (pt === "template_detail" && !isFamily) {
            const slug = path.split('/').pop() || '';
            const t = TEMPLATES.find(temp => temp.slug === slug);
            const keywordStrategy = TEMPLATE_KEYWORD_MAPS[slug];

            if (t) {
                ctx.templateName = t.name;
                signals.bodyTextChars = (t.description?.length || 0) + (t.features?.length || 0) * 150;
                signals.featureCount = t.features?.length || 0;
                signals.faqCount = 3;
                signals.sections = 4;
            }
        }

        if (pt === "compare_page") {
            const comp = COMPETITORS[path.split('/').pop() || ''];
            if (comp) {
                signals.faqCount = comp.faqs.length;
                signals.bodyTextChars = 2500;
                signals.sections = 7;
            }
        }

        const metadata = metadataFor(path, ctx);
        const robots = robotsFor(path);
        const jsonLd = jsonLdFor(path, ctx);

        const schemaTypes: string[] = [];
        const extractTypes = (obj: any) => {
            if (!obj) return;
            if (Array.isArray(obj)) obj.forEach(extractTypes);
            else {
                if (obj["@type"]) schemaTypes.push(obj["@type"]);
                if (obj["@graph"]) obj["@graph"].forEach(extractTypes);
            }
        };
        extractTypes(jsonLd);

        let forcedIndexable = robots.index;
        if (path === DUPLICATE_MARKETPLACE_PATH || isFamily) {
            forcedIndexable = false;
        }

        // Quality Gate for DB routes
        if (!isFamily && (pt === "storefront" || pt === "market_category")) {
            const score = computeScore(signals);
            if (score < 3) forcedIndexable = false;
        }

        const item: any = {
            path,
            pageType: pt,
            indexable: forcedIndexable,
            canonical: metadata.alternates?.canonical || canonicalFor(path),
            robots: `${forcedIndexable ? "index" : "noindex"},${robots.follow ? "follow" : "nofollow"}`,
            title: metadata.title,
            description: metadata.description,
            schemaTypes: Array.from(new Set(schemaTypes)),
            h1: ctx.pageTitle || ctx.storeName || ctx.templateName || "Vayva",
            contentSignals: signals,
            warnings: isFamily ? ["FAMILY_ROUTE_NOT_ENUMERATED"] : [],
        };

        if (pt === "template_detail" && !isFamily) {
            const slug = path.split('/').pop() || '';
            item.primaryKeyword = TEMPLATE_KEYWORD_MAPS[slug]?.primary || 'unknown-template-keyword';
        }

        return item;
    }));

    return NextResponse.json(manifest);
}

function computeScore(s: any) {
    let pass = 0;
    if (s.bodyTextChars >= 1200) pass++;
    if (s.faqCount >= 3) pass++;
    if (s.featureCount >= 6) pass++;
    if (s.internalLinks >= 8) pass++;
    if (s.sections >= 4) pass++;
    return pass;
}
