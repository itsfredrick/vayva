import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { metadataFor, jsonLdFor } from "@/lib/seo/seo-engine";
import { COMPETITORS } from "@/lib/seo/comparisons";
import { PremiumButton } from "@/components/marketing/PremiumButton";
import * as motion from "framer-motion/client";
/**
 * 1. SHOPIFY ATTACK METADATA
 * Using consolidated engine to ensure canonical and robots consistency.
 */
export async function generateMetadata({ params, }) {
    const { competitor } = await params;
    const data = COMPETITORS[competitor];
    if (!data)
        return {};
    return metadataFor(`/compare/${competitor}`, {
        compareTitle: data.title,
        pageDescription: data.description,
    });
}
export function generateStaticParams() {
    return Object.keys(COMPETITORS).map((competitor) => ({
        competitor,
    }));
}
export default async function ComparisonPage({ params }) {
    const { competitor } = await params;
    const data = COMPETITORS[competitor];
    if (!data) {
        notFound();
    }
    const jsonLd = jsonLdFor(`/compare/${competitor}`, {
        faqs: data.faqs,
    });
    return (_jsxs("div", { className: "bg-white min-h-screen relative overflow-hidden", children: [_jsxs("div", { className: "absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0", children: [_jsx("div", { className: "absolute top-[-5%] right-[-5%] w-[40%] h-[40%] bg-blue-50 rounded-full blur-[120px] opacity-60 animate-pulse" }), _jsx("div", { className: "absolute bottom-[20%] left-[-10%] w-[35%] h-[35%] bg-green-50 rounded-full blur-[100px] opacity-40 animate-pulse delay-1000" })] }), jsonLd && (_jsx("script", { type: "application/ld+json", dangerouslySetInnerHTML: { __html: JSON.stringify(jsonLd) } })), _jsxs("div", { className: "max-w-4xl mx-auto py-32 px-4 sm:px-6 lg:px-8 relative z-10", children: [_jsxs(motion.div, { initial: { opacity: 0, y: 20 }, animate: { opacity: 1, y: 0 }, className: "text-center mb-16", children: [_jsx("div", { className: "inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-100 text-slate-600 text-[10px] font-black uppercase tracking-widest mb-6 border border-slate-200", children: "Competitor Comparison" }), _jsx("h1", { className: "text-5xl md:text-7xl font-bold text-[#0F172A] mb-8 tracking-tight leading-[1.1]", children: data.heroHeading })] }), _jsxs(motion.section, { initial: { opacity: 0, y: 20 }, whileInView: { opacity: 1, y: 0 }, viewport: { once: true }, className: "mb-16", children: [_jsx("h2", { className: "text-2xl font-bold text-[#0F172A] mb-8 tracking-tight", children: "Who Vayva is for" }), _jsx("div", { className: "grid grid-cols-1 md:grid-cols-3 gap-4", children: [
                                    "Nigerian merchants scaling beyond social media.",
                                    "Businesses needing native Naira (NGN) stability.",
                                    "Operations relying on WhatsApp for conversions."
                                ].map((text, i) => (_jsxs("div", { className: "p-6 bg-gray-50/50 rounded-2xl border border-gray-100 group hover:bg-white hover:shadow-lg transition-all", children: [_jsx("div", { className: "w-8 h-8 rounded-full bg-green-50 flex items-center justify-center text-[#22C55E] mb-4 group-hover:scale-110 transition-transform", children: _jsx("svg", { className: "w-4 h-4", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", children: _jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 3, d: "M5 13l4 4L19 7" }) }) }), _jsx("p", { className: "text-sm font-medium text-[#475569] leading-relaxed", children: text })] }, i))) })] }), _jsxs(motion.div, { initial: { opacity: 0, y: 30 }, whileInView: { opacity: 1, y: 0 }, viewport: { once: true }, className: "bg-white/80 backdrop-blur-md border border-gray-100 p-8 lg:p-12 rounded-[40px] mb-20 shadow-[0_32px_64px_-16px_rgba(0,0,0,0.05)]", children: [_jsxs("div", { className: "flex items-center gap-4 mb-6", children: [_jsx("div", { className: "w-2 h-8 bg-[#22C55E] rounded-full" }), _jsx("h3", { className: "text-2xl font-bold text-[#0F172A] tracking-tight", children: "The Honest Verdict" })] }), _jsx("p", { className: "text-lg text-[#64748B] leading-relaxed mb-10", children: data.verdict }), _jsx("div", { className: "overflow-hidden border border-gray-100 rounded-[24px] bg-white shadow-sm", children: _jsxs("table", { className: "w-full text-left", children: [_jsx("thead", { className: "bg-gray-50 border-b border-gray-100", children: _jsxs("tr", { children: [_jsx("th", { className: "py-4 px-6 text-xs font-black text-[#64748B] uppercase tracking-wider", children: "Feature" }), _jsx("th", { className: "py-4 px-6 text-xs font-black text-[#22C55E] uppercase tracking-wider", children: "Vayva" }), _jsx("th", { className: "py-4 px-6 text-xs font-black text-[#64748B] uppercase tracking-wider", children: data.name })] }) }), _jsx("tbody", { className: "divide-y divide-gray-50", children: data.featureComparison.map((row, i) => (_jsxs("tr", { className: "group", children: [_jsx("td", { className: "py-5 px-6 text-sm font-bold text-[#0F172A]", children: row.feature }), _jsx("td", { className: "py-5 px-6 text-sm font-medium text-[#22C55E] bg-green-50/20 group-hover:bg-green-50/40 transition-colors border-x border-green-50/50", children: row.vayva }), _jsx("td", { className: "py-5 px-6 text-sm text-[#94A3B8]", children: row.competitor })] }, i))) })] }) })] }), _jsxs("section", { className: "mb-32", children: [_jsx("h2", { className: "text-4xl font-bold text-[#0F172A] mb-12 tracking-tight text-center", children: "Why Vayva wins in Nigeria." }), _jsx("div", { className: "space-y-12", children: [
                                    {
                                        title: "Native NGN Payments",
                                        desc: "Stop worrying about USD fluctuations. Vayva handles everything in Naira natively via Paystack and Flutterwave, with no platform transaction fees.",
                                        visual: "NGN",
                                        align: "left"
                                    },
                                    {
                                        title: "WhatsApp Order Mastery",
                                        desc: "Every order on Vayva can trigger an automated WhatsApp confirmation. Keep customers in the app they actually use.",
                                        visual: "WA",
                                        align: "right"
                                    }
                                ].map((item, i) => (_jsxs(motion.div, { initial: { opacity: 0, scale: 0.95 }, whileInView: { opacity: 1, scale: 1 }, viewport: { once: true }, className: `flex flex-col ${item.align === "left" ? "md:flex-row" : "md:flex-row-reverse"} gap-8 items-center bg-gray-50/50 p-8 rounded-[40px] border border-gray-100`, children: [_jsxs("div", { className: "flex-1", children: [_jsx("h3", { className: "text-2xl font-bold mb-4 text-[#0F172A] tracking-tight", children: item.title }), _jsx("p", { className: "text-[#64748B] leading-relaxed", children: item.desc })] }), _jsxs("div", { className: "w-full md:w-1/3 aspect-video bg-white rounded-3xl flex items-center justify-center text-[10px] font-black uppercase tracking-[0.2em] text-[#CBD5E1] shadow-inner", children: [item.visual, " Visual"] })] }, i))) })] }), _jsxs(motion.section, { initial: { opacity: 0, y: 30 }, whileInView: { opacity: 1, y: 0 }, viewport: { once: true }, className: "mb-32 p-12 lg:p-16 bg-slate-900 text-white rounded-[48px] relative overflow-hidden", children: [_jsx("div", { className: "absolute top-0 right-0 w-64 h-64 bg-[#22C55E] blur-[120px] opacity-10" }), _jsxs("div", { className: "relative z-10 text-center", children: [_jsxs("h2", { className: "text-4xl md:text-5xl font-bold mb-6 tracking-tight", children: ["Moving from ", data.name, "?"] }), _jsx("p", { className: "text-slate-400 mb-10 text-xl font-medium max-w-2xl mx-auto", children: "We help you migrate your products and customers in under 10 minutes. No downtime, no lost data." }), _jsx(Link, { href: "/contact", children: _jsx(PremiumButton, { className: "px-12 py-6 text-lg rounded-[20px]", children: "Get Migration Help" }) })] })] }), _jsxs("section", { className: "mb-32", children: [_jsx("h2", { className: "text-4xl font-bold text-[#0F172A] mb-12 tracking-tight text-center", children: "Frequently Asked Questions" }), _jsx("div", { className: "grid md:grid-cols-2 gap-6", children: data.faqs.map((faq, i) => (_jsxs(motion.div, { initial: { opacity: 0, y: 20 }, whileInView: { opacity: 1, y: 0 }, viewport: { once: true }, className: "p-8 bg-white border border-gray-100 rounded-[32px] shadow-sm hover:shadow-xl transition-all", children: [_jsx("h3", { className: "text-lg font-bold text-[#0F172A] mb-4", children: faq.question }), _jsx("p", { className: "text-sm text-[#64748B] leading-relaxed", children: faq.answer })] }, i))) })] }), _jsx("section", { className: "border-t border-gray-100 pt-24", children: _jsx("div", { className: "grid grid-cols-1 md:grid-cols-3 gap-6", children: [
                                { title: "Ready to Build?", desc: "Choose a template and launch today.", link: "/templates", label: "Browse Templates" },
                                { title: "Pricing Plans", desc: "NGN pricing designed for Nigerian growth.", link: "/pricing", label: "See Pricing" },
                                { title: "Marketplace", desc: "Join 5,000+ verified African sellers.", link: "/market/categories", label: "Explore Market" }
                            ].map((item, i) => (_jsxs("div", { className: "p-8 bg-gray-50/50 rounded-[32px] border border-gray-100 flex flex-col items-start gap-4 hover:bg-white hover:shadow-lg transition-all group", children: [_jsx("h4", { className: "font-bold text-[#0F172A]", children: item.title }), _jsx("p", { className: "text-sm text-[#64748B] mb-2 leading-relaxed", children: item.desc }), _jsxs(Link, { href: item.link, className: "text-[#22C55E] font-black text-xs uppercase tracking-widest hover:underline flex items-center gap-2", children: [item.label, " ", _jsx(ArrowRight, { size: 14, className: "group-hover:translate-x-1 transition-transform" })] })] }, i))) }) })] })] }));
}
