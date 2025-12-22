'use client';

import React, { useEffect, useState } from 'react';
import { GlassPanel, Button, Icon, Input } from '@vayva/ui';
import { useWallet } from '@/context/WalletContext';
import { PaymentService } from '@/services/payments';

export default function ComplianceKycPage() {
    const { summary, refreshWallet } = useWallet();
    const [kycDetail, setKycDetail] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);

    const [formData, setFormData] = useState({ bvn: '', nin: '' });

    const loadKyc = async () => {
        try {
            const data = await PaymentService.getKycStatus();
            setKycDetail(data);
        } catch (e) {
            console.error('Failed to load KYC status', e);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadKyc();
    }, []);

    const handleResubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSubmitting(true);
        try {
            await PaymentService.submitKyc(formData.nin, formData.bvn);
            await loadKyc();
            await refreshWallet();
        } catch (e) {
            console.error('Resubmit failed', e);
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) return <div className="p-8 text-center">Loading compliance profile...</div>;

    const status = kycDetail?.status || 'NOT_STARTED';

    return (
        <div className="max-w-4xl mx-auto space-y-8 p-6">
            <header>
                <h1 className="text-3xl font-bold text-black">Account Compliance</h1>
                <p className="text-gray-500">Manage your identity verification and regulatory status.</p>
            </header>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Status Card */}
                <GlassPanel className="lg:col-span-1 p-6 space-y-6">
                    <div className="text-center">
                        <div className={`w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 
                            ${status === 'VERIFIED' ? 'bg-green-100 text-green-600' :
                                status === 'PENDING' ? 'bg-yellow-100 text-yellow-600' :
                                    'bg-gray-100 text-gray-600'}`}>
                            <Icon name={(status === 'VERIFIED' ? 'ShieldCheck' : status === 'PENDING' ? 'Clock' : 'Shield') as any} size={32} />
                        </div>
                        <h2 className="text-xl font-bold text-black uppercase tracking-wider">{status.replace('_', ' ')}</h2>
                        <p className="text-sm text-gray-500 mt-1">Current KYC Status</p>
                    </div>

                    <div className="border-t border-gray-100 pt-6 space-y-4">
                        <div className="flex justify-between text-sm">
                            <span className="text-gray-500">BVN</span>
                            <span className="font-medium text-black">****{kycDetail?.bvnLast4 || '----'}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                            <span className="text-gray-500">NIN</span>
                            <span className="font-medium text-black">****{kycDetail?.ninLast4 || '----'}</span>
                        </div>
                        {kycDetail?.submittedAt && (
                            <div className="flex justify-between text-sm">
                                <span className="text-gray-500">Last Submitted</span>
                                <span className="font-medium text-black">{new Date(kycDetail.submittedAt).toLocaleDateString()}</span>
                            </div>
                        )}
                    </div>
                </GlassPanel>

                {/* Main Content */}
                <div className="lg:col-span-2 space-y-6">
                    {status === 'VERIFIED' && (
                        <GlassPanel className="p-6 border-l-4 border-l-green-500">
                            <h3 className="text-lg font-bold text-black flex items-center gap-2">
                                <Icon name={"CheckCircle" as any} className="text-green-500" />
                                You're all set!
                            </h3>
                            <p className="text-gray-600 mt-2">
                                Your identity has been verified. You have full access to all Vayva features including
                                Storefront publishing and Wallet withdrawals.
                            </p>
                            <div className="mt-4 flex gap-4">
                                <Button variant="secondary" size="sm" onClick={() => window.location.href = '/admin/control-center'}>Go to Storefront</Button>
                                <Button variant="secondary" size="sm" onClick={() => window.location.href = '/admin/wallet'}>View Wallet</Button>
                            </div>
                        </GlassPanel>
                    )}

                    {status === 'PENDING' && (
                        <GlassPanel className="p-6 border-l-4 border-l-yellow-500">
                            <h3 className="text-lg font-bold text-black flex items-center gap-2">
                                <Icon name={"Clock" as any} className="text-yellow-500" />
                                Review in Progress
                            </h3>
                            <p className="text-gray-600 mt-2">
                                We are currently reviewing your documents. This usually takes less than 24 hours.
                                We'll notify you once your status changes.
                            </p>
                        </GlassPanel>
                    )}

                    {(status === 'REJECTED' || status === 'NOT_STARTED') && (
                        <GlassPanel className="p-8">
                            <div className="mb-6">
                                <h3 className="text-xl font-bold text-black">
                                    {status === 'REJECTED' ? 'Resubmit Verification' : 'Start Verification'}
                                </h3>
                                {status === 'REJECTED' && (
                                    <div className="mt-2 p-3 bg-red-50 border border-red-100 rounded-lg text-red-700 text-sm">
                                        <strong>Reason for rejection:</strong> {kycDetail.rejectionReason || 'Documents were unclear.'}
                                    </div>
                                )}
                                <p className="text-gray-500 mt-2">Please provide your correct identification details to enable payouts.</p>
                            </div>

                            <form onSubmit={handleResubmit} className="space-y-4">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <Input
                                        label="BVN"
                                        placeholder="11111111111"
                                        maxLength={11}
                                        required
                                        value={formData.bvn}
                                        onChange={e => setFormData({ ...formData, bvn: e.target.value })}
                                    />
                                    <Input
                                        label="NIN"
                                        placeholder="11111111111"
                                        maxLength={11}
                                        required
                                        value={formData.nin}
                                        onChange={e => setFormData({ ...formData, nin: e.target.value })}
                                    />
                                </div>
                                <Button
                                    type="submit"
                                    variant="primary"
                                    className="w-full !bg-black !text-white h-12"
                                    isLoading={submitting}
                                    disabled={formData.bvn.length !== 11 || formData.nin.length !== 11}
                                >
                                    Submit for Verification
                                </Button>
                                <p className="text-[10px] text-gray-400 text-center">
                                    By submitting, you agree to Vayva's KYC Policy and allow us to verify your identity.
                                </p>
                            </form>
                        </GlassPanel>
                    )}
                </div>
            </div>
        </div>
    );
}
