'use client';

import React, { useEffect, useState } from 'react';
import { OpsShell } from '../../../../components/OpsShell';
import { OpsService, Merchant } from '../../../../services/OpsService';
import { useParams, useRouter } from 'next/navigation';
import { CheckCircle, XCircle, Ban, ArrowLeft, Clock, ShieldCheck, Shield } from 'lucide-react';
import Link from 'next/link';

export default function MerchantDetailPage() {
    const params = useParams();
    const router = useRouter();
    const [merchant, setMerchant] = useState<Merchant | null>(null);
    const [loading, setLoading] = useState(true);

    const loadMerchant = async () => {
        if (params.id) {
            const data = await OpsService.getMerchant(params.id as string);
            setMerchant(data || null);
            setLoading(false);
        }
    };

    useEffect(() => {
        loadMerchant();
    }, [params.id]);

    const handleReview = async (action: 'APPROVE' | 'REJECT') => {
        if (!merchant) return;

        let reason = '';
        if (action === 'REJECT') {
            reason = window.prompt('Enter reason for rejection:') || '';
            if (!reason) return;
        }

        try {
            await OpsService.reviewKyc(merchant.id, action, reason);
            await loadMerchant();
        } catch (e) {
            console.error('Review failed', e);
        }
    };

    if (loading) return <OpsShell><div>Loading Merchant...</div></OpsShell>;
    if (!merchant) return <OpsShell><div>Merchant not found</div></OpsShell>;

    const kycStatus = (merchant.kycStatus || 'NOT_STARTED').toUpperCase();

    return (
        <OpsShell>
            <div className="mb-6">
                <Link href="/ops/merchants" className="text-sm text-gray-500 hover:text-black flex items-center gap-1 mb-4">
                    <ArrowLeft size={16} /> Back to Merchants
                </Link>
                <div className="flex justify-between items-start">
                    <div>
                        <h1 className="text-3xl font-bold mb-2">{merchant.name}</h1>
                        <p className="text-gray-500">{merchant.id} • {merchant.email} • {merchant.slug}.vayva.shop</p>
                    </div>
                    <div className="flex gap-3">
                        <button className="px-4 py-2 border border-gray-200 rounded-lg text-sm font-medium hover:border-black flex items-center gap-2">
                            <Ban size={16} /> Suspend Store
                        </button>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* KYC Section */}
                <div className="bg-white border border-gray-200 rounded-xl p-6">
                    <h3 className="font-bold border-b border-gray-100 pb-3 mb-4">KYC Verification</h3>

                    <div className="space-y-4 mb-6">
                        <div className="flex justify-between items-center">
                            <span className="text-gray-500">Status</span>
                            <div className={`flex items-center gap-2 font-bold px-3 py-1 rounded-full text-xs
                                ${kycStatus === 'VERIFIED' ? 'bg-green-100 text-green-700' :
                                    kycStatus === 'PENDING' ? 'bg-yellow-100 text-yellow-700' :
                                        'bg-gray-100 text-gray-700'}`}>
                                {kycStatus === 'VERIFIED' ? <ShieldCheck size={12} /> : kycStatus === 'PENDING' ? <Clock size={12} /> : <Shield size={12} />}
                                {kycStatus}
                            </div>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-gray-500">Risk Score</span>
                            <span className="font-bold capitalize">{merchant.riskScore}</span>
                        </div>
                        <div className="p-4 bg-gray-50 rounded-lg text-sm text-gray-600">
                            Documents submitted: BVN/NIN (Masked).
                            <br />
                            <span className="text-xs text-gray-400">Submission date: {new Date(merchant.joinedAt).toLocaleDateString()}</span>
                        </div>
                    </div>

                    {kycStatus === 'PENDING' && (
                        <div className="flex gap-3">
                            <button
                                onClick={() => handleReview('APPROVE')}
                                className="flex-1 bg-black text-white py-2 rounded-lg font-bold hover:bg-gray-900 flex items-center justify-center gap-2"
                            >
                                <CheckCircle size={16} /> Approve
                            </button>
                            <button
                                onClick={() => handleReview('REJECT')}
                                className="flex-1 border border-red-200 text-red-600 py-2 rounded-lg font-bold hover:bg-red-50 flex items-center justify-center gap-2"
                            >
                                <XCircle size={16} /> Reject
                            </button>
                        </div>
                    )}
                </div>

                {/* Financial Section */}
                <div className="bg-white border border-gray-200 rounded-xl p-6">
                    <h3 className="font-bold border-b border-gray-100 pb-3 mb-4">Financials</h3>
                    <div className="flex justify-between items-end mb-6">
                        <div>
                            <p className="text-sm text-gray-500 mb-1">Wallet Balance</p>
                            <p className="text-3xl font-bold">₦{(merchant.balance || 0).toLocaleString()}</p>
                        </div>
                    </div>
                    <div className="bg-yellow-50 text-yellow-800 p-4 rounded-lg text-sm">
                        {kycStatus === 'VERIFIED' ? 'No active payout issues detected.' : 'Payouts restricted until KYC is verified.'}
                    </div>
                </div>
            </div>
        </OpsShell>
    );
}
