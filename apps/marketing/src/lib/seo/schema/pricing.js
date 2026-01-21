/**
 * PRICING SCHEMA
 * Type: OfferCatalog + FAQPage
 */
export function getPricingSchema(props) {
    return {
        "@context": "https://schema.org",
        "@graph": [
            {
                "@type": "OfferCatalog",
                "@id": `${props.baseUrl}/pricing#catalog`,
                name: "Vayva Plans",
                itemListElement: [
                    {
                        "@type": "Offer",
                        name: "Growth",
                        priceCurrency: "NGN",
                        price: "32250",
                        url: `${props.baseUrl}/pricing`,
                    },
                    {
                        "@type": "Offer",
                        name: "Pro",
                        priceCurrency: "NGN",
                        price: "43000",
                        url: `${props.baseUrl}/pricing`,
                    },
                ],
            },
            {
                "@type": "FAQPage",
                "@id": `${props.baseUrl}/pricing#faq`,
                mainEntity: [
                    {
                        "@type": "Question",
                        name: "How long is the free trial?",
                        acceptedAnswer: {
                            "@type": "Answer",
                            text: "The free trial lasts 5 days.",
                        },
                    },
                    {
                        "@type": "Question",
                        name: "Are there platform transaction fees?",
                        acceptedAnswer: {
                            "@type": "Answer",
                            text: "Vayva charges a standard 3% platform fee on withdrawals to cover settlement processing.",
                        },
                    },
                ],
            },
        ],
    };
}
