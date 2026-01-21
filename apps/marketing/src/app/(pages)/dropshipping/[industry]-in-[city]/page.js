import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Button, Icon } from "@vayva/ui";
import Link from "next/link";
import { APP_URL } from "@/lib/constants";
import { SchemaOrg } from "@/components/seo/SchemaOrg";
import { BreadcrumbSchema } from "@/components/seo/BreadcrumbSchema";
import { SITE_ORIGIN } from "@/lib/seo/route-policy";
function capitalize(s) {
    return s.charAt(0).toUpperCase() + s.slice(1).replace(/-/g, " ");
}
export async function generateMetadata({ params }) {
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
export default async function DropshippingPage({ params }) {
    const { industry, city } = await params;
    const industryLabel = capitalize(industry);
    const cityLabel = capitalize(city);
    return (_jsxs("div", { className: "min-h-screen bg-white", children: [_jsx(SchemaOrg, { type: "SoftwareApplication" }), _jsx(BreadcrumbSchema, { items: [
                    { name: "Home", item: SITE_ORIGIN },
                    { name: "Dropshipping", item: `${SITE_ORIGIN}/dropshipping` },
                    { name: `${industryLabel} in ${cityLabel}`, item: `${SITE_ORIGIN}/dropshipping/${industry}-in-${city}` }
                ] }), _jsx("section", { className: "pt-24 pb-20 px-4 bg-orange-50/20", children: _jsxs("div", { className: "max-w-4xl mx-auto text-center", children: [_jsxs("div", { className: "inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-50 text-orange-600 text-xs font-bold uppercase mb-8", children: ["#1 Dropshipping Platform in ", cityLabel] }), _jsxs("h1", { className: "text-5xl md:text-7xl font-bold text-[#0F172A] mb-8 leading-tight", children: ["Dropship ", industryLabel, " in ", _jsx("span", { className: "text-orange-500", children: cityLabel }), "."] }), _jsx("p", { className: "text-xl text-[#64748B] mb-10 max-w-3xl mx-auto leading-relaxed", children: "The ultimate toolkit for Nigerian dropshippers. Connect with suppliers, automate your WhatsApp checkout, and handle city-wide \"Waybills\" without keeping inventory." }), _jsx("div", { className: "flex flex-col sm:flex-row gap-4 justify-center", children: _jsx(Link, { href: `${APP_URL}/signup`, children: _jsx(Button, { className: "bg-black text-white px-10 py-6 rounded-2xl text-xl font-bold shadow-2xl transition-transform hover:scale-105 active:scale-95", children: "Start Dropshipping Free" }) }) })] }) }), _jsx("section", { className: "py-24 px-4 bg-white", children: _jsxs("div", { className: "max-w-6xl mx-auto", children: [_jsxs("div", { className: "text-center mb-16", children: [_jsx("h2", { className: "text-4xl font-bold mb-4", children: "Everything you need to scale." }), _jsx("p", { className: "text-gray-500", children: "Built specifically for the African dropshipping model." })] }), _jsx("div", { className: "grid md:grid-cols-3 gap-8", children: [
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
                            ].map((feature, i) => (_jsxs("div", { className: "p-8 border border-gray-100 rounded-3xl hover:shadow-xl transition-all group", children: [_jsx("div", { className: "w-12 h-12 bg-orange-50 rounded-xl flex items-center justify-center text-orange-600 mb-6 group-hover:scale-110 transition-transform", children: _jsx(Icon, { name: feature.icon, size: 24 }) }), _jsx("h3", { className: "text-xl font-bold mb-3", children: feature.title }), _jsx("p", { className: "text-gray-500 text-sm leading-relaxed", children: feature.desc })] }, i))) })] }) }), _jsx("section", { className: "py-24 px-4 bg-gray-50 rounded-[60px] mx-4 mb-24 overflow-hidden", children: _jsxs("div", { className: "max-w-6xl mx-auto grid lg:grid-cols-2 gap-16 items-center", children: [_jsxs("div", { className: "relative", children: [_jsx("div", { className: "absolute -inset-4 bg-orange-200 rounded-full blur-3xl opacity-20" }), _jsxs("div", { className: "relative p-12 bg-white rounded-[40px] shadow-2xl border border-orange-100", children: [_jsx("h3", { className: "text-2xl font-bold mb-4 italic text-orange-600", children: "\"Waybill\" Ready" }), _jsxs("p", { className: "text-gray-600 font-medium", children: ["Selling to customers in ", cityLabel, "? Vayva generates ready-to-print waybills and lets you book riders from major logistics hubs instantly."] })] })] }), _jsxs("div", { children: [_jsxs("h2", { className: "text-4xl font-bold mb-8 leading-tight", children: ["Fast delivery across ", cityLabel, "."] }), _jsxs("p", { className: "text-lg text-gray-500 mb-10", children: ["Nigerian dropshipping depends on logistics speed. Vayva is the only platform that treats \"Waybilling\" as a first-class citizen, ensuring your customers get their ", industryLabel, " within 24-48 hours."] }), _jsx(Link, { href: `${APP_URL}/signup`, children: _jsxs(Button, { className: "bg-orange-500 hover:bg-orange-600 text-white px-8 py-4 rounded-xl font-bold", children: ["Setup your ", cityLabel, " Store"] }) })] })] }) }), _jsx("section", { className: "py-24 px-4 text-center", children: _jsxs("div", { className: "max-w-3xl mx-auto", children: [_jsx(Icon, { name: "Quote", size: 48, className: "text-orange-100 mb-8 mx-auto" }), _jsx("h2", { className: "text-3xl font-bold mb-6 italic leading-relaxed", children: "\"Switching my dropshipping business to Vayva saved me from the manual chaos of Lagos traffic and incessant 'Price in DM' questions.\"" }), _jsxs("div", { className: "font-bold text-gray-400 uppercase tracking-widest text-sm", children: ["\u2014 Top Fashion Vendor, ", cityLabel] })] }) })] }));
}
