import { MetadataRoute } from "next";
import { SITE_ORIGIN } from "@/lib/seo/route-policy";
import { prisma } from "@vayva/db";

const INDUSTRIES = ["food-vendors", "boutiques", "real-estate", "laundry", "pharmacies", "gadgets"];
const CITIES = ["lagos", "abuja", "port-harcourt", "ibadan", "kano", "benin-city"];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    const corePages = [
        "",
        "/pricing",
        "/templates",
        "/marketplace",
        "/how-vayva-works",
        "/features",
        "/about",
        "/blog",
        "/contact",
        "/legal",
        "/help",
        "/market/categories",
        "/market/products",
        "/market/sellers"
    ].map((p) => ({
        url: `${SITE_ORIGIN}${p}`,
        lastModified: new Date(),
        changeFrequency: (p === "" ? "daily" : "weekly") as "daily" | "weekly",
        priority: p === "" ? 1 : 0.8,
    }));

    const programmaticPages = INDUSTRIES.flatMap((industry) =>
        CITIES.map((city) => ({
            url: `${SITE_ORIGIN}/solutions/${industry}-in-${city}`,
            lastModified: new Date(),
            changeFrequency: "monthly" as const,
            priority: 0.6,
        }))
    );

    const dropshippingPages = INDUSTRIES.flatMap((industry) =>
        CITIES.map((city) => ({
            url: `${SITE_ORIGIN}/dropshipping/${industry}-in-${city}`,
            lastModified: new Date(),
            changeFrequency: "monthly" as const,
            priority: 0.6,
        }))
    );

    const comparisonPages = ["shopify", "instagram-shopping", "jumia"].map((competitor) => ({
        url: `${SITE_ORIGIN}/vs/${competitor}`,
        lastModified: new Date(),
        changeFrequency: "monthly" as const,
        priority: 0.7,
    }));

    const highIntentComparison = [
        "/compare/shopify-vs-vayva-nigeria"
    ].map((p) => ({
        url: `${SITE_ORIGIN}${p}`,
        lastModified: new Date(),
        changeFrequency: "weekly" as const,
        priority: 0.9,
    }));

    // Fetch live merchant slugs (Search Console Dominance)
    let merchantPages: MetadataRoute.Sitemap = [];
    try {
        const merchants = await prisma.store.findMany({
            where: { isLive: true },
            select: { slug: true, updatedAt: true },
            take: 5000 // Limit for now to prevent sitemap overflow
        });

        merchantPages = merchants.map((m) => ({
            url: `https://${m.slug}.vayva.ng`,
            lastModified: m.updatedAt,
            changeFrequency: "daily" as const,
            priority: 0.9,
        }));
    } catch (error) {
        console.error("Failed to fetch merchant slugs for sitemap:", error);
    }

    return [...corePages, ...programmaticPages, ...dropshippingPages, ...comparisonPages, ...highIntentComparison, ...merchantPages];
}
