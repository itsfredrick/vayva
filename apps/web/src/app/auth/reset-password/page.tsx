'use client';

import React, { useState, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { AuthShell } from '@/components/auth-shell';
import { GlassPanel } from '@/components/ui/glass-panel';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { OTPInput } from '@/components/ui/otp-input';
import { Icon } from '@/components/ui/icon';

function ResetPasswordContent() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const contact = searchParams.get('contact') || 'your account';

    const [isLoading, setIsLoading] = useState(false);
    const [step, setStep] = useState<'otp' | 'new_password'>('otp');
    const [otp, setOtp] = useState('');
    const [password, setPassword] = useState('');
    const [confirm, setConfirm] = useState('');

    const handleVerifyOTP = async () => {
        if (otp.length !== 6) return;
        setIsLoading(true);
        await new Promise(resolve => setTimeout(resolve, 1000));
        setIsLoading(false);
        setStep('new_password');
    };

    const handleReset = async (e: React.FormEvent) => {
        e.preventDefault();
        if (password !== confirm) return;

        setIsLoading(true);
        await new Promise(resolve => setTimeout(resolve, 1500));
        setIsLoading(false);
        router.push('/auth/login');
    };

    return (
        <GlassPanel className="w-full max-w-[440px] p-10 flex flex-col gap-8">
            <div className="text-center">
                <h2 className="text-2xl font-bold text-white mb-2">Reset password</h2>
                <p className="text-text-secondary text-sm">
                    for <span className="text-white">{contact}</span>
                </p>
            </div>

            {step === 'otp' ? (
                <div className="flex flex-col gap-6">
                    <div className="flex flex-col gap-2">
                        <label className="text-xs uppercase tracking-widest text-[rgba(255,255,255,0.65)] font-bold text-center mb-2">
                            Enter Code
                        </label>
                        <OTPInput value={otp} onChange={setOtp} />
                    </div>
                    <Button onClick={handleVerifyOTP} disabled={otp.length !== 6} isLoading={isLoading}>
                        Verify Code
                    </Button>
                </div>
            ) : (
                <form onSubmit={handleReset} className="flex flex-col gap-6">
                    <Input
                        label="New Password"
                        type="password"
                        placeholder="Min 8 characters"
                        value={password}
                        onChange={e => setPassword(e.target.value)}
                    />
                    <Input
                        label="Confirm Password"
                        type="password"
                        placeholder="Re-enter password"
                        value={confirm}
                        onChange={e => setConfirm(e.target.value)}
                        error={confirm && password !== confirm ? "Passwords don't match" : undefined}
                    />
                    <Button type="submit" disabled={!password || password !== confirm} isLoading={isLoading}>
                        Update Password
                    </Button>
                </form>
            )}

            <div className="text-center">
                <Link href="/auth/login" className="text-sm text-text-secondary hover:text-white transition-colors">
                    Back to login
                </Link>
            </div>
        </GlassPanel>
    );
}

export default function ResetPasswordPage() {
    return (
        <AuthShell>
            <Suspense fallback={<div>Loading...</div>}>
                <ResetPasswordContent />
            </Suspense>
        </AuthShell>
    );
}
