'use client';

import { useState } from 'react';
import Link from 'next/link';
import { AuthService } from '@/services/auth';
import { SplitAuthLayout } from '@/components/auth/SplitAuthLayout';

export default function ForgotPasswordPage() {
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            await AuthService.forgotPassword(email);
            setSuccess(true);
        } catch (err: any) {
            console.error(err);
            setError(err.message || 'Failed to send reset instructions');
        } finally {
            setLoading(false);
        }
    };

    return (
        <SplitAuthLayout
            title="Reset your password"
            subtitle="Enter your email and we'll send you instructions."
            showSignInLink
        >
            {success ? (
                <div className="space-y-6">
                    <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                        <div className="flex items-start gap-3">
                            <svg className="w-5 h-5 text-green-600 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            <div>
                                <h3 className="text-sm font-semibold text-green-900 mb-1">
                                    Check your email
                                </h3>
                                <p className="text-sm text-green-700">
                                    We've sent password reset instructions to <strong>{email}</strong>.
                                    Please check your inbox and follow the link to reset your password.
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="text-center">
                        <Link
                            href="/signin"
                            className="text-sm text-gray-700 hover:text-black font-medium transition-colors"
                        >
                            ← Back to sign in
                        </Link>
                    </div>
                </div>
            ) : (
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
                        />
                    </div>

                    {/* Submit Button */}
                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full h-12 bg-[#22C55E] hover:bg-[#16A34A] text-white font-semibold rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {loading ? 'Sending instructions...' : 'Send reset instructions'}
                    </button>

                    {/* Back to Sign In */}
                    <div className="text-center">
                        <Link
                            href="/signin"
                            className="text-sm text-gray-700 hover:text-black font-medium transition-colors"
                        >
                            ← Back to sign in
                        </Link>
                    </div>
                </form>
            )}
        </SplitAuthLayout>
    );
}
