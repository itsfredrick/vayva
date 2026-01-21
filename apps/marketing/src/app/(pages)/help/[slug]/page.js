"use client";
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { getArticleBySlug } from "@/lib/help";
import { Button } from "@vayva/ui";
export default function HelpArticlePage() {
    const params = useParams();
    const router = useRouter();
    const slug = params?.slug;
    const article = getArticleBySlug(slug);
    if (!article) {
        return (_jsx("div", { className: "min-h-screen flex items-center justify-center p-4", children: _jsxs("div", { className: "text-center", children: [_jsx("h1", { className: "text-2xl font-bold text-gray-900 mb-4", children: "Article not found" }), _jsx(Link, { href: "/help", children: _jsx(Button, { children: "Back to Help Center" }) })] }) }));
    }
    return (_jsx("div", { className: "min-h-screen bg-white pt-32 pb-24 px-4", children: _jsxs("div", { className: "max-w-3xl mx-auto", children: [_jsxs("nav", { className: "mb-8 flex items-center gap-2 text-sm text-gray-400 font-medium", children: [_jsx(Link, { href: "/help", className: "hover:text-gray-900 transition-colors", children: "Help Center" }), _jsx("span", { children: "/" }), _jsx("span", { className: "text-gray-900", children: article.category })] }), _jsxs("article", { className: "prose prose-slate prose-lg max-w-none", children: [_jsx("span", { className: "inline-block px-3 py-1 rounded-full bg-green-50 text-[#22C55E] text-[10px] font-black uppercase mb-4 tracking-widest", children: article.category }), _jsx("h1", { className: "text-4xl md:text-5xl font-black text-[#0F172A] mb-4 leading-tight", children: article.title }), _jsx("p", { className: "text-xl text-gray-500 mb-12 font-medium leading-relaxed", children: article.summary }), _jsx("div", { className: "p-8 bg-gray-50 rounded-3xl border border-gray-100 text-gray-700 leading-relaxed space-y-6", children: article.content.split("\n").map((line, i) => {
                                if (line.trim().startsWith("###")) {
                                    return (_jsx("h3", { className: "text-2xl font-bold text-gray-900 mt-8 mb-4", children: line.replace("###", "").trim() }, i));
                                }
                                if (line.trim().startsWith("1.") || line.trim().startsWith("-")) {
                                    return (_jsx("li", { className: "ml-4 mb-2", children: line
                                            .trim()
                                            .replace(/^[0-9\.-]+/, "")
                                            .trim() }, i));
                                }
                                if (line.trim() === "")
                                    return null;
                                return _jsx("p", { children: line.trim() }, i);
                            }) })] }), _jsxs("div", { className: "mt-16 pt-12 border-t border-gray-100 flex flex-col md:flex-row items-center justify-between gap-8", children: [_jsxs("div", { className: "text-sm text-gray-400", children: ["Last updated: ", _jsx("strong", { children: article.lastUpdated })] }), _jsxs("div", { className: "flex items-center gap-4", children: [_jsx("span", { className: "text-sm font-bold text-gray-900", children: "Was this helpful?" }), _jsxs("div", { className: "flex gap-2", children: [_jsx(Button, { className: "px-4 py-2 rounded-lg border border-gray-200 hover:bg-green-50 hover:border-green-200 hover:text-green-600 transition-all text-sm font-bold", children: "Yes" }), _jsx(Button, { className: "px-4 py-2 rounded-lg border border-gray-200 hover:bg-red-50 hover:border-red-200 hover:text-red-600 transition-all text-sm font-bold", children: "No" })] })] })] }), _jsxs("div", { className: "mt-24 p-8 bg-green-50 rounded-3xl border border-green-100 flex flex-col md:flex-row items-center justify-between gap-6", children: [_jsxs("div", { children: [_jsx("h4", { className: "font-bold text-green-900", children: "Still Stuck?" }), _jsx("p", { className: "text-sm text-green-700", children: "Get in touch with an expert who can walk you through it." })] }), _jsx("a", { href: "mailto:support@vayva.ng", className: "px-6 py-3 bg-[#22C55E] text-white font-bold rounded-xl shadow-lg transition-all hover:scale-105", children: "Talk to Support" })] })] }) }));
}
