'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Button } from '@vayva/ui';

const PRICING_TIERS = [
    {
        id: 'free',
        name: 'Free',
        price: '₦0',
        period: '',
        tagline: 'Best for getting started',
        whoFor: 'Individuals and small sellers getting started with structured selling on WhatsApp.',
        features: [
            'WhatsApp order capture',
            'Basic order tracking',
            'Customer list',
            'Payment recording (manual)',
            'Delivery notes',
            'Basic activity log',
        ],
        limits: [
            'Single user',
            'Limited records history',
            'No advanced reports',
        ],
        cta: 'Start free',
        ctaVariant: 'outline' as const,
    },
    {
        id: 'growth',
        name: 'Growth',
        price: '₦25,000',
        period: '/ month',
        tagline: 'Best for growing businesses',
        whoFor: 'Growing merchants handling regular orders and payments who need visibility and control.',
        features: [
            'Everything in Free, plus:',
            'Full order lifecycle tracking',
            'Payment reconciliation',
            'Inventory tracking',
            'Delivery status management',
            'Customer history & repeat buyer tracking',
            'Basic reports & exports',
            'Multi-staff access (limited roles)',
        ],
        positioning: 'Designed for businesses moving from informal selling to structured operations.',
        cta: 'Upgrade to Growth',
        ctaVariant: 'default' as const,
        recommended: true,
    },
    {
        id: 'pro',
        name: 'Pro',
        price: '₦40,000',
        period: '/ month',
        tagline: 'Best for established businesses',
        whoFor: 'Established businesses running daily operations on WhatsApp with teams and accountability needs.',
        features: [
            'Everything in Growth, plus:',
            'Advanced reports & exports',
            'Full audit trails',
            'Role-based permissions',
            'Unlimited staff access',
            'Priority support',
            'Operational history retention',
            'Business-level visibility',
        ],
        positioning: 'Built for businesses where mistakes are costly and records matter.',
        cta: 'Go Pro',
        ctaVariant: 'outline' as const,
    },
];

const COMPARISON_FEATURES = [
    { name: 'Orders', free: 'Basic', growth: 'Full lifecycle', pro: 'Full lifecycle' },
    { name: 'Payments', free: 'Manual recording', growth: 'Reconciliation', pro: 'Reconciliation' },
    { name: 'Inventory', free: '—', growth: 'Tracking & alerts', pro: 'Tracking & alerts' },
    { name: 'Deliveries', free: 'Notes only', growth: 'Status management', pro: 'Status management' },
    { name: 'Customers', free: 'Basic list', growth: 'History tracking', pro: 'History tracking' },
    { name: 'Reports', free: '—', growth: 'Basic exports', pro: 'Advanced exports' },
    { name: 'Staff access', free: 'Single user', growth: 'Limited roles', pro: 'Unlimited + roles' },
    { name: 'Records history', free: 'Limited', growth: 'Standard', pro: 'Full retention' },
    { name: 'Support level', free: 'Community', growth: 'Email', pro: 'Priority' },
];

const FAQS = [
    {
        q: 'Can I start free and upgrade later?',
        a: 'Yes. Start with the free plan and upgrade anytime. Your data comes with you.',
    },
    {
        q: 'Can I downgrade?',
        a: 'Yes. You can downgrade at any time. You\'ll keep your data but lose access to premium features.',
    },
    {
        q: 'Is there a contract?',
        a: 'No. All plans are month-to-month. Cancel anytime.',
    },
    {
        q: 'What happens if I stop paying?',
        a: 'Your account moves to the free plan. Your data is safe and you can still access basic features.',
    },
    {
        q: 'Do prices include VAT?',
        a: 'Prices shown are before VAT. VAT will be added at checkout where applicable.',
    },
];

