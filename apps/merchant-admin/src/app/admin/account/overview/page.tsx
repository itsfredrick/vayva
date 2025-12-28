'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
    CreditCard,
    FileCheck,
    Wallet,
    MessageSquare,
    ArrowRight,
    AlertCircle,
    CheckCircle,
    Clock,
    XCircle,
    User,
    ShieldCheck,
    Globe,
    Share2,
    Lock
} from 'lucide-react';
import { cn, Icon } from '@vayva/ui';
import { ACCOUNT_ROUTES } from '@/lib/routes/account-routes';
import { PinEntryModal } from '@/components/security/PinEntryModal';

interface AccountOverviewData {
    profile: {
        name: string;
        category: string;
        plan: string;
        isLive: boolean;
        onboardingCompleted: boolean;
    };
    subscription: {
        plan: string;
        status: string;
        renewalDate: string | null;
        canUpgrade: boolean;
    };
    kyc: {
        status: string;
        lastAttempt: string | null;
        rejectionReason: string | null;
        missingDocs: string[];
        canWithdraw: boolean;
    };
    payouts: {
        bankConnected: boolean;
        payoutsEnabled: boolean;
        maskedAccount: string | null;
        bankName: string | null;
    };
    domains: {
        customDomain: string | null;
        subdomain: string;
        status: string;
        sslEnabled: boolean;
    };
    integrations: {
        whatsapp: string;
        payments: string;
        delivery: string;
        lastWebhook: string;
    };
    security: {
        mfaEnabled: boolean;
        recentLogins: number;
        apiKeyStatus: string;
    };
    alerts: Array<{
        id: string;
        severity: 'error' | 'warning' | 'info';
        message: string;
        action: string;
    }>;
}

