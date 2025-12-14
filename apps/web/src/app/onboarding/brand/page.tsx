'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { AdminShell } from '@/components/admin-shell';
import { GlassPanel } from '@/components/ui/glass-panel';
import { Button } from '@/components/ui/button';
import { Stepper } from '@/components/ui/stepper';

export default function BrandingPage() {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);

    // Brand State
    const [color, setColor] = useState('#46EC13');
    const [font, setFont] = useState('manrope');
    const [headerStyle, setHeaderStyle] = useState('minimal');

    const handleSave = async () => {
        setIsLoading(true);
        await new Promise(r => setTimeout(r, 1000));
        setIsLoading(false);
        router.push('/onboarding/products');
    };

    return (
        <AdminShell mode="onboarding" breadcrumb="Onboarding / Branding">
            <div className="flex flex-col gap-6 max-w-5xl mx-auto">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold text-white">Brand your store</h1>
                        <p className="text-text-secondary">Make it yours with colors and logos.</p>
                    </div>
                    <Stepper currentStep={3} />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {/* Controls */}
                    <GlassPanel className="md:col-span-1 p-6 flex flex-col gap-8">
                        {/* Logo */}
                        <div>
                            <h3 className="font-bold text-white mb-3">Logo</h3>
                            <div className="border border-dashed border-white/20 rounded-xl p-6 flex flex-col items-center justify-center gap-2 cursor-pointer hover:bg-white/5 transition-colors">
                                <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center">+</div>
                                <span className="text-sm text-text-secondary">Upload Logo</span>
                            </div>
                        </div>

                        {/* Colors */}
                        <div>
                            <h3 className="font-bold text-white mb-3">Accent Color</h3>
                            <div className="flex gap-3 flex-wrap">
                                {['#46EC13', '#3B82F6', '#EF4444', '#F59E0B', '#8B5CF6'].map(c => (
                                    <button
                                        key={c}
                                        onClick={() => setColor(c)}
                                        className={`w-8 h-8 rounded-full border-2 transition-all ${color === c ? 'border-white scale-110' : 'border-transparent'}`}
                                        style={{ backgroundColor: c }}
                                    />
                                ))}
                                <input
                                    type="color"
                                    value={color}
                                    onChange={e => setColor(e.target.value)}
                                    className="w-8 h-8 opacity-0 absolute"
                                />
                                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-white/20 to-black/20 flex items-center justify-center text-xs border border-white/10 cursor-pointer">+</div>
                            </div>
                        </div>

                        {/* Typography */}
                        <div>
                            <h3 className="font-bold text-white mb-3">Typography</h3>
                            <div className="flex flex-col gap-2">
                                <button
                                    onClick={() => setFont('manrope')}
                                    className={`p-3 rounded-lg border text-left transition-all ${font === 'manrope' ? 'bg-white/10 border-primary' : 'border-white/10'}`}
                                >
                                    <span className="block font-bold text-white">Manrope (Default)</span>
                                    <span className="text-xs text-text-secondary">Clean & Modern</span>
                                </button>
                                <button
                                    onClick={() => setFont('serif')}
                                    className={`p-3 rounded-lg border text-left transition-all ${font === 'serif' ? 'bg-white/10 border-primary' : 'border-white/10'}`}
                                >
                                    <span className="block font-bold text-white font-serif">Elegant Serif</span>
                                    <span className="text-xs text-text-secondary">Classic & Trustworthy</span>
                                </button>
                            </div>
                        </div>
                    </GlassPanel>

                    {/* Preview */}
                    <div className="md:col-span-2">
                        <div className="sticky top-6 rounded-2xl border border-white/10 overflow-hidden bg-[#0a0a0a] min-h-[500px] flex flex-col">
                            {/* Mock Header */}
                            <div className={`border-b border-white/5 p-6 flex items-center justify-between ${headerStyle === 'bold' ? 'bg-white/5' : ''}`}>
                                <div className="font-bold text-xl text-white">Store Logo</div>
                                <div className="flex gap-4 text-sm text-gray-400">
                                    <span>Home</span>
                                    <span>Catalog</span>
                                    <span>Contact</span>
                                </div>
                                <div className="w-8 h-8 rounded-full bg-white/10" />
                            </div>

                            {/* Mock Hero */}
                            <div className="p-12 flex flex-col items-center justify-center text-center gap-6 border-b border-white/5 bg-[url('https://images.unsplash.com/photo-1557683316-973673baf926?auto=format&fit=crop&w=1000&q=80')] bg-cover relative">
                                <div className="absolute inset-0 bg-black/60 backdrop-blur-[2px]" />
                                <div className="relative z-10 flex flex-col items-center gap-4">
                                    <h2 className="text-4xl font-bold text-white">New Collection</h2>
                                    <p className="text-gray-300 max-w-md">Discover the latest trends in our summer collection. Quality meets style.</p>
                                    <button
                                        className="h-10 px-6 rounded-full font-bold text-black"
                                        style={{ backgroundColor: color }}
                                    >
                                        Shop Now
                                    </button>
                                </div>
                            </div>

                            {/* Mock Grid */}
                            <div className="p-8 grid grid-cols-2 gap-4">
                                <div className="aspect-square bg-white/5 rounded-lg" />
                                <div className="aspect-square bg-white/5 rounded-lg" />
                            </div>
                        </div>

                        <div className="flex justify-between pt-6">
                            <Button variant="ghost" onClick={() => router.back()}>Back</Button>
                            <Button onClick={handleSave} isLoading={isLoading}>Save & Continue</Button>
                        </div>
                    </div>
                </div>
            </div>
        </AdminShell>
    );
}
