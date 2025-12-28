'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { HELP_ARTICLES } from '@/lib/help';

export default function HelpCenterPage() {
    const [searchQuery, setSearchQuery] = useState('');

    const filteredArticles = HELP_ARTICLES.filter(a =>
        a.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        a.summary.toLowerCase().includes(searchQuery.toLowerCase()) ||
        a.category.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const categories = Array.from(new Set(HELP_ARTICLES.map(a => a.category)));

    return (
        <div className="min-h-screen bg-gray-50 pt-32 pb-24 px-4">
            <div className="max-w-5xl mx-auto">
                {/* Search Header */}
                <div className="text-center mb-16">
                    <h1 className="text-4xl font-bold text-[#0F172A] mb-6">How can we help?</h1>
                    <div className="relative max-w-xl mx-auto">
                        <input
                            type="text"
                            placeholder="Search for articles, features, or guides..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full px-6 py-4 rounded-2xl border border-gray-200 shadow-sm focus:ring-2 focus:ring-[#22C55E] focus:border-transparent outline-none text-lg transition-all"
                        />
                        <div className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400">
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                            </svg>
                        </div>
                    </div>
                </div>

                {/* Popular Topics / Categories */}
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {categories.map(cat => (
                        <div key={cat} className="space-y-4">
                            <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest px-2">{cat}</h3>
                            <div className="space-y-2">
                                {HELP_ARTICLES.filter(a => a.category === cat).map(article => (
                                    <Link
                                        key={article.id}
                                        href={`/help/${article.slug}`}
                                        className="block p-4 bg-white rounded-xl border border-gray-200 hover:border-[#22C55E] hover:shadow-md transition-all group"
                                    >
                                        <h4 className="font-bold text-[#0F172A] group-hover:text-[#22C55E] transition-colors line-clamp-1">
                                            {article.title}
                                        </h4>
                                        <p className="text-xs text-gray-500 mt-1 line-clamp-1">{article.summary}</p>
                                    </Link>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>

                {/* Contact Routing */}
                <div className="mt-24 p-12 bg-[#0F172A] rounded-3xl text-center relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-green-500/10 blur-[80px] rounded-full" />
                    <h2 className="text-3xl font-bold text-white mb-4 relative z-10">Can't find what you need?</h2>
                    <p className="text-gray-400 mb-8 max-w-lg mx-auto relative z-10">
                        Our support team is available 9am - 8pm WAT for live chat and technical assistance.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center relative z-10">
                        <a
                            href="mailto:support@vayva.io"
                            className="px-8 py-4 bg-[#22C55E] hover:bg-[#16A34A] text-white font-bold rounded-xl shadow-lg transition-all"
                        >
                            Email Support
                        </a>
                        <Link
                            href="/contact"
                            className="px-8 py-4 bg-white/10 hover:bg-white/20 text-white font-bold rounded-xl backdrop-blur-sm transition-all"
                        >
                            Open a Ticket
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
