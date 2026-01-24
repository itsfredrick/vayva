import React from "react";
import { Metadata } from "next";
import { Button, Icon } from "@vayva/ui";
import Link from "next/link";
import { APP_URL } from "@/lib/constants";
import { SchemaOrg } from "@/components/seo/SchemaOrg";
import { BreadcrumbSchema } from "@/components/seo/BreadcrumbSchema";
import { SITE_ORIGIN } from "@/lib/seo/route-policy";

interface Props {
    params: Promise<{
        industry: string;
        city: string;
    }>;
}

function capitalize(s: string): string {
    return s.charAt(0).toUpperCase() + s.slice(1).replace(/-/g, " ");
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { industry, city } = await params;
    const industryLabel = capitalize(industry);
    const cityLabel = capitalize(city);
    const title = `How to Start Dropshipping ${industryLabel} in ${cityLabel} (2026 Guide)`;
    const description = `Learn how to launch a profitable dropshipping business in ${cityLabel}, Nigeria. Sell ${industryLabel} on WhatsApp using Vayva’s AI tools and local delivery partners.`;

    return {
        title,
        description,
        openGraph: {
            title,
            description,
            type: "website",
        },
    };
}

export default async function DropshippingPage({ params }: Props): Promise<React.JSX.Element> {
    const { industry, city } = await params;
    const industryLabel = capitalize(industry);
    const cityLabel = capitalize(city);

    return (
        <div className="min-h-screen bg-white">
            <SchemaOrg type="SoftwareApplication" />
            <BreadcrumbSchema
                items={[
                    { name: "Home", item: SITE_ORIGIN },
                    { name: "Dropshipping", item: `${SITE_ORIGIN}/dropshipping` },
                    { name: `${industryLabel} in ${cityLabel}`, item: `${SITE_ORIGIN}/dropshipping/${industry}-in-${city}` }
                ]}
            />

            {/* Hero */}
            <section className="pt-24 pb-20 px-4 bg-orange-50/20">
                <div className="max-w-4xl mx-auto text-center">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-50 text-orange-600 text-xs font-bold uppercase mb-8">
                        #1 Dropshipping Platform in {cityLabel}
                    </div>
                    <h1 className="text-5xl md:text-7xl font-bold text-[#0F172A] mb-8 leading-tight">
                        Dropship {industryLabel} in <span className="text-orange-500">{cityLabel}</span>.
                    </h1>
                    <p className="text-xl text-[#64748B] mb-10 max-w-3xl mx-auto leading-relaxed">
                        The ultimate toolkit for Nigerian dropshippers. Connect with suppliers, automate your
                        WhatsApp checkout, and handle city-wide "Waybills" without keeping inventory.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <Link href={`${APP_URL}/signup`}>
                            <Button className="bg-black text-white px-10 py-6 rounded-2xl text-xl font-bold shadow-2xl transition-transform hover:scale-105 active:scale-95">
                                Start Dropshipping Free
                            </Button>
                        </Link>
                    </div>
                </div>
            </section>

            {/* Dropshipping Features */}
            <section className="py-24 px-4 bg-white">
                <div className="max-w-6xl mx-auto">
                    <div className="text-center mb-16">
                        <h2 className="text-4xl font-bold mb-4">Everything you need to scale.</h2>
                        <p className="text-gray-500">Built specifically for the African dropshipping model.</p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-8">
                        {[
                            {
                                title: "No Inventory Required",
                                desc: "List products from your suppliers and only pay when you make a sale.",
                                icon: "PackageSearch"
                            },
                            {
                                title: "AI Chat Automation",
                                desc: "Our AI extracts order details from WhatsApp dms, so you don't have to.",
                                icon: "Bot"
                            },
                            {
                                title: "Trust & Escrow",
                                desc: "Vayva's wallet system ensures your customers feel safe paying upfront.",
                                icon: "Shield"
                            }
                        ].map((feature, i) => (
                            <div key={i} className="p-8 border border-gray-100 rounded-3xl hover:shadow-xl transition-all group">
                                <div className="w-12 h-12 bg-orange-50 rounded-xl flex items-center justify-center text-orange-600 mb-6 group-hover:scale-110 transition-transform">
                                    <Icon name={feature.icon as any} size={24} />
                                </div>
                                <h3 className="text-xl font-bold mb-3">{feature.title}</h3>
                                <p className="text-gray-500 text-sm leading-relaxed">{feature.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* City-Specific Logistics */}
            <section className="py-24 px-4 bg-gray-50 rounded-[60px] mx-4 mb-24 overflow-hidden">
                <div className="max-w-6xl mx-auto grid lg:grid-cols-2 gap-16 items-center">
                    <div className="relative">
                        <div className="absolute -inset-4 bg-orange-200 rounded-full blur-3xl opacity-20"></div>
                        <div className="relative p-12 bg-white rounded-[40px] shadow-2xl border border-orange-100">
                            <h3 className="text-2xl font-bold mb-4 italic text-orange-600">"Waybill" Ready</h3>
                            <p className="text-gray-600 font-medium">
                                Selling to customers in {cityLabel}? Vayva generates ready-to-print waybills
                                and lets you book riders from major logistics hubs instantly.
                            </p>
                        </div>
                    </div>
                    <div>
                        <h2 className="text-4xl font-bold mb-8 leading-tight">Fast delivery across {cityLabel}.</h2>
                        <p className="text-lg text-gray-500 mb-10">
                            Nigerian dropshipping depends on logistics speed. Vayva is the only platform
                            that treats "Waybilling" as a first-class citizen, ensuring your customers
                            get their {industryLabel} within 24-48 hours.
                        </p>
                        <Link href={`${APP_URL}/signup`}>
                            <Button className="bg-orange-500 hover:bg-orange-600 text-white px-8 py-4 rounded-xl font-bold">
                                Setup your {cityLabel} Store
                            </Button>
                        </Link>
                    </div>
                </div>
            </section>

            {/* Testimonial Placeholder */}
            <section className="py-24 px-4 text-center">
                <div className="max-w-3xl mx-auto">
                    <Icon name="Quote" size={48} className="text-orange-100 mb-8 mx-auto" />
                    <h2 className="text-3xl font-bold mb-6 italic leading-relaxed">
                        "Switching my dropshipping business to Vayva saved me from the manual chaos of
                        Lagos traffic and incessant 'Price in DM' questions."
                    </h2>
                    <div className="font-bold text-gray-400 uppercase tracking-widest text-sm">— Top Fashion Vendor, {cityLabel}</div>
                </div>
            </section>
        </div>
    );
}
