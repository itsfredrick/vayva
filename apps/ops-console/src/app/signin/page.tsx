'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Loader2 } from 'lucide-react';
import { OpsAuthService } from '../../services/AuthService';

export default function OpsSignin() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const router = useRouter();

    const handleSignin = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            const data = await OpsAuthService.login({ email, password });
            if (data.mfaRequired) {
                router.push(`/signin/mfa?tempToken=${data.tempToken}`);
            } else if (data.token) {
                // Direct login success (if MFA disabled for user)
                router.push('/ops');
            } else {
                setError('Invalid credentials');
            }
        } catch (err: any) {
            setError('Sign in failed. Internal error.');
        } finally {
            setLoading(false);
        }
    };


    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 text-black">
            <div className="w-full max-w-sm bg-white border border-gray-200 rounded-xl p-8 shadow-sm">
                <h1 className="text-2xl font-bold mb-1">Ops Console</h1>
                <p className="text-sm text-gray-500 mb-6">Internal access only.</p>

                <form onSubmit={handleSignin} className="space-y-4">
                    <div>
                        <label className="block text-xs font-bold uppercase text-gray-500 mb-1">Email</label>
                        <input
                            type="email"
                            required
                            className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:border-black"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                    </div>
                    <div>
                        <label className="block text-xs font-bold uppercase text-gray-500 mb-1">Password</label>
                        <input
                            type="password"
                            required
                            className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:border-black"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full py-2 bg-black text-white font-bold rounded-lg hover:bg-gray-900 transition-colors flex items-center justify-center gap-2"
                    >
                        {loading && <Loader2 size={16} className="animate-spin" />}
                        Sign In
                    </button>
                </form>
            </div>
        </div>
    );
}
