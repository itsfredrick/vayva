import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Space_Grotesk, Inter } from "next/font/google";
import { AuthProvider } from "@/context/AuthContext";
import { ConsentBanner } from "@/components/legal/ConsentBanner";
import { IncidentBanner } from "@/components/layout/IncidentBanner";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next";
import "./globals.css";
export const dynamic = "force-dynamic";
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
export const viewport = {
    themeColor: "#000000",
    width: "device-width",
    initialScale: 1,
    maximumScale: 1,
    userScalable: true,
};
export const metadata = {
    title: "Vayva - Seller Dashboard",
    description: "Manage your Vayva store",
    manifest: "/manifest.json",
    appleWebApp: {
        capable: true,
        statusBarStyle: "black-translucent",
        title: "Vayva",
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
import { Toaster } from "sonner";
export default function RootLayout({ children, }) {
    return (_jsxs("html", { lang: "en", className: `${spaceGrotesk.variable} ${inter.variable}`, suppressHydrationWarning: true, children: [_jsx("head", { children: _jsx("link", { rel: "stylesheet", href: "https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200" }) }), _jsxs("body", { className: `font-sans antialiased min-h-screen bg-background density-comfortable`, suppressHydrationWarning: true, children: [_jsxs(AuthProvider, { children: [_jsx(IncidentBanner, {}), children, _jsx(Toaster, { richColors: true, position: "top-right" }), _jsx(ConsentBanner, {})] }), _jsx(Analytics, {}), _jsx(SpeedInsights, {})] })] }));
}
