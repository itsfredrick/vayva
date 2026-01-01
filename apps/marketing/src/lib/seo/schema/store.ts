// src/lib/seo/schema/store.ts
import { SITE_ORIGIN } from "../route-policy";

export function storeSchema(path: string, ctx?: Record<string, any>) {
  return {
    "@context": "https://schema.org",
    "@type": "Store",
    name: ctx?.storeName ?? "Vayva Store",
    url: `${SITE_ORIGIN}${path}`,
    description:
      ctx?.storeDescription ??
      "Pay securely and get delivery updates—powered by Vayva.",
    currenciesAccepted: "NGN",
    paymentAccepted: "Card, Bank Transfer, Paystack",
    priceRange: "₦₦",
  };
}
