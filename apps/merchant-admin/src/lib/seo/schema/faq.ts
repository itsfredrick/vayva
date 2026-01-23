// src/lib/seo/schema/faq.ts
export function faqSchema(path: unknown, ctx: unknown) {
    return {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        mainEntity: (ctx?.faqs ?? []).map((faq: unknown) => ({
            "@type": "Question",
            name: faq.question,
            acceptedAnswer: {
                "@type": "Answer",
                text: faq.answer,
            },
        })),
    };
}
