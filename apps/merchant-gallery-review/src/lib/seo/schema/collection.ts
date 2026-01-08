// src/lib/seo/schema/collection.ts
import { SITE_ORIGIN } from "../route-policy";

export function collectionSchema(path: string, ctx?: Record<string, any>) {
  return {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: ctx?.collectionName ?? "Marketplace Collection",
    description:
      ctx?.collectionDescription ??
      "Explore merchants and products on the Vayva marketplace.",
    url: `${SITE_ORIGIN}${path}`,
    mainEntity: {
      "@type": "ItemList",
      itemListElement: (ctx?.items ?? []).map((item: any, index: number) => ({
        "@type": "ListItem",
        position: index + 1,
        name: item.name,
        url: item.url.startsWith("http")
          ? item.url
          : `${SITE_ORIGIN}${item.url}`,
      })),
    },
  };
}
