"use client";

import { Button } from "@vayva/ui";
import { Plug, ExternalLink } from "lucide-react";
import Link from "next/link";

export default function IntegrationsPage() {
    return (
        <div className="p-8">
            <div className="max-w-4xl mx-auto">
                <h1 className="text-2xl font-bold text-gray-900 mb-2">Integrations</h1>
                <p className="text-gray-600 mb-8">Connect your store with third-party services and tools.</p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Payment Gateways */}
                    <div className="bg-white p-6 rounded-lg border border-gray-200">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="bg-green-100 p-2 rounded">
                                <Plug className="h-5 w-5 text-green-600" />
                            </div>
                            <h3 className="font-semibold text-gray-900">Payment Gateways</h3>
                        </div>
                        <p className="text-sm text-gray-600 mb-4">
                            Paystack integration is pre-configured for your store. Manage your payment settings in Finance.
                        </p>
                        <Link href="/dashboard/finance">
                            <Button variant="outline" size="sm" className="w-full">
                                View Payment Settings
                                <ExternalLink className="h-4 w-4 ml-2" />
                            </Button>
                        </Link>
                    </div>

                    {/* Logistics */}
                    <div className="bg-white p-6 rounded-lg border border-gray-200">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="bg-blue-100 p-2 rounded">
                                <Plug className="h-5 w-5 text-blue-600" />
                            </div>
                            <h3 className="font-semibold text-gray-900">Logistics & Delivery</h3>
                        </div>
                        <p className="text-sm text-gray-600 mb-4">
                            Kwik delivery integration available. Configure your logistics preferences.
                        </p>
                        <Link href="/dashboard/fulfillment">
                            <Button variant="outline" size="sm" className="w-full">
                                View Logistics Settings
                                <ExternalLink className="h-4 w-4 ml-2" />
                            </Button>
                        </Link>
                    </div>

                    {/* WhatsApp */}
                    <div className="bg-white p-6 rounded-lg border border-gray-200">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="bg-purple-100 p-2 rounded">
                                <Plug className="h-5 w-5 text-purple-600" />
                            </div>
                            <h3 className="font-semibold text-gray-900">WhatsApp Business</h3>
                        </div>
                        <p className="text-sm text-gray-600 mb-4">
                            Connect your WhatsApp Business account to enable AI-powered customer support.
                        </p>
                        <Link href="/dashboard/wa-agent">
                            <Button variant="outline" size="sm" className="w-full">
                                Configure WhatsApp
                                <ExternalLink className="h-4 w-4 ml-2" />
                            </Button>
                        </Link>
                    </div>

                    {/* More integrations placeholder */}
                    <div className="bg-gray-50 p-6 rounded-lg border border-dashed border-gray-300">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="bg-gray-200 p-2 rounded">
                                <Plug className="h-5 w-5 text-gray-400" />
                            </div>
                            <h3 className="font-semibold text-gray-700">More Integrations</h3>
                        </div>
                        <p className="text-sm text-gray-500 mb-4">
                            Additional integrations are being added regularly. Contact support if you need a specific integration.
                        </p>
                        <Button variant="ghost" size="sm" className="w-full" disabled>
                            Request Integration
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
}
