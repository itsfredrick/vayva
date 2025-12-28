import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import Link from 'next/link';
import { Button } from '@vayva/ui';
import { metadataFor, jsonLdFor } from '@/lib/seo/seo-engine';
import { COMPETITORS } from '@/lib/seo/comparisons';

interface PageProps {
    params: {
        competitor: string;
    };
}

/**
 * 1. SHOPIFY ATTACK METADATA
 * Using consolidated engine to ensure canonical and robots consistency.
 */
export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
    const data = COMPETITORS[params.competitor];
    if (!data) return {};

    return metadataFor(`/compare/${params.competitor}`, {
        compareTitle: data.title,
        pageDescription: data.description
    });
}

export function generateStaticParams() {
    return Object.keys(COMPETITORS).map((competitor) => ({
        competitor,
    }));
}

export default function ComparisonPage({ params }: PageProps) {
    const data = COMPETITORS[params.competitor];

    if (!data) {
        notFound();
    }

    const jsonLd = jsonLdFor(`/compare/${params.competitor}`, { faqs: data.faqs });

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
                    {data.heroHeading}
                </h1>

                {/* 2. Who this is for */}
                <section className="mb-12">
                    <h2 className="text-2xl font-bold text-slate-900 mb-4">Who Vayva is for</h2>
                    <ul className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <li className="flex items-start gap-3">
                            <span className="text-green-500 font-bold">✓</span>
                            <span className="text-slate-600">Nigerian merchants scaling beyond social media.</span>
                        </li>
                        <li className="flex items-start gap-3">
                            <span className="text-green-500 font-bold">✓</span>
                            <span className="text-slate-600">Businesses needing native Naira (NGN) stability.</span>
                        </li>
                        <li className="flex items-start gap-3">
                            <span className="text-green-500 font-bold">✓</span>
                            <span className="text-slate-600">Operations relying on WhatsApp for conversions.</span>
                        </li>
                    </ul>
                </section>

                {/* 3. Verdict (Decision Table Alternative) */}
                <div className="bg-slate-50 border border-slate-200 p-8 rounded-2xl mb-16 shadow-sm">
                    <h3 className="text-xl font-bold mb-4 text-slate-900">The Honest Verdict</h3>
                    <p className="text-lg text-slate-600 leading-relaxed mb-6">
                        {data.verdict}
                    </p>

                    <div className="overflow-hidden border border-slate-200 rounded-xl bg-white">
                        <table className="w-full text-left">
                            <thead className="bg-slate-50 border-b border-slate-200">
                                <tr>
                                    <th className="py-3 px-4 text-sm font-semibold text-slate-900">Feature</th>
                                    <th className="py-3 px-4 text-sm font-semibold text-green-600">Vayva</th>
                                    <th className="py-3 px-4 text-sm font-semibold text-slate-500">{data.name}</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {data.featureComparison.map((row, i) => (
                                    <tr key={i}>
                                        <td className="py-3 px-4 text-sm font-medium text-slate-900">{row.feature}</td>
                                        <td className="py-3 px-4 text-sm text-slate-700 bg-green-50/30">{row.vayva}</td>
                                        <td className="py-3 px-4 text-sm text-slate-500">{row.competitor}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* 4. Feature Breakdown */}
                <section className="mb-20">
                    <h2 className="text-3xl font-bold text-slate-900 mb-8">Why Vayva wins in Nigeria</h2>
                    <div className="space-y-12">
                        <div className="grid md:grid-cols-2 gap-8 items-center">
                            <div>
                                <h3 className="text-xl font-bold mb-3">Native NGN Payments</h3>
                                <p className="text-slate-600">Stop worrying about USD fluctuations. Vayva handles everything in Naira natively via Paystack and Flutterwave, with no platform transaction fees.</p>
                            </div>
                            <div className="bg-slate-100 aspect-video rounded-lg flex items-center justify-center text-slate-400 font-medium">
                                NGN Payment Visual
                            </div>
                        </div>
                        <div className="grid md:grid-cols-2 gap-8 items-center">
                            <div className="order-2 md:order-1 bg-slate-100 aspect-video rounded-lg flex items-center justify-center text-slate-400 font-medium">
                                WhatsApp Flow Visual
                            </div>
                            <div className="order-1 md:order-2">
                                <h3 className="text-xl font-bold mb-3">WhatsApp Order Mastery</h3>
                                <p className="text-slate-600">Every order on Vayva can trigger an automated WhatsApp confirmation. Keep customers in the app they actually use.</p>
                            </div>
                        </div>
                    </div>
                </section>

                {/* 5. Migration */}
                <section className="mb-20 p-10 bg-slate-900 text-white rounded-3xl">
                    <h2 className="text-3xl font-bold mb-6">Moving from {data.name}?</h2>
                    <p className="text-slate-400 mb-8 text-lg">We can help you migrate your products and customers in under 10 minutes. No downtime, no lost data.</p>
                    <Link href="/contact">
                        <Button className="bg-green-500 hover:bg-green-600 text-white px-8 py-3 h-auto text-lg">
                            Get Migration Help
                        </Button>
                    </Link>
                </section>

                {/* 6. FAQs */}
                <section className="mb-20">
                    <h2 className="text-3xl font-bold text-slate-900 mb-8">Frequently Asked Questions</h2>
                    <div className="space-y-8">
                        {data.faqs.map((faq, i) => (
                            <div key={i} className="border-b border-slate-100 pb-8 last:border-0">
                                <h3 className="text-xl font-bold text-slate-900 mb-3">{faq.question}</h3>
                                <p className="text-slate-600 leading-relaxed">{faq.answer}</p>
                            </div>
                        ))}
                    </div>
                </section>

                {/* 7. CTA Blocks & Internal Links */}
                <section className="border-t border-slate-200 pt-16">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        <div className="p-6 bg-slate-50 rounded-xl">
                            <h4 className="font-bold mb-2">Ready to Build?</h4>
                            <p className="text-sm text-slate-500 mb-4">Choose a template and launch today.</p>
                            <Link href="/templates" className="text-green-600 font-semibold text-sm hover:underline">
                                Browse Templates →
                            </Link>
                        </div>
                        <div className="p-6 bg-slate-50 rounded-xl">
                            <h4 className="font-bold mb-2">Pricing Plans</h4>
                            <p className="text-sm text-slate-500 mb-4">NGN pricing designed for Nigerian growth.</p>
                            <Link href="/pricing" className="text-green-600 font-semibold text-sm hover:underline">
                                See Pricing →
                            </Link>
                        </div>
                        <div className="p-6 bg-slate-50 rounded-xl">
                            <h4 className="font-bold mb-2">Marketplace</h4>
                            <p className="text-sm text-slate-500 mb-4">Join 5,000+ verified African sellers.</p>
                            <Link href="/market/categories" className="text-green-600 font-semibold text-sm hover:underline">
                                Explore Market →
                            </Link>
                        </div>
                    </div>
                </section>
            </div>
        </div>
    );
}
