'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { AppShell, GlassPanel, Button, Icon } from '@vayva/ui';
import { KYCVerification } from '@/components/kyc/KYCVerification';

export default function ComplianceKYCPage() {
    const router = useRouter();

    return (
        <div className="max-w-4xl mx-auto py-8 px-4 space-y-8 animate-in fade-in duration-500">
            <div className="flex items-center gap-4 mb-8">
                <Button variant="ghost" size="sm" onClick={() => router.back()}>
                    <Icon name="ArrowLeft" size={16} className="mr-2" />
                    Back
                </Button>
                <div>
                    <h1 className="text-3xl font-extrabold text-white">Compliance & KYC</h1>
                    <p className="text-text-secondary font-medium">Verify your identity to enable payouts and higher limits.</p>
                </div>
            </div>

            <GlassPanel className="p-8">
                <KYCVerification
                    onSuccess={() => {
                        setTimeout(() => router.push('/admin/account/overview'), 3000);
                    }}
                    onCancel={() => router.push('/admin/account/overview')}
                />
            </GlassPanel>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <GlassPanel className="p-6 space-y-4">
                    <div className="w-10 h-10 bg-white/5 rounded-lg flex items-center justify-center text-white">
                        <Icon name="Shield" size={20} />
                    </div>
                    <div>
                        <h3 className="font-bold text-white">Why verify?</h3>
                        <p className="text-xs text-text-secondary leading-relaxed mt-1">
                            To comply with financial regulations and protect your account from fraud, we require identity verification before processing payouts.
                        </p>
                    </div>
                </GlassPanel>

                <GlassPanel className="p-6 space-y-4">
                    <div className="w-10 h-10 bg-white/5 rounded-lg flex items-center justify-center text-white">
                        <Icon name="Lock" size={20} />
                    </div>
                    <div>
                        <h3 className="font-bold text-white">Security & Privacy</h3>
                        <p className="text-xs text-text-secondary leading-relaxed mt-1">
                            Your data is encrypted and used only for verification purposes. We never store full BVN/NIN numbers in plain text.
                        </p>
                    </div>
                </GlassPanel>
            </div>
        </div>
    );
}
