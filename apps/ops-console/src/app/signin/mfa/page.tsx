'use client';

import React, { useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Loader2, ShieldCheck } from 'lucide-react';
import { OpsAuthService } from '../../../services/AuthService';

const MfaContent = () => {
    const [code, setCode] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const router = useRouter();
    const searchParams = useSearchParams();
    const tempToken = searchParams.get('tempToken') || '';

    const handleVerify = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            const data = await OpsAuthService.verifyMfa({ tempToken, code });
            if (data.token) {
                router.push('/ops');
            } else {
                setError(data.error || 'Invalid verification code');
            }
        } catch (err: any) {
            setError('Verification failed. Internal error.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 text-black">
            <div className="w-full max-w-sm bg-white border border-gray-200 rounded-xl p-8 shadow-sm">
                <div className="flex justify-center mb-6">
                    <div className="w-12 h-12 bg-black/5 rounded-full flex items-center justify-center">
                        <ShieldCheck className="w-6 h-6 text-black" />
                    </div>
                </div>

                <h1 className="text-2xl font-bold mb-1 text-center">Security Verification</h1>
                <p className="text-sm text-gray-500 mb-6 text-center">
                    Enter the 6-digit code from your authenticator app.
                </p>

                {error && (
                    <div className="mb-4 p-3 text-sm text-red-600 bg-red-50 border border-red-200 rounded-xl text-center">
                        {error}
                    </div>
                )}

                <form onSubmit={handleVerify} className="space-y-4">
                    <div>
                        <input
                            type="text"
                            required
                            placeholder="000000"
                            maxLength={6}
                            className="w-full px-4 py-4 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:border-black text-center text-2xl font-bold tracking-widest"
                            value={code}
                            onChange={(e) => setCode(e.target.value.replace(/\D/g, ''))}
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading || code.length !== 6}
                        className="w-full py-2 bg-black text-white font-bold rounded-lg hover:bg-gray-900 transition-colors flex items-center justify-center gap-2"
                    >
                        {loading && <Loader2 size={16} className="animate-spin" />}
                        Verify & Continue
                    </button>

                    <button
                        type="button"
                        onClick={() => router.back()}
                        className="w-full text-sm text-gray-500 hover:text-black font-medium transition-colors"
                    >
                        Back to Login
                    </button>
                </form>
            </div>
        </div>
    );
};

export default function MfaPage() {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <MfaContent />
        </Suspense>
    );
}
