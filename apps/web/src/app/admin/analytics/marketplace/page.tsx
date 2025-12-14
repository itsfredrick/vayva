'use client';

import React from 'react';
import { AdminShell } from '@/components/admin-shell';
import { GlassPanel } from '@/components/ui/glass-panel';
import { Button } from '@/components/ui/button';
import { Icon } from '@/components/ui/icon';

export default function MarketplaceAnalyticsPage() {
    return (
        <AdminShell title="Marketplace Analytics" breadcrumb="Analytics / Marketplace">
            {/* Not Enabled State Placeholder */}
            <div className="flex flex-col items-center justify-center h-[50vh] text-center max-w-lg mx-auto">
                <div className="w-20 h-20 rounded-full bg-indigo-500/10 flex items-center justify-center mb-6">
                    <Icon name="storefront" size={40} className="text-indigo-400" />
                </div>
                <h2 className="text-2xl font-bold text-white mb-2">Sell on Vayva Market</h2>
                <p className="text-text-secondary mb-8">
                    Reach millions of customers by listing your products on the Vayva Marketplace.
                    Connect now to see analytics here.
                </p>
                <Button className="bg-indigo-600 hover:bg-indigo-500 text-white border-none">Enable Marketplace</Button>
            </div>
        </AdminShell>
    );
}
