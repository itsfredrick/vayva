import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import "./globals.css";
// Remote fonts disabled to avoid network dependency during build
// const spaceGrotesk = Space_Grotesk({ ... });
// const inter = Inter({ ... });
export const metadata = {
    title: "Vayva - WhatsApp Business Platform for Nigeria",
    description: "Stop fighting with chat bubbles. Let Vayva's AI auto-capture orders, track payments, and organize your business.",
    keywords: ["WhatsApp business", "Nigeria", "e-commerce", "order management", "payments"],
    authors: [{ name: "Vayva" }],
    manifest: "/manifest.json",
    openGraph: {
        title: "Vayva - WhatsApp Business Platform",
        description: "Turn WhatsApp into a complete business platform",
        url: "https://vayva.ng",
        siteName: "Vayva",
        images: [
            {
                url: "/og-image.png",
                width: 1200,
                height: 630,
            },
        ],
        locale: "en_NG",
        type: "website",
    },
    twitter: {
        card: "summary_large_image",
        title: "Vayva - WhatsApp Business Platform",
        description: "Turn WhatsApp into a complete business platform",
        images: ["/og-image.png"],
    },
    icons: {
        icon: [
            { url: "/favicon.svg", type: "image/svg+xml" },
            { url: "/icons/icon-192.png", sizes: "192x192", type: "image/png" },
            { url: "/icons/icon-512.png", sizes: "512x512", type: "image/png" },
        ],
        apple: [{ url: "/apple-touch-icon.png" }],
    },
};
import Script from "next/script";
export default function RootLayout({ children, }) {
    const jsonLd = {
        "@context": "https://schema.org",
        "@type": "Organization",
        "name": "Vayva",
        "url": "https://vayva.ng",
        "logo": "https://vayva.ng/favicon.svg",
        "contactPoint": {
            "@type": "ContactPoint",
            "telephone": "+234-XXX-XXXX-XXXX",
            "contactType": "customer service",
            "email": "support@vayva.ng"
        },
        "description": "Vayva is the leading WhatsApp Business Platform in Nigeria, helping SMEs automate sales, payments, and logistics with AI.",
        "sameAs": [
            "https://twitter.com/vayvang",
            "https://www.linkedin.com/company/vayva"
        ]
    };
    return (_jsxs("html", { lang: "en", className: "light", suppressHydrationWarning: true, children: [_jsx("head", { children: _jsx(Script, { id: "json-ld", type: "application/ld+json", dangerouslySetInnerHTML: { __html: JSON.stringify(jsonLd) } }) }), _jsx("body", { className: "antialiased font-sans bg-white text-black", suppressHydrationWarning: true, children: children })] }));
}
