'use client';

import React, { useState } from 'react';
import { Button, Icon, cn, Input } from '@vayva/ui';
import { useOnboarding } from '@/context/OnboardingContext';

export default function WhatsAppPage() {
    const { updateState, goToStep } = useOnboarding();
    const [mode, setMode] = useState<'decision' | 'connect' | 'verify' | 'success'>('decision');
    const [phoneNumber, setPhoneNumber] = useState('');
    const [otp, setOtp] = useState('');

    const handleLater = async () => {
        await updateState({
            whatsappConnected: false,
            whatsapp: { number: undefined }
        });
        await goToStep('templates');
    };

    const handleConnectStart = () => setMode('connect');

    const handleSendOtp = () => {
        if (phoneNumber.length > 5) setMode('verify');
    };

    const handleVerifyOtp = async () => {
        if (otp.length === 6) {
            setMode('success');
        }
    };

    const handleSuccessContinue = async () => {
        await updateState({
            whatsappConnected: true,
            whatsapp: { number: phoneNumber }
        });
        await goToStep('templates');
    };

    return (
        <div className="flex flex-col lg:flex-row h-full gap-8 max-w-6xl mx-auto items-center lg:items-start">

            {/* Left Column: Interaction */}
            <div className="flex-1 w-full max-w-lg lg:pt-10">
                <div className="mb-8">
                    <h1 className="text-2xl font-bold text-gray-900 mb-2">Connect WhatsApp</h1>
                    <p className="text-gray-500">Vayva works best when connected, but you can set it up in a few minutes now or later.</p>
                </div>

                {mode === 'decision' && (
                    <div className="space-y-4 animate-fade-in">
                        <button
                            onClick={handleConnectStart}
                            className="w-full text-left p-4 rounded-xl border border-gray-200 hover:border-green-500 hover:bg-green-50 group transition-all flex items-center gap-4"
                        >
                            <div className="w-12 h-12 rounded-full bg-green-100 text-green-600 flex items-center justify-center group-hover:bg-green-500 group-hover:text-white transition-colors">
                                <Icon name="MessageCircle" size={24} />
                            </div>
                            <div className="flex-1">
                                <h3 className="font-bold text-gray-900">Connect now (Recommended)</h3>
                                <p className="text-sm text-gray-500">Sync chats, automate orders, and build history.</p>
                            </div>
                            <Icon name="ArrowRight" className="text-gray-300 group-hover:text-green-600" />
                        </button>

                        <button
                            onClick={handleLater}
                            className="w-full text-left p-4 rounded-xl border border-gray-200 hover:border-gray-300 hover:bg-gray-50 group transition-all flex items-center gap-4"
                        >
                            <div className="w-12 h-12 rounded-full bg-gray-100 text-gray-500 flex items-center justify-center group-hover:bg-gray-200 transition-colors">
                                <Icon name="Clock" size={24} />
                            </div>
                            <div className="flex-1">
                                <h3 className="font-bold text-gray-900">I’ll do this later</h3>
                                <p className="text-sm text-gray-500">Your setup will still work without it.</p>
                            </div>
                        </button>
                    </div>
                )}

                {mode === 'connect' && (
                    <div className="space-y-6 animate-fade-in">
                        <div className="space-y-2">
                            <label className="block text-sm font-medium text-gray-700">WhatsApp Business Number</label>
                            <div className="flex gap-2">
                                <div className="bg-gray-100 border border-gray-200 rounded-lg px-3 flex items-center text-gray-500 text-sm font-medium">
                                    +234
                                </div>
                                <Input
                                    placeholder="80 1234 5678"
                                    value={phoneNumber}
                                    onChange={(e) => setPhoneNumber(e.target.value)}
                                    autoFocus
                                />
                            </div>
                        </div>
                        <Button onClick={handleSendOtp} className="w-full !bg-green-600 hover:!bg-green-700 text-white">
                            Send Code
                        </Button>
                        <button onClick={() => setMode('decision')} className="w-full text-sm text-gray-400 hover:text-gray-600 mt-2">
                            Back
                        </button>
                    </div>
                )}

                {mode === 'verify' && (
                    <div className="space-y-6 animate-fade-in">
                        <div className="space-y-2">
                            <label className="block text-sm font-medium text-gray-700">Verification Code</label>
                            <Input
                                placeholder="123456"
                                value={otp}
                                onChange={(e) => setOtp(e.target.value)}
                                maxLength={6}
                                className="text-center tracking-widest text-lg"
                                autoFocus
                            />
                            <p className="text-xs text-gray-400">Sent to {phoneNumber}</p>
                        </div>
                        <Button onClick={handleVerifyOtp} className="w-full !bg-green-600 hover:!bg-green-700 text-white">
                            Verify & Connect
                        </Button>
                        <button onClick={() => setMode('connect')} className="w-full text-sm text-gray-400 hover:text-gray-600 mt-2">
                            Change Number
                        </button>
                    </div>
                )}

                {mode === 'success' && (
                    <div className="text-center py-8 animate-fade-in space-y-4">
                        <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
                            <Icon name="Check" size={32} />
                        </div>
                        <h3 className="text-xl font-bold text-green-900">Connected Successfully!</h3>
                        <p className="text-gray-600">Your WhatsApp Business account is now linked.</p>
                        <Button onClick={handleSuccessContinue} className="w-full !bg-black text-white mt-4">
                            Continue Setup
                        </Button>
                    </div>
                )}
            </div>

            {/* Right Column: Live Benefit Panel */}
            <div className="hidden lg:block flex-1 w-full sticky top-24">
                <div className="bg-white rounded-3xl border border-gray-100 shadow-xl overflow-hidden relative min-h-[500px]">
                    <div className="bg-gray-50 p-6 border-b border-gray-100">
                        <h3 className="font-bold text-gray-900">What you get after connecting</h3>
                    </div>

                    <div className="p-0">
                        {/* Simulation of chat interaction */}
                        <div className="space-y-4 p-6">
                            <div className="flex gap-4 items-start opacity-50">
                                <div className="w-10 h-10 rounded-full bg-gray-100 flex-shrink-0" />
                                <div className="space-y-2 flex-1">
                                    <div className="h-4 w-24 bg-gray-100 rounded" />
                                    <div className="h-16 w-full bg-gray-50 rounded-xl rounded-tl-none border border-gray-100" />
                                </div>
                            </div>

                            <div className="flex gap-4 items-start">
                                <div className="w-10 h-10 rounded-full bg-green-100 text-green-600 flex items-center justify-center flex-shrink-0 border-2 border-white shadow-sm z-10">
                                    <Icon name="Bot" size={20} />
                                </div>
                                <div className="space-y-2 flex-1 animate-pulse">
                                    <div className="bg-green-50 p-4 rounded-xl rounded-tl-none border border-green-100 shadow-sm">
                                        <div className="flex items-center gap-2 mb-2 text-green-800 font-bold text-sm">
                                            <Icon name="Zap" size={14} /> New Order Created
                                        </div>
                                        <p className="text-sm text-gray-600">Identifying products and creating order #1024...</p>
                                    </div>
                                </div>
                            </div>

                            <div className="mt-8 space-y-3">
                                <div className="flex items-center gap-3 text-sm text-gray-600">
                                    <Icon name="CircleCheck" className="text-green-500" size={18} />
                                    <span>Orders from WhatsApp appear automatically</span>
                                </div>
                                <div className="flex items-center gap-3 text-sm text-gray-600">
                                    <Icon name="CircleCheck" className="text-green-500" size={18} />
                                    <span>Customer history builds instantly</span>
                                </div>
                                <div className="flex items-center gap-3 text-sm text-gray-600">
                                    <Icon name="CircleCheck" className="text-green-500" size={18} />
                                    <span>Payment records link to chats</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
