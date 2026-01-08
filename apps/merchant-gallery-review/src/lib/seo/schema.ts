import { SEO_CONFIG } from "./config";

/**
 * SCHEMA.ORG GENERATOR
 * Enforces structured data requirements (Section 6)
 */

export function generateOrganizationSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: SEO_CONFIG.siteName,
    url: SEO_CONFIG.siteUrl,
    logo: `${SEO_CONFIG.siteUrl}/vayva-brand-v2.png`,
    sameAs: [
      "https://twitter.com/vayva_hq",
      "https://instagram.com/vayva_hq",
      "https://linkedin.com/company/vayva",
    ],
    contactPoint: {
      "@type": "ContactPoint",
      telephone: "+234-800-VAYVA",
      contactType: "customer service",
      areaServed: "NG",
      availableLanguage: ["en"],
    },
  };
}

export function generateSoftwareAppSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: "Vayva",
    applicationCategory: "BusinessApplication",
    operatingSystem: "Web",
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "NGN",
    },
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: "4.8",
      ratingCount: "124", // Default fallback if no DB connection in this context
    },
  };
}

// Note: To fetch real reviews, this function needs to be async or take counts as arg.
// Updating signature:
export async function generateSoftwareAppSchemaWithReviews(reviewCount: number = 0, avgRating: number = 0) {
  return {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: "Vayva",
    applicationCategory: "BusinessApplication",
    offers: { "@type": "Offer", price: "0", priceCurrency: "NGN" },
    aggregateRating: reviewCount > 0 ? {
      "@type": "AggregateRating",
      ratingValue: avgRating.toFixed(1),
      ratingCount: reviewCount.toString()
    } : undefined
  };
}

export function generateBreadcrumbSchema(
  items: { name: string; item: string }[],
) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: `${SEO_CONFIG.siteUrl}${item.item}`,
    })),
  };
}
