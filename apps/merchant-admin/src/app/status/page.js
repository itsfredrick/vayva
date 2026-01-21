"use client";
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useEffect } from "react";
import { HeartPulse, CheckCircle2, AlertTriangle, XCircle, RefreshCw, Clock, } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@vayva/ui";
import Link from "next/link";
export default function PublicStatusPage() {
    const [health, setHealth] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    useEffect(() => {
        fetchHealth();
    }, []);
    const fetchHealth = async () => {
        try {
            setIsLoading(true);
            const res = await fetch("/api/public/status");
            const data = await res.json();
            setHealth(data.health);
        }
        catch (error) {
            console.error("Failed to fetch public status");
        }
        finally {
            setIsLoading(false);
        }
    };
    const StatusIndicator = ({ status }) => {
        switch (status) {
            case "OK":
                return (_jsxs("span", { className: "text-green-500 font-bold flex items-center gap-1", children: [_jsx(CheckCircle2, { className: "w-4 h-4" }), " Operational"] }));
            case "WARNING":
                return (_jsxs("span", { className: "text-amber-500 font-bold flex items-center gap-1", children: [_jsx(AlertTriangle, { className: "w-4 h-4" }), " Degraded Performance"] }));
            case "FAIL":
                return (_jsxs("span", { className: "text-red-500 font-bold flex items-center gap-1", children: [_jsx(XCircle, { className: "w-4 h-4" }), " Service Outage"] }));
            default:
                return _jsx("span", { className: "text-slate-400 font-bold", children: "Checking..." });
        }
    };
    const isPlatformDown = health && Object.values(health).some((v) => v.status === "FAIL");
    return (_jsx("div", { className: "min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col items-center p-6 md:p-12", children: _jsxs("div", { className: "max-w-2xl w-full space-y-12", children: [_jsxs("div", { className: "flex flex-col items-center text-center space-y-4", children: [_jsx("div", { className: "w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center", children: _jsx(HeartPulse, { className: "w-8 h-8 text-primary" }) }), _jsxs("div", { className: "space-y-2", children: [_jsx("h1", { className: "text-4xl font-black tracking-tight uppercase italic", children: "Vayva Status" }), _jsx("p", { className: "text-muted-foreground text-sm font-medium tracking-wide", children: "Live updates on our system performance and critical infrastructure." })] })] }), _jsxs("div", { className: `p-6 rounded-2xl flex items-center justify-between border-2 transition-all ${isPlatformDown
                        ? "bg-red-50 border-red-200 text-red-900"
                        : health &&
                            Object.values(health).some((v) => v.status === "WARNING")
                            ? "bg-amber-50 border-amber-200 text-amber-900"
                            : "bg-slate-900 border-slate-800 text-white"}`, children: [_jsxs("div", { className: "flex items-center gap-4", children: [_jsx("div", { className: `p-2 rounded-full ${isPlatformDown ? "bg-red-500" : "bg-green-500"} animate-pulse` }), _jsx("h2", { className: "text-lg font-bold uppercase tracking-tight", children: isPlatformDown
                                        ? "Platform Major Outage"
                                        : "All Systems Operational" })] }), _jsxs(Button, { variant: "ghost", size: "sm", className: "hidden md:flex gap-2 opacity-70 hover:opacity-100", onClick: fetchHealth, disabled: isLoading, children: [_jsx(RefreshCw, { className: `w-3 h-3 ${isLoading ? "animate-spin" : ""}` }), " ", "Update"] })] }), _jsxs("div", { className: "space-y-4", children: [_jsx("h3", { className: "text-[10px] uppercase font-bold text-muted-foreground tracking-[0.2em] px-2", children: "Core Infrastructure" }), _jsx(Card, { className: "divide-y rounded-2xl overflow-hidden shadow-sm", children: [
                                {
                                    name: "Payment Processing",
                                    key: "paystack",
                                    desc: "Settlements & Charges",
                                },
                                {
                                    name: "Delivery Integrations",
                                    key: "delivery",
                                    desc: "Shipment Tracking & Labels",
                                },
                                {
                                    name: "WhatsApp Business API",
                                    key: "whatsapp",
                                    desc: "System Notifications",
                                },
                                {
                                    name: "Store Frontends",
                                    key: "platform",
                                    desc: "Merchant & Public Dashboards",
                                },
                            ].map((service) => (_jsxs("div", { className: "p-5 flex items-center justify-between hover:bg-slate-50 transition-colors", children: [_jsxs("div", { className: "space-y-0.5", children: [_jsx("h4", { className: "font-bold text-sm tracking-tight", children: service.name }), _jsx("p", { className: "text-[10px] text-muted-foreground font-semibold uppercase", children: service.desc })] }), _jsx("div", { className: "text-xs", children: _jsx(StatusIndicator, { status: health?.[service.key]?.status || "OK" }) })] }, service.name))) })] }), _jsxs("div", { className: "space-y-4", children: [_jsx("h3", { className: "text-[10px] uppercase font-bold text-muted-foreground tracking-[0.2em] px-2", children: "Incident History" }), _jsx("div", { className: "space-y-3", children: _jsxs("div", { className: "p-6 border border-dashed rounded-2xl bg-white flex flex-col items-center text-center gap-2", children: [_jsx(Clock, { className: "w-5 h-5 text-slate-300" }), _jsx("p", { className: "text-xs text-slate-400 font-medium italic", children: "No incidents reported in the last 30 days." })] }) })] }), _jsxs("div", { className: "pt-8 border-t flex flex-col md:flex-row items-center justify-between gap-6", children: [_jsxs("div", { className: "flex flex-col items-center md:items-start gap-1", children: [_jsx("p", { className: "text-[10px] font-bold text-slate-400 uppercase tracking-widest", children: "Powered by" }), _jsx("h3", { className: "text-xl font-black italic tracking-tighter opacity-20", children: "VAYVA CLOUD" })] }), _jsxs("div", { className: "flex gap-4", children: [_jsx(Link, { href: "https://twitter.com/vayva_status", children: _jsx(Button, { variant: "outline", size: "sm", className: "text-xs font-bold rounded-full", children: "Twitter Status" }) }), _jsx(Link, { href: "/admin/help", children: _jsx(Button, { variant: "secondary", size: "sm", className: "text-xs font-bold rounded-full", children: "Merchant Help" }) })] })] })] }) }));
}
