// src/lib/seo/schema/home.ts
import { SITE_ORIGIN } from "../route-policy";

export function homeSchema() {
    return {
        "@context": "https://schema.org",
        "@graph": [
            {
                "@type": "Organization",
                "@id": `${SITE_ORIGIN}/#org`,
                "name": "Vayva",
                "url": SITE_ORIGIN,
                "logo": `${SITE_ORIGIN}/brand/logo.png`,
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
            }
        ]
    };
}
