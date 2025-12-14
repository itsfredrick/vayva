'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { AdminShell } from '@/components/admin-shell';
import { GlassPanel } from '@/components/ui/glass-panel';
import { Button } from '@/components/ui/button';
import { Stepper } from '@/components/ui/stepper';
import { Icon } from '@/components/ui/icon';

export default function WhatsAppPage() {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);
    const [step, setStep] = useState(1); // 1: Info, 2: Connect, 3: Success

    const handleConnect = async () => {
        setIsLoading(true);
        // Simulate QR scan / auth
        await new Promise(r => setTimeout(r, 2000));
        setIsLoading(false);
        setStep(3);
    };

    const handleContinue = () => {
        router.push('/onboarding/review');
    };

    return (
        <AdminShell mode="onboarding" breadcrumb="Onboarding / WhatsApp AI">
            <div className="flex flex-col gap-6 max-w-5xl mx-auto h-full">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold text-white">WhatsApp AI Agent</h1>
                        <p className="text-text-secondary">Automate your sales and support.</p>
                    </div>
                    <Stepper currentStep={7} />
                </div>

                <div className="flex justify-center mt-8">
                    <GlassPanel className="w-full max-w-2xl p-10 flex flex-col gap-8 text-center items-center relative overflow-hidden">
                        {/* Background Splat */}
                        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-64 h-64 bg-primary/10 rounded-full blur-3xl -z-10" />

                        {step === 1 && (
                            <>
                                <div className="w-20 h-20 rounded-full bg-white/5 flex items-center justify-center border border-white/10 shadow-glow">
                                    <Icon name="smart_toy" className="text-4xl text-primary" />
                                </div>

                                <div>
                                    <h2 className="text-2xl font-bold text-white mb-4">Meet your new AI assistant</h2>
                                    <p className="text-text-secondary max-w-md mx-auto">
                                        Vayva&apos;s AI agent connects to your WhatsApp Business number to answer customer questions, take orders, and send updates 24/7.
                                    </p>
                                </div>

                                <div className="grid grid-cols-2 gap-4 text-left w-full max-w-md">
                                    <div className="p-4 rounded-xl bg-white/5 border border-white/5">
                                        <div className="font-bold text-white mb-1"><Icon name="schedule" className="inline mr-2 text-primary" size={16} /> 24/7 Availability</div>
                                        <p className="text-xs text-text-secondary">Never miss a late-night order</p>
                                    </div>
                                    <div className="p-4 rounded-xl bg-white/5 border border-white/5">
                                        <div className="font-bold text-white mb-1"><Icon name="verified_user" className="inline mr-2 text-primary" size={16} /> Human Review</div>
                                        <p className="text-xs text-text-secondary">You approve big decisions</p>
                                    </div>
                                </div>

                                <div className="flex flex-col gap-3 w-full max-w-xs">
                                    <Button onClick={() => setStep(2)}>Connect WhatsApp</Button>
                                    <Button variant="ghost" onClick={handleContinue}>Skip for now</Button>
                                </div>
                            </>
                        )}

                        {step === 2 && (
                            <>
                                <h2 className="text-xl font-bold text-white">Scan to Connect</h2>
                                <div className="w-48 h-48 bg-white rounded-xl flex items-center justify-center">
                                    {/* Mock QR */}
                                    <div className="w-40 h-40 bg-black/10 grid grid-cols-4 gap-1 p-2">
                                        {/* Fake squares */}
                                        {Array.from({ length: 16 }).map((_, i) => (
                                            <div key={i} className={`rounded-sm ${Math.random() > 0.5 ? 'bg-black' : 'bg-transparent'}`} />
                                        ))}
                                    </div>
                                </div>
                                <p className="text-sm text-text-secondary">
                                    Open WhatsApp on your phone &gt; Linked Devices &gt; Link a Device
                                </p>
                                <Button onClick={handleConnect} isLoading={isLoading}>Simulate Scan Success</Button>
                            </>
                        )}

                        {step === 3 && (
                            <>
                                <div className="w-20 h-20 rounded-full bg-state-success/20 flex items-center justify-center border border-state-success/30 animate-scale-in">
                                    <Icon name="check" className="text-4xl text-state-success" />
                                </div>
                                <h2 className="text-2xl font-bold text-white">Connected Successfully!</h2>
                                <p className="text-text-secondary">Your AI agent is now active and ready to learn.</p>
                                <Button onClick={handleContinue} className="w-full max-w-xs">Continue</Button>
                            </>
                        )}
                    </GlassPanel>
                </div>
            </div>
        </AdminShell>
    );
}
