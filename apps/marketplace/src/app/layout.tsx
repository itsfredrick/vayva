import React from "react";
import "@vayva/theme/css";
import "./globals.css";
import type { Metadata } from "next";
// import { Inter } from 'next/font/google';

// const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: "Vayva marketplace",
  description: "Vayva",
};

import { ClientLayout } from "@/components/ClientLayout";

interface RootLayoutProps {
  children: React.ReactNode;
}

export default function RootLayout({
  children,
}: RootLayoutProps): React.JSX.Element {
  return (
    <html lang="en">
      <body className="font-sans">
        <ClientLayout>{children}</ClientLayout>
      </body>
    </html>
  );
}
