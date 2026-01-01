"use client";

import React from "react";
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

    const getStatusIcon = (status: string) => {
        switch (status) {
            case "operational":
                return <CheckCircle className="w-5 h-5 text-green-500" />;
            case "degraded":
                return <AlertCircle className="w-5 h-5 text-yellow-500" />;
            case "outage":
                return <AlertCircle className="w-5 h-5 text-red-500" />;
            default:
                return <Clock className="w-5 h-5 text-gray-500" />;
        }
    };

    const getStatusText = (status: string) => {
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

    const getStatusColor = (status: string) => {
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

    return (
        <div className="min-h-screen bg-white pt-32 pb-24 px-4">
            <div className="max-w-4xl mx-auto">
                {/* Header */}
                <div className="text-center mb-16">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-green-50 text-green-600 text-xs font-bold uppercase mb-6">
                        <CheckCircle className="w-4 h-4" />
                        All Systems Operational
                    </div>
                    <h1 className="text-5xl font-bold text-[#0F172A] mb-6">
                        System Status
                    </h1>
                    <p className="text-xl text-[#64748B] max-w-2xl mx-auto">
                        Real-time status of Vayva platform services and infrastructure.
                    </p>
                </div>

                {/* Services Status */}
                <div className="space-y-4 mb-16">
                    {services.map((service) => (
                        <div
                            key={service.name}
                            className="bg-white border border-gray-200 rounded-2xl p-6 hover:shadow-lg transition-shadow"
                        >
                            <div className="flex items-start justify-between">
                                <div className="flex items-start gap-4 flex-1">
                                    {getStatusIcon(service.status)}
                                    <div className="flex-1">
                                        <h3 className="font-bold text-[#0F172A] mb-1">
                                            {service.name}
                                        </h3>
                                        <p className="text-sm text-[#64748B]">
                                            {service.description}
                                        </p>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <p
                                        className={`text-sm font-bold ${getStatusColor(service.status)}`}
                                    >
                                        {getStatusText(service.status)}
                                    </p>
                                    <p className="text-xs text-[#64748B] mt-1">
                                        {service.uptime} uptime
                                    </p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Incident History */}
                <div className="bg-gray-50 rounded-2xl p-8 border border-gray-100">
                    <h2 className="text-2xl font-bold text-[#0F172A] mb-4">
                        Recent Incidents
                    </h2>
                    <p className="text-[#64748B] mb-6">
                        No incidents reported in the last 30 days.
                    </p>
                    <div className="flex items-center gap-2 text-sm text-green-600 font-medium">
                        <CheckCircle className="w-4 h-4" />
                        100% uptime this month
                    </div>
                </div>

                {/* Support CTA */}
                <div className="mt-16 text-center">
                    <p className="text-[#64748B] mb-4">
                        Experiencing issues? Contact our support team.
                    </p>
                    <div className="flex justify-center gap-4">
                        <Link href="/help">
                            <button className="px-6 py-3 bg-[#22C55E] text-white font-bold rounded-xl hover:bg-[#16A34A] transition-colors">
                                Visit Help Center
                            </button>
                        </Link>
                        <a href="mailto:support@vayva.ng">
                            <button className="px-6 py-3 border-2 border-gray-200 text-[#0F172A] font-bold rounded-xl hover:bg-gray-50 transition-colors">
                                Email Support
                            </button>
                        </a>
                    </div>
                </div>
            </div>
        </div>
    );
}
