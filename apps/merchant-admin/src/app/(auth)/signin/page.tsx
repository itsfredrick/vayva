'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
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
            setError(err.response?.data?.error || 'Incorrect email or password');
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
            subtitle="Sign in to manage your business operations"
            showSignUpLink
        >
            {/* Google Sign In */}
            {/* Google Sign In removed as per user request */}

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-5">
                {error && (
                    <div className="p-3 text-sm text-red-700 bg-red-50 border border-red-200 rounded-lg">
                        {error}
                    </div>
                )}

                {/* Email */}
                <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-900 mb-2">
                        Email address
                    </label>
                    <input
                        id="email"
                        type="email"
                        placeholder="you@business.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        className="w-full h-12 px-4 border border-gray-300 rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#22C55E] focus:border-transparent"
                        data-testid="auth-signin-email"
                    />
                </div>

                {/* Password */}
                <div>
                    <label htmlFor="password" className="block text-sm font-medium text-gray-900 mb-2">
                        Password
                    </label>
                    <div className="relative">
                        <input
                            id="password"
                            type={showPassword ? 'text' : 'password'}
                            placeholder="••••••••"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            className="w-full h-12 px-4 pr-12 border border-gray-300 rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#22C55E] focus:border-transparent"
                            data-testid="auth-signin-password"
                        />
                        <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                        >
                            {showPassword ? (
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                                </svg>
                            ) : (
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                </svg>
                            )}
                        </button>
                    </div>
                    <div className="flex items-center justify-end mt-2">
                        <Link
                            href="/forgot-password"
                            className="text-sm text-gray-600 hover:text-gray-900 font-medium transition-colors"
                        >
                            Forgot password?
                        </Link>
                    </div>
                </div>

                {/* Submit Button */}
                <button
                    type="submit"
                    disabled={loading}
                    className="w-full h-12 bg-[#22C55E] hover:bg-[#16A34A] text-white font-semibold rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    data-testid="auth-signin-submit"
                >
                    {loading ? 'Signing in...' : 'Sign in'}
                </button>
            </form>

            {/* Sign Up Link */}
            <div className="mt-6 text-center text-sm text-gray-600">
                New here?{' '}
                <Link href="/signup" className="text-gray-900 hover:text-black font-semibold transition-colors">
                    Create an account
                </Link>
            </div>

            {/* Google OAuth Placeholder Modal */}
            {showGoogleModal && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-lg p-6 max-w-sm w-full shadow-xl">
                        <div className="text-center mb-4">
                            <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3">
                                <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                            </div>
                            <h3 className="text-lg font-semibold text-gray-900 mb-2">
                                Google Sign-In Not Configured
                            </h3>
                            <p className="text-sm text-gray-600">
                                Google OAuth is not yet configured for this environment. Please sign in with your email and password.
                            </p>
                        </div>
                        <button
                            className="w-full h-10 bg-gray-900 hover:bg-black text-white font-medium rounded-lg transition-colors"
                            onClick={() => setShowGoogleModal(false)}
                        >
                            Got it
                        </button>
                    </div>
                </div>
            )}
        </SplitAuthLayout>
    );
}
