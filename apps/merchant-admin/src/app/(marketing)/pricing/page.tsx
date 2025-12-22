'use client';

import React, { useState } from 'react';
import { Button } from '@vayva/ui';
import { Icon } from '@vayva/ui';
import { motion } from 'framer-motion';
import Link from 'next/link';

const PLANS = [
    {
        name: 'Starter',
        price: 'Free',
        description: 'For individuals and small businesses just getting started.',
        features: [
            'Online Store Builder',
            '50 Product Limit',
            'Basic Analytics',
            'Standard Delivery Integration',
            '3% Transaction Fee'
        ],
        cta: 'Start for Free',
        popular: false
    },
    {
        name: 'Growth',
        price: '₦ 5,000',
        period: '/mo',
        description: 'For growing businesses scaling their operations.',
        features: [
            'Everything in Starter',
            'Unlimited Products',
            'WhatsApp Automation',
            'Advanced Analytics',
            'Custom Domain',
            '1.5% Transaction Fee'
        ],
        cta: 'Start Free Trial',
        popular: true
    },
    {
        name: 'Scale',
        price: '₦ 15,000',
        period: '/mo',
        description: 'For high-volume merchants and enterprise brands.',
        features: [
            'Everything in Growth',
            'Priority Support',
            'Lower Transaction Fees (0.5%)',
            'Multiple Staff Accounts',
            'API Access',
            'Dedicated Account Manager'
        ],
        cta: 'Contact Sales',
        popular: false
    }
];

export default function PricingPage() {
    const [isYearly, setIsYearly] = useState(false);

    return (
        <div className="py-20 px-4">
            <div className="max-w-7xl mx-auto">
                <div className="text-center max-w-3xl mx-auto mb-16">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                    >
                        <h1 className="text-5xl md:text-6xl font-bold text-[#1d1d1f] mb-6">
                            Simple, transparent <br /> pricing.
                        </h1>
                        <p className="text-xl text-[#1d1d1f]/60 mb-8">
                            Start for free, upgrade as you grow. No hidden fees.
                        </p>

                        <div className="flex items-center justify-center gap-4 mb-8">
                            <span className={`text-sm font-bold ${!isYearly ? 'text-[#1d1d1f]' : 'text-[#1d1d1f]/50'}`}>Monthly</span>
                            <button
                                onClick={() => setIsYearly(!isYearly)}
                                className="w-14 h-8 bg-gray-200 rounded-full p-1 relative transition-colors duration-300"
                            >
                                <div className={`w-6 h-6 bg-white rounded-full shadow-md transform transition-transform duration-300 ${isYearly ? 'translate-x-6' : 'translate-x-0'}`} />
                            </button>
                            <span className={`text-sm font-bold ${isYearly ? 'text-[#1d1d1f]' : 'text-[#1d1d1f]/50'}`}>
                                Yearly <span className="text-[#46EC13] text-xs ml-1">(Save 20%)</span>
                            </span>
                        </div>
                    </motion.div>
                </div>

                <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
                    {PLANS.map((plan, i) => (
                        <motion.div
                            key={plan.name}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: i * 0.1 }}
                            whileHover={{ y: -10 }}
                            className={`relative bg-white border rounded-[2rem] p-8 transition-all duration-300 ${plan.popular
                                ? 'border-[#46EC13] shadow-2xl shadow-[#46EC13]/10 scale-105'
                                : 'border-gray-100 hover:shadow-xl'
                                }`}
                        >
                            {plan.popular && (
                                <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-[#46EC13] text-black text-xs font-bold px-4 py-1.5 rounded-full uppercase tracking-wide">
                                    Most Popular
                                </div>
                            )}

                            <h3 className="text-xl font-bold text-[#1d1d1f] mb-2">{plan.name}</h3>
                            <div className="flex items-baseline gap-1 mb-4">
                                <span className="text-4xl font-bold text-[#1d1d1f]">{plan.price}</span>
                                {plan.period && <span className="text-[#1d1d1f]/60">{plan.period}</span>}
                            </div>
                            <p className="text-[#1d1d1f]/60 text-sm mb-8 leading-relaxed">{plan.description}</p>

                            {/* @ts-ignore */}
                            <Link href="/auth/signup" className="block mb-8">
                                <Button
                                    className={`w-full h-12 rounded-full font-bold text-lg ${plan.popular
                                        ? 'bg-[#46EC13] hover:bg-[#3DD10F] text-black'
                                        : 'bg-[#1d1d1f] hover:bg-[#1d1d1f]/90 text-white'
                                        }`}
                                >
                                    {plan.cta}
                                </Button>
                            </Link>

                            <ul className="space-y-4">
                                {plan.features.map((feature) => (
                                    <li key={feature} className="flex items-start gap-3 text-sm text-[#1d1d1f]/80">
                                        <Icon name={"CheckCircle" as any} className="text-[#46EC13] shrink-0" size={18} />
                                        <span>{feature}</span>
                                    </li>
                                ))}
                            </ul>
                        </motion.div>
                    ))}
                </div>

                <h3 className="text-2xl font-bold text-white mb-8 text-center">Frequently Asked Questions</h3>
                <div className="space-y-6">
                    {[
                        { q: 'Is there a free trial?', a: 'Yes, the Growth plan comes with a 14-day free trial. No credit card required.' },
                        { q: 'Can I change plans anytime?', a: 'Absolutely. You can upgrade or downgrade your plan from the dashboard billing settings.' },
                        { q: 'What payment methods do you accept?', a: 'We accept all major Nigerian cards, bank transfers, and USSD via Paystack.' }
                    ].map((item, i) => (
                        <div key={i} className="border-b border-white/5 pb-6">
                            <h4 className="font-bold text-white mb-2">{item.q}</h4>
                            <p className="text-white/50 text-sm">{item.a}</p>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
