/**
 * PRICING SCHEMA
 * Type: OfferCatalog + FAQPage
 */
export function getPricingSchema(props: { baseUrl: string }) {
    return {
        "@context": "https://schema.org",
        "@graph": [
            {
                "@type": "OfferCatalog",
                "@id": `${props.baseUrl}/pricing#catalog`,
                "name": "Vayva Plans",
                "itemListElement": [
                    {
                        "@type": "Offer",
                        "name": "Growth",
                        "priceCurrency": "NGN",
                        "price": "30000",
                        "url": `${props.baseUrl}/pricing`
                    },
                    {
                        "@type": "Offer",
                        "name": "Pro",
                        "priceCurrency": "NGN",
                        "price": "45000",
                        "url": `${props.baseUrl}/pricing`
                    }
                ]
            },
            {
                "@type": "FAQPage",
                "@id": `${props.baseUrl}/pricing#faq`,
                "mainEntity": [
                    {
                        "@type": "Question",
                        "name": "How long is the free trial?",
                        "acceptedAnswer": {
                            "@type": "Answer",
                            "text": "The free trial lasts 5 days."
                        }
                    },
                    {
                        "@type": "Question",
                        "name": "Are there platform transaction fees?",
                        "acceptedAnswer": {
                            "@type": "Answer",
                            "text": "No, Vayva does not charge platform transaction fees. You only pay standard payment gateway fees."
                        }
                    }
                ]
            }
        ]
    };
}
