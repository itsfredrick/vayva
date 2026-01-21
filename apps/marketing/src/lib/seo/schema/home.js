// src/lib/seo/schema/home.ts
import { SITE_ORIGIN } from "../route-policy";
export function homeSchema() {
    return {
        "@context": "https://schema.org",
        "@graph": [
            {
                "@type": "Organization",
                "@id": `${SITE_ORIGIN}/#org`,
                "legalName": "Vayva",
                "name": "Vayva",
                "url": SITE_ORIGIN,
                "logo": `${SITE_ORIGIN}/brand/logo.png`,
                "areaServed": {
                    "@type": "Country",
                    "name": "Nigeria"
                },
                "sameAs": [
                    "https://www.instagram.com/Vayva.ng",
                    "https://twitter.com/Vayva_ng",
                    "https://www.linkedin.com/company/vayva"
                ],
                "address": {
                    "@type": "PostalAddress",
                    "streetAddress": "123 Herbert Macaulay Way",
                    "addressLocality": "Yaba, Lagos",
                    "addressRegion": "Lagos",
                    "addressCountry": "NG"
                }
            },
            {
                "@type": "SoftwareApplication",
                "@id": `${SITE_ORIGIN}/#app`,
                "name": "Vayva",
                "applicationCategory": "BusinessApplication",
                "operatingSystem": "Web",
                "url": SITE_ORIGIN,
                "publisher": { "@id": `${SITE_ORIGIN}/#org` },
                "offers": {
                    "@type": "Offer",
                    "priceCurrency": "NGN",
                    "price": "0",
                    "category": "FreeTrial"
                }
            },
            {
                "@type": "WebSite",
                "@id": `${SITE_ORIGIN}/#website`,
                "url": SITE_ORIGIN,
                "name": "Vayva",
                "publisher": { "@id": `${SITE_ORIGIN}/#org` },
                "potentialAction": {
                    "@type": "SearchAction",
                    "target": {
                        "@type": "EntryPoint",
                        "urlTemplate": `${SITE_ORIGIN}/marketplace?q={search_term_string}`
                    },
                    "query-input": "required name=search_term_string"
                }
            }
        ],
    };
}
