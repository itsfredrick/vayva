// src/lib/seo/schema/article.ts
import { SITE_ORIGIN } from "../route-policy";

export function articleSchema(path: string, ctx?: Record<string, any>) {
  return {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: ctx?.postTitle ?? "Vayva Blog Post",
    description:
      ctx?.postDescription ??
      "Expert guides for selling online and growing your business in Nigeria.",
    author: { "@type": "Organization", name: "Vayva" },
    publisher: { "@type": "Organization", name: "Vayva" },
    datePublished: ctx?.datePublished ?? new Date().toISOString(),
    mainEntityOfPage: `${SITE_ORIGIN}${path}`,
  };
}
