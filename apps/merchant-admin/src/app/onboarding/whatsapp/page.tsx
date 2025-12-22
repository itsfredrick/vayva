'use client';

import React, { useState } from 'react';
import { Button, Input, Icon, GlassPanel } from '@vayva/ui';
import { useOnboarding } from '@/context/OnboardingContext';
import { useAuth } from '@/context/AuthContext';
import { PhoneInput } from '@/components/ui/PhoneInput';

export default function WhatsAppPage() {
    const { state, updateState, goToStep } = useOnboarding();
    const { user } = useAuth();

    const [mode, setMode] = useState<'own' | 'vayva'>('own');
    const [ownNumber, setOwnNumber] = useState(state?.identity?.phone || '');
    const [loading, setLoading] = useState(false);

    const userPlan = (user as any)?.plan || 'free';
    const isStarter = userPlan === 'starter';

    const handleSelectMode = (m: 'own' | 'vayva') => {
        if (m === 'vayva' && isStarter) {
            alert("Vayva dedicated numbers are available on Growth and Pro plans.");
            return;
        }
        setMode(m);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        // Simulate connection check
        await new Promise(r => setTimeout(r, 1000));

        await updateState({
            whatsapp: {
                mode,
                number: mode === 'own' ? ownNumber : 'PENDING_ASSIGNMENT',
                status: 'pending' // pending manual QR scan usually
            }
        });

        setLoading(false);
        await goToStep('kyc');
    };

    return (
        <div className="max-w-xl mx-auto">
            <div className="mb-8">
                <h1 className="text-2xl font-bold text-black mb-2">WhatsApp AI Setup</h1>
                <p className="text-gray-600">Connect a number to start automating sales and support.</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
                {/* Mode Selection */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div
                        onClick={() => handleSelectMode('own')}
                        className={`
                            cursor-pointer p-6 rounded-2xl border-2 transition-all relative
                            ${mode === 'own' ? 'border-black bg-white shadow-md' : 'border-gray-100 bg-white hover:border-gray-200'}
                        `}
                    >
                        <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center mb-4">
                            <Icon name="Smartphone" className="text-green-600" />
                        </div>
                        <h3 className="font-bold text-black mb-1">Use my number</h3>
                        <p className="text-xs text-gray-500">Connect your existing WhatsApp Business number.</p>
                        {mode === 'own' && <div className="absolute top-4 right-4"><Icon name={"CheckCircle" as any} className="text-black" size={20} /></div>}
                    </div>

                    <div
                        onClick={() => handleSelectMode('vayva')}
                        className={`
                            cursor-pointer p-6 rounded-2xl border-2 transition-all relative
                            ${mode === 'vayva' ? 'border-black bg-white shadow-md' : 'border-gray-100 bg-white hover:border-gray-200'}
                            ${isStarter ? 'opacity-75 bg-gray-50' : ''}
                        `}
                    >
                        <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center mb-4">
                            <Icon name="Phone" className="text-blue-600" />
                        </div>
                        <h3 className="font-bold text-black mb-1">Get Vayva Number</h3>
                        <p className="text-xs text-gray-500">We assign a dedicated business number for you.</p>

                        {isStarter ? (
                            <span className="absolute top-4 right-4 bg-gray-200 text-gray-600 text-[10px] font-bold px-2 py-1 rounded">GROWTH+</span>
                        ) : (
                            mode === 'vayva' && <div className="absolute top-4 right-4"><Icon name={"CheckCircle" as any} className="text-black" size={20} /></div>
                        )}
                    </div>
                </div>

                {/* Configuration */}
                <div className="bg-white p-8 rounded-2xl border border-gray-200 shadow-sm">
                    {mode === 'own' ? (
                        <div className="space-y-4">
                            <h3 className="font-bold text-black">Enter your WhatsApp Number</h3>
                            <PhoneInput
                                label="Phone Number"
                                value={ownNumber}
                                onChange={setOwnNumber}
                                required
                            />
                            <div className="p-4 bg-yellow-50 rounded-xl border border-yellow-100 text-sm text-yellow-800">
                                <p><strong>Note:</strong> You will need to scan a QR code in the dashboard to finish connecting this number.</p>
                            </div>
                        </div>
                    ) : (
                        <div className="space-y-4 text-center py-4">
                            <div className="w-16 h-16 bg-green-50 rounded-full flex items-center justify-center mx-auto animate-pulse">
                                <Icon name={"CheckCircle" as any} className="text-[#46EC13]" size={20} />
                            </div>
                            <h3 className="font-bold text-black">Number Assignment</h3>
                            <p className="text-sm text-gray-500 max-w-sm mx-auto">
                                We will assign a local business number to your account immediately after onboarding.
                            </p>
                        </div>
                    )}
                </div>

                {/* Consents and Compliance */}
                <div className="space-y-4 py-4 border-t border-gray-100">
                    <h4 className="text-sm font-bold text-black uppercase tracking-wider">Consent & Compliance</h4>

                    <div className="space-y-3">
                        <label className="flex items-start gap-3 cursor-pointer group">
                            <input
                                type="checkbox"
                                required
                                className="mt-1 w-4 h-4 rounded border-gray-300 text-black focus:ring-black"
                            />
                            <span className="text-sm text-gray-600 group-hover:text-black transition-colors">
                                I confirm I have customer consent to message them via WhatsApp where required.
                            </span>
                        </label>

                        <label className="flex items-start gap-3 cursor-pointer group">
                            <input
                                type="checkbox"
                                required
                                className="mt-1 w-4 h-4 rounded border-gray-300 text-black focus:ring-black"
                            />
                            <span className="text-sm text-gray-600 group-hover:text-black transition-colors">
                                I confirm I am authorized to connect this number for business use.
                            </span>
                        </label>
                    </div>

                    <div className="p-4 bg-gray-50 rounded-xl space-y-2">
                        <p className="text-xs text-gray-500 leading-relaxed">
                            Vayva does not send unsolicited messages. You are responsible for ensuring your use of WhatsApp
                            complies with our <a href="/legal/acceptable-use" target="_blank" className="text-black font-bold underline">Acceptable Use Policy</a> and
                            <a href="/legal/prohibited-items" target="_blank" className="text-black font-bold underline"> Prohibited Items Policy</a>.
                        </p>
                    </div>
                </div>

                {isStarter && (
                    <p className="text-center text-xs text-gray-400">
                        Your plan includes a 4-day free trial of WhatsApp AI.
                    </p>
                )}

                <div className="flex items-center gap-4 pt-4">
                    <Button
                        type="button"
                        variant="ghost"
                        onClick={() => goToStep('payments')}
                        className="flex-1 text-gray-500 hover:text-black"
                    >
                        Back
                    </Button>
                    <Button
                        type="submit"
                        variant="primary"
                        className="flex-[2] !bg-black !text-white h-12 rounded-xl"
                        isLoading={loading}
                    >
                        Continue
                        <Icon name="ArrowRight" className="ml-2 w-4 h-4" />
                    </Button>
                </div>
            </form>
        </div>
    );
}
