'use client';

import React from 'react';
import Link from 'next/link';
import { Button } from '@vayva/ui';
import { Icon } from '@vayva/ui';
import { motion } from 'framer-motion';

export default function MarketingHomePage() {
    return (
        <div className="flex flex-col gap-20 pb-20 overflow-hidden bg-white">
            {/* Hero Section */}
            <section className="relative pt-24 px-4">
                <div className="max-w-[1440px] mx-auto grid lg:grid-cols-2 gap-12 items-center">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                        className="space-y-8"
                    >
                        <div className="inline-flex items-center gap-2 bg-gray-50 rounded-full px-4 py-1.5 border border-gray-200">
                            <span className="w-2 h-2 rounded-full bg-black animate-pulse" />
                            <span className="text-xs font-bold text-gray-600 uppercase tracking-wide">New: WhatsApp AI Assistant</span>
                        </div>

                        <h1 className="text-5xl md:text-7xl font-bold text-black leading-[1.1] tracking-tight">
                            Build your empire, <br />
                            <span className="text-gray-400">
                                right from Lagos.
                            </span>
                        </h1>

                        <p className="text-xl text-gray-500 max-w-lg leading-relaxed">
                            The all-in-one operating system for African merchants. Store builder, logistics, payments, and AI automation—simplified.
                        </p>

                        <div className="flex flex-col sm:flex-row gap-4 pt-4">
                            <Link href="/signup">
                                <Button data-testid="landing-get-started" className="h-14 px-8 rounded-full bg-black hover:bg-black/80 text-white font-bold text-lg shadow-xl shadow-black/10 transition-all">
                                    Start Free Trial
                                </Button>
                            </Link>
                            <Link href="/features">
                                <Button variant="outline" className="h-14 px-8 rounded-full border-gray-200 hover:bg-gray-50 text-black font-bold text-lg bg-white transition-all">
                                    Browse Features
                                </Button>
                            </Link>
                        </div>

                        <div className="flex items-center gap-4 text-sm text-gray-500 font-medium">
                            <div className="flex -space-x-2">
                                {[1, 2, 3, 4].map(i => (
                                    <div key={i} className="w-8 h-8 rounded-full border-2 border-white bg-gray-100 flex items-center justify-center text-[10px] font-bold text-gray-400">
                                        {i}
                                    </div>
                                ))}
                            </div>
                            <p>Trusted by 10,000+ merchants</p>
                        </div>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.8, delay: 0.2 }}
                        className="relative"
                    >
                        {/* Abstract Device Mockup */}
                        <div className="relative z-10 bg-white border border-gray-200 rounded-3xl shadow-2xl overflow-hidden aspect-[4/3]">
                            <div className="absolute top-0 left-0 right-0 h-12 bg-gray-50 border-b border-gray-100 flex items-center px-4 gap-2">
                                <div className="flex gap-1.5">
                                    <div className="w-3 h-3 rounded-full bg-gray-300" />
                                    <div className="w-3 h-3 rounded-full bg-gray-300" />
                                    <div className="w-3 h-3 rounded-full bg-gray-300" />
                                </div>
                            </div>
                            <div className="p-8 mt-12 grid grid-cols-2 gap-6 bg-white">
                                <div className="space-y-4">
                                    <div className="h-32 bg-gray-50 rounded-xl" />
                                    <div className="h-4 w-2/3 bg-gray-50 rounded" />
                                    <div className="h-4 w-1/2 bg-gray-50 rounded" />
                                </div>
                                <div className="space-y-4">
                                    <div className="h-32 bg-gray-50 rounded-xl" />
                                    <div className="h-4 w-2/3 bg-gray-50 rounded" />
                                    <div className="h-4 w-1/2 bg-gray-50 rounded" />
                                </div>
                            </div>
                            {/* Floating Card */}
                            <motion.div
                                animate={{ y: [0, -10, 0] }}
                                transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
                                className="absolute bottom-8 right-8 bg-white backdrop-blur-xl border border-gray-100 p-4 rounded-2xl shadow-lg max-w-xs"
                            >
                                <div className="flex items-center gap-3 mb-2">
                                    <div className="w-8 h-8 rounded-full bg-black text-white flex items-center justify-center">
                                        <Icon name="Check" size={16} />
                                    </div>
                                    <div>
                                        <p className="text-xs font-bold text-gray-900">New Order</p>
                                        <p className="text-[10px] text-gray-500">Just now • ₦ 45,000</p>
                                    </div>
                                </div>
                            </motion.div>
                        </div>
                        {/* Background blobs behind image */}
                        <div className="absolute -top-10 -right-10 w-64 h-64 bg-gray-100/50 rounded-full blur-3xl -z-10" />
                        <div className="absolute -bottom-10 -left-10 w-64 h-64 bg-gray-100/50 rounded-full blur-3xl -z-10" />
                    </motion.div>
                </div>
            </section>

            {/* Features Strip */}
            <section className="py-24 bg-white border-y border-gray-100">
                <div className="max-w-[1440px] mx-auto px-4 lg:px-6">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl font-bold text-black">Everything you need to sell.</h2>
                    </div>
                    <div className="grid md:grid-cols-3 gap-8">
                        {[
                            { title: 'Store Builder', desc: 'No-code website builder with beautiful themes.', icon: 'Store' },
                            { title: 'Logistics', desc: 'Discounted shipping rates with top partners.', icon: 'Truck' },
                            { title: 'Payments', desc: 'Accept cards, transfers, and USSD instantly.', icon: 'CreditCard' },
                        ].map((feature, i) => (
                            <motion.div
                                key={i}
                                whileHover={{ y: -5 }}
                                className="p-8 rounded-3xl bg-gray-50 hover:bg-white hover:shadow-xl transition-all border border-transparent hover:border-gray-100"
                            >
                                <div className={`w-12 h-12 rounded-2xl bg-white border border-gray-100 shadow-sm flex items-center justify-center mb-6 text-black`}>
                                    <Icon name={feature.icon} size={24} />
                                </div>
                                <h3 className="text-xl font-bold text-black mb-3">{feature.title}</h3>
                                <p className="text-gray-500 leading-relaxed">{feature.desc}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* How It Works */}
            <section className="py-32 px-4 bg-black overflow-hidden">
                <div className="max-w-[1440px] mx-auto relative z-10">
                    <div className="grid md:grid-cols-2 gap-20 items-center">
                        <div className="text-white">
                            <span className="text-gray-400 font-bold tracking-wide uppercase mb-4 block">How it works</span>
                            <h2 className="text-4xl md:text-5xl font-bold mb-8">From idea to <br /> first sale in minutes.</h2>

                            <div className="space-y-12">
                                {[
                                    { title: 'Create your store', desc: 'Sign up and choose a template that fits your brand.' },
                                    { title: 'Add products', desc: 'Upload your inventory, set prices, and manage variants.' },
                                    { title: 'Start selling', desc: 'Share your link and accept payments instantly.' }
                                ].map((step, i) => (
                                    <div key={i} className="flex gap-6 group">
                                        <div className="flex-shrink-0 w-12 h-12 rounded-full border border-white/20 flex items-center justify-center font-bold text-xl group-hover:bg-white group-hover:text-black transition-colors">
                                            {i + 1}
                                        </div>
                                        <div>
                                            <h4 className="text-xl font-bold mb-2">{step.title}</h4>
                                            <p className="text-white/50">{step.desc}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                        <div className="relative">
                            <div className="aspect-square rounded-3xl bg-white/5 border border-white/10 p-8 rotate-3">
                                <div className="w-full h-full bg-[#111] rounded-2xl border border-white/5 flex items-center justify-center text-white/20 font-medium">
                                    <div className="text-center">
                                        <Icon name="LayoutDashboard" size={48} className="mx-auto mb-4 opacity-50" />
                                        <p>Dashboard Preview</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* CTA */}
            <section className="py-20 px-4">
                <div className="max-w-5xl mx-auto bg-gray-50 border border-gray-100 rounded-[2.5rem] p-12 md:p-20 text-center relative overflow-hidden">
                    <div className="relative z-10">
                        <h2 className="text-4xl md:text-5xl font-bold text-black mb-6">Ready to scale?</h2>
                        <p className="text-gray-500 text-lg mb-8 max-w-xl mx-auto">
                            Join thousands of merchants growing their business with Vayva today.
                        </p>
                        <Link href="/signup">
                            <Button className="h-14 px-10 rounded-full bg-black hover:bg-black/80 text-white font-bold text-lg shadow-lg">
                                Create free account
                            </Button>
                        </Link>
                    </div>
                </div>
            </section>
        </div>
    );
}
