// src/lib/seo/schema/faq.ts
export function faqSchema(path, ctx) {
    return {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        mainEntity: (ctx?.faqs ?? []).map((faq) => ({
            "@type": "Question",
            name: faq.question,
            acceptedAnswer: {
                "@type": "Answer",
                text: faq.answer,
            },
        })),
    };
}
