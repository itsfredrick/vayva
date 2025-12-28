'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { FEATURES } from '@/lib/env-validation';

export default function KYCPage() {
    const router = useRouter();

    useEffect(() => {
        if (!FEATURES.KYC_ENABLED) {
            router.replace('/admin/onboarding/go-live');
        }
    }, [router]);

    if (!FEATURES.KYC_ENABLED) {
        return null;
    }

    return (
        <div className="min-h-screen flex items-center justify-center p-8">
            <div className="max-w-2xl w-full">
                <h1 className="text-3xl font-bold mb-6">KYC Verification</h1>
                <p className="text-gray-600">
                    KYC verification is enabled but not yet implemented.
                </p>
            </div>
        </div>
    );
}
