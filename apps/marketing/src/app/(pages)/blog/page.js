import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@vayva/ui";
import { ArrowRight, Calendar, User, Tag } from "lucide-react";
import { APP_URL } from "@/lib/constants";
export const metadata = {
    title: "Blog | Vayva - Business Growth & WhatsApp Tips",
    description: "Expert advice, success stories, and updates for Nigerian businesses running on WhatsApp.",
};
const POSTS = [
    {
        id: 1,
        title: "How to Automate WhatsApp Sales Without Losing the Personal Touch",
        excerpt: "Automation doesn't have to feel robotic. Learn how successful Nigerian brands use Vayva's AI to handle inquiries 24/7 while keeping customers happy and engaged with personalized responses.",
        category: "Guides",
        author: "Tola Adesina",
        authorImage: "https://randomuser.me/api/portraits/women/44.jpg",
        date: "Dec 28, 2025",
        image: "/images/step-1-whatsapp.png",
        slug: "automate-whatsapp-sales",
    },
    {
        id: 2,
        title: "5 Nigerian Brands That Scaled to ₦10M/Month on WhatsApp",
        excerpt: "From fashion to food, see how these local businesses transformed their chaotic WhatsApp DMs into streamlined sales channels. Case studies included.",
        category: "Success Stories",
        author: "Chidi Nwafor",
        authorImage: "https://randomuser.me/api/portraits/men/32.jpg",
        date: "Dec 20, 2025",
        image: "/images/calm-solution.jpg",
        slug: "nigerian-brands-scale",
    },
    {
        id: 3,
        title: "Understanding the New CBN KYC Requirements for Online Sellers",
        excerpt: "Confused by the latest banking regulations? We break down exactly what online vendors need to know to keep their business accounts compliant in 2026.",
        category: "Regulation",
        author: "Sarah Okonjo",
        authorImage: "https://randomuser.me/api/portraits/women/68.jpg",
        date: "Dec 15, 2025",
        image: "/images/chaos-problem.jpg",
        slug: "cbn-kyc-requirements",
    },
    {
        id: 4,
        title: "The Ultimate Guide to Inventory Management for IG vendors",
        excerpt: "Stop overselling and disappointing customers. Discover simple strategies to track stock levels across Instagram, WhatsApp, and your physical store.",
        category: "Operations",
        author: "David Ibrahim",
        authorImage: "https://randomuser.me/api/portraits/men/86.jpg",
        date: "Dec 10, 2025",
        image: "/images/mobile-showcase.png",
        slug: "inventory-management-guide",
    },
];
export default function BlogPage() {
    return (_jsxs("div", { className: "min-h-screen bg-white", children: [_jsx("section", { className: "bg-gray-50 py-20 px-4 border-b border-gray-100", children: _jsxs("div", { className: "max-w-4xl mx-auto text-center", children: [_jsx("h1", { className: "text-4xl md:text-5xl font-bold text-gray-900 mb-6", children: "The Vayva Blog" }), _jsx("p", { className: "text-xl text-gray-600 max-w-2xl mx-auto", children: "Insights, updates, and strategies to help you build a better business on WhatsApp." })] }) }), _jsx("section", { className: "py-16 px-4", children: _jsxs("div", { className: "max-w-6xl mx-auto", children: [_jsxs("div", { className: "grid md:grid-cols-2 gap-12 items-center mb-24", children: [_jsx("div", { className: "relative aspect-video bg-gray-200 rounded-3xl overflow-hidden shadow-lg border border-gray-100", children: _jsx("div", { className: "absolute inset-0 flex items-center justify-center bg-gray-100 text-gray-400", children: _jsx("span", { className: "font-bold", children: "Featured Image" }) }) }), _jsxs("div", { children: [_jsxs("div", { className: "flex items-center gap-4 text-sm mb-4", children: [_jsx("span", { className: "bg-[#22C55E]/10 text-[#22C55E] px-3 py-1 rounded-full font-bold uppercase tracking-wide", children: "Product Update" }), _jsxs("span", { className: "text-gray-500 flex items-center gap-1", children: [_jsx(Calendar, { size: 14 }), " Jan 2, 2026"] })] }), _jsx("h2", { className: "text-3xl md:text-4xl font-bold text-gray-900 mb-6 leading-tight", children: "Introducing Vayva AI: Your 24/7 Sales Assistant" }), _jsx("p", { className: "text-gray-600 text-lg mb-8 leading-relaxed", children: "We've rebuilt our core engine to understand Nigerian slang, handle complex orders, and automatically reconcile payments. See what's new in v2.0." }), _jsx(Link, { href: `${APP_URL}/signup`, children: _jsx(Button, { className: "bg-gray-900 text-white px-6 py-3 rounded-xl hover:bg-black transition-all", children: "Read the Announcement" }) })] })] }), _jsx("div", { className: "grid md:grid-cols-2 lg:grid-cols-3 gap-8", children: POSTS.map((post) => (_jsxs("article", { className: "group flex flex-col bg-white border border-gray-100 rounded-2xl overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-1", children: [_jsx("div", { className: "aspect-[1.6] bg-gray-100 relative overflow-hidden", children: _jsxs("div", { className: "absolute inset-0 bg-gray-100 flex items-center justify-center text-gray-400 text-sm font-medium group-hover:bg-gray-200 transition-colors", children: [post.category, " Image"] }) }), _jsxs("div", { className: "p-6 flex flex-col flex-1", children: [_jsxs("div", { className: "flex items-center justify-between text-xs text-gray-500 mb-4 font-medium uppercase tracking-wide", children: [_jsxs("div", { className: "flex items-center gap-1.5 text-[#22C55E]", children: [_jsx(Tag, { size: 12 }), post.category] }), _jsx("span", { children: post.date })] }), _jsx("h3", { className: "text-xl font-bold text-gray-900 mb-3 group-hover:text-[#22C55E] transition-colors leading-tight", children: post.title }), _jsx("p", { className: "text-gray-600 text-sm leading-relaxed mb-6 flex-1", children: post.excerpt }), _jsxs("div", { className: "flex items-center justify-between mt-auto pt-6 border-t border-gray-50", children: [_jsxs("div", { className: "flex items-center gap-2", children: [post.authorImage ? (_jsx("div", { className: "w-8 h-8 rounded-full overflow-hidden border border-gray-100", children: _jsx(Image, { src: post.authorImage, alt: post.author, width: 32, height: 32, className: "w-full h-full object-cover", unoptimized: true }) })) : (_jsx("div", { className: "w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center text-gray-400", children: _jsx(User, { size: 14 }) })), _jsx("span", { className: "text-xs font-bold text-gray-900", children: post.author })] }), _jsxs("span", { className: "text-[#22C55E] text-sm font-bold flex items-center gap-1 group-hover:translate-x-1 transition-transform", children: ["Read", _jsx(ArrowRight, { size: 16 })] })] })] })] }, post.id))) })] }) }), _jsx("section", { className: "py-24 px-4 bg-[#0F172A] text-white", children: _jsxs("div", { className: "max-w-4xl mx-auto text-center", children: [_jsx("h2", { className: "text-3xl font-bold mb-6", children: "Get business tips delivered to your WhatsApp" }), _jsx("p", { className: "text-gray-400 mb-8 text-lg", children: "Join 5,000+ merchants receiving weekly growth strategies." }), _jsxs("div", { className: "flex flex-col sm:flex-row gap-4 justify-center max-w-md mx-auto", children: [_jsx("input", { type: "email", placeholder: "Enter your email address", className: "bg-white/10 border border-white/20 rounded-xl px-5 py-3 text-white placeholder:text-gray-500 focus:outline-none focus:border-[#22C55E] flex-1" }), _jsx(Button, { className: "bg-[#22C55E] hover:bg-[#16A34A] text-white rounded-xl px-8", children: "Subscribe" })] })] }) })] }));
}
