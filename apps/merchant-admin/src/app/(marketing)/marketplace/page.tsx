'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Button } from '@vayva/ui';

const MARKETPLACE_CATEGORIES = [
    {
        id: 'payments',
        name: 'Payments & Finance',
        description: 'Advanced payment processing and financial tools',
        example: 'Example: Multi-currency support, installment payments',
    },
    {
        id: 'logistics',
        name: 'Logistics & Delivery',
        description: 'Extended delivery and fulfillment options',
        example: 'Example: International shipping, warehouse management',
    },
    {
        id: 'marketing',
        name: 'Marketing & Messaging',
        description: 'Customer engagement and marketing automation',
        example: 'Example: Email campaigns, SMS notifications',
    },
    {
        id: 'accounting',
        name: 'Accounting & Records',
        description: 'Advanced bookkeeping and compliance tools',
        example: 'Example: Tax filing, invoice generation',
    },
    {
        id: 'analytics',
        name: 'Analytics & Insights',
        description: 'Deep business intelligence and reporting',
        example: 'Example: Customer segmentation, sales forecasting',
    },
    {
        id: 'developer',
        name: 'Developer Tools',
        description: 'APIs and integrations for custom workflows',
        example: 'Example: Webhook endpoints, custom integrations',
    },
];

export default function MarketplacePage() {
    const [hoveredCategory, setHoveredCategory] = useState<string | null>(null);
    const [showWaitlistModal, setShowWaitlistModal] = useState(false);

    return (
        <div className="min-h-screen bg-white">
            {/* Page Hero */}
            <section className="pt-32 pb-16 px-4">
                <div className="max-w-4xl mx-auto">
                    <p className="text-sm text-[#64748B] mb-4">Product → Marketplace</p>
                    <h1 className="text-4xl md:text-5xl font-bold text-[#0F172A] mb-6 leading-tight">
                        Extend Vayva when your business needs more.
                    </h1>
                    <p className="text-xl text-[#64748B] max-w-2xl">
                        The Vayva Marketplace will let you add specialized tools—only when they\'re useful to your operations.
                    </p>
                </div>
            </section>

            {/* What the Marketplace Is */}
            <section className="py-16 px-4 bg-gray-50">
                <div className="max-w-6xl mx-auto">
                    <div className="grid md:grid-cols-2 gap-12 items-center">
                        {/* Explanation */}
                        <div>
                            <h2 className="text-2xl font-bold text-[#0F172A] mb-6">
                                Why a marketplace?
                            </h2>
                            <div className="space-y-4 text-[#64748B]">
                                <p>
                                    Businesses don\'t need everything on day one. As your operations grow, your needs become more specific.
                                </p>
                                <p>
                                    The Marketplace allows you to add capabilities without cluttering the core system. Only install what you actually use.
                                </p>
                                <p>
                                    Every tool integrates directly into your existing workflows—no separate dashboards, no disconnected systems.
                                </p>
                            </div>
                        </div>

                        {/* Visual */}
                        <div className="bg-white rounded-lg border border-gray-200 p-8">
                            <div className="relative">
                                {/* Core System */}
                                <div className="w-32 h-32 bg-[#22C55E]/10 border-2 border-[#22C55E] rounded-lg flex items-center justify-center mx-auto mb-8">
                                    <span className="text-sm font-semibold text-[#22C55E]">Core System</span>
                                </div>

                                {/* Add-ons */}
                                <div className="grid grid-cols-3 gap-4">
                                    {['Payments', 'Logistics', 'Marketing', 'Analytics', 'Records', 'Tools'].map((addon) => (
                                        <div key={addon} className="bg-gray-50 border border-gray-200 rounded p-3 text-center">
                                            <span className="text-xs text-[#64748B]">{addon}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Marketplace Categories */}
            <section className="py-16 px-4">
                <div className="max-w-6xl mx-auto">
                    <h2 className="text-3xl font-bold text-[#0F172A] mb-4 text-center">
                        What you\'ll find in the Marketplace
                    </h2>
                    <p className="text-[#64748B] text-center mb-12 max-w-2xl mx-auto">
                        Preview of tool categories that will be available
                    </p>

                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {MARKETPLACE_CATEGORIES.map((category) => (
                            <div
                                key={category.id}
                                className="bg-white border border-gray-200 rounded-lg p-6 cursor-not-allowed opacity-75 hover:opacity-100 transition-opacity relative"
                                onMouseEnter={() => setHoveredCategory(category.id)}
                                onMouseLeave={() => setHoveredCategory(null)}
                                onClick={() => setShowWaitlistModal(true)}
                            >
                                <div className="absolute top-4 right-4">
                                    <span className="text-xs bg-gray-100 text-[#64748B] px-2 py-1 rounded">
                                        Coming Soon
                                    </span>
                                </div>

                                <h3 className="text-lg font-semibold text-[#0F172A] mb-2 pr-20">
                                    {category.name}
                                </h3>
                                <p className="text-sm text-[#64748B] mb-4">
                                    {category.description}
                                </p>

                                {hoveredCategory === category.id && (
                                    <div className="text-xs text-[#22C55E] italic">
                                        {category.example}
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* How Add-ons Will Work */}
            <section className="py-16 px-4 bg-gray-50">
                <div className="max-w-4xl mx-auto">
                    <h2 className="text-3xl font-bold text-[#0F172A] mb-12 text-center">
                        How add-ons will work
                    </h2>

                    <div className="space-y-8">
                        {[
                            { num: 1, text: 'Browse available tools', detail: 'See what\'s available in the Marketplace' },
                            { num: 2, text: 'See what problem each solves', detail: 'Clear explanations of what each tool does' },
                            { num: 3, text: 'Enable only what you need', detail: 'No forced bundles or unnecessary features' },
                            { num: 4, text: 'Integrated into your workflows', detail: 'Works seamlessly with your existing setup' },
                        ].map((step) => (
                            <div key={step.num} className="flex items-start gap-6">
                                <div className="flex-shrink-0 w-12 h-12 bg-[#22C55E] text-white rounded-full flex items-center justify-center text-xl font-bold">
                                    {step.num}
                                </div>
                                <div className="pt-2">
                                    <p className="text-lg font-semibold text-[#0F172A] mb-1">{step.text}</p>
                                    <p className="text-[#64748B]">{step.detail}</p>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="mt-12 p-6 bg-white rounded-lg border border-[#22C55E]/20">
                        <p className="text-center text-lg font-semibold text-[#0F172A]">
                            No disconnected tools. No separate dashboards.
                        </p>
                    </div>
                </div>
            </section>

            {/* Coming Soon Centerpiece */}
            <section className="py-20 px-4">
                <div className="max-w-3xl mx-auto">
                    <div className="bg-gray-50 rounded-lg border border-gray-200 p-12 text-center">
                        <h2 className="text-3xl font-bold text-[#0F172A] mb-6">
                            Marketplace launching soon.
                        </h2>
                        <p className="text-lg text-[#64748B] mb-8 max-w-2xl mx-auto leading-relaxed">
                            We\'re building the Marketplace carefully—so every tool meets the same reliability and clarity standards as the core Vayva system.
                        </p>
                        <div className="space-y-3 text-sm text-[#64748B] max-w-md mx-auto">
                            <p>• Early access will roll out gradually</p>
                            <p>• Only production-ready tools will be listed</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Platform Philosophy */}
            <section className="py-16 px-4 bg-gray-50">
                <div className="max-w-4xl mx-auto text-center">
                    <h2 className="text-3xl font-bold text-[#0F172A] mb-6">
                        A platform, not a bundle of features.
                    </h2>
                    <div className="grid md:grid-cols-3 gap-8 text-left">
                        <div>
                            <p className="font-semibold text-[#0F172A] mb-2">Core stays stable</p>
                            <p className="text-sm text-[#64748B]">
                                The foundation you rely on doesn\'t change unexpectedly
                            </p>
                        </div>
                        <div>
                            <p className="font-semibold text-[#0F172A] mb-2">Marketplace grows over time</p>
                            <p className="text-sm text-[#64748B]">
                                New capabilities added as they\'re needed by real businesses
                            </p>
                        </div>
                        <div>
                            <p className="font-semibold text-[#0F172A] mb-2">Businesses opt in</p>
                            <p className="text-sm text-[#64748B]">
                                You choose what to add, nothing is forced on you
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Final CTA */}
            <section className="py-20 px-4">
                <div className="max-w-3xl mx-auto text-center">
                    <h2 className="text-3xl font-bold text-[#0F172A] mb-6">
                        Start with the core. Extend when ready.
                    </h2>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <Link href="/features">
                            <Button className="bg-[#22C55E] hover:bg-[#16A34A] text-white px-8 py-4 text-lg font-semibold">
                                Explore core features
                            </Button>
                        </Link>
                        <Link href="/pricing">
                            <Button variant="outline" className="border-2 border-gray-300 text-[#0F172A] px-8 py-4 text-lg font-semibold">
                                View pricing
                            </Button>
                        </Link>
                    </div>
                </div>
            </section>

            {/* Coming Soon Modal */}
            {showWaitlistModal && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={() => setShowWaitlistModal(false)}>
                    <div className="bg-white rounded-lg p-8 max-w-md" onClick={(e) => e.stopPropagation()}>
                        <h3 className="text-2xl font-bold text-[#0F172A] mb-4">Coming Soon</h3>
                        <p className="text-[#64748B] mb-6">
                            The Marketplace is currently in development. We\'ll announce when it\'s ready.
                        </p>
                        <Button
                            onClick={() => setShowWaitlistModal(false)}
                            className="w-full bg-[#22C55E] hover:bg-[#16A34A] text-white"
                        >
                            Got it
                        </Button>
                    </div>
                </div>
            )}
        </div>
    );
}
