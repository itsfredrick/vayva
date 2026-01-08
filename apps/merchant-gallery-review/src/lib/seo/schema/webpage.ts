// src/lib/seo/schema/webpage.ts
import { SITE_ORIGIN } from "../route-policy";

export function webPageSchema(path: string, ctx?: Record<string, any>) {
  return {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: ctx?.pageTitle ?? "Vayva",
    description:
      ctx?.pageDescription ??
      "Build, sell, and grow with Vayva—Nigeria-first ecommerce infrastructure.",
    url: `${SITE_ORIGIN}${path}`,
  };
}
