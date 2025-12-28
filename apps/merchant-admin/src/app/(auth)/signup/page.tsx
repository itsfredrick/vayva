'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { AuthService } from '@/services/auth';
import { SplitAuthLayout } from '@/components/auth/SplitAuthLayout';

export default function SignupPage() {
    const router = useRouter();
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [businessName, setBusinessName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [agreedToTerms, setAgreedToTerms] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [showGoogleModal, setShowGoogleModal] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!agreedToTerms) {
            setError('Please agree to the Terms of Service and Privacy Policy');
            return;
        }

        if (password !== confirmPassword) {
            setError('Passwords do not match');
            return;
        }

        setLoading(true);
        setError(null);

        try {
            await AuthService.register({
                email,
                password,
                firstName,
                lastName,
                businessName,
            });
            // Redirect to verify page
            router.push(`/verify?email=${encodeURIComponent(email)}`);
        } catch (err: any) {
            console.error(err);
            setError(err.message || 'Failed to create account');
        } finally {
            setLoading(false);
        }
    };

    const handleGoogleSignUp = () => {
        setShowGoogleModal(true);
    };

    return (
        <SplitAuthLayout
            title="Create your Vayva account"
            subtitle="Set up your business system in minutes"
            showSignInLink
        >
            {/* Google Sign Up */}
            {/* Google Sign Up removed as per user request */}

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-5">
                {error && (
                    <div className="p-3 text-sm text-red-700 bg-red-50 border border-red-200 rounded-lg">
                        {error}
                    </div>
                )}

                {/* First Name */}
                <div>
                    <label htmlFor="firstName" className="block text-sm font-medium text-gray-900 mb-2">
                        First name
                    </label>
                    <input
                        id="firstName"
                        type="text"
                        placeholder="John"
                        value={firstName}
                        onChange={(e) => setFirstName(e.target.value)}
                        required
                        className="w-full h-12 px-4 border border-gray-300 rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#22C55E] focus:border-transparent"
                    />
                </div>

                {/* Last Name */}
                <div>
                    <label htmlFor="lastName" className="block text-sm font-medium text-gray-900 mb-2">
                        Last name
                    </label>
                    <input
                        id="lastName"
                        type="text"
                        placeholder="Doe"
                        value={lastName}
                        onChange={(e) => setLastName(e.target.value)}
                        required
                        className="w-full h-12 px-4 border border-gray-300 rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#22C55E] focus:border-transparent"
                    />
                </div>

                {/* Business Name */}
                <div>
                    <label htmlFor="businessName" className="block text-sm font-medium text-gray-900 mb-2">
                        Business name
                    </label>
                    <input
                        id="businessName"
                        type="text"
                        placeholder="Your Business Ltd"
                        value={businessName}
                        onChange={(e) => setBusinessName(e.target.value)}
                        required
                        className="w-full h-12 px-4 border border-gray-300 rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#22C55E] focus:border-transparent"
                    />
                </div>

                {/* Business Email */}
                <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-900 mb-2">
                        Business email
                    </label>
                    <input
                        id="email"
                        type="email"
                        placeholder="you@business.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        className="w-full h-12 px-4 border border-gray-300 rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#22C55E] focus:border-transparent"
                        data-testid="auth-signup-email"
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
                            placeholder="Create a strong password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            className="w-full h-12 px-4 pr-12 border border-gray-300 rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#22C55E] focus:border-transparent"
                            data-testid="auth-signup-password"
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
                </div>

                {/* Confirm Password */}
                <div>
                    <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-900 mb-2">
                        Confirm password
                    </label>
                    <div className="relative">
                        <input
                            id="confirmPassword"
                            type={showConfirmPassword ? 'text' : 'password'}
                            placeholder="Re-enter your password"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            required
                            className="w-full h-12 px-4 pr-12 border border-gray-300 rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#22C55E] focus:border-transparent"
                        />
                        <button
                            type="button"
                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                        >
                            {showConfirmPassword ? (
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
                </div>

                {/* Terms Checkbox */}
                <label className="flex items-start gap-3 cursor-pointer">
                    <input
                        type="checkbox"
                        checked={agreedToTerms}
                        onChange={(e) => setAgreedToTerms(e.target.checked)}
                        className="w-4 h-4 mt-0.5 rounded border-gray-300 text-[#22C55E] focus:ring-2 focus:ring-[#22C55E]"
                    />
                    <span className="text-sm text-gray-600">
                        By creating an account, you agree to our{' '}
                        <Link href="/legal/terms" target="_blank" className="text-gray-900 hover:text-black font-medium underline">
                            Terms of Service
                        </Link>
                        {' '}and{' '}
                        <Link href="/legal/privacy" target="_blank" className="text-gray-900 hover:text-black font-medium underline">
                            Privacy Policy
                        </Link>
                        .
                    </span>
                </label>

                {/* Submit Button */}
                <button
                    type="submit"
                    disabled={loading || !agreedToTerms}
                    className="w-full h-12 bg-[#22C55E] hover:bg-[#16A34A] text-white font-semibold rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    data-testid="auth-signup-submit"
                >
                    {loading ? 'Creating account...' : 'Create account'}
                </button>
            </form>

            {/* Sign In Link */}
            <div className="mt-6 text-center text-sm text-gray-600">
                Already have an account?{' '}
                <Link href="/signin" className="text-gray-900 hover:text-black font-semibold transition-colors">
                    Sign in
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
                                Google Sign-Up Not Configured
                            </h3>
                            <p className="text-sm text-gray-600">
                                Google OAuth is not yet configured for this environment. Please sign up with your email.
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
