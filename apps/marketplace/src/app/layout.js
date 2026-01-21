import { jsx as _jsx } from "react/jsx-runtime";
import "@vayva/theme/css";
import "./globals.css";
// import { Inter } from 'next/font/google';
// const inter = Inter({ subsets: ['latin'] });
export const metadata = {
    title: "Vayva marketplace",
    description: "Vayva",
};
import { ClientLayout } from "@/components/ClientLayout";
export default function RootLayout({ children, }) {
    return (_jsx("html", { lang: "en", children: _jsx("body", { className: "font-sans", children: _jsx(ClientLayout, { children: children }) }) }));
}
