import React from "react";
import "./globals.css";

// Remote fonts disabled to avoid network dependency during build
// const spaceGrotesk = Space_Grotesk({ ... });
// const inter = Inter({ ... });

export const metadata = {
    metadataBase: new URL("https://vayva.ng"),
    title: "Vayva - WhatsApp Business Platform for Nigeria | Accept Card & Bank Payments",
    description: "Turn WhatsApp into a complete business platform. Accept payments via cards (Visa, Mastercard), bank transfers, and USSD. Powered by Paystack. AI-powered order capture, inventory sync, and logistics.",
    keywords: ["WhatsApp business", "Nigeria", "e-commerce", "order management", "payments", "Paystack", "card payments", "bank transfer", "online store Nigeria", "accept payments Nigeria"],
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

interface RootLayoutProps {
    children: React.ReactNode;
}

export default function RootLayout({
    children,
}: RootLayoutProps): React.JSX.Element {
    const jsonLd = {
        "@context": "https://schema.org",
        "@type": "Organization",
        "name": "Vayva",
        "url": "https://vayva.ng",
        "logo": "https://vayva.ng/favicon.svg",
        "contactPoint": {
            "@type": "ContactPoint",
            "telephone": "+234-916-000-0000",
            "contactType": "customer service",
            "email": "support@vayva.ng"
        },
        "description": "Vayva is the leading WhatsApp Business Platform in Nigeria, helping SMEs automate sales, payments, and logistics with AI.",
        "sameAs": [
            "https://twitter.com/vayvang",
            "https://www.linkedin.com/company/vayva"
        ]
    };

    return (
        <html lang="en" className="light" suppressHydrationWarning>
            <head>
                <Script
                    id="json-ld"
                    type="application/ld+json"
                    dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
                />
            </head>
            <body className="antialiased font-sans bg-white text-black" suppressHydrationWarning>
                {children}
            </body>
        </html>
    );
}
