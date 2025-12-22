'use client';

import React, { useEffect, useState } from 'react';
import { GlassPanel, Button, Icon } from '@vayva/ui';
import Link from 'next/link';
import { AccountService } from '@/services/account.service';
import { BillingService } from '@/services/billing.service';
import { MerchantProfile, StoreProfile, KycDetails } from '@/types/account';
import { Subscription } from '@/types/billing';
import { Spinner } from '@/components/Spinner';

export default function AccountOverviewPage() {
    const [profile, setProfile] = useState<MerchantProfile | null>(null);
    const [store, setStore] = useState<StoreProfile | null>(null);
    const [subscription, setSubscription] = useState<Subscription | null>(null);
    const [kyc, setKyc] = useState<KycDetails | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const load = async () => {
            const [p, s, sub, k] = await Promise.all([
                AccountService.getProfile(),
                AccountService.getStoreProfile(),
                BillingService.getSubscription(),
                AccountService.getKycStatus()
            ]);
            setProfile(p);
            setStore(s);
            setSubscription(sub);
            setKyc(k);
            setLoading(false);
        };
        load();
    }, []);

    if (loading) return <div className="p-8 flex justify-center"><Spinner /></div>;

    return (
        <div className="space-y-6">
            <header className="mb-8">
                <h2 className="text-2xl font-bold text-white">Welcome, {profile?.firstName}</h2>
                <p className="text-text-secondary">Here's an overview of your account status.</p>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {/* Current Plan */}
                <GlassPanel className="p-6 flex flex-col justify-between">
                    <div>
                        <div className="flex items-center justify-between mb-4">
                            <Icon name={"CreditCard" as any} className="text-primary" />
                            <span className="text-xs font-bold bg-white/10 px-2 py-1 rounded text-white uppercase">{subscription?.planId} PLAN</span>
                        </div>
                        <h3 className="text-lg font-bold text-white">Subscription</h3>
                        <p className="text-sm text-text-secondary mt-1">Manage your plan and billing.</p>
                    </div>
                    <Link href="/admin/account/subscription" className="mt-6">
                        <Button variant="outline" className="w-full">Manage Plan</Button>
                    </Link>
                </GlassPanel>

                {/* Store Status */}
                <GlassPanel className="p-6 flex flex-col justify-between">
                    <div>
                        <div className="flex items-center justify-between mb-4">
                            <Icon name={"Store" as any} className="text-blue-400" />
                            <span className={`text-xs font-bold px-2 py-1 rounded uppercase ${store?.isPublished ? 'bg-green-500/10 text-green-500' : 'bg-yellow-500/10 text-yellow-500'}`}>
                                {store?.isPublished ? 'Live' : 'Offline'}
                            </span>
                        </div>
                        <h3 className="text-lg font-bold text-white">Storefront</h3>
                        <p className="text-sm text-text-secondary mt-1">{store?.name}</p>
                    </div>
                    <div className="mt-6 flex gap-2">
                        <Link href="/admin/control-center/preview" target="_blank" className="flex-1">
                            <Button variant="outline" className="w-full">Preview</Button>
                        </Link>
                        <Link href="/admin/control-center" className="flex-1">
                            <Button variant="secondary" className="w-full">Edit</Button>
                        </Link>
                    </div>
                </GlassPanel>

                {/* Compliance / KYC */}
                <GlassPanel className="p-6 flex flex-col justify-between">
                    <div>
                        <div className="flex items-center justify-between mb-4">
                            <Icon name={"Shield" as any} className={kyc?.status === 'verified' ? 'text-green-500' : 'text-orange-500'} />
                            <span className="text-xs font-bold bg-white/10 px-2 py-1 rounded text-white uppercase">Compliance</span>
                        </div>
                        <h3 className="text-lg font-bold text-white">Identity Verification</h3>
                        <p className="text-sm text-text-secondary mt-1">
                            {kyc?.status === 'verified' ? 'Your identity is verified.' : 'Verification required for payouts.'}
                        </p>
                    </div>
                    <Link href="/admin/account/compliance-kyc" className="mt-6">
                        <Button variant={kyc?.status === 'verified' ? 'outline' : 'primary'} className="w-full">
                            {kyc?.status === 'verified' ? 'View Details' : 'Complete KYC'}
                        </Button>
                    </Link>
                </GlassPanel>

                {/* WhatsApp Agent */}
                <GlassPanel className="p-6 flex flex-col justify-between">
                    <div>
                        <div className="flex items-center justify-between mb-4">
                            <Icon name={"MessageSquare" as any} className="text-green-400" />
                            <span className="text-xs font-bold bg-white/10 px-2 py-1 rounded text-white uppercase">AI AGENT</span>
                        </div>
                        <h3 className="text-lg font-bold text-white">WhatsApp Agent</h3>
                        <p className="text-sm text-text-secondary mt-1">Configure your automated support.</p>
                    </div>
                    {/* Note: This route might be /admin/wa-agent based on sidebar, keeping consistent */}
                    <Link href="/admin/wa-agent" className="mt-6">
                        <Button variant="outline" className="w-full">Manage Agent</Button>
                    </Link>
                </GlassPanel>

                {/* Wallet */}
                <GlassPanel className="p-6 flex flex-col justify-between">
                    <div>
                        <div className="flex items-center justify-between mb-4">
                            <Icon name={"Wallet" as any} className="text-purple-400" />
                        </div>
                        <h3 className="text-lg font-bold text-white">Wallet</h3>
                        <p className="text-sm text-text-secondary mt-1">View balance and payouts.</p>
                    </div>
                    <Link href="/admin/payments" className="mt-6">
                        <Button variant="outline" className="w-full">Open Wallet</Button>
                    </Link>
                </GlassPanel>
            </div>
        </div>
    );
}
