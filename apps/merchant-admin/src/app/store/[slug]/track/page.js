"use client";
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import React from "react";
import { StoreShell } from "@/components/storefront/store-shell";
import { Button, Icon } from "@vayva/ui";
export default function TrackOrderPage({ params, }) {
    const { slug } = React.use(params);
    return (_jsx(StoreShell, { slug: slug, children: _jsxs("div", { className: "max-w-2xl mx-auto px-4 py-16", children: [_jsxs("div", { className: "text-center mb-8", children: [_jsx("h1", { className: "text-3xl font-bold text-white mb-2", children: "Track Your Order" }), _jsx("p", { className: "text-text-secondary", children: "Enter your order ID and phone number to see the status." })] }), _jsx("div", { className: "bg-white/5 rounded-2xl border border-white/5 p-8 mb-8", children: _jsxs("form", { className: "space-y-4", children: [_jsxs("div", { children: [_jsx("label", { className: "text-xs text-text-secondary uppercase font-bold tracking-wider mb-2 block", children: "Order Reference" }), _jsx("input", { className: "w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-primary placeholder:text-text-secondary/50", placeholder: "e.g. VV-12345" })] }), _jsxs("div", { children: [_jsx("label", { className: "text-xs text-text-secondary uppercase font-bold tracking-wider mb-2 block", children: "Phone Number" }), _jsx("input", { className: "w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-primary placeholder:text-text-secondary/50", placeholder: "+234..." })] }), _jsx(Button, { className: "w-full h-12 rounded-full bg-primary text-black hover:bg-primary/90 font-bold", children: "Find Order" })] }) }), _jsxs("div", { className: "border border-white/10 rounded-2xl p-6 bg-[#0b141a]", children: [_jsxs("div", { className: "flex justify-between items-start mb-6", children: [_jsxs("div", { children: [_jsx("h3", { className: "font-bold text-white text-lg", children: "Order #VV-90123" }), _jsx("p", { className: "text-sm text-text-secondary", children: "Placed on Dec 14, 2025" })] }), _jsx("span", { className: "px-3 py-1 rounded-full bg-blue-500/20 text-blue-400 text-xs font-bold uppercase tracking-wider", children: "Out for Delivery" })] }), _jsx("div", { className: "relative pl-6 border-l-2 border-white/10 space-y-8 my-8", children: [
                                {
                                    title: "Out for Delivery",
                                    time: "Today, 8:30 AM",
                                    active: true,
                                },
                                {
                                    title: "Arrived at Lagos Hub",
                                    time: "Yesterday, 6:00 PM",
                                    active: false,
                                },
                                {
                                    title: "Order Confirmed",
                                    time: "Dec 14, 10:00 AM",
                                    active: false,
                                },
                            ].map((event, i) => (_jsxs("div", { className: "relative", children: [_jsx("div", { className: `absolute -left-[29px] top-1 w-3 h-3 rounded-full border-2 ${event.active ? "bg-primary border-primary" : "bg-[#0b141a] border-white/30"}` }), _jsx("div", { className: `font-bold ${event.active ? "text-white" : "text-text-secondary"}`, children: event.title }), _jsx("div", { className: "text-xs text-text-secondary", children: event.time })] }, i))) }), _jsx("div", { className: "mt-8 text-center text-sm text-gray-500", children: _jsxs("p", { className: "flex items-center justify-center gap-2", children: [_jsx(Icon, { name: "HelpCircle", size: 16 }), "Need help with this order?", " ", _jsx("a", { href: "#", className: "underline", children: "Contact Support" })] }) })] })] }) }));
}
