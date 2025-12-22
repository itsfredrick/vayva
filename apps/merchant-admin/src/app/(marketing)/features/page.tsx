'use client';

import React from 'react';
import Link from 'next/link';
import { Button , Icon, IconName } from '@vayva/ui';
import { motion } from 'framer-motion';

const FEATURES = [
    {
        title: 'Store Builder',
        description: 'Drag-and-drop website builder with beautiful, mobile-first themes designed for African businesses.',
        icon: 'Store',
        href: '/features/store-builder',
        color: 'bg-blue-500',
        textColor: 'text-blue-600'
    },
    {
        title: 'Vayva Market',
        description: 'Get discovered by millions of buyers on our centralized marketplace. Sync products automatically.',
        icon: 'Store',
        href: '/features/marketplace',
        color: 'bg-purple-500',
        textColor: 'text-purple-600'
    },
    {
        title: 'WhatsApp AI',
        description: 'Automate sales and support on WhatsApp. Let AI handle inquiries while you sleep.',
        icon: 'MessageSquare',
        href: '/features/whatsapp',
        color: 'bg-[#46EC13]',
        textColor: 'text-[#16a34a]'
    },
    {
        title: 'Payments',
        description: 'Accept cards, bank transfers, and USSD. Instant settlements to your bank account.',
        icon: 'CreditCard',
        href: '/features/payments',
        color: 'bg-yellow-500',
        textColor: 'text-yellow-600'
    },
    {
        title: 'Logistics',
        description: 'Discounted shipping rates with top partners like GIG and DHL. Auto-generate waybills.',
        icon: 'Truck',
        href: '/features/logistics',
        color: 'bg-red-500',
        textColor: 'text-red-600'
    },
    {
        title: 'Analytics',
        description: 'Real-time insights on sales, visitors, and profit. Know exactly how your business is performing.',
        icon: 'BarChart3',
        href: '/features/analytics',
        color: 'bg-indigo-500',
        textColor: 'text-indigo-600'
    }
];

export default function FeaturesPage() {
    return (
        <div className="pb-20">
            {/* Hero */}
            <section className="py-20 px-4 text-center">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    className="max-w-4xl mx-auto"
                >
                    <h1 className="text-5xl md:text-7xl font-bold text-[#1d1d1f] mb-6">
                        Power-packed features <br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#46EC13] to-blue-500">
                            for modern growth.
                        </span>
                    </h1>
                    <p className="text-xl text-[#1d1d1f]/60 max-w-2xl mx-auto">
                        Everything you need to launch, run, and scale your business in one powerful dashboard.
                    </p>
                </motion.div>
            </section>

            {/* Features Grid */}
            <section className="px-4">
                <div className="max-w-[1440px] mx-auto grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {FEATURES.map((feature, i) => (
                        // @ts-ignore
                        <Link href={feature.href} key={i}>
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: i * 0.1 }}
                                whileHover={{ y: -5 }}
                                className="group h-full bg-white border border-gray-100 rounded-[2rem] p-8 hover:shadow-xl transition-all duration-300"
                            >
                                <div className={`w-14 h-14 ${feature.color}/10 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}>
                                    <Icon name={feature.icon as IconName} size={32} className={feature.textColor} />
                                </div>
                                <h3 className="text-2xl font-bold text-[#1d1d1f] mb-4">{feature.title}</h3>
                                <p className="text-[#1d1d1f]/60 leading-relaxed mb-6">{feature.description}</p>
                                <div className="flex items-center gap-2 text-[#1d1d1f] font-bold group-hover:gap-4 transition-all">
                                    Learn more <Icon name="ArrowRight" size={18} />
                                </div>
                            </motion.div>
                        </Link>
                    ))}
                </div>
            </section>

            {/* CTA */}
            <section className="mt-32 px-4">
                <div className="max-w-5xl mx-auto bg-[#1d1d1f] rounded-[3rem] p-12 md:p-20 text-center relative overflow-hidden">
                    <div className="relative z-10">
                        <h2 className="text-4xl md:text-5xl font-bold text-white mb-8">Start growing today.</h2>
                        {/* @ts-ignore */}
                        <Link href="/market" className="block">
                            <Button className="h-14 px-10 rounded-full bg-[#46EC13] hover:bg-[#3DD10F] text-black font-bold text-lg">
                                Get Started Free
                            </Button>
                        </Link>
                    </div>
                </div>
            </section>
        </div>
    );
}
