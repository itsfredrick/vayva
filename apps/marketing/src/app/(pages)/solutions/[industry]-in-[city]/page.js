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
export default async function ProgrammaticLandingPage({ params }) {
    const { industry, city } = await params;
    const industryLabel = capitalize(industry);
    const cityLabel = capitalize(city);
    return (_jsxs("div", { className: "min-h-screen bg-white", children: [_jsx(SchemaOrg, { type: "SoftwareApplication" }), _jsx(BreadcrumbSchema, { items: [
                    { name: "Home", item: SITE_ORIGIN },
                    { name: "Solutions", item: `${SITE_ORIGIN}/solutions` },
                    { name: `${industryLabel} in ${cityLabel}`, item: `${SITE_ORIGIN}/solutions/${industry}-in-${city}` }
                ] }), _jsx("section", { className: "pt-24 pb-20 px-4 bg-gray-50/50", children: _jsxs("div", { className: "max-w-4xl mx-auto text-center", children: [_jsxs("div", { className: "inline-flex items-center gap-2 px-3 py-1 rounded-full bg-green-50 text-[#22C55E] text-xs font-bold uppercase mb-8", children: ["Empowering ", cityLabel, " Businesses"] }), _jsxs("h1", { className: "text-5xl md:text-7xl font-bold text-[#0F172A] mb-8 leading-tight", children: ["How ", industryLabel, " in ", _jsx("span", { className: "text-[#22C55E]", children: cityLabel }), " dominate on WhatsApp."] }), _jsxs("p", { className: "text-xl text-[#64748B] mb-10 max-w-3xl mx-auto leading-relaxed", children: ["Stop losing orders in chat bubbles. Vayva's AI helps ", industryLabel, " in ", cityLabel, "automate their sales, accept local payments, and manage deliveries\u2014all while you sleep."] }), _jsx("div", { className: "flex flex-col sm:flex-row gap-4 justify-center", children: _jsx(Link, { href: `${APP_URL}/signup`, children: _jsxs(Button, { className: "bg-[#22C55E] hover:bg-[#16A34A] text-white px-10 py-6 rounded-2xl text-xl font-bold shadow-2xl transition-transform hover:scale-105 active:scale-95", children: ["Start Selling in ", cityLabel] }) }) })] }) }), _jsx("section", { className: "py-24 px-4", children: _jsxs("div", { className: "max-w-6xl mx-auto grid md:grid-cols-2 gap-16 items-center", children: [_jsxs("div", { children: [_jsxs("h2", { className: "text-4xl font-bold text-[#0F172A] mb-8", children: ["Built for the ", cityLabel, " Reality."] }), _jsx("div", { className: "space-y-8", children: [
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
                                    ].map((benefit, i) => (_jsxs("div", { className: "flex gap-6", children: [_jsx("div", { className: "flex-shrink-0 w-12 h-12 bg-green-50 rounded-xl flex items-center justify-center text-[#22C55E]", children: _jsx(Icon, { name: "Check", size: 24 }) }), _jsxs("div", { children: [_jsx("h3", { className: "text-lg font-bold text-[#0F172A] mb-1", children: benefit.title }), _jsx("p", { className: "text-gray-500 text-sm", children: benefit.desc })] })] }, i))) })] }), _jsx("div", { className: "bg-gray-100 aspect-video rounded-3xl overflow-hidden border border-gray-200 shadow-xl flex items-center justify-center", children: _jsxs("span", { className: "text-gray-400 font-bold", children: ["Local Success in ", cityLabel] }) })] }) }), _jsx("section", { className: "py-20 px-4 bg-gray-900 text-white rounded-[40px] mx-4 mb-24", children: _jsxs("div", { className: "max-w-4xl mx-auto text-center", children: [_jsxs("h2", { className: "text-3xl font-bold mb-6", children: ["Nigeria's #1 Platform for ", industryLabel, "."] }), _jsx("p", { className: "text-gray-400 mb-10 text-lg", children: "Join thousands of modern vendors in Lagos, Abuja, Port Harcourt and beyond who are leaving the chaos of manual WhatsApp chat behind." }), _jsx(Link, { href: `${APP_URL}/signup`, children: _jsx(Button, { className: "bg-white text-black hover:bg-gray-100 px-8 py-4 rounded-xl font-bold", children: "Join the Commerce Revolution" }) })] }) })] }));
}
