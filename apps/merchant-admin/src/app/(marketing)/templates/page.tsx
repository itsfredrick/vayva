'use client';

import React from 'react';
import Link from 'next/link';
import { Button , Icon } from '@vayva/ui';
import { motion } from 'framer-motion';

const THEMES = [
    { name: 'Aurora', category: 'Fashion', image: 'bg-pink-500/20' },
    { name: 'Onyx', category: 'Electronics', image: 'bg-blue-500/20' },
    { name: 'Sage', category: 'Home & Living', image: 'bg-green-500/20' },
    { name: 'Ember', category: 'Beauty', image: 'bg-orange-500/20' },
    { name: 'Obsidian', category: 'Luxury', image: 'bg-black/50' },
    { name: 'Cobalt', category: 'Services', image: 'bg-indigo-500/20' },
];

export default function TemplatesPage() {
    return (
        <div className="min-h-screen py-20 px-4">
            <div className="max-w-7xl mx-auto">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    className="text-center max-w-3xl mx-auto mb-16"
                >
                    <h1 className="text-4xl md:text-6xl font-bold text-[#1d1d1f] mb-6">Start with style.</h1>
                    <p className="text-xl text-[#1d1d1f]/60 mb-8">
                        Choose from our professionally designed themes. Fully customizable and optimized for mobile.
                    </p>

                    {/* Filters */}
                    <div className="flex flex-wrap justify-center gap-3">
                        {['All', 'Fashion', 'Electronics', 'Beauty', 'Food', 'Services'].map((filter, i) => (
                            <button key={filter} className={`px-5 py-2 rounded-full text-sm font-bold border transition-colors ${i === 0 ? 'bg-[#1d1d1f] text-white border-[#1d1d1f]' : 'bg-transparent text-[#1d1d1f]/60 border-gray-200 hover:border-gray-400 hover:text-[#1d1d1f]'}`}>
                                {filter}
                            </button>
                        ))}
                    </div>
                </motion.div>

                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {THEMES.map((theme, i) => (
                        <motion.div
                            key={theme.name}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: i * 0.1 }}
                            className="group cursor-pointer"
                        >
                            <div className={`aspect-[3/4] rounded-[2rem] ${theme.image.replace('/20', '/10')} border border-gray-100 mb-6 relative overflow-hidden shadow-sm group-hover:shadow-xl transition-all duration-500`}>
                                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 bg-white/20 backdrop-blur-sm transition-opacity">
                                    <Button className="rounded-full font-bold bg-[#1d1d1f] text-white hover:bg-[#1d1d1f]/90 shadow-xl">Preview Theme</Button>
                                </div>
                            </div>
                            <div className="flex justify-between items-center px-2">
                                <div>
                                    <h3 className="text-xl font-bold text-[#1d1d1f]">{theme.name}</h3>
                                    <p className="text-[#1d1d1f]/50 text-sm">{theme.category}</p>
                                </div>
                                <Link href="/auth/signup">
                                    <span className="text-sm font-bold text-[#46EC13] group-hover:underline">Use this theme</span>
                                </Link>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </div>
    );
}
