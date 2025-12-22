'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Button, Icon } from '@vayva/ui';
import { Input } from '@vayva/ui';
import { useAuth } from '@/context/AuthContext';
import { AuthService } from '@/services/auth';
import { SplitAuthLayout } from '@/components/auth/SplitAuthLayout';

export default function SigninPage() {
    const { login } = useAuth();
    const router = useRouter();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [showGoogleModal, setShowGoogleModal] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            const data = await AuthService.login({ email, password });
            login(data.token, data.user);
            // AuthContext handles redirect
        } catch (err: any) {
            console.error(err);
            setError(err.response?.data?.error || 'Invalid email or password');
        } finally {
            setLoading(false);
        }
    };

    const handleGoogleSignIn = () => {
        setShowGoogleModal(true);
    };

    return (
        <SplitAuthLayout
            title="Welcome back"
            subtitle="Sign in to manage your store"
            showSignUpLink
        >
            {/* Google Sign In */}
            <button
                onClick={handleGoogleSignIn}
                className="w-full h-12 flex items-center justify-center gap-2 border border-gray-200 rounded-xl hover:bg-gray-50 text-black font-medium transition-all mb-6"
            >
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                    <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                    <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                    <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                    <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                </svg>
                <span>Continue with Google</span>
            </button>

            <div className="relative mb-6">
                <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-gray-200"></div>
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-white px-3 text-gray-400 font-medium">or</span>
                </div>
            </div>

            {/* Form */}
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
                    data-testid="auth-signin-email"
                />

                <div>
                    <div className="relative">
                        <Input
                            label="Password"
                            type={showPassword ? 'text' : 'password'}
                            placeholder="••••••••"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            data-testid="auth-signin-password"
                        />
                        <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-3 top-[38px] text-gray-400 hover:text-black transition-colors"
                        >
                            <Icon name={(showPassword ? 'EyeOff' : 'Eye') as any} className="w-5 h-5" />
                        </button>
                    </div>

                    <div className="flex items-center justify-end mt-3">
                        <Link
                            href="/forgot-password"
                            className="text-sm text-[#0D1D1E] hover:text-black font-medium transition-colors"
                        >
                            Forgot password?
                        </Link>
                    </div>
                </div>

                <Button
                    type="submit"
                    variant="primary"
                    size="lg"
                    className="w-full !bg-black !text-white hover:!bg-black/90 !rounded-xl !h-12"
                    disabled={loading}
                    data-testid="auth-signin-submit"
                >
                    {loading ? (
                        <>
                            <Icon name={"Loader2" as any} className="w-5 h-5 animate-spin" />
                            Signing in...
                        </>
                    ) : (
                        'Sign in'
                    )}
                </Button>
            </form>

            {/* Sign Up Link */}
            <div className="mt-6 text-center text-sm text-gray-600">
                New here?{' '}
                <Link href="/signup" className="text-[#0D1D1E] hover:text-black font-semibold transition-colors">
                    Create an account
                </Link>
            </div>

            {/* Google OAuth Placeholder Modal */}
            {showGoogleModal && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-2xl p-6 max-w-sm w-full shadow-2xl animate-fade-in">
                        <div className="text-center mb-4">
                            <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-3">
                                <Icon name={"Info" as any} className="w-6 h-6 text-yellow-600" />
                            </div>
                            <h3 className="text-lg font-heading font-semibold text-black mb-2">
                                Google Sign-In Not Configured
                            </h3>
                            <p className="text-sm text-gray-600">
                                Google OAuth is not yet configured for this environment. Please sign in with your email and password.
                            </p>
                        </div>
                        <Button
                            variant="primary"
                            className="w-full !bg-black !text-white"
                            onClick={() => setShowGoogleModal(false)}
                        >
                            Got it
                        </Button>
                    </div>
                </div>
            )}
        </SplitAuthLayout>
    );
}
