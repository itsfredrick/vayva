'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Button, Icon , Input } from '@vayva/ui';
import { AuthService } from '@/services/auth';
import { SplitAuthLayout } from '@/components/auth/SplitAuthLayout';

export default function ForgotPasswordPage() {
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [resendTimer, setResendTimer] = useState(0);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            await AuthService.forgotPassword({ email });
            setSuccess(true);
            setResendTimer(30);

            // Start countdown
            const interval = setInterval(() => {
                setResendTimer((prev) => {
                    if (prev <= 1) {
                        clearInterval(interval);
                        return 0;
                    }
                    return prev - 1;
                });
            }, 1000);
        } catch (err: any) {
            console.error(err);
            setError(err.response?.data?.error || 'Failed to send reset link');
        } finally {
            setLoading(false);
        }
    };

    const handleResend = () => {
        setSuccess(false);
        setResendTimer(0);
    };

    if (success) {
        return (
            <SplitAuthLayout
                title="Check your email"
                subtitle={`We've sent a password reset link to ${email}`}
                showSignInLink
            >
                <div className="text-center">
                    <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                        <Icon name={"CheckCircle" as any} className="w-8 h-8 text-green-600" />
                    </div>

                    {resendTimer > 0 ? (
                        <p className="text-sm text-gray-400 mb-6">
                            Didn't receive it? Resend in {resendTimer}s
                        </p>
                    ) : (
                        <button
                            onClick={handleResend}
                            className="text-sm text-[#0D1D1E] hover:text-black font-medium mb-6"
                        >
                            Resend reset link
                        </button>
                    )}

                    <Link href="/signin">
                        <Button variant="secondary" className="w-full !border-2 !border-black !rounded-xl !h-12">
                            Back to sign in
                        </Button>
                    </Link>
                </div>
            </SplitAuthLayout>
        );
    }

    return (
        <SplitAuthLayout
            title="Forgot password?"
            subtitle="No worries, we'll send you reset instructions"
            showSignInLink
        >
            <div className="flex justify-center mb-6">
                <div className="w-16 h-16 bg-black/5 rounded-full flex items-center justify-center">
                    <Icon name={"KeyRound" as any} className="w-8 h-8 text-black" />
                </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
                {error && (
                    <div className="p-3 text-sm text-red-600 bg-red-50 border border-red-200 rounded-xl">
                        {error}
                    </div>
                )}

                <Input
                    label="Email Address"
                    type="email"
                    placeholder="you@company.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                />

                <Button
                    type="submit"
                    variant="primary"
                    size="lg"
                    className="w-full !bg-black !text-white hover:!bg-black/90 !rounded-xl !h-12"
                    disabled={loading}
                >
                    {loading ? (
                        <>
                            <Icon name={"Loader2" as any} className="w-5 h-5 animate-spin" />
                            Sending...
                        </>
                    ) : (
                        'Send reset link'
                    )}
                </Button>
            </form>

            <div className="mt-6 text-center">
                <Link href="/signin" className="text-sm text-[#0D1D1E] hover:text-black font-medium transition-colors inline-flex items-center gap-1">
                    <Icon name={"ArrowLeft" as any} className="w-4 h-4" />
                    Back to sign in
                </Link>
            </div>
        </SplitAuthLayout>
    );
}
