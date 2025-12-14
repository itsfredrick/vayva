'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { AuthShell } from '@/components/auth-shell';
import { GlassPanel } from '@/components/ui/glass-panel';
import { Button } from '@/components/ui/button';
import { OTPInput } from '@/components/ui/otp-input';
import { Icon } from '@/components/ui/icon';

function VerifyContent() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const contact = searchParams.get('contact') || 'your email';

    const [otp, setOtp] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(false);
    const [timer, setTimer] = useState(30);

    useEffect(() => {
        if (timer > 0) {
            const interval = setInterval(() => setTimer(t => t - 1), 1000);
            return () => clearInterval(interval);
        }
    }, [timer]);

    const handleVerify = async () => {
        if (otp.length !== 6) return;

        setIsLoading(true);
        await new Promise(resolve => setTimeout(resolve, 1500));

        if (otp === '123456') {
            // Success
            router.push('/admin'); // Or onboarding
        } else {
            setError(true);
            setTimeout(() => setError(false), 2000);
        }
        setIsLoading(false);
    };

    return (
        <GlassPanel className="w-full max-w-[520px] p-10 flex flex-col gap-8 text-center">
            <div>
                <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-6">
                    <Icon name="lock" className="text-primary text-3xl" />
                </div>
                <h2 className="text-2xl font-bold text-white mb-2">Verify your account</h2>
                <p className="text-text-secondary">
                    We sent a 6-digit code to <span className="text-white font-medium">{contact}</span>
                </p>
            </div>

            <div className="flex flex-col gap-4">
                <OTPInput value={otp} onChange={setOtp} error={error} />
                {error && <p className="text-state-danger text-sm font-medium">Incorrect code. Try again.</p>}
            </div>

            <div className="flex flex-col gap-4">
                <Button onClick={handleVerify} disabled={otp.length !== 6} isLoading={isLoading}>
                    Verify
                </Button>

                <div className="flex items-center justify-between text-sm px-4">
                    <button
                        onClick={() => router.back()}
                        className="text-text-secondary hover:text-white transition-colors"
                    >
                        Change email/phone
                    </button>

                    {timer > 0 ? (
                        <span className="text-text-secondary">Resend in 00:{timer.toString().padStart(2, '0')}</span>
                    ) : (
                        <button onClick={() => setTimer(30)} className="text-primary hover:text-primary-hover font-bold">
                            Resend Code
                        </button>
                    )}
                </div>
            </div>

            <div className="border-t border-border-subtle pt-6">
                <p className="text-xs text-text-secondary">
                    Didn’t get a code? Check your spam folder or try waiting a minute.
                </p>
            </div>
        </GlassPanel>
    );
}

export default function VerifyPage() {
    return (
        <AuthShell>
            <Suspense fallback={<div>Loading...</div>}>
                <VerifyContent />
            </Suspense>
        </AuthShell>
    );
}
