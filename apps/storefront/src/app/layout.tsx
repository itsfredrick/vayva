import type { Metadata, ResolvingMetadata } from "next";
import { Inter, Space_Grotesk } from "next/font/google"; // eslint-disable-line @typescript-eslint/no-unused-vars
import "./globals.css";
import { StoreProvider } from "@/context/StoreContext";
import { Suspense } from "react";
import { headers } from "next/headers";
import { prisma } from "@vayva/db";

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-space-grotesk",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export async function generateMetadata(
  { params, searchParams }: any,
  parent: ResolvingMetadata
): Promise<Metadata> {
  const headersList = await headers();
  const host = headersList.get("host") || "";

  let slug = null;

  // Domain resolution logic
  if (process.env.NEXT_PUBLIC_ROOT_DOMAIN && host.includes(process.env.NEXT_PUBLIC_ROOT_DOMAIN)) {
    slug = host.replace(`.${process.env.NEXT_PUBLIC_ROOT_DOMAIN}`, "");
  } else if (host.endsWith(".vayva.shop")) {
    slug = host.replace(".vayva.shop", "");
  } else if (host.endsWith(".vayva.ng")) {
    slug = host.replace(".vayva.ng", ""); // Production
  }

  // Handle localhost via manual override for testing if needed, though hard on server layout without params
  // Use a fallback if no slug found on domain

  if (slug) {
    try {
      const store = await prisma.store.findUnique({
        where: { slug },
        select: {
          name: true,
          // tagline: true, // Legacy field removed
          seoTitle: true,
          seoDescription: true,
          seoKeywords: true,
          socialImage: true,
          logoUrl: true
        }
      });

      if (store) {
        const title = store.seoTitle || store.name;
        const description = store.seoDescription || `Powered by Vayva`;
        const images = store.socialImage ? [store.socialImage] : (store.logoUrl ? [store.logoUrl] : []);

        return {
          title,
          description,
          keywords: store.seoKeywords || [],
          openGraph: {
            title,
            description,
            images,
            type: "website",
          },
          twitter: {
            card: "summary_large_image",
            title,
            description,
            images,
          }
        };
      }
    } catch (e) {
      console.error("SEO Fetch Error", e);
    }
  }

  return {
    title: "Vayva Storefront",
    description: "Powered by Vayva",
    icons: {
      icon: [{ url: "/favicon.svg", type: "image/svg+xml" }],
      apple: [{ url: "/apple-touch-icon.png" }],
    },
  };
}

export default function RootLayout({ children }: { children: any }) {
  return (
    <html lang="en">
      <head>
        <link
          rel="preconnect"
          href={process.env.NEXT_PUBLIC_API_URL || ""}
        />

        <link rel="preconnect" href="https://images.unsplash.com" />
        <link rel="dns-prefetch" href="https://images.unsplash.com" />
      </head>
      <body
        className={`${spaceGrotesk.variable} ${inter.variable} font-sans antialiased bg-white text-black min-h-screen flex flex-col`}
      >
        <Suspense fallback={<div className="p-10 text-center">Loading...</div>}>
          <StoreProvider>{children}</StoreProvider>
        </Suspense>
      </body>
    </html>
  );
}
