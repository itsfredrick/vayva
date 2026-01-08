import { BRAND } from "@vayva/shared";


interface SchemaOrgProps {
  type: "Organization" | "WebSite" | "SoftwareApplication";
}

export function SchemaOrg({ type }: SchemaOrgProps) {
  const getSchema = () => {
    switch (type) {
      case "Organization":
        return {
          "@context": "https://schema.org",
          "@type": "Organization",
          name: "Vayva",
          url: BRAND.canonicalOrigin,
          logo: `${BRAND.canonicalOrigin}/icon.png`,
          description:
            "The all-in-one commerce platform for African merchants. Build your store, sell on WhatsApp, and manage deliveries.",
          address: {
            "@type": "PostalAddress",
            addressCountry: "NG",
          },
          contactPoint: {
            "@type": "ContactPoint",
            contactType: "Customer Support",
            email: BRAND.supportEmail,
          },
        };

      case "WebSite":
        return {
          "@context": "https://schema.org",
          "@type": "WebSite",
          name: "Vayva",
          url: BRAND.canonicalOrigin,
          description: "The all-in-one commerce platform for African merchants",
          publisher: {
            "@type": "Organization",
            name: "Vayva",
          },
        };

      case "SoftwareApplication":
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
            url: `${BRAND.canonicalOrigin}/pricing`,
          },
          description:
            "WhatsApp commerce platform for Nigerian merchants. Build stores, accept payments, and manage orders.",
          screenshot: `${BRAND.canonicalOrigin}/og-image.png`,
        };

      default:
        return null;
    }
  };

  const schema = getSchema();

  if (!schema) return null;

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}
