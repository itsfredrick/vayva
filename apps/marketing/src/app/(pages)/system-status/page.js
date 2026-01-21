"use client";
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Button } from "@vayva/ui";
import Link from "next/link";
import { CheckCircle, AlertCircle, Clock } from "lucide-react";
export default function SystemStatusPage() {
    const services = [
        {
            name: "Merchant Dashboard",
            status: "operational",
            uptime: "99.9%",
            description: "Main application and admin panel",
        },
        {
            name: "Payment Processing",
            status: "operational",
            uptime: "99.8%",
            description: "Paystack integration and payment verification",
        },
        {
            name: "Order Management",
            status: "operational",
            uptime: "99.9%",
            description: "Order creation, tracking, and fulfillment",
        },
        {
            name: "Delivery Integration",
            status: "operational",
            uptime: "99.7%",
            description: "Kwik delivery partner integration",
        },
        {
            name: "API Services",
            status: "operational",
            uptime: "99.9%",
            description: "REST API and webhooks",
        },
        {
            name: "Email Notifications",
            status: "operational",
            uptime: "99.8%",
            description: "Transactional emails via Resend",
        },
    ];
    const getStatusIcon = (status) => {
        switch (status) {
            case "operational":
                return _jsx(CheckCircle, { className: "w-5 h-5 text-green-500" });
            case "degraded":
                return _jsx(AlertCircle, { className: "w-5 h-5 text-yellow-500" });
            case "outage":
                return _jsx(AlertCircle, { className: "w-5 h-5 text-red-500" });
            default:
                return _jsx(Clock, { className: "w-5 h-5 text-gray-500" });
        }
    };
    const getStatusText = (status) => {
        switch (status) {
            case "operational":
                return "Operational";
            case "degraded":
                return "Degraded Performance";
            case "outage":
                return "Service Outage";
            default:
                return "Unknown";
        }
    };
    const getStatusColor = (status) => {
        switch (status) {
            case "operational":
                return "text-green-600";
            case "degraded":
                return "text-yellow-600";
            case "outage":
                return "text-red-600";
            default:
                return "text-gray-600";
        }
    };
    return (_jsx("div", { className: "min-h-screen bg-white pt-32 pb-24 px-4", children: _jsxs("div", { className: "max-w-4xl mx-auto", children: [_jsxs("div", { className: "text-center mb-16", children: [_jsxs("div", { className: "inline-flex items-center gap-2 px-3 py-1 rounded-full bg-green-50 text-green-600 text-xs font-bold uppercase mb-6", children: [_jsx(CheckCircle, { className: "w-4 h-4" }), "All Systems Operational"] }), _jsx("h1", { className: "text-5xl font-bold text-[#0F172A] mb-6", children: "System Status" }), _jsx("p", { className: "text-xl text-[#64748B] max-w-2xl mx-auto", children: "Real-time status of Vayva platform services and infrastructure." })] }), _jsx("div", { className: "space-y-4 mb-16", children: services.map((service) => (_jsx("div", { className: "bg-white border border-gray-200 rounded-2xl p-6 hover:shadow-lg transition-shadow", children: _jsxs("div", { className: "flex items-start justify-between", children: [_jsxs("div", { className: "flex items-start gap-4 flex-1", children: [getStatusIcon(service.status), _jsxs("div", { className: "flex-1", children: [_jsx("h3", { className: "font-bold text-[#0F172A] mb-1", children: service.name }), _jsx("p", { className: "text-sm text-[#64748B]", children: service.description })] })] }), _jsxs("div", { className: "text-right", children: [_jsx("p", { className: `text-sm font-bold ${getStatusColor(service.status)}`, children: getStatusText(service.status) }), _jsxs("p", { className: "text-xs text-[#64748B] mt-1", children: [service.uptime, " uptime"] })] })] }) }, service.name))) }), _jsxs("div", { className: "bg-gray-50 rounded-2xl p-8 border border-gray-100", children: [_jsx("h2", { className: "text-2xl font-bold text-[#0F172A] mb-4", children: "Recent Incidents" }), _jsx("p", { className: "text-[#64748B] mb-6", children: "No incidents reported in the last 30 days." }), _jsxs("div", { className: "flex items-center gap-2 text-sm text-green-600 font-medium", children: [_jsx(CheckCircle, { className: "w-4 h-4" }), "100% uptime this month"] })] }), _jsxs("div", { className: "mt-16 text-center", children: [_jsx("p", { className: "text-[#64748B] mb-4", children: "Experiencing issues? Contact our support team." }), _jsxs("div", { className: "flex justify-center gap-4", children: [_jsx(Link, { href: "/help", children: _jsx(Button, { className: "px-6 py-3 bg-[#22C55E] text-white font-bold rounded-xl hover:bg-[#16A34A] transition-colors", children: "Visit Help Center" }) }), _jsx("a", { href: "mailto:support@vayva.ng", children: _jsx(Button, { className: "px-6 py-3 border-2 border-gray-200 text-[#0F172A] font-bold rounded-xl hover:bg-gray-50 transition-colors", children: "Email Support" }) })] })] })] }) }));
}
