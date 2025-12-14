'use client';

import React from 'react';
import Link from 'next/link';
import { AdminShell } from '@/components/admin-shell';
import { GlassPanel } from '@/components/ui/glass-panel';
import { Button } from '@/components/ui/button';
import { Icon } from '@/components/ui/icon';

export default function MarketplacePromotionsPage() {
    return (
        <AdminShell title="Marketplace Promotions" breadcrumb="Marketplace / Promotions">
            <div className="max-w-4xl mx-auto py-10">
                <GlassPanel className="p-10 text-center relative overflow-hidden border-indigo-500/20">
                    <div className="absolute inset-0 bg-gradient-to-br from-indigo-900/10 to-transparent pointer-events-none" />

                    <span className="inline-block px-3 py-1 rounded-full bg-indigo-500/20 text-indigo-300 text-xs font-bold uppercase tracking-wider mb-6">
                        Coming Soon
                    </span>

                    <h1 className="text-3xl font-bold text-white mb-4">Boost Sales with Promotions</h1>
                    <p className="text-text-secondary text-lg mb-10 max-w-xl mx-auto">
                        Soon you'll be able to run targeted campaigns and sponsored listings to reach even more customers on Vayva Market.
                    </p>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 opacity-60 pointer-events-none select-none filter grayscale">
                        <div className="p-6 rounded-xl bg-white/5 border border-white/5 flex flex-col items-center gap-3">
                            <Icon name="campaign" size={32} />
                            <h3 className="font-bold text-white">Sponsored Listings</h3>
                            <p className="text-xs text-text-secondary">Appear at the top of search results.</p>
                            <Button size="sm" variant="outline" className="mt-2" disabled>Start</Button>
                        </div>
                        <div className="p-6 rounded-xl bg-white/5 border border-white/5 flex flex-col items-center gap-3">
                            <Icon name="verified" size={32} />
                            <h3 className="font-bold text-white">Featured Badge</h3>
                            <p className="text-xs text-text-secondary">Stand out with a trusted seller badge.</p>
                            <Button size="sm" variant="outline" className="mt-2" disabled>Apply</Button>
                        </div>
                        <div className="p-6 rounded-xl bg-white/5 border border-white/5 flex flex-col items-center gap-3">
                            <Icon name="local_offer" size={32} />
                            <h3 className="font-bold text-white">Flash Deals</h3>
                            <p className="text-xs text-text-secondary">Run limited-time discount campaigns.</p>
                            <Button size="sm" variant="outline" className="mt-2" disabled>Create</Button>
                        </div>
                    </div>
                </GlassPanel>
            </div>
        </AdminShell>
    );
}