export default function PricingPage() {
    const [showDetailedComparison, setShowDetailedComparison] = useState(false);

    return (
        <div className="min-h-screen bg-white">
            {/* Page Hero */}
            <section className="pt-32 pb-16 px-4 text-center">
                <div className="max-w-4xl mx-auto">
                    <h1 className="text-4xl md:text-5xl font-bold text-[#0F172A] mb-6">
                        Simple pricing for serious businesses.
                    </h1>
                    <p className="text-xl text-[#64748B] max-w-2xl mx-auto">
                        Start free. Upgrade only when your business needs more structure, scale, and control.
                    </p>
                </div>
            </section>

            {/* Pricing Tiers */}
            <section className="py-16 px-4">
                <div className="max-w-6xl mx-auto">
                    <div className="grid md:grid-cols-3 gap-8">
                        {PRICING_TIERS.map((tier) => (
                            <div
                                key={tier.id}
                                className={`bg-white rounded-lg border-2 p-8 ${tier.recommended
                                    ? 'border-[#22C55E] shadow-lg'
                                    : 'border-gray-200'
                                    }`}
                            >
                                {tier.recommended && (
                                    <div className="text-sm text-[#22C55E] font-semibold mb-4">
                                        {tier.tagline}
                                    </div>
                                )}

                                <h3 className="text-2xl font-bold text-[#0F172A] mb-2">{tier.name}</h3>
                                <div className="mb-6">
                                    <span className="text-4xl font-bold text-[#0F172A]">{tier.price}</span>
                                    {tier.period && <span className="text-[#64748B]">{tier.period}</span>}
                                </div>

                                <p className="text-[#64748B] mb-6 text-sm leading-relaxed">
                                    {tier.whoFor}
                                </p>

                                <div className="mb-6">
                                    <p className="text-sm font-semibold text-[#0F172A] mb-3">Includes:</p>
                                    <ul className="space-y-2">
                                        {tier.features.map((feature, i) => (
                                            <li key={i} className="text-sm text-[#64748B] flex items-start gap-2">
                                                <span className="text-[#22C55E] mt-1">✓</span>
                                                <span>{feature}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>

                                {tier.limits && (
                                    <div className="mb-6">
                                        <p className="text-sm font-semibold text-[#0F172A] mb-3">Limits:</p>
                                        <ul className="space-y-2">
                                            {tier.limits.map((limit, i) => (
                                                <li key={i} className="text-sm text-[#64748B]">
                                                    • {limit}
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                )}

                                {tier.positioning && (
                                    <div className="mb-6 p-3 bg-gray-50 rounded text-sm text-[#64748B] italic">
                                        {tier.positioning}
                                    </div>
                                )}

                                <Link href="/signup">
                                    <Button
                                        variant={tier.ctaVariant}
                                        className={`w-full ${tier.ctaVariant === 'default'
                                            ? 'bg-[#22C55E] hover:bg-[#16A34A] text-white'
                                            : 'border-2 border-gray-300'
                                            }`}
                                    >
                                        {tier.cta}
                                    </Button>
                                </Link>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Interactive Comparison */}
            <section className="py-16 px-4 bg-gray-50">
                <div className="max-w-6xl mx-auto">
                    <div className="text-center mb-8">
                        <h2 className="text-2xl font-bold text-[#0F172A] mb-4">Compare plans</h2>
                        <button
                            onClick={() => setShowDetailedComparison(!showDetailedComparison)}
                            className="text-[#22C55E] font-semibold text-sm"
                        >
                            {showDetailedComparison ? 'Show simple view' : 'Show detailed comparison'}
                        </button>
                    </div>

                    {showDetailedComparison && (
                        <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
                            <table className="w-full">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="text-left p-4 text-sm font-semibold text-[#0F172A]">Feature</th>
                                        <th className="text-center p-4 text-sm font-semibold text-[#0F172A]">Free</th>
                                        <th className="text-center p-4 text-sm font-semibold text-[#0F172A]">Growth</th>
                                        <th className="text-center p-4 text-sm font-semibold text-[#0F172A]">Pro</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {COMPARISON_FEATURES.map((feature, i) => (
                                        <tr key={i} className="border-t border-gray-200">
                                            <td className="p-4 text-sm text-[#0F172A]">{feature.name}</td>
                                            <td className="p-4 text-sm text-[#64748B] text-center">{feature.free}</td>
                                            <td className="p-4 text-sm text-[#64748B] text-center">{feature.growth}</td>
                                            <td className="p-4 text-sm text-[#64748B] text-center">{feature.pro}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </section>

            {/* Pricing Philosophy */}
            <section className="py-16 px-4">
                <div className="max-w-4xl mx-auto text-center">
                    <h2 className="text-3xl font-bold text-[#0F172A] mb-6">
                        Pay for structure, not promises.
                    </h2>
                    <div className="grid md:grid-cols-2 gap-6 text-left">
                        <div className="bg-gray-50 rounded-lg p-6">
                            <p className="font-semibold text-[#0F172A] mb-2">No hidden fees</p>
                            <p className="text-sm text-[#64748B]">What you see is what you pay. No surprises.</p>
                        </div>
                        <div className="bg-gray-50 rounded-lg p-6">
                            <p className="font-semibold text-[#0F172A] mb-2">No per-message pricing</p>
                            <p className="text-sm text-[#64748B]">Unlimited WhatsApp conversations included.</p>
                        </div>
                        <div className="bg-gray-50 rounded-lg p-6">
                            <p className="font-semibold text-[#0F172A] mb-2">No commissions</p>
                            <p className="text-sm text-[#64748B]">We don't take a cut of your sales. Ever.</p>
                        </div>
                        <div className="bg-gray-50 rounded-lg p-6">
                            <p className="font-semibold text-[#0F172A] mb-2">You own your data</p>
                            <p className="text-sm text-[#64748B]">Export anytime. Your business, your records.</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Local Context */}
            <section className="py-16 px-4 bg-gray-50">
                <div className="max-w-4xl mx-auto">
                    <h2 className="text-2xl font-bold text-[#0F172A] mb-6 text-center">
                        Built for Nigerian businesses
                    </h2>
                    <div className="grid md:grid-cols-3 gap-6">
                        <div className="text-center">
                            <p className="font-semibold text-[#0F172A] mb-2">Local pricing</p>
                            <p className="text-sm text-[#64748B]">Predictable costs in Naira, no currency surprises</p>
                        </div>
                        <div className="text-center">
                            <p className="font-semibold text-[#0F172A] mb-2">Real conditions</p>
                            <p className="text-sm text-[#64748B]">Works with unreliable networks and basic devices</p>
                        </div>
                        <div className="text-center">
                            <p className="font-semibold text-[#0F172A] mb-2">How you sell</p>
                            <p className="text-sm text-[#64748B]">Designed for WhatsApp-first selling</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* FAQ */}
            <section className="py-16 px-4">
                <div className="max-w-3xl mx-auto">
                    <h2 className="text-2xl font-bold text-[#0F172A] mb-8 text-center">
                        Pricing questions
                    </h2>
                    <div className="space-y-6">
                        {FAQS.map((faq, i) => (
                            <div key={i} className="bg-white border border-gray-200 rounded-lg p-6">
                                <h3 className="font-semibold text-[#0F172A] mb-2">{faq.q}</h3>
                                <p className="text-[#64748B]">{faq.a}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Final CTA */}
            <section className="py-20 px-4 bg-gray-50">
                <div className="max-w-3xl mx-auto text-center">
                    <h2 className="text-3xl font-bold text-[#0F172A] mb-6">
                        Start free. Upgrade when your business is ready.
                    </h2>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center mb-6">
                        <Link href="/signup">
                            <Button className="bg-[#22C55E] hover:bg-[#16A34A] text-white px-8 py-4 text-lg font-semibold">
                                Create free account
                            </Button>
                        </Link>
                        <Link href="/features">
                            <Button variant="outline" className="border-2 border-gray-300 text-[#0F172A] px-8 py-4 text-lg font-semibold">
                                Compare features
                            </Button>
                        </Link>
                    </div>
                    <div className="flex flex-wrap justify-center gap-6 text-sm text-[#64748B]">
                        <span>✔ No credit card required</span>
                        <span>✔ Cancel anytime</span>
                    </div>
                </div>
            </section>
        </div>
    );
}
