import type { Metadata, ResolvingMetadata } from "next";
import { Inter, Space_Grotesk } from "next/font/google";
import "./globals.css";
import { StoreProvider } from "@/context/StoreContext";
import { Suspense } from "react";
import { prisma } from "@vayva/db";
import { notFound } from "next/navigation";
import { PublicStore } from "@/types/storefront";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { getSlugFromHeaders } from "./utils";

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-space-grotesk",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export async function generateMetadata(
  { params: _params, searchParams: _searchParams }: any,
  _parent: ResolvingMetadata
): Promise<Metadata> {
  const slug = await getSlugFromHeaders();

  if (slug) {
    try {
      const store = await prisma.store.findUnique({
        where: { slug },
        select: {
          name: true,
          seoTitle: true,
          seoDescription: true,
          socialImage: true,
          logoUrl: true
        }
      });

      if (store) {
        const title = store.seoTitle || `${store.name} | Powered by Vayva`;
        const description = store.seoDescription || `Shop at ${store.name} - Powered by Vayva`;
        const images = store.socialImage ? [store.socialImage] : (store.logoUrl ? [store.logoUrl] : []);

        return {
          title,
          description,
          openGraph: {
            title,
            description,
            images,
            siteName: store.name,
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
    } catch (e: unknown) {
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

export default async function RootLayout({ children }: { children: React.ReactNode }): Promise<React.JSX.Element> {
  const slug = await getSlugFromHeaders();
  let store: PublicStore | null = null;

  if (slug) {
    try {
      const rawStore = await prisma.store.findUnique({
        where: { slug },
        include: {
          storefrontPublished: true,
          merchantPolicies: true,
          // contacts is a JSON field, no include
        }
      });

      if (rawStore) {
        const themeConfig = (rawStore.storefrontPublished?.themeConfig as any) || {
          primaryColor: "#000000",
          accentColor: "#FFFFFF",
          templateId: "minimal"
        };
        const contacts = (rawStore.contacts as any) || {};

        const policies = {
          shipping: rawStore.merchantPolicies.find((p: any) => p.type === 'SHIPPING_DELIVERY')?.contentMd || "",
          returns: rawStore.merchantPolicies.find((p: any) => p.type === 'RETURNS')?.contentMd || "",
          privacy: rawStore.merchantPolicies.find((p: any) => p.type === 'PRIVACY')?.contentMd || "",
        };

        store = {
          id: rawStore.id,
          slug: rawStore.slug,
          name: rawStore.name,
          tagline: rawStore.seoDescription || undefined,
          logoUrl: rawStore.logoUrl || undefined,
          theme: themeConfig,
          contact: {
            phone: contacts.phone,
            email: contacts.email,
            whatsapp: contacts.whatsapp
          },
          policies,
          industry: rawStore.industrySlug || undefined,
          plan: rawStore.plan as "FREE" | "STARTER" | "PRO"
        };
      }
    } catch (e) {
      console.error("Layout Store Fetch Error", e);
    }
  }

  // STRICT 404 RULE: If we have a slug but no store, 404.
  if (slug && !store) {
    notFound();
  }

  return (
    <html lang="en" suppressHydrationWarning>
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
        suppressHydrationWarning
      >
        <Suspense fallback={<div className="p-10 text-center">Loading...</div>}>
          <StoreProvider initialStore={store}>{children}</StoreProvider>
        </Suspense>
        {/* Performance Monitoring */}
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
