import { MetadataRoute } from "next";
import { prisma, Prisma } from "@vayva/db";
import { TEMPLATES } from "@/lib/templates-registry";
import { COMPETITORS } from "@/lib/seo/comparisons";
import { FEATURES } from "@/lib/seo/features-data";
import { SITE_ORIGIN } from "@/lib/seo/route-policy";

/**
 * DYNAMIC SITEMAP V2 (DB-BACKED)
 * Matches the logic in /api/__seo/manifest to ensure SERP consistency.
 */
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = SITE_ORIGIN;

  // 1. Static Marketing Routes
  const staticPaths = [
    "",
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

  // 2. SEO Moat Routes
  const attackPaths = [
    ...Object.keys(COMPETITORS).map((slug) => `/compare/${slug}`),
    ...Object.keys(FEATURES).map((slug) => `/features/${slug}`),
  ];

  // 3. Enumerated Routes from DB
  const enumeratedPaths: string[] = [];

  try {
    // Only include live and completed stores
    type StoreSlugRow = Prisma.StoreGetPayload<{ select: { slug: true } }>;

    const stores: StoreSlugRow[] = await prisma.store.findMany({
      where: { isLive: true, onboardingCompleted: true },
      select: { slug: true },
      take: 500,
    });

    stores.forEach((s: StoreSlugRow) => {
      enumeratedPaths.push(`/store/${s.slug}`);
    });

    // Active market categories
    const categories = await prisma.marketplaceListing.groupBy({
      by: ["category"],
      where: { status: "LISTED" },
    });
    categories.forEach((c: { category: string | null }) => {
      if (c.category) {
        const catSlug = c.category.toLowerCase().replace(/\s+/g, "-");
        enumeratedPaths.push(`/market/categories/${catSlug}`);
      }
    });

    // Templates
    TEMPLATES.forEach((t) => enumeratedPaths.push(`/templates/${t.slug}`));
  } catch (e) {
    console.error("Sitemap DB Query failed:", e);
  }

  const allPaths = [...staticPaths, ...attackPaths, ...enumeratedPaths];

  return allPaths.map((path) => ({
    url: `${baseUrl}${path}`,
    lastModified: new Date(),
    changeFrequency: path === "" ? "daily" : "weekly",
    priority: path === "" ? 1.0 : path.startsWith("/store/") ? 0.8 : 0.6,
  }));
}
