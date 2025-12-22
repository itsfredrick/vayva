'use client';

import { useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Button, Icon , Input } from '@vayva/ui';
import { PasswordStrengthIndicator } from '@/components/ui/PasswordStrengthIndicator';
import { AuthService } from '@/services/auth';
import { SplitAuthLayout } from '@/components/auth/SplitAuthLayout';

const ResetPasswordContent = () => {
    const router = useRouter();
    const searchParams = useSearchParams();
    const token = searchParams.get('token') || '';

    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (password !== confirmPassword) {
            setError('Passwords do not match');
            return;
        }

        setLoading(true);
        setError(null);

        try {
            await AuthService.resetPassword({ token, password });
            router.push('/signin?reset=success');
        } catch (err: any) {
            console.error(err);
            setError(err.response?.data?.error || 'Failed to reset password');
        } finally {
            setLoading(false);
        }
    };

    if (!token) {
        return (
            <SplitAuthLayout
                title="Invalid reset link"
                subtitle="This password reset link is invalid or has expired"
                showSignInLink
            >
                <div className="text-center">
                    <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
                        <Icon name={"AlertCircle" as any} className="w-8 h-8 text-red-600" />
                    </div>
                    <Link href="/forgot-password">
                        <Button variant="primary" className="w-full !bg-black !text-white !rounded-xl !h-12">
                            Request new link
                        </Button>
                    </Link>
                </div>
            </SplitAuthLayout>
        );
    }

    return (
        <SplitAuthLayout
            title="Set new password"
            subtitle="Choose a strong password for your account"
            showSignInLink
        >
            <div className="flex justify-center mb-6">
                <div className="w-16 h-16 bg-black/5 rounded-full flex items-center justify-center">
                    <Icon name={"Lock" as any} className="w-8 h-8 text-black" />
                </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
                {error && (
                    <div className="p-3 text-sm text-red-600 bg-red-50 border border-red-200 rounded-xl">
                        {error}
                    </div>
                )}

                <div>
                    <div className="relative">
                        <Input
                            label="New Password"
                            type={showPassword ? 'text' : 'password'}
                            placeholder="Create a strong password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                        <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-3 top-[38px] text-gray-400 hover:text-black transition-colors"
                        >
                            <Icon name={(showPassword ? 'EyeOff' : 'Eye') as any} className="w-5 h-5" />
                        </button>
                    </div>
                    <PasswordStrengthIndicator password={password} />
                </div>

                <div className="relative">
                    <Input
                        label="Confirm Password"
                        type={showConfirmPassword ? 'text' : 'password'}
                        placeholder="Re-enter your password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        required
                    />
                    <button
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        className="absolute right-3 top-[38px] text-gray-400 hover:text-black transition-colors"
                    >
                        <Icon name={(showConfirmPassword ? 'EyeOff' : 'Eye') as any} className="w-5 h-5" />
                    </button>
                    {confirmPassword.length > 0 && password !== confirmPassword && (
                        <p className="text-xs text-red-600 mt-1">Passwords do not match</p>
                    )}
                </div>

                <Button
                    type="submit"
                    variant="primary"
                    size="lg"
                    className="w-full !bg-black !text-white hover:!bg-black/90 !rounded-xl !h-12"
                    disabled={loading || password !== confirmPassword || !password}
                >
                    {loading ? (
                        <>
                            <Icon name={"Loader2" as any} className="w-5 h-5 animate-spin" />
                            Resetting password...
                        </>
                    ) : (
                        'Reset password'
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
};

export default function ResetPasswordPage() {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <ResetPasswordContent />
        </Suspense>
    );
}
