'use client';

import React, { useState } from 'react';
import { Button, Input, Icon } from '@vayva/ui';
import { useOnboarding } from '@/context/OnboardingContext';

// Step 8: Payments Setup (Paystack)
export default function PaymentsPage() {
    const { updateState, goToStep } = useOnboarding();
    const [loading, setLoading] = useState(false);

    // Simplistic form for now - assuming we just collect bank details to create subaccount later
    // or simulate OAuth flow
    const [account, setAccount] = useState({
        bankName: '',
        accountNumber: '',
        accountName: ''
    });

    const [verifiedName, setVerifiedName] = useState<string | null>(null);

    const checkAccount = async () => {
        if (account.accountNumber.length === 10) {
            // Mock verification
            setLoading(true);
            await new Promise(r => setTimeout(r, 1000));
            setVerifiedName("ALI MERCHANT LTD"); // Mock
            setLoading(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        await updateState({
            payments: {
                isConfigured: true,
                paystackCustomerId: 'cus_mock_123'
            }
        });
        await goToStep('whatsapp'); // or KYC depending on flow order in types. Step 9 is Whatsapp
    };

    return (
        <div className="max-w-xl mx-auto">
            <div className="mb-8">
                <h1 className="text-2xl font-bold text-black mb-2">Get Paid</h1>
                <p className="text-gray-600">Enter your bank details to receive payouts from sales.</p>
            </div>

            <form onSubmit={handleSubmit} className="bg-white p-8 rounded-2xl border border-gray-200 shadow-sm space-y-6">
                <div className="p-4 bg-blue-50 border border-blue-100 rounded-xl flex items-center gap-3">
                    <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center border border-blue-100">
                        <Icon name="ShieldCheck" className="text-blue-600" size={20} />
                    </div>
                    <div>
                        <p className="text-sm font-bold text-blue-900">Secure Payments via Paystack</p>
                        <p className="text-xs text-blue-600">Your details are encrypted and secure.</p>
                    </div>
                </div>

                <div className="space-y-4">
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-black">Bank Name</label>
                        <select
                            className="w-full h-12 rounded-xl border border-gray-200 px-3 text-sm"
                            value={account.bankName}
                            onChange={e => setAccount({ ...account, bankName: e.target.value })}
                            required
                        >
                            <option value="">Select Bank</option>
                            <option value="gtbank">GTBank</option>
                            <option value="zenith">Zenith Bank</option>
                            <option value="access">Access Bank</option>
                            <option value="kuda">Kuda Microfinance</option>
                            <option value="opay">OPay</option>
                        </select>
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium text-black">Account Number</label>
                        <div className="relative">
                            <input
                                type="text"
                                className="w-full h-12 rounded-xl border border-gray-200 px-3 text-sm outline-none focus:border-black"
                                value={account.accountNumber}
                                onChange={e => {
                                    setAccount({ ...account, accountNumber: e.target.value });
                                }}
                                onBlur={checkAccount}
                                maxLength={10}
                                placeholder="0123456789"
                                required
                            />
                            {loading && (
                                <div className="absolute right-3 top-3">
                                    <Icon name={"Loader2" as any} className="animate-spin text-gray-400" size={20} />
                                </div>
                            )}
                        </div>
                    </div>

                    {verifiedName && (
                        <div className="p-3 bg-green-50 border border-green-100 rounded-lg flex items-center gap-2 animate-fade-in">
                            <Icon name={"CheckCircle" as any} className="text-green-600" size={16} />
                            <span className="text-sm font-bold text-green-800">{verifiedName}</span>
                        </div>
                    )}
                </div>

                <div className="flex items-center gap-4 pt-4">
                    <Button
                        type="button"
                        variant="ghost"
                        onClick={() => goToStep('products')}
                        className="flex-1 text-gray-500 hover:text-black"
                    >
                        Back
                    </Button>
                    <Button
                        type="submit"
                        variant="primary"
                        className="flex-[2] !bg-black !text-white h-12 rounded-xl"
                        disabled={!verifiedName}
                    >
                        Continue
                        <Icon name="ArrowRight" className="ml-2 w-4 h-4" />
                    </Button>
                </div>
            </form>
        </div>
    );
}
