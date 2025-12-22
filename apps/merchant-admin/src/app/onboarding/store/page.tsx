'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { AppShell } from '@vayva/ui';
import { GlassPanel } from '@vayva/ui';
import { Button } from '@vayva/ui';
import { Input } from '@vayva/ui';
import { Stepper } from '@vayva/ui';

export default function StoreDetailsPage() {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);

    // Form state
    const [storeName, setStoreName] = useState('');
    const [category, setCategory] = useState('');
    const [subdomain, setSubdomain] = useState('');
    const [address, setAddress] = useState('');
    const [city, setCity] = useState('');
    const [state, setState] = useState('Lagos');

    const handleNameChange = (val: string) => {
        setStoreName(val);
        // Auto-slugify
        const slug = val.toLowerCase().replace(/[^a-z0-9]/g, '-');
        setSubdomain(slug);
    };

    const handleSave = async () => {
        setIsLoading(true);
        await new Promise(r => setTimeout(r, 1000));
        setIsLoading(false);
        router.push('/onboarding/brand');
    };

    const isFormValid = storeName && category && subdomain && address && city;

    return (
        <AppShell sidebar={<></>} header={<></>}>
            <div className="flex flex-col gap-6 max-w-5xl mx-auto">
                {/* Header With Stepper */}
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold text-white">Store Details</h1>
                        <p className="text-text-secondary">Tell us a bit about your business.</p>
                    </div>
                    <Stepper currentStep={2} steps={[]} />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {/* Main Form */}
                    <GlassPanel className="md:col-span-2 p-8 flex flex-col gap-6">
                        <Input
                            label="Store Name"
                            placeholder="e.g. Amina Beauty"
                            value={storeName}
                            onChange={e => handleNameChange(e.target.value)}
                            data-testid="onboarding-store-name"
                        />

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="text-xs uppercase tracking-widest text-[rgba(255,255,255,0.65)] font-bold mb-2 block">Category</label>
                                <select
                                    className="w-full h-[48px] px-4 rounded-full bg-[rgba(20,34,16,0.6)] border border-[rgba(255,255,255,0.08)] text-white outline-none focus:border-primary appearance-none"
                                    value={category}
                                    onChange={e => setCategory(e.target.value)}
                                >
                                    <option value="">Select...</option>
                                    <option value="fashion">Fashion & Clothing</option>
                                    <option value="beauty">Beauty & Personal Care</option>
                                    <option value="electronics">Electronics</option>
                                    <option value="food">Food & Groceries</option>
                                    <option value="home">Home & Living</option>
                                </select>
                            </div>

                            <Input
                                label="Subdomain"
                                placeholder="storename"
                                value={subdomain}
                                onChange={e => setSubdomain(e.target.value)}
                            />
                        </div>

                        <div className="border-t border-white/5 pt-4">
                            <h3 className="font-bold text-white mb-4">Business Address</h3>
                            <div className="flex flex-col gap-4">
                                <Input
                                    label="Address Line 1"
                                    placeholder="e.g. 12 Adetokunbo Ademola St"
                                    value={address}
                                    onChange={e => setAddress(e.target.value)}
                                />
                                <div className="grid grid-cols-2 gap-4">
                                    <Input
                                        label="City"
                                        placeholder="e.g. Victoria Island"
                                        value={city}
                                        onChange={e => setCity(e.target.value)}
                                    />
                                    <div>
                                        <label className="text-xs uppercase tracking-widest text-[rgba(255,255,255,0.65)] font-bold mb-2 block">State</label>
                                        <select
                                            className="w-full h-[48px] px-4 rounded-full bg-[rgba(20,34,16,0.6)] border border-[rgba(255,255,255,0.08)] text-white outline-none focus:border-primary appearance-none"
                                            value={state}
                                            onChange={e => setState(e.target.value)}
                                        >
                                            <option value="Lagos">Lagos</option>
                                            <option value="Abuja">Abuja / FCT</option>
                                            <option value="Rivers">Rivers</option>
                                            <option value="Oyo">Oyo</option>
                                        </select>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="flex justify-between pt-4 mt-auto">
                            <Button variant="ghost" onClick={() => router.back()}>Back</Button>
                            <Button onClick={handleSave} disabled={!isFormValid} isLoading={isLoading} data-testid="onboarding-store-submit">Save & Continue</Button>
                        </div>
                    </GlassPanel>

                    {/* Preview Panel */}
                    <div className="md:col-span-1">
                        <GlassPanel className="p-6 sticky top-6 opacity-80">
                            <h3 className="text-xs uppercase tracking-widest text-text-secondary font-bold mb-4">Storefront Preview</h3>

                            {/* Fake Browser Window */}
                            <div className="bg-background-dark rounded-xl border border-white/10 overflow-hidden">
                                <div className="h-8 bg-white/5 border-b border-white/5 flex items-center px-3 gap-2">
                                    <div className="flex gap-1">
                                        <div className="w-2 h-2 rounded-full bg-red-400" />
                                        <div className="w-2 h-2 rounded-full bg-yellow-400" />
                                        <div className="w-2 h-2 rounded-full bg-green-400" />
                                    </div>
                                    <div className="flex-1 bg-black/20 h-5 rounded text-[10px] flex items-center justify-center text-text-secondary">
                                        {subdomain || 'yourstore'}.vayva.ng
                                    </div>
                                </div>
                                <div className="p-4 flex flex-col items-center gap-3">
                                    <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center text-xl">
                                        🛍️
                                    </div>
                                    <div className="h-4 w-24 bg-white/10 rounded"></div>
                                    <div className="w-full h-24 bg-white/5 rounded-lg border border-dashed border-white/10 flex items-center justify-center text-xs text-text-secondary">
                                        Hero Banner
                                    </div>
                                </div>
                            </div>

                            <p className="text-xs text-text-secondary mt-4 text-center">
                                This is how your store URL will look to customers.
                            </p>
                        </GlassPanel>
                    </div>
                </div>
            </div>
        </AppShell>
    );
}
