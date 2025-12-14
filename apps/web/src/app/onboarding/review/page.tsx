'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { AdminShell } from '@/components/admin-shell';
import { GlassPanel } from '@/components/ui/glass-panel';
import { Button } from '@/components/ui/button';
import { Stepper } from '@/components/ui/stepper';
import { Icon } from '@/components/ui/icon';

export default function ReviewPage() {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);
    const [isPublished, setIsPublished] = useState(false);
    const [listOnMarketplace, setListOnMarketplace] = useState(true);

    const handlePublish = async () => {
        setIsLoading(true);
        // Simulate publish
        await new Promise(r => setTimeout(r, 2000));
        setIsLoading(false);
        setIsPublished(true);
    };

    if (isPublished) {
        return (
            <AdminShell mode="onboarding" breadcrumb="Onboarding / Success">
                <div className="flex flex-col items-center justify-center h-full max-w-2xl mx-auto text-center gap-8 animate-fade-in">
                    <div className="w-24 h-24 rounded-full bg-primary/20 flex items-center justify-center border border-primary/30 shadow-[0_0_50px_rgba(70,236,19,0.3)]">
                        <Icon name="rocket_launch" className="text-5xl text-primary" />
                    </div>

                    <div>
                        <h1 className="text-3xl font-bold text-white mb-2">Your store is live!</h1>
                        <p className="text-text-secondary text-lg">
                            Congratulations, <span className="text-white font-bold">Amina Beauty</span> is now open for business.
                        </p>
                    </div>

                    <div className="flex items-center gap-2 p-4 rounded-full bg-white/5 border border-white/10 pr-6">
                        <div className="w-3 h-3 rounded-full bg-state-success animate-pulse ml-2" />
                        <span className="text-white font-mono">aminabeauty.vayva.ng</span>
                        <Link href="#" target="_blank" className="ml-2 text-primary hover:underline text-sm font-bold">
                            Open Store
                            <Icon name="open_in_new" size={14} className="inline ml-1" />
                        </Link>
                    </div>

                    <div className="grid grid-cols-2 gap-4 w-full">
                        <Button onClick={() => router.push('/admin')}>
                            Go to Dashboard
                        </Button>
                        <Button variant="outline" onClick={() => router.push('/admin/products/new')}>
                            Add More Products
                        </Button>
                    </div>
                </div>
            </AdminShell>
        );
    }

    return (
        <AdminShell mode="onboarding" breadcrumb="Onboarding / Review">
            <div className="flex flex-col gap-6 max-w-5xl mx-auto h-full">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold text-white">Review & Publish</h1>
                        <p className="text-text-secondary">Double check everything before you go live.</p>
                    </div>
                    <Stepper currentStep={8} />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {/* Checklist */}
                    <GlassPanel className="md:col-span-1 p-8">
                        <h3 className="font-bold text-white mb-6">Launch Checklist</h3>
                        <div className="flex flex-col gap-4">
                            <CheckItem label="Store Details" status="completed" />
                            <CheckItem label="Branding" status="completed" />
                            <CheckItem label="Products" status="completed" count={2} />
                            <CheckItem label="Payments" status="completed" />
                            <CheckItem label="Delivery" status="completed" />
                            <CheckItem label="WhatsApp AI" status="optional" />
                        </div>
                    </GlassPanel>

                    {/* Preview & Action */}
                    <div className="md:col-span-2 flex flex-col gap-6">
                        <div className="flex-1 bg-black/40 rounded-2xl border border-white/10 flex items-center justify-center min-h-[400px] relative overflow-hidden group">
                            {/* Mock Preview Overlay */}
                            <div className="text-center">
                                <Icon name="storefront" className="text-6xl text-white/20 mb-4" />
                                <p className="text-white/40">Store Preview Generating...</p>
                            </div>
                            <button className="absolute bottom-6 right-6 px-4 py-2 rounded-full bg-white/10 hover:bg-white/20 text-white text-sm backdrop-blur transition-colors opacity-0 group-hover:opacity-100">
                                Preview in full screen
                            </button>
                        </div>

                        <GlassPanel className="p-6 flex flex-col gap-4">
                            <div className="flex items-center justify-between p-4 rounded-xl bg-white/5 border border-white/5">
                                <div>
                                    <div className="font-bold text-white">List on Vayva Market</div>
                                    <p className="text-xs text-text-secondary">Your products will be searchable on our main marketplace.</p>
                                </div>
                                <input
                                    type="checkbox"
                                    className="toggle toggle-primary"
                                    checked={listOnMarketplace}
                                    onChange={e => setListOnMarketplace(e.target.checked)}
                                />
                            </div>

                            <div className="flex gap-4">
                                <Button variant="ghost" onClick={() => router.back()}>Back</Button>
                                <Button className="flex-1" onClick={handlePublish} isLoading={isLoading}>
                                    Publish Store
                                </Button>
                                <Button variant="ghost" className="text-text-secondary">Save Draft</Button>
                            </div>
                        </GlassPanel>
                    </div>
                </div>
            </div>
        </AdminShell>
    );
}

function CheckItem({ label, status, count }: { label: string, status: 'completed' | 'warning' | 'error' | 'optional', count?: number }) {
    return (
        <div className="flex items-center justify-between">
            <span className="text-sm text-white/80">{label} {count && <span className="text-white/40">({count})</span>}</span>
            {status === 'completed' && <Icon name="check_circle" className="text-state-success" size={20} />}
            {status === 'warning' && <Icon name="warning" className="text-state-warning" size={20} />}
            {status === 'optional' && <span className="text-[10px] uppercase font-bold text-text-secondary bg-white/5 px-2 py-0.5 rounded pill">Optional</span>}
        </div>
    );
}
