'use client';

import React, { useState, useEffect } from 'react';
import { Button, GlassPanel, Icon, Input } from '@vayva/ui';
import { FEATURES } from '@/lib/env-validation';

export default function BillingPage() {
    const [isLoading, setIsLoading] = useState(true);
    const [isEditing, setIsEditing] = useState(false);
    const [showCardModal, setShowCardModal] = useState(false);
    const [data, setData] = useState<any>(null);
    const [formData, setFormData] = useState({
        legalName: '',
        email: '',
        taxId: '',
        address: ''
    });

    useEffect(() => {
        fetchBillingData();
    }, []);

    const fetchBillingData = async () => {
        try {
            const response = await fetch('/api/account/billing');
            const result = await response.json();
            setData(result);
            setFormData(result.billing);
        } catch (error) {
            console.error('Failed to fetch billing:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleSave = async () => {
        try {
            const response = await fetch('/api/account/billing', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            });
            if (response.ok) {
                setIsEditing(false);
                fetchBillingData();
            }
        } catch (error) {
            console.error('Save failed:', error);
        }
    };

    if (isLoading) return <div className="text-white">Loading billing details...</div>;

    if (!FEATURES.PAYMENTS_ENABLED) {
        return (
            <div className="max-w-4xl">
                <GlassPanel className="p-8 text-center">
                    <div className="w-16 h-16 bg-white/10 rounded-full flex items-center justify-center mx-auto mb-6">
                        <Icon name="CreditCard" size={32} className="text-white/50" />
                    </div>
                    <h2 className="text-2xl font-bold text-white mb-4">Billing Not Configured</h2>
                    <p className="text-text-secondary mb-6">
                        Payment processing is not configured for your account.
                        Contact support to enable billing features.
                    </p>
                    <a href="mailto:support@vayva.ng?subject=Enable Billing">
                        <Button variant="primary" className="gap-2">
                            <Icon name="Mail" size={16} />
                            Contact Support
                        </Button>
                    </a>
                </GlassPanel>
            </div>
        );
    }

    return (
        <div className="space-y-6 max-w-4xl">
            {/* 1. Subscription Plan */}
            <GlassPanel className="p-6">
                <div className="flex items-center justify-between mb-6">
                    <div>
                        <h3 className="text-lg font-bold text-white">Current Plan</h3>
                        <p className="text-sm text-text-secondary">Your store is currently on the {data.subscription.plan} plan.</p>
                    </div>
                    <Button variant="primary" size="sm">Upgrade Plan</Button>
                </div>
                <div className="p-4 rounded-xl bg-primary/5 border border-primary/10 flex items-center justify-between">
                    <div>
                        <div className="text-xs text-primary font-bold uppercase tracking-wider">Status</div>
                        <div className="text-white font-bold">{data.subscription.status.toUpperCase()}</div>
                    </div>
                    {data.subscription.renewalDate && (
                        <div className="text-right">
                            <div className="text-xs text-text-secondary font-bold uppercase tracking-wider">Renewal Date</div>
                            <div className="text-white font-mono">{new Date(data.subscription.renewalDate).toLocaleDateString()}</div>
                        </div>
                    )}
                </div>
            </GlassPanel>

            {/* 2. Payment Method */}
            <GlassPanel className="p-6">
                <div className="flex items-center justify-between mb-6">
                    <h3 className="text-lg font-bold text-white">Payment Method</h3>
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setShowCardModal(true)}
                    >
                        Update Card
                    </Button>
                </div>

                <div className="flex items-center gap-4 p-4 rounded-xl bg-white/5 border border-white/10 opacity-50">
                    <div className="w-12 h-8 bg-white/10 rounded flex items-center justify-center">
                        <span className="font-bold text-xs text-white">BANK</span>
                    </div>
                    <div>
                        <p className="text-white font-medium">No stored card found</p>
                        <p className="text-sm text-text-secondary">Payments will be prompted at renewal</p>
                    </div>
                </div>

                <div className="mt-8 flex items-center gap-2 text-text-secondary text-sm">
                    <Icon name={"Shield" as any} size={14} />
                    <span>Payments are secured by Paystack</span>
                </div>
            </GlassPanel>

            {/* 3. Billing Details */}
            <GlassPanel className="p-6">
                <div className="flex items-center justify-between mb-6">
                    <h3 className="text-lg font-bold text-white">Billing Details</h3>
                    {!isEditing ? (
                        <Button variant="outline" size="sm" onClick={() => setIsEditing(true)}>Edit Details</Button>
                    ) : (
                        <div className="flex gap-2">
                            <Button variant="ghost" size="sm" onClick={() => setIsEditing(false)}>Cancel</Button>
                            <Button variant="primary" size="sm" onClick={handleSave}>Save</Button>
                        </div>
                    )}
                </div>

                {isEditing ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <Input
                            label="Legal Business Name"
                            value={formData.legalName}
                            onChange={(e) => setFormData({ ...formData, legalName: e.target.value })}
                        />
                        <Input
                            label="Billing Email"
                            value={formData.email}
                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        />
                        <Input
                            label="Address"
                            value={formData.address}
                            onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                        />
                        <Input
                            label="Tax ID / TIN"
                            value={formData.taxId}
                            onChange={(e) => setFormData({ ...formData, taxId: e.target.value })}
                        />
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="text-xs text-text-secondary uppercase font-bold tracking-wider">Company Name</label>
                            <p className="text-white mt-1">{data.billing.legalName || 'Not Set'}</p>
                        </div>
                        <div>
                            <label className="text-xs text-text-secondary uppercase font-bold tracking-wider">Email for Invoices</label>
                            <p className="text-white mt-1">{data.billing.email || 'Not Set'}</p>
                        </div>
                        <div>
                            <label className="text-xs text-text-secondary uppercase font-bold tracking-wider">Address</label>
                            <p className="text-white mt-1">{data.billing.address || 'Not Set'}</p>
                        </div>
                        <div>
                            <label className="text-xs text-text-secondary uppercase font-bold tracking-wider">Tax ID</label>
                            <p className="text-white mt-1">{data.billing.taxId || 'Not Set'}</p>
                        </div>
                    </div>
                )}
            </GlassPanel>

            {/* Card Update Modal */}
            {showCardModal && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-xl max-w-md w-full p-6">
                        <div className="flex items-center justify-between mb-4">
                            <h2 className="text-xl font-bold text-gray-900">Update Payment Card</h2>
                            <button
                                onClick={() => setShowCardModal(false)}
                                className="text-gray-400 hover:text-gray-600"
                            >
                                <Icon name="X" size={20} />
                            </button>
                        </div>

                        <p className="text-gray-600 mb-6">
                            Card updates require assistance from our support team to ensure secure processing.
                        </p>

                        <div className="bg-gray-50 rounded-lg p-4 mb-6">
                            <h3 className="font-semibold text-gray-900 mb-2">What happens next:</h3>
                            <ul className="space-y-2 text-sm text-gray-600">
                                <li className="flex items-start gap-2">
                                    <Icon name="Check" size={16} className="text-green-600 mt-0.5 shrink-0" />
                                    <span>Support will send you a secure payment link</span>
                                </li>
                                <li className="flex items-start gap-2">
                                    <Icon name="Check" size={16} className="text-green-600 mt-0.5 shrink-0" />
                                    <span>Your card details are encrypted via Paystack</span>
                                </li>
                                <li className="flex items-start gap-2">
                                    <Icon name="Check" size={16} className="text-green-600 mt-0.5 shrink-0" />
                                    <span>Updates typically process within 24 hours</span>
                                </li>
                            </ul>
                        </div>

                        <div className="flex gap-3">
                            <Button
                                variant="outline"
                                className="flex-1"
                                onClick={() => setShowCardModal(false)}
                            >
                                Cancel
                            </Button>
                            <a
                                href="mailto:support@vayva.ng?subject=Update Payment Card"
                                className="flex-1"
                            >
                                <Button className="w-full gap-2">
                                    <Icon name="Mail" size={16} />
                                    Contact Support
                                </Button>
                            </a>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
