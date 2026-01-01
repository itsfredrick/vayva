// src/app/(marketing)/marketplace/layout.tsx
import { metadataFor } from "@/lib/seo/seo-engine";

// Section 8.1 Resolve Duplication: /marketplace path
// The engine handles canonical mapping to /market/categories via DUPLICATE_MARKETPLACE_PATH rule
export const metadata = metadataFor("/marketplace", {
  pageTitle: "Vayva Marketplace - Extend your business tools",
  pageDescription:
    "Learn about the upcoming Vayva Marketplace for logistics, payments, and marketing add-ons.",
});

export default function MarketplaceLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
