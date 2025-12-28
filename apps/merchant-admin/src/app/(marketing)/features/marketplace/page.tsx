'use client';

import React from 'react';
import Link from 'next/link';
import { Button, Icon } from '@vayva/ui';
import { motion } from 'framer-motion';

export default function MarketplaceFeaturePage() {
    return (
        <div className="min-h-screen py-20 px-4">
            <div className="max-w-7xl mx-auto">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    className="text-center max-w-3xl mx-auto mb-20"
                >
                    <span className="text-purple-600 font-bold tracking-wide uppercase mb-4 block">Vayva Market</span>
                    <h1 className="text-5xl md:text-6xl font-bold text-[#1d1d1f] mb-6">Get discovered by millions.</h1>
                    <p className="text-xl text-[#1d1d1f]/60 mb-8 max-w-2xl mx-auto">
                        Don't just sell to your followers. List your products on Vayva Market and reach new customers instantly.
                    </p>
                    {/* @ts-ignore */}
                    <Link href="/signup">
                        <Button className="bg-purple-600 hover:bg-purple-700 text-white font-bold h-12 px-8 rounded-full shadow-lg shadow-purple-600/20">
                            Join the Marketplace
                        </Button>
                    </Link>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 40 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                    className="grid md:grid-cols-2 gap-12 bg-white border border-gray-100 rounded-[2.5rem] p-12 items-center shadow-xl"
                >
                    <div>
                        <h3 className="text-3xl font-bold text-[#1d1d1f] mb-8">How it works</h3>
                        <ul className="space-y-8">
                            {[
                                'Opt-in your products from your dashboard with one click.',
                                'We verify your business to build trust with buyers.',
                                'Customers discover your items on the Vayva Market app.',
                                'We handle the payment and you fulfill the order.'
                            ].map((step, i) => (
                                <li key={i} className="flex gap-6">
                                    <div className="w-10 h-10 rounded-full bg-purple-100 text-purple-600 flex items-center justify-center font-bold text-lg shrink-0">
                                        {i + 1}
                                    </div>
                                    <span className="text-[#1d1d1f]/80 text-lg leading-relaxed">{step}</span>
                                </li>
                            ))}
                        </ul>
                    </div>
                    <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-[2rem] border border-white/50 aspect-square md:aspect-auto h-full min-h-[400px] flex items-center justify-center shadow-inner">
                        <Icon name="Store" size={80} className="text-purple-600/20" />
                    </div>
                </motion.div>
            </div>
        </div>
    );
}
