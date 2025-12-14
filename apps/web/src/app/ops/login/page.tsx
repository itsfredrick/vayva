'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Icon } from '@/components/ui/icon';

export default function OpsLoginPage() {
    const [step, setStep] = useState<'email' | 'mfa'>('email');

    return (
        <div className="min-h-screen bg-[#142210] flex items-center justify-center p-4 selection:bg-red-500/30">

            {/* Background Effects */}
            <div className="fixed inset-0 overflow-hidden pointer-events-none">
                <div className="absolute -top-[20%] -left-[10%] w-[50%] h-[50%] bg-red-500/5 rounded-full blur-[120px]" />
                <div className="absolute top-[20%] right-[10%] w-[40%] h-[40%] bg-blue-500/5 rounded-full blur-[100px]" />
            </div>

            <div className="w-full max-w-md bg-[#0b141a]/50 backdrop-blur-xl border border-white/10 rounded-2xl p-8 relative z-10 shadow-2xl">

                <div className="text-center mb-8">
                    <div className="w-12 h-12 rounded bg-red-500/20 text-red-500 flex items-center justify-center font-bold border border-red-500/30 mx-auto mb-4 text-xl">O</div>
                    <h1 className="text-2xl font-bold text-white">Vayva Ops</h1>
                    <p className="text-sm text-text-secondary mt-2">Restricted Area. Authorized Personnel Only.</p>
                </div>

                {step === 'email' ? (
                    <form className="space-y-4" onSubmit={(e) => { e.preventDefault(); setStep('mfa'); }}>
                        <div>
                            <label className="text-xs text-text-secondary uppercase font-bold tracking-wider mb-2 block">Email Address</label>
                            <input
                                type="email"
                                // autoFocus
                                className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-red-500/50 transition-colors"
                                placeholder="name@vayva.com"
                            />
                        </div>
                        <div>
                            <label className="text-xs text-text-secondary uppercase font-bold tracking-wider mb-2 block">Password</label>
                            <input
                                type="password"
                                className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-red-500/50 transition-colors"
                                placeholder="••••••••••••"
                            />
                        </div>
                        <Button className="w-full h-11 bg-red-600 hover:bg-red-500 text-white font-bold rounded-lg mt-2">
                            Sign In
                        </Button>
                        <div className="text-center">
                            <a href="#" className="text-xs text-text-secondary hover:text-white">Forgot password?</a>
                        </div>
                    </form>
                ) : (
                    <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
                        <div className="text-center">
                            <h3 className="text-white font-bold">Two-Factor Authentication</h3>
                            <p className="text-xs text-text-secondary mt-1">Enter the status code from your authenticator app.</p>
                        </div>

                        <div className="flex gap-2 justify-center">
                            {[1, 2, 3, 4, 5, 6].map((i) => (
                                <input
                                    key={i}
                                    type="text"
                                    maxLength={1}
                                    className="w-10 h-12 bg-white/5 border border-white/10 rounded text-center text-xl font-bold text-white focus:outline-none focus:border-red-500/50 transition-colors"
                                />
                            ))}
                        </div>

                        <Link href="/ops/merchants">
                            <Button className="w-full h-11 bg-red-600 hover:bg-red-500 text-white font-bold rounded-lg">
                                Verify & Access
                            </Button>
                        </Link>

                        <div className="text-center">
                            <button onClick={() => setStep('email')} className="text-xs text-text-secondary hover:text-white">Back to login</button>
                        </div>
                    </form>
                )}

                <div className="mt-8 pt-6 border-t border-white/5 text-center">
                    <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/5 rounded-full border border-white/5">
                        <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                        <span className="text-[10px] text-text-secondary font-mono">SYSTEM NORMAL</span>
                    </div>
                </div>

            </div>
        </div>
    );
}
