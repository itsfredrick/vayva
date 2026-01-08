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

function capitalize(s: string) {
    return s.charAt(0).toUpperCase() + s.slice(1).replace(/-/g, " ");
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { industry, city } = await params;
    const industryLabel = capitalize(industry);
    const cityLabel = capitalize(city);
    const title = `${industryLabel} in ${cityLabel} | #1 AI Commerce for ${cityLabel}`;
    const description = `The #1 platform for ${industryLabel} in ${cityLabel}, Nigeria. Scale your business on WhatsApp with Vayva's AI-powered automated ordering and payments.`;

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

export default async function ProgrammaticLandingPage({ params }: Props) {
    const { industry, city } = await params;
    const industryLabel = capitalize(industry);
    const cityLabel = capitalize(city);

    return (
        <div className="min-h-screen bg-white">
            <SchemaOrg type="SoftwareApplication" />
            <BreadcrumbSchema
                items={[
                    { name: "Home", item: SITE_ORIGIN },
                    { name: "Solutions", item: `${SITE_ORIGIN}/solutions` },
                    { name: `${industryLabel} in ${cityLabel}`, item: `${SITE_ORIGIN}/solutions/${industry}-in-${city}` }
                ]}
            />

            {/* Hero */}
            <section className="pt-24 pb-20 px-4 bg-gray-50/50">
                <div className="max-w-4xl mx-auto text-center">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-green-50 text-[#22C55E] text-xs font-bold uppercase mb-8">
                        Empowering {cityLabel} Businesses
                    </div>
                    <h1 className="text-5xl md:text-7xl font-bold text-[#0F172A] mb-8 leading-tight">
                        How {industryLabel} in <span className="text-[#22C55E]">{cityLabel}</span> dominate on WhatsApp.
                    </h1>
                    <p className="text-xl text-[#64748B] mb-10 max-w-3xl mx-auto leading-relaxed">
                        Stop losing orders in chat bubbles. Vayva's AI helps {industryLabel} in {cityLabel}
                        automate their sales, accept local payments, and manage deliveries—all while you sleep.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <Link href={`${APP_URL}/signup`}>
                            <Button className="bg-[#22C55E] hover:bg-[#16A34A] text-white px-10 py-6 rounded-2xl text-xl font-bold shadow-2xl transition-transform hover:scale-105 active:scale-95">
                                Start Selling in {cityLabel}
                            </Button>
                        </Link>
                    </div>
                </div>
            </section>

            {/* Local Benefit Section */}
            <section className="py-24 px-4">
                <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-16 items-center">
                    <div>
                        <h2 className="text-4xl font-bold text-[#0F172A] mb-8">Built for the {cityLabel} Reality.</h2>
                        <div className="space-y-8">
                            {[
                                {
                                    title: "Accept Bank Transfers Safely",
                                    desc: "Integrated with Paystack to verify every payment in real-time.",
                                },
                                {
                                    title: "Automated Deliveries",
                                    desc: "Connect directly with local riders and delivery partners across the city.",
                                },
                                {
                                    title: "AI Order Capture",
                                    desc: "Our AI understands local slang and chat norms, extracting orders instantly.",
                                },
                            ].map((benefit, i) => (
                                <div key={i} className="flex gap-6">
                                    <div className="flex-shrink-0 w-12 h-12 bg-green-50 rounded-xl flex items-center justify-center text-[#22C55E]">
                                        <Icon name="Check" size={24} />
                                    </div>
                                    <div>
                                        <h3 className="text-lg font-bold text-[#0F172A] mb-1">{benefit.title}</h3>
                                        <p className="text-gray-500 text-sm">{benefit.desc}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                    <div className="bg-gray-100 aspect-video rounded-3xl overflow-hidden border border-gray-200 shadow-xl flex items-center justify-center">
                        <span className="text-gray-400 font-bold">Local Success in {cityLabel}</span>
                    </div>
                </div>
            </section>

            {/* Trust Signal */}
            <section className="py-20 px-4 bg-gray-900 text-white rounded-[40px] mx-4 mb-24">
                <div className="max-w-4xl mx-auto text-center">
                    <h2 className="text-3xl font-bold mb-6">Nigeria's #1 Platform for {industryLabel}.</h2>
                    <p className="text-gray-400 mb-10 text-lg">
                        Join thousands of modern vendors in Lagos, Abuja, Port Harcourt and beyond who are
                        leaving the chaos of manual WhatsApp chat behind.
                    </p>
                    <Link href={`${APP_URL}/signup`}>
                        <Button className="bg-white text-black hover:bg-gray-100 px-8 py-4 rounded-xl font-bold">
                            Join the Commerce Revolution
                        </Button>
                    </Link>
                </div>
            </section>
        </div>
    );
}
