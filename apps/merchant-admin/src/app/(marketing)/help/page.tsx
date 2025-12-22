'use client';

import React from 'react';
import { Icon } from '@vayva/ui';

export default function HelpCenterPage() {
    return (
        <div className="min-h-screen py-20 px-4">
            <div className="max-w-6xl mx-auto">
                <div className="text-center mb-16">
                    <h1 className="text-4xl font-bold text-white mb-6">How can we help?</h1>

                    <div className="max-w-xl mx-auto relative">
                        <Icon name={"Search" as any} className="absolute left-4 top-1/2 -translate-y-1/2 text-white/50" />
                        <input
                            placeholder="Search for articles..."
                            className="w-full h-12 bg-white/5 border border-white/10 rounded-full pl-12 pr-4 text-white placeholder:text-white/30 focus:outline-none focus:border-[#46EC13]"
                        />
                    </div>
                </div>

                <div className="grid md:grid-cols-3 gap-6">
                    {[
                        { title: 'Getting Started', icon: 'Flag' },
                        { title: 'Account & Billing', icon: 'User' },
                        { title: 'Store Management', icon: 'Store' },
                        { title: 'Payments & Payouts', icon: 'Banknote' },
                        { title: 'Delivery & Logistics', icon: 'Truck' },
                        { title: 'WhatsApp Automation', icon: 'MessageSquare' },
                    ].map((cat, i) => (
                        <div key={i} className="bg-white/5 border border-white/10 p-6 rounded-2xl hover:bg-white/10 transition-colors cursor-pointer group">
                            <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-white/70 group-hover:text-[#46EC13] mb-4">
                                <Icon name={cat.icon as any} />
                            </div>
                            <h3 className="text-lg font-bold text-white mb-2">{cat.title}</h3>
                            <p className="text-white/40 text-sm">Browse 12 articles</p>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
