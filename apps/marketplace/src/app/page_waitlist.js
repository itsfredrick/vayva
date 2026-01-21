"use client";
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from "react";
import NextLink from "next/link";
const Link = NextLink;
import { ShoppingBag as ShoppingBagIcon, ArrowRight as ArrowRightIcon, Zap as ZapIcon, Loader2 as Loader2Icon, CheckCircle as CheckCircleIcon, } from "lucide-react";
import { Button } from "@vayva/ui";
const ShoppingBag = ShoppingBagIcon;
const ArrowRight = ArrowRightIcon;
const Zap = ZapIcon;
const Loader2 = Loader2Icon;
const CheckCircle = CheckCircleIcon;
export default function MarketplaceHome() {
    const [email, setEmail] = useState("");
    const [phone, setPhone] = useState("");
    const [interest, setInterest] = useState("buying");
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const res = await fetch("/api/waitlist", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, phone, interest }),
            });
            if (res.ok) {
                setSuccess(true);
            }
        }
        catch (err) {
            console.error(err);
        }
        finally {
            setLoading(false);
        }
    };
    return (_jsxs("div", { className: "min-h-screen bg-white text-black font-sans selection:bg-black selection:text-white flex flex-col", children: [_jsxs("header", { className: "flex items-center justify-between px-6 py-6 max-w-7xl mx-auto w-full", children: [_jsxs("div", { className: "flex items-center gap-2 font-bold text-xl tracking-tight", children: [_jsx("div", { className: "w-8 h-8 bg-black rounded-lg flex items-center justify-center text-white", children: _jsx(ShoppingBag, { size: 18 }) }), "Vayva Market"] }), _jsxs(Link, { href: "/", className: "text-sm font-medium hover:opacity-70 transition-opacity flex items-center gap-1", children: ["Back to Vayva ", _jsx(ArrowRight, { size: 14 })] })] }), _jsxs("main", { className: "flex-1 flex flex-col items-center justify-center px-4 py-12 md:py-20 text-center max-w-4xl mx-auto w-full", children: [_jsxs("div", { className: "mb-6 inline-flex items-center gap-2 px-3 py-1 bg-gray-100 rounded-full text-xs font-semibold uppercase tracking-wider text-gray-600", children: [_jsx("span", { className: "w-2 h-2 rounded-full bg-black animate-pulse" }), "Coming Soon"] }), _jsxs("h1", { className: "text-4xl md:text-6xl font-bold tracking-tight mb-6 leading-[1.1]", children: ["The Marketplace ", _jsx("br", { className: "hidden md:block" }), " Built for AI Commerce."] }), _jsx("p", { className: "text-lg md:text-xl text-gray-500 max-w-2xl mb-12 leading-relaxed", children: "Sell faster with Vayva. Experience a Jiji-style marketplace powered by automated AI agents that handle inquiries, negotiations, and sales for you 24/7." }), _jsxs("div", { className: "grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-3xl mb-16 text-left", children: [_jsxs("div", { className: "p-6 bg-gray-50 rounded-2xl border border-gray-100", children: [_jsx("div", { className: "w-10 h-10 bg-white rounded-lg border border-gray-200 flex items-center justify-center mb-4 shadow-sm", children: _jsx(Zap, { size: 20 }) }), _jsx("h3", { className: "font-bold mb-2", children: "AI Negotiations" }), _jsx("p", { className: "text-sm text-gray-500", children: "Our agents handle price haggling and Q&A so you don't have to." })] }), _jsxs("div", { className: "p-6 bg-gray-50 rounded-2xl border border-gray-100", children: [_jsx("div", { className: "w-10 h-10 bg-white rounded-lg border border-gray-200 flex items-center justify-center mb-4 shadow-sm", children: _jsx(ShoppingBag, { size: 20 }) }), _jsx("h3", { className: "font-bold mb-2", children: "Unified Inventory" }), _jsx("p", { className: "text-sm text-gray-500", children: "Sync products from your Vayva Storefront instantly." })] }), _jsxs("div", { className: "p-6 bg-gray-50 rounded-2xl border border-gray-100", children: [_jsx("div", { className: "w-10 h-10 bg-white rounded-lg border border-gray-200 flex items-center justify-center mb-4 shadow-sm", children: _jsx(CheckCircle, { size: 20 }) }), _jsx("h3", { className: "font-bold mb-2", children: "Verified Trust" }), _jsx("p", { className: "text-sm text-gray-500", children: "KYC-verified merchants and secure escrow payments." })] })] }), _jsx("div", { className: "w-full max-w-md bg-white border border-gray-200 rounded-2xl p-6 md:p-8 shadow-xl shadow-gray-100", children: success ? (_jsxs("div", { className: "text-center py-10", children: [_jsx("div", { className: "mx-auto w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mb-4", children: _jsx(CheckCircle, { size: 32 }) }), _jsx("h3", { className: "text-2xl font-bold mb-2", children: "You're on the list!" }), _jsx("p", { className: "text-gray-500 mb-6", children: "We'll notify you as soon as early access opens." }), _jsx(Link, { href: "/", children: _jsx(Button, { className: "w-full py-3 font-bold rounded-lg", children: "Return to Vayva" }) })] })) : (_jsxs("form", { onSubmit: handleSubmit, className: "text-left space-y-4", children: [_jsx("h3", { className: "text-xl font-bold mb-1", children: "Join the Waitlist" }), _jsx("p", { className: "text-sm text-gray-500 mb-4", children: "Be the first to know when we launch." }), _jsxs("div", { children: [_jsx("label", { className: "block text-xs font-bold uppercase text-gray-500 mb-1", children: "Email Address" }), _jsx("input", { type: "email", required: true, className: "w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent transition-all", placeholder: "you@example.com", value: email, onChange: (e) => setEmail(e.target.value) })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-xs font-bold uppercase text-gray-500 mb-1", children: "Phone Number" }), _jsx("input", { type: "tel", required: true, className: "w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent transition-all", placeholder: "+234...", value: phone, onChange: (e) => setPhone(e.target.value) })] }), _jsxs("div", { children: [_jsx("label", { htmlFor: "interest", className: "block text-xs font-bold uppercase text-gray-500 mb-1", children: "I am interested in" }), _jsxs("select", { id: "interest", className: "w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent transition-all", value: interest, onChange: (e) => setInterest(e.target.value), children: [_jsx("option", { value: "buying", children: "Buying Products" }), _jsx("option", { value: "selling", children: "Selling Products" }), _jsx("option", { value: "both", children: "Both" })] })] }), _jsxs(Button, { type: "submit", disabled: loading, className: "w-full py-3 font-bold rounded-lg flex items-center justify-center gap-2 mt-2", children: [loading && _jsx(Loader2, { size: 16, className: "animate-spin" }), loading ? "Joining..." : "Join Waitlist"] })] })) })] }), _jsx("footer", { className: "py-8 text-center text-sm text-gray-400 border-t border-gray-100 w-full", children: _jsxs("div", { className: "max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-4", children: [_jsxs("p", { children: ["\u00A9 ", new Date().getFullYear(), " Vayva. All rights reserved."] }), _jsxs("div", { className: "flex gap-6", children: [_jsx(Link, { href: "/legal/privacy", className: "hover:text-black transition-colors", children: "Privacy Policy" }), _jsx(Link, { href: "/legal/terms", className: "hover:text-black transition-colors", children: "Terms of Service" })] })] }) })] }));
}
