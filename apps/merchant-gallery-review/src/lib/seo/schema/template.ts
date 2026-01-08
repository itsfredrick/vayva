import { SITE_ORIGIN } from "../route-policy";

export function templateSchema(path: string, ctx?: Record<string, any>) {
  return {
    "@context": "https://schema.org",
    "@type": "Product",
    name: ctx?.templateName ?? "Vayva Online Store Template",
    description:
      ctx?.templateDescription ??
      "A conversion-focused online store template built for Nigeria.",
    brand: { "@type": "Brand", name: "Vayva" },
    offers: {
      "@type": "Offer",
      priceCurrency: "NGN",
      price: "0",
      availability: "https://schema.org/InStock",
      url: `${SITE_ORIGIN}${path}`,
    },
  };
}
