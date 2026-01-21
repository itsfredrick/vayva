import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import "./globals.css";
import QueryProvider from "@/providers/QueryProvider";
import { Toaster } from "sonner";
export const metadata = {
    title: "Vayva Ops Console",
    description: "Internal Operations Platform",
    icons: {
        icon: [
            { url: "/favicon.svg", type: "image/svg+xml" },
        ],
        apple: [{ url: "/apple-touch-icon.png" }],
    },
};
export default function RootLayout({ children, }) {
    return (_jsx("html", { lang: "en", suppressHydrationWarning: true, children: _jsxs("body", { className: `font-sans antialiased min-h-screen bg-background text-foreground density-compact`, suppressHydrationWarning: true, children: [_jsx(QueryProvider, { children: children }), _jsx(Toaster, { position: "top-right", richColors: true })] }) }));
}
