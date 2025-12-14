'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { AdminShell } from '@/components/admin-shell';
import { GlassPanel } from '@/components/ui/glass-panel';
import { Button } from '@/components/ui/button';
import { Icon } from '@/components/ui/icon';

const STEPS = ['Choose Number', 'Verify', 'Permissions', 'Turn on AI'];

export default function ConnectWizardPage() {
    const router = useRouter();
    const [step, setStep] = useState(1);
    const [verifying, setVerifying] = useState(false);

    const nextStep = () => setStep(s => Math.min(s + 1, 4));

    return (
        <AdminShell title="Connect WhatsApp" breadcrumb="WhatsApp / Connect">
            <div className="max-w-2xl mx-auto py-10">
                {/* Stepper */}
                <div className="flex items-center justify-between mb-10 px-4">
                    {STEPS.map((s, i) => {
                        const isActive = i + 1 === step;
                        const isDone = i + 1 < step;
                        return (
                            <div key={i} className="flex flex-col items-center relative z-10">
                                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold mb-2 transition-colors 
                                    ${isActive ? 'bg-primary text-black' : isDone ? 'bg-state-success text-black' : 'bg-white/10 text-text-secondary'}`}>
                                    {isDone ? <Icon name="check" size={16} /> : i + 1}
                                </div>
                                <span className={`text-xs ${isActive ? 'text-white font-bold' : 'text-text-secondary'}`}>{s}</span>

                                {/* Connector Line */}
                                {i < STEPS.length - 1 && (
                                    <div className={`absolute top-4 left-1/2 w-full h-[2px] -z-10 bg-white/5`} style={{ left: '50%', width: 'calc(100% + 2rem)' }}>
                                        <div className={`h-full bg-primary transition-all duration-300 ${isDone ? 'w-full' : 'w-0'}`} />
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>

                <GlassPanel className="p-8 min-h-[400px] flex flex-col">
                    {step === 1 && (
                        <div className="flex flex-col h-full gap-6">
                            <div className="text-center">
                                <h2 className="text-2xl font-bold text-white mb-2">Connect your Business Number</h2>
                                <p className="text-text-secondary">Enter your WhatsApp Business number to start chatting with customers.</p>
                            </div>

                            <div className="space-y-4 max-w-sm mx-auto w-full">
                                <div className="p-4 rounded-lg border border-primary/20 bg-primary/5 cursor-pointer flex items-center gap-3">
                                    <input type="radio" className="radio radio-primary" checked readOnly />
                                    <div>
                                        <div className="font-bold text-white">Use verification code</div>
                                        <div className="text-xs text-text-secondary">We'll send an OTP to your phone</div>
                                    </div>
                                </div>

                                <div>
                                    <label className="text-xs text-text-secondary uppercase font-bold tracking-wider mb-2 block">Phone Number</label>
                                    <div className="flex gap-2">
                                        <div className="flex items-center justify-center px-3 rounded-lg bg-white/5 border border-white/10 text-white font-mono gap-1">
                                            <img src="https://flagcdn.com/w20/ng.png" className="w-4" alt="NG" />
                                            +234
                                        </div>
                                        <input
                                            className="flex-1 bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white font-mono focus:outline-none focus:border-primary"
                                            placeholder="812 345 6789"
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="mt-auto flex justify-end">
                                <Button onClick={nextStep} className="bg-primary text-black">Send Verification Code</Button>
                            </div>
                        </div>
                    )}

                    {step === 2 && (
                        <div className="flex flex-col h-full gap-6">
                            <div className="text-center">
                                <h2 className="text-2xl font-bold text-white mb-2">Verify it's you</h2>
                                <p className="text-text-secondary">Enter the 6-digit code sent to +234 812 ••• ••• 89</p>
                            </div>

                            <div className="flex justify-center gap-2 my-8">
                                {[1, 2, 3, 4, 5, 6].map((_, i) => (
                                    <div key={i} className="w-12 h-14 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-xl font-bold text-white font-mono">
                                        •
                                    </div>
                                ))}
                            </div>

                            <div className="text-center">
                                <div className="text-sm text-text-secondary mb-2">Didn't receive code?</div>
                                <button className="text-primary text-sm font-bold hover:underline">Resend in 30s</button>
                            </div>

                            <div className="mt-auto flex justify-between">
                                <Button variant="ghost" onClick={() => setStep(1)}>Back</Button>
                                <Button onClick={nextStep} className="bg-primary text-black">Verify</Button>
                            </div>
                        </div>
                    )}

                    {step === 3 && (
                        <div className="flex flex-col h-full gap-6">
                            <div className="text-center">
                                <h2 className="text-2xl font-bold text-white mb-2">Permissions</h2>
                                <p className="text-text-secondary">Control what the AI is allowed to do.</p>
                            </div>

                            <div className="space-y-3">
                                {[
                                    { text: 'Send order updates automatically', checked: true },
                                    { text: 'Reply to product questions', checked: true },
                                    { text: 'Require approval before confirming delivery time', checked: true, highlight: true },
                                    { text: 'Allow collecting customer feedback', checked: true },
                                ].map((perm, i) => (
                                    <label key={i} className={`flex items-center gap-3 p-3 rounded-lg border ${perm.highlight ? 'border-primary/20 bg-primary/5' : 'border-white/5 bg-white/5'}`}>
                                        <input type="checkbox" className="checkbox checkbox-primary" defaultChecked={perm.checked} />
                                        <span className={`text-sm ${perm.highlight ? 'text-white' : 'text-text-secondary'}`}>{perm.text}</span>
                                    </label>
                                ))}
                            </div>

                            <div className="mt-auto flex justify-between">
                                <Button variant="ghost" onClick={() => setStep(2)}>Back</Button>
                                <Button onClick={nextStep} className="bg-primary text-black">Continue</Button>
                            </div>
                        </div>
                    )}

                    {step === 4 && (
                        <div className="flex flex-col h-full items-center text-center justify-center gap-6">
                            <div className="w-20 h-20 rounded-full bg-state-success/20 flex items-center justify-center text-state-success mb-4">
                                <Icon name="check_circle" size={40} />
                            </div>
                            <div>
                                <h2 className="text-3xl font-bold text-white mb-2">You're all set!</h2>
                                <p className="text-text-secondary max-w-md mx-auto">
                                    Vayva Assistant is now active on <strong>+234 812 345 6789</strong>.
                                    We've set up your inbox and knowledge base.
                                </p>
                            </div>

                            <div className="flex gap-4 mt-8">
                                <Button variant="ghost" onClick={() => router.push('/admin/whatsapp/settings')}>View Settings</Button>
                                <Button className="bg-primary text-black px-8" onClick={() => router.push('/admin/whatsapp')}>Go to Dashboard</Button>
                            </div>
                        </div>
                    )}

                </GlassPanel>
            </div>
        </AdminShell>
    );
}
