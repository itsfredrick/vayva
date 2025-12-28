// src/lib/seo/schema/faq.ts
export function faqSchema(path: string, ctx?: Record<string, any>) {
    return {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        "mainEntity": (ctx?.faqs ?? []).map((faq: any) => ({
            "@type": "Question",
            "name": faq.question,
            "acceptedAnswer": {
                "@type": "Answer",
                "text": faq.answer
            }
        }))
    };
}
