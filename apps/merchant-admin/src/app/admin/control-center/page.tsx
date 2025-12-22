'use client';

import React from 'react';
import Link from 'next/link';
import { ControlCenterCard } from '@/components/control-center/ControlCenterCard';
import { Button, GlassPanel, Icon } from '@vayva/ui';

export default function ControlCenterPage() {
    const [config, setConfig] = React.useState<any>(null);
    const [loading, setLoading] = React.useState(true);

    React.useEffect(() => {
        // Mock fetching config and KYC status
        const load = async () => {
            // In a real app we'd fetch specific KYC status here or from context
            // For now we assume the user is 'starter' and KYC is PENDING by default for this flow
            // unless we toggled it. 
            // Let's implement a visual toggle for testing if needed, or just stick to the requirements.
            // Requirement: "If KYC verified: allow Publish Store".
            setLoading(false);
        };
        load();
    }, []);

    // Real Status Hook
    const { summary } = require('@/context/WalletContext').useWallet?.() || { summary: null };
    const isKycVerified = summary?.kycStatus === 'VERIFIED';
    const isPublished = config?.isPublished || false;

    return (
        <div className="mx-auto max-w-6xl space-y-8 p-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-white tracking-tight">Control Center</h1>
                    <p className="mt-2 text-text-secondary">Manage your storefront presence and settings.</p>
                </div>
                <div className="flex gap-3">
                    <Link href="/admin/control-center/preview" target="_blank">
                        <Button variant="secondary" className="gap-2">
                            <Icon name={"Eye" as any} size={16} />
                            Preview
                        </Button>
                    </Link>
                    <Button
                        variant="primary"
                        className="gap-2"
                        disabled={!isKycVerified || loading}
                        isLoading={loading}
                        onClick={async () => {
                            setLoading(true);
                            try {
                                const response = await fetch('/v1/orders/publish', { method: 'POST' });
                                if (response.ok) {
                                    window.location.reload();
                                }
                            } catch (e) {
                                console.error('Publish Error', e);
                            } finally {
                                setLoading(false);
                            }
                        }}
                        title={!isKycVerified ? "Verify KYC to publish" : "Publish Store"}
                    >
                        <Icon name={"Globe" as any} size={16} />
                        {isPublished ? 'Update Live Store' : 'Publish Store'}
                    </Button>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <ControlCenterCard
                    title="Templates"
                    description="Choose and customize your store theme."
                    icon="Layout"
                    href="/admin/control-center/templates"
                    status="Active: Vayva Storefront"
                />
                <ControlCenterCard
                    title="Branding"
                    description="Logos, colors, and typography."
                    icon="Palette"
                    href="/admin/control-center/branding"
                />
                <ControlCenterCard
                    title="Pages"
                    description="Manage About, Contact, and custom pages."
                    icon="FileText"
                    href="/admin/control-center/pages"
                />
                <ControlCenterCard
                    title="Navigation"
                    description="Configure header and footer links."
                    icon="Menu"
                    href="/admin/control-center/navigation"
                />
                <ControlCenterCard
                    title="Policies"
                    description="Returns, shipping, and privacy policies."
                    icon="Shield"
                    href="/admin/control-center/policies"
                />
                <ControlCenterCard
                    title="Domains"
                    description="Connect your custom domain."
                    icon="Globe"
                    href="/admin/control-center/domains"
                    status="Coming Soon"

                />
            </div>

            {/* Quick Status / Gating Info */}
            <GlassPanel className={`p-6 mt-8 flex items-center justify-between border-l-4 ${isKycVerified ? 'border-l-green-500 bg-green-500/5' : 'border-l-yellow-500 bg-yellow-500/5'}`}>
                <div className="flex items-center gap-4">
                    <div className={`p-2 rounded-full ${isKycVerified ? 'bg-green-500/20 text-green-500' : 'bg-yellow-500/20 text-yellow-500'}`}>
                        <Icon name={(isKycVerified ? "CheckCircle" : "AlertCircle") as any} size={24} />
                    </div>
                    <div>
                        <h4 className="font-medium text-white">{isPublished ? 'Store is Live' : (isKycVerified ? 'Ready to Publish' : 'Store is Offline')}</h4>
                        <p className="text-sm text-text-secondary">
                            {isPublished
                                ? 'Your store is visible to customers.'
                                : (isKycVerified ? 'You can now publish your store.' : 'Verify your business details (KYC) to go live.')}
                        </p>
                    </div>
                </div>
                {!isKycVerified && (
                    <Link href="/admin/onboarding/review">
                        <Button variant="outline" size="sm">Complete Verification</Button>
                    </Link>
                )}
            </GlassPanel>
        </div>
    );
}
