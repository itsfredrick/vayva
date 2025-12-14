'use client';

import React from 'react';
import { AdminShell } from '@/components/admin-shell';
import { GlassPanel } from '@/components/ui/glass-panel';
import { Button } from '@/components/ui/button';
import { Icon } from '@/components/ui/icon';

export default function DomainsPage() {
    return (
        <AdminShell title="Domains" breadcrumb="Storefront / Domains">
            <div className="flex flex-col gap-8 max-w-4xl mx-auto">
                <div className="flex flex-col gap-1">
                    <h1 className="text-2xl font-bold text-white">Domains</h1>
                    <p className="text-text-secondary">Manage your web address and custom domains.</p>
                </div>

                {/* Vayva Subdomain */}
                <GlassPanel className="p-0 overflow-hidden">
                    <div className="bg-primary/5 p-6 border-b border-primary/10">
                        <div className="flex items-start justify-between">
                            <div className="flex gap-4">
                                <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center text-primary">
                                    <Icon name="language" size={24} />
                                </div>
                                <div className="flex flex-col gap-1">
                                    <h3 className="font-bold text-white text-lg">brand.vayva.ng</h3>
                                    <div className="flex items-center gap-2">
                                        <span className="px-2 py-0.5 rounded bg-state-success/10 text-state-success text-[10px] font-bold uppercase tracking-wider">Primary</span>
                                        <span className="text-sm text-text-secondary">Your default Vayva address</span>
                                    </div>
                                </div>
                            </div>
                            <Button variant="outline" size="sm">Change</Button>
                        </div>
                    </div>
                </GlassPanel>

                {/* Custom Domain Placeholder */}
                <GlassPanel className="p-8 text-center flex flex-col items-center justify-center gap-4 border-2 border-dashed border-white/10 shadow-none bg-transparent">
                    <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center mb-2">
                        <Icon name="dns" size={32} className="text-text-secondary" />
                    </div>
                    <h3 className="text-xl font-bold text-white">Connect a Custom Domain</h3>
                    <p className="text-text-secondary max-w-md">
                        Already own a domain like <strong>mystore.com</strong>? Connect it to Vayva to build trust with your customers.
                    </p>
                    <div className="flex gap-4 mt-2">
                        <Button>Buy New Domain</Button>
                        <Button variant="white">Connect Existing Domain</Button>
                    </div>
                </GlassPanel>
            </div>
        </AdminShell>
    );
}
