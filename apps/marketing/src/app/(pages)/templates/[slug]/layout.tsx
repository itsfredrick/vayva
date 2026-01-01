import { Metadata } from "next";
import { notFound } from "next/navigation";
import { TEMPLATES } from "@/lib/templates-registry";
import { metadataFor, jsonLdFor } from "@/lib/seo/seo-engine";
import { TEMPLATE_KEYWORD_MAPS } from "@/lib/seo/keywords/templates";

interface LayoutProps {
  children: React.ReactNode;
  params: Promise<{
    slug: string;
  }>;
}

/**
 * TEMPLATE DETAIL METADATA
 * Dynamically incorporates primary keyword into title/description.
 */
export async function generateMetadata({
  params,
}: LayoutProps): Promise<Metadata> {
  const { slug } = await params;
  const template = TEMPLATES.find((t) => t.slug === slug);
  if (!template) return {};

  const keywordStrategy = TEMPLATE_KEYWORD_MAPS[slug];

  // Primary Keyword Strategy (Section 6 Enforcement)
  const title = keywordStrategy
    ? `${keywordStrategy.primary.charAt(0).toUpperCase() + keywordStrategy.primary.slice(1)} | ${template.name}`
    : `${template.name} - Online Store Template`;

  return metadataFor(`/templates/${slug}`, {
    pageTitle: title,
    templateName: template.name,
    templateDescription: keywordStrategy?.longTail?.[0] || template.description,
  });
}

export default async function TemplateDetailLayout({
  children,
  params,
}: LayoutProps) {
  const { slug } = await params;
  const template = TEMPLATES.find((t) => t.slug === slug);
  if (!template) notFound();

  const jsonLd = jsonLdFor(`/templates/${slug}`, {
    templateName: template.name,
    templateDescription: template.description,
  });

  return (
    <>
      {jsonLd && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      )}
      {children}
    </>
  );
}

export function generateStaticParams() {
  return TEMPLATES.map((t) => ({
    slug: t.slug,
  }));
}
