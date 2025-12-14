'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { AdminShell } from '@/components/admin-shell';
import { GlassPanel } from '@/components/ui/glass-panel';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Stepper } from '@/components/ui/stepper';

export default function DeliveryPage() {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);

    // Delivery State
    const [enablePickup, setEnablePickup] = useState(true);
    const [enableDelivery, setEnableDelivery] = useState(true);
    const [flatFee, setFlatFee] = useState('1500');

    const handleSave = async () => {
        setIsLoading(true);
        await new Promise(r => setTimeout(r, 1000));
        setIsLoading(false);
        router.push('/onboarding/whatsapp');
    };

    return (
        <AdminShell mode="onboarding" breadcrumb="Onboarding / Delivery">
            <div className="flex flex-col gap-6 max-w-5xl mx-auto">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold text-white">Delivery setup</h1>
                        <p className="text-text-secondary">How will customers get their orders?</p>
                    </div>
                    <Stepper currentStep={6} />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Methods */}
                    <GlassPanel className="p-8 flex flex-col gap-8">
                        <div className="flex items-center justify-between">
                            <div>
                                <h3 className="font-bold text-white">Store Pickup</h3>
                                <p className="text-sm text-text-secondary">Customers pick up from your address</p>
                            </div>
                            <input
                                type="checkbox"
                                className="toggle toggle-primary"
                                checked={enablePickup}
                                onChange={e => setEnablePickup(e.target.checked)}
                            />
                        </div>

                        <div className="border-t border-white/5" />

                        <div className="flex items-center justify-between">
                            <div>
                                <h3 className="font-bold text-white">Local Delivery</h3>
                                <p className="text-sm text-text-secondary">You deliver to customers</p>
                            </div>
                            <input
                                type="checkbox"
                                className="toggle toggle-primary"
                                checked={enableDelivery}
                                onChange={e => setEnableDelivery(e.target.checked)}
                            />
                        </div>
                    </GlassPanel>

                    {/* Fees */}
                    {enableDelivery && (
                        <GlassPanel className="p-8 flex flex-col gap-6 animate-fade-in">
                            <h3 className="font-bold text-white">Delivery Fees</h3>

                            <Input
                                label="Nationwide Flat Fee (₦)"
                                value={flatFee}
                                onChange={e => setFlatFee(e.target.value)}
                                type="number"
                            />

                            <div className="flex gap-2 flex-wrap">
                                <span className="px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs text-text-secondary cursor-pointer hover:bg-white/10">Lagos</span>
                                <span className="px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs text-text-secondary cursor-pointer hover:bg-white/10">Abuja</span>
                                <span className="px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs text-text-secondary cursor-pointer hover:bg-white/10 text-primary border-primary/30 bg-primary/10">+ Add Zone Override</span>
                            </div>
                        </GlassPanel>
                    )}
                </div>

                <div className="flex justify-between">
                    <Button variant="ghost" onClick={() => router.back()}>Back</Button>
                    <Button onClick={handleSave} isLoading={isLoading}>Save & Continue</Button>
                </div>
            </div>
        </AdminShell>
    );
}
