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
        competitor: string;
    }>;
}

const COMPETITOR_DATA: Record<string, {
    name: string;
    headline: string;
    sub: string;
    vs_points: { vayva: string; competitor: string; label: string }[];
    cta: string;
}> = {
    shopify: {
        name: "Shopify",
        headline: "Stop paying Shopify fees in Dollars.",
        sub: "Switch to Vayva and get a flat ₦30,000 monthly rate. No hidden FX conversion fees, and built-in WhatsApp AI for the Nigerian market.",
        vs_points: [
            { label: "Pricing", vayva: "₦30,000/mo (Fixed)", competitor: "$39+/mo (Fluctuating Naira)" },
            { label: "WhatsApp", vayva: "Native AI Auto-Ordering", competitor: "Requires Paid Apps" },
            { label: "Delivery", vayva: "Local Rider Integration", competitor: "Global Focused" },
            { label: "Payments", vayva: "Instant Paystack/Transfer", competitor: "Shopify Payments (Limited)" },
        ],
        cta: "Switch from Shopify to Vayva",
    },
    "instagram-shopping": {
        name: "Instagram",
        headline: "Stop saying 'Price in DM'.",
        sub: "Let Vayva's AI close the sale while you sleep. Automatically capture orders from your Instagram traffic without manual chatting.",
        vs_points: [
            { label: "Checkout", vayva: "Automated & Instant", competitor: "Manual Back-and-forth" },
            { label: "Inventory", vayva: "Real-time Tracking", competitor: "Manual Management" },
            { label: "Trust", vayva: "Professional Storefront", competitor: "DM-based Trust Issues" },
            { label: "Records", vayva: "Complete Audit Trail", competitor: "Scattered Chat History" },
        ],
        cta: "Automate your Instagram Sales",
    },
    jumia: {
        name: "Jumia",
        headline: "Build your own Brand, not a marketplace listing.",
        sub: "Instead of paying high commissions to Jumia, keep 100% of your sales with your own Vayva storefront. You own the customer data, not them.",
        vs_points: [
            { label: "Fees", vayva: "Zero Commission", competitor: "Up to 20% Commission" },
            { label: "Branding", vayva: "Your Own Domain/Store", competitor: "Jumia Marketplace Theme" },
            { label: "Data", vayva: "You Own Customer Leads", competitor: "Jumia Owns the Customer" },
            { label: "Payouts", vayva: "Secure Escrow Wallet", competitor: "Delayed Market Cycles" },
        ],
        cta: "Take Control of your Brand",
    }
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { competitor } = await params;
    const data = COMPETITOR_DATA[competitor] || COMPETITOR_DATA.shopify;
    const title = `Vayva vs ${data.name} | The #1 Shopify Alternative in Nigeria`;
    const description = `Why smart Nigerian merchants are switching from ${data.name} to Vayva. Save on fees, automate WhatsApp orders, and grow your local brand.`;

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

export default async function ComparisonPage({ params }: Props) {
    const { competitor } = await params;
    const data = COMPETITOR_DATA[competitor] || COMPETITOR_DATA.shopify;

    return (
        <div className="min-h-screen bg-white">
            <SchemaOrg type="SoftwareApplication" />
            <BreadcrumbSchema
                items={[
                    { name: "Home", item: SITE_ORIGIN },
                    { name: "Compare", item: `${SITE_ORIGIN}/vs` },
                    { name: `Vayva vs ${data.name}`, item: `${SITE_ORIGIN}/vs/${competitor}` }
                ]}
            />

            {/* Hero */}
            <section className="pt-24 pb-20 px-4 bg-blue-50/30">
                <div className="max-w-4xl mx-auto text-center">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 text-blue-600 text-xs font-bold uppercase mb-8">
                        Vayva vs {data.name}
                    </div>
                    <h1 className="text-5xl md:text-7xl font-bold text-[#0F172A] mb-8 leading-tight">
                        {data.headline}
                    </h1>
                    <p className="text-xl text-[#64748B] mb-10 max-w-3xl mx-auto leading-relaxed">
                        {data.sub}
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <Link href={`${APP_URL}/signup`}>
                            <Button className="bg-[#22C55E] hover:bg-[#16A34A] text-white px-10 py-6 rounded-2xl text-xl font-bold shadow-2xl transition-transform hover:scale-105 active:scale-95">
                                {data.cta}
                            </Button>
                        </Link>
                    </div>
                </div>
            </section>

            {/* Comparison Table */}
            <section className="py-24 px-4 overflow-x-auto">
                <div className="max-w-5xl mx-auto">
                    <h2 className="text-3xl font-bold text-center mb-16">Why Vayva is better for local business.</h2>

                    <div className="bg-white border border-gray-100 rounded-[32px] shadow-2xl overflow-hidden">
                        <table className="w-full text-left">
                            <thead className="bg-gray-50 border-b border-gray-100">
                                <tr>
                                    <th className="p-8 text-sm font-black uppercase tracking-widest text-gray-400">Feature</th>
                                    <th className="p-8 text-xl font-bold text-[#22C55E]">Vayva</th>
                                    <th className="p-8 text-xl font-bold text-gray-400">{data.name}</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-50">
                                {data.vs_points.map((point, i) => (
                                    <tr key={i} className="hover:bg-gray-50/50 transition-colors">
                                        <td className="p-8 font-bold text-gray-900">{point.label}</td>
                                        <td className="p-8">
                                            <div className="flex items-center gap-3">
                                                <Icon name="CheckCircle2" className="text-green-500" size={20} />
                                                <span className="font-medium">{point.vayva}</span>
                                            </div>
                                        </td>
                                        <td className="p-8 text-gray-500 italic">
                                            {point.competitor}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </section>

            {/* Local Slang Section */}
            <section className="py-24 px-4 bg-gray-50">
                <div className="max-w-4xl mx-auto text-center">
                    <h2 className="text-4xl font-bold mb-8">Integrated Logistics & "Waybills"</h2>
                    <p className="text-lg text-gray-600 mb-12">
                        Don't get stranded with delivery. Vayva handles the waybill generation and connects you
                        with local riders across Nigeria, ensuring your packages get to customers without the
                        manual coordination headache.
                    </p>
                    <div className="grid md:grid-cols-2 gap-8 text-left">
                        <div className="bg-white p-8 rounded-2xl shadow-sm">
                            <h3 className="font-bold text-lg mb-2">Escrow-style Trust</h3>
                            <p className="text-sm text-gray-500 leading-relaxed">
                                Our wallet system acts as a trust bridge (Escrow) between you and your customers,
                                ensuring payments are verified before you ship.
                            </p>
                        </div>
                        <div className="bg-white p-8 rounded-2xl shadow-sm">
                            <h3 className="font-bold text-lg mb-2">No More "Price in DM"</h3>
                            <p className="text-sm text-gray-500 leading-relaxed">
                                Automate your sales funnel. Customers get prices, check out, and receive receipts
                                instantly via WhatsApp without you lifting a finger.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* CTA */}
            <section className="py-32 px-4 text-center">
                <h2 className="text-5xl font-bold mb-8">Ready to switch to Africa's #1 AI Commerce?</h2>
                <Link href={`${APP_URL}/signup`}>
                    <Button className="bg-black text-white px-12 py-6 rounded-2xl text-xl font-bold">
                        Get Started for Free
                    </Button>
                </Link>
                <p className="mt-6 text-gray-400 font-medium">No credit card required. 7-day full access.</p>
            </section>
        </div>
    );
}