export default function AccountOverviewPage() {
    const [data, setData] = useState<AccountOverviewData | null>(null);
    const [loading, setLoading] = useState(true);
    const [showPinModal, setShowPinModal] = useState(false);
    const [isPinSetup, setIsPinSetup] = useState(true); // TODO: fetch from backend

    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await fetch('/api/account/overview');
                if (!res.ok) throw new Error('Failed to fetch');
                const json = await res.json();
                setData(json);
            } catch (error) {
                console.error('Failed to load account overview', error);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    if (loading) {
        return (
            <div className="space-y-6 animate-in fade-in duration-500">
                <div className="h-12 bg-gray-100 rounded-xl w-64 animate-pulse"></div>
                <div className="h-24 bg-gray-50 border border-gray-100 rounded-2xl w-full animate-pulse"></div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {[1, 2, 3, 4, 5, 6, 7].map((i) => (
                        <div key={i} className="h-56 bg-white border border-gray-100 rounded-2xl animate-pulse"></div>
                    ))}
                </div>
            </div>
        );
    }

    if (!data) return null;

    const hasCriticalError = data.alerts.some((a: any) => a.severity === 'error');
    const hasWarnings = data.alerts.some((a: any) => a.severity === 'warning');

    return (
        <div className="space-y-8 pb-12 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">Account Overview</h1>
                    <p className="text-gray-500 text-lg mt-1 font-medium">Monitor your business health and identity status.</p>
                </div>
                <div className="flex items-center gap-3">
                    <span className="text-sm font-bold text-gray-400 uppercase tracking-widest">Store ID</span>
                    <code className="bg-gray-100 px-3 py-1.5 rounded-lg font-mono text-sm text-gray-700 select-all">
                        {data.profile.name?.toLowerCase().replace(/ /g, '-') || 'pending'}
                    </code>
                </div>
            </div>

            {/* Health Banner */}
            <div className={cn(
                "p-4 rounded-2xl border flex items-center gap-4 transition-all shadow-sm",
                hasCriticalError ? "bg-red-50 border-red-200" :
                    hasWarnings ? "bg-amber-50 border-amber-200" :
                        "bg-emerald-50 border-emerald-200"
            )}>
                <div className={cn(
                    "p-2 rounded-full",
                    hasCriticalError ? "bg-red-200 text-red-700" :
                        hasWarnings ? "bg-amber-200 text-amber-700" :
                            "bg-emerald-200 text-emerald-700"
                )}>
                    <Icon name={hasCriticalError ? "AlertCircle" : hasWarnings ? "Clock" : "CheckCircle" as any} size={24} />
                </div>
                <div className="flex-1">
                    <h3 className={cn(
                        "font-bold text-lg",
                        hasCriticalError ? "text-red-900" : hasWarnings ? "text-amber-900" : "text-emerald-900"
                    )}>
                        {hasCriticalError ? "Account attention required" :
                            hasWarnings ? "Recommendations available" :
                                "Your account is in optimal health"}
                    </h3>
                    <p className={cn(
                        "text-sm font-medium",
                        hasCriticalError ? "text-red-700" : hasWarnings ? "text-amber-700" : "text-emerald-700"
                    )}>
                        {hasCriticalError ? "Please resolve critical alerts to prevent service interruption." :
                            hasWarnings ? "Complete pending configurations to unlock full platform features." :
                                "All systems operational. No actions required."}
                    </p>
                </div>
            </div>

            {/* Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-6">
                {/* 1. Profile & Business */}
                <StatusCard
                    title="Profile & Business"
                    icon={<User size={20} />}
                    status="ACTIVE"
                    details={[
                        { label: 'Legal Name', value: data.profile.name },
                        { label: 'Category', value: data.profile.category },
                        { label: 'Live Status', value: data.profile.isLive ? 'Live' : 'Draft' }
                    ]}
                    action={{ label: 'Edit Profile', href: ACCOUNT_ROUTES.SETTINGS_STORE }}
                />

                {/* 2. Verification (KYC) */}
                <StatusCard
                    title="Verification (KYC)"
                    icon={<ShieldCheck size={20} />}
                    status={data.kyc.status}
                    details={[
                        { label: 'Identity', value: getKYCStatusLabel(data.kyc.status) },
                        { label: 'Last Attempt', value: data.kyc.lastAttempt ? new Date(data.kyc.lastAttempt).toLocaleDateString() : 'None' }
                    ]}
                    action={{ label: 'Verify Identity', href: ACCOUNT_ROUTES.KYC }}
                />

                {/* 3. Plan & Billing */}
                <StatusCard
                    title="Plan & Billing"
                    icon={<CreditCard size={20} />}
                    status={data.subscription.status === 'ACTIVE' ? 'VERIFIED' : 'FAILED'}
                    details={[
                        { label: 'Current Plan', value: data.subscription.plan },
                        { label: 'Next Billing', value: data.subscription.renewalDate ? new Date(data.subscription.renewalDate).toLocaleDateString() : 'N/A' }
                    ]}
                    action={{ label: 'Manage Billing', href: ACCOUNT_ROUTES.SETTINGS_BILLING }}
                />

                {/* 4. Domains & Storefront */}
                <StatusCard
                    title="Domains"
                    icon={<Globe size={20} />}
                    status={data.domains.sslEnabled ? 'VERIFIED' : 'PENDING'}
                    details={[
                        { label: 'Main Domain', value: data.domains.customDomain || data.domains.subdomain },
                        { label: 'SSL Status', value: data.domains.sslEnabled ? 'Enabled' : 'Pending' }
                    ]}
                    action={{ label: 'Manage Domains', href: ACCOUNT_ROUTES.SETTINGS_DOMAINS }}
                />

                {/* 5. Payouts & Settlement */}
                <StatusCard
                    title="Payouts"
                    icon={<Wallet size={20} />}
                    status={data.payouts.payoutsEnabled ? 'VERIFIED' : 'PENDING'}
                    details={[
                        { label: 'Bank Name', value: data.payouts.bankName || 'Not Added' },
                        { label: 'Account', value: data.payouts.maskedAccount || 'None' }
                    ]}
                    action={{ label: 'Update Payouts', href: ACCOUNT_ROUTES.SETTINGS_PAYOUTS }}
                />

                {/* 6. Integrations */}
                <StatusCard
                    title="Integrations Health"
                    icon={<Share2 size={20} />}
                    status={data.integrations.whatsapp === 'CONNECTED' ? 'ACTIVE' : 'DISCONNECTED'}
                    details={[
                        { label: 'WhatsApp', value: data.integrations.whatsapp },
                        { label: 'Last Webhook', value: new Date(data.integrations.lastWebhook).toLocaleTimeString() }
                    ]}
                    action={{ label: 'Settings', href: ACCOUNT_ROUTES.SETTINGS_INTEGRATIONS }}
                />

                {/* 7. Security */}
                <StatusCard
                    title="Security"
                    icon={<Lock size={20} />}
                    status={data.security.mfaEnabled || isPinSetup ? 'VERIFIED' : 'PENDING'}
                    details={[
                        { label: '2FA Status', value: data.security.mfaEnabled ? 'Enabled' : 'Disabled' },
                        { label: 'Seller PIN', value: isPinSetup ? 'Active' : 'Not Set' }
                    ]}
                    action={{
                        label: isPinSetup ? 'Change PIN' : 'Set PIN',
                        // Instead of href, we use onClick if we could, but StatusCard expects href. 
                        // We'll wrap or modify StatusCard to accept onClick or just use a settings link 
                        href: '#',
                        onClick: (e: any) => {
                            e.preventDefault();
                            setShowPinModal(true);
                        }
                    }}
                />
            </div>

            {/* PIN Modal */}
            <PinEntryModal
                isOpen={showPinModal}
                isSetupMode={true}
                title="Change Security PIN"
                description="Update the PIN used to access sensitive areas."
                onSuccess={() => {
                    setShowPinModal(false);
                    // maybe show toast
                }}
                onClose={() => setShowPinModal(false)}
            />
        </div>
    );
}

