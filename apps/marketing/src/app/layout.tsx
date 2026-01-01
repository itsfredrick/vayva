import type { Metadata } from "next";
import { Space_Grotesk, Inter } from "next/font/google";
import "./globals.css";

const spaceGrotesk = Space_Grotesk({
    subsets: ["latin"],
    weight: ["300", "400", "500", "600", "700"],
    variable: "--font-space-grotesk",
    display: "swap",
});

const inter = Inter({
    subsets: ["latin"],
    weight: ["300", "400", "500", "600", "700"],
    variable: "--font-inter",
    display: "swap",
});

export const metadata: Metadata = {
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

export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <html lang="en" className={`${spaceGrotesk.variable} ${inter.variable} light`} suppressHydrationWarning>
            <body className="antialiased font-sans bg-white text-slate-900" style={{ backgroundColor: "#ffffff", color: "#000000" }} suppressHydrationWarning>{children}</body>
        </html>
    );
}
