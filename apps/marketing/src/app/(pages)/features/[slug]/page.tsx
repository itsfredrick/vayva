import { notFound } from "next/navigation";
import { Metadata } from "next";
import Link from "next/link";
import { Button } from "@vayva/ui";
import { metadataFor, jsonLdFor } from "@/lib/seo/seo-engine";
import { FEATURES } from "@/lib/seo/features-data";

interface PageProps {
  params: Promise<{
    slug: string;
  }>;
}

/**
 * 1. FEATURE MOAT METADATA
 */
export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const data = FEATURES[slug];
  if (!data) return {};

  return metadataFor(`/features/${slug}`, {
    pageTitle: data.title,
    pageDescription: data.description,
  });
}

export function generateStaticParams() {
  return Object.keys(FEATURES).map((slug) => ({
    slug,
  }));
}

export default async function FeaturePage({ params }: PageProps) {
  const { slug } = await params;
  const data = FEATURES[slug];

  if (!data) {
    notFound();
  }

  const jsonLd = jsonLdFor(`/features/${slug}`);

  return (
    <div className="bg-white min-h-screen">
      {/* Schema Injection */}
      {jsonLd && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      )}

      <div className="max-w-4xl mx-auto py-24 px-4 sm:px-6 lg:px-8">
        {/* 1. H1 */}
        <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 mb-8 tracking-tight">
          {data.h1}
        </h1>

        {/* 2. Intro */}
        <p className="text-xl text-slate-600 mb-12 leading-relaxed max-w-2xl">
          {data.intro}
        </p>

        {/* 3. Benefits (Conversion Structure) */}
        <section className="mb-20">
          <h2 className="text-3xl font-bold text-slate-900 mb-10">
            Why successful merchants choose Vayva
          </h2>
          <div className="grid md:grid-cols-2 gap-8">
            {data.benefits.map((benefit, i) => (
              <div
                key={i}
                className="flex items-start gap-4 p-6 bg-slate-50 rounded-2xl border border-slate-100"
              >
                <span className="w-8 h-8 rounded-full bg-green-100 text-green-600 flex items-center justify-center font-bold">
                  {i + 1}
                </span>
                <p className="text-lg font-medium text-slate-800">{benefit}</p>
              </div>
            ))}
          </div>
        </section>

        {/* 4. Migration CTA (Reusing style) */}
        <section className="mb-20 p-10 bg-green-50 rounded-3xl border border-green-100">
          <h2 className="text-3xl font-bold mb-6 text-green-900">
            Start using this feature today
          </h2>
          <p className="text-green-800/80 mb-8 text-lg">
            Launch your store in under 10 minutes and activate{" "}
            {data.primaryKeyword} capabilities instantly.
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <Link href="/store-builder">
              <Button className="bg-green-600 hover:bg-green-700 text-white px-8 py-3 h-auto text-lg w-full sm:w-auto">
                Start Free Trial
              </Button>
            </Link>
            <Link href="/pricing">
              <Button
                variant="outline"
                className="border-green-200 text-green-700 hover:bg-green-100 px-8 py-3 h-auto text-lg w-full sm:w-auto"
              >
                View Plans
              </Button>
            </Link>
          </div>
        </section>

        {/* 5. Internal Links (SEO Multiplier) */}
        <footer className="border-t border-slate-200 pt-16">
          <h3 className="text-xl font-bold mb-8">
            Related Categories & Comparisons
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="p-6 bg-slate-50 rounded-xl">
              <h4 className="font-bold mb-2">Recommended Template</h4>
              <p className="text-sm text-slate-500 mb-4">
                Start with the {data.relatedTemplateSlug} template for best
                results.
              </p>
              <Link
                href={`/templates/${data.relatedTemplateSlug}`}
                className="text-green-600 font-semibold text-sm hover:underline"
              >
                View Template →
              </Link>
            </div>
            <div className="p-6 bg-slate-50 rounded-xl">
              <h4 className="font-bold mb-2">Compare Platforms</h4>
              <p className="text-sm text-slate-500 mb-4">
                See how Vayva compares to global leaders for Nigerian commerce.
              </p>
              <Link
                href="/compare/shopify"
                className="text-green-600 font-semibold text-sm hover:underline"
              >
                Vayva vs Shopify →
              </Link>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}
