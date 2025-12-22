'use client';

import React from 'react';
import Link from 'next/link';
import { Icon , Button } from '@vayva/ui';
import { motion } from 'framer-motion';

export default function StoreBuilderPage() {
    return (
        <div className="min-h-screen py-20 px-4">
            <div className="max-w-7xl mx-auto">
                {/* Hero */}
                <div className="grid md:grid-cols-2 gap-16 items-center mb-32">
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.6 }}
                    >
                        <span className="text-blue-500 font-bold tracking-wide uppercase mb-4 block">Online Store Builder</span>
                        <h1 className="text-5xl font-bold text-[#1d1d1f] mb-6">Your brand, your website.<br /> No code required.</h1>
                        <p className="text-xl text-[#1d1d1f]/60 mb-8 leading-relaxed">
                            Create a stunning, mobile-optimized online store that looks exactly how you want.
                            Customize themes, manage pages, and connect your own domain in minutes.
                        </p>
                        <div className="flex gap-4">
                            <Link href="/auth/signup">
                                <Button className="bg-blue-500 hover:bg-blue-600 text-white font-bold h-12 px-8 rounded-full shadow-lg shadow-blue-500/20">
                                    Start Building
                                </Button>
                            </Link>
                        </div>
                    </motion.div>
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.8 }}
                        className="relative"
                    >
                        <div className="aspect-[4/3] rounded-3xl bg-gradient-to-br from-blue-50 to-purple-50 border border-white p-2 shadow-2xl rotated-3d">
                            {/* Mockup Placeholder */}
                            <div className="w-full h-full bg-white rounded-2xl flex items-center justify-center border border-gray-100 shadow-inner">
                                <span className="text-[#1d1d1f]/20 font-bold">Store Preview UI</span>
                            </div>
                        </div>
                    </motion.div>
                </div>

                {/* Features List */}
                <div className="grid md:grid-cols-3 gap-8">
                    {[
                        { title: 'Mobile First', desc: 'Every theme is designed to look perfect on phones, where 90% of your customers are.' },
                        { title: 'Custom Domains', desc: 'Connect your own .com or .ng domain for a professional look.' },
                        { title: 'Fast Checkout', desc: 'Optimized checkout flow designed to reduce abandoned carts in Nigeria.' }
                    ].map((item, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: i * 0.1 }}
                            className="bg-white border border-gray-100 p-8 rounded-[2rem] shadow-lg hover:shadow-xl transition-all"
                        >
                            <h3 className="text-xl font-bold text-[#1d1d1f] mb-4">{item.title}</h3>
                            <p className="text-[#1d1d1f]/60">{item.desc}</p>
                        </motion.div>
                    ))}
                </div>
            </div>
        </div>
    );
}