function StatusCard({ title, icon, status, details, action }: any) {
    const statusConfig = getStatusConfig(status);

    return (
        <div className="bg-white rounded-2xl border border-gray-100 p-6 flex flex-col shadow-sm hover:shadow-md transition-all duration-300 group">
            <div className="flex items-start justify-between mb-6">
                <div className="p-3 bg-gray-50 rounded-xl group-hover:bg-black group-hover:text-white transition-colors duration-300">
                    {icon}
                </div>
                <div className={cn(
                    "flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider",
                    statusConfig.className
                )}>
                    <Icon name={statusConfig.iconName as any} size={12} />
                    {statusConfig.label}
                </div>
            </div>

            <h3 className="text-xl font-bold text-gray-900 mb-6">{title}</h3>

            <div className="space-y-3 flex-1">
                {details.map((detail: any, i: number) => (
                    <div key={i} className="flex justify-between items-center border-b border-gray-50 pb-2">
                        <span className="text-sm font-medium text-gray-400">{detail.label}</span>
                        <span className="text-sm font-bold text-gray-800">{detail.value}</span>
                    </div>
                ))}
            </div>

            {action.onClick ? (
                <button
                    onClick={action.onClick}
                    className="mt-8 flex items-center justify-center gap-2 w-full py-3 bg-gray-50 hover:bg-black text-gray-600 hover:text-white font-bold rounded-xl transition-all text-sm"
                >
                    {action.label}
                    <ArrowRight size={16} />
                </button>
            ) : (
                <Link
                    href={action.href}
                    className="mt-8 flex items-center justify-center gap-2 w-full py-3 bg-gray-50 hover:bg-black text-gray-600 hover:text-white font-bold rounded-xl transition-all text-sm"
                >
                    {action.label}
                    <ArrowRight size={16} />
                </Link>
            )}
        </div>
    );
}

function getStatusConfig(status: string) {
    switch (status?.toUpperCase()) {
        case 'ACTIVE':
        case 'VERIFIED':
            return {
                label: 'Active',
                iconName: 'CheckCircle',
                className: 'bg-green-100 text-green-700',
            };
        case 'PENDING':
        case 'NOT_STARTED':
            return {
                label: 'Pending',
                iconName: 'Clock',
                className: 'bg-yellow-100 text-yellow-700',
            };
        case 'EXPIRED':
        case 'FAILED':
        case 'DISCONNECTED':
            return {
                label: 'Inactive',
                iconName: 'XCircle',
                className: 'bg-red-100 text-red-700',
            };
        default:
            return {
                label: status || 'Unknown',
                iconName: 'Clock',
                className: 'bg-gray-100 text-gray-700',
            };
    }
}

function getKYCStatusLabel(status: string): string {
    switch (status?.toUpperCase()) {
        case 'VERIFIED':
            return 'Verified';
        case 'PENDING':
            return 'Under Review';
        case 'FAILED':
            return 'Failed';
        case 'NOT_STARTED':
            return 'Not Started';
        default:
            return status || 'Unknown';
    }
}
