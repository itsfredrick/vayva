"use client";

import React, { useState } from "react";
import { Button, Input, Icon } from "@vayva/ui";
import { Switch } from "@/components/ui/Switch";
import { useOnboarding } from "@/context/OnboardingContext";

export default function FinancePage() {
    const { state, updateState, goToStep } = useOnboarding();

    const [bankDetails, setBankDetails] = useState({
        bankName: state?.finance?.bankName || "",
        accountNumber: state?.finance?.accountNumber || "",
        accountName: state?.finance?.accountName || "",
    });

    const [paymentMethods, setPaymentMethods] = useState({
        bankTransfer: state?.finance?.methods?.bankTransfer ?? true,
        cash: state?.finance?.methods?.cash ?? false,
        pos: state?.finance?.methods?.pos ?? false,
    });

    const [isVerifying, setIsVerifying] = useState(false);

    // Mock Bank Verification
    const verifyAccount = () => {
        if (bankDetails.accountNumber.length === 10) {
            setIsVerifying(true);
            setTimeout(() => {
                setBankDetails(prev => ({ ...prev, accountName: "VAYVA MERCHANT TEST" }));
                setIsVerifying(false);
            }, 1000);
        }
    };

    const handleContinue = async () => {
        await updateState({
            finance: {
                ...bankDetails,
                methods: paymentMethods
            }
        });

        // Check if we need to skip delivery
        const skipLogistics = state?.intent?.hasDelivery === false;

        if (skipLogistics) {
            await goToStep("inventory");
        } else {
            await goToStep("logistics");
        }
    };

    return (
        <div className="max-w-3xl mx-auto py-8">
            <div className="mb-8">
                <h1 className="text-2xl font-bold text-gray-900 mb-2">
                    Finance & Payments
                </h1>
                <p className="text-gray-500">
                    How do you want to receive payments?
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Left Column: Bank Details */}
                <div className="space-y-6">
                    <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm">
                        <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                            <Icon name="Building2" size={20} />
                            Bank Account
                        </h3>

                        <div className="space-y-4">
                            <div className="space-y-1">
                                <label className="text-sm font-medium text-gray-700">Bank Name</label>
                                <select
                                    className="w-full h-12 rounded-xl border border-gray-200 px-3 bg-gray-50 focus:outline-none focus:border-black"
                                    value={bankDetails.bankName}
                                    onChange={(e) => setBankDetails({ ...bankDetails, bankName: e.target.value })}
                                >
                                    <option value="">Select Bank</option>
                                    <option value="gtbank">Guaranty Trust Bank</option>
                                    <option value="zenith">Zenith Bank</option>
                                    <option value="access">Access Bank</option>
                                    <option value="kuda">Kuda Microfinance</option>
                                    <option value="opay">OPay</option>
                                </select>
                            </div>

                            <div className="space-y-1">
                                <label className="text-sm font-medium text-gray-700">Account Number</label>
                                <div className="relative">
                                    <Input
                                        value={bankDetails.accountNumber}
                                        onChange={(e) => {
                                            setBankDetails({ ...bankDetails, accountNumber: e.target.value });
                                            if (e.target.value.length === 10) verifyAccount();
                                        }}
                                        maxLength={10}
                                        placeholder="0123456789"
                                        className="pr-10"
                                    />
                                    {isVerifying && (
                                        <div className="absolute right-3 top-3">
                                            <Icon name="Loader" className="animate-spin text-gray-400" size={16} />
                                        </div>
                                    )}
                                </div>
                            </div>

                            <div className="space-y-1">
                                <label className="text-sm font-medium text-gray-700">Account Name</label>
                                <Input
                                    value={bankDetails.accountName}
                                    readOnly
                                    className="bg-gray-50 text-gray-500"
                                    placeholder="Auto-verified name"
                                />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right Column: Payment Methods */}
                <div className="space-y-6">
                    <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm">
                        <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                            <Icon name="CreditCard" size={20} />
                            Payment Methods
                        </h3>

                        <div className="space-y-4 divide-y divide-gray-100">
                            <div className="flex items-center justify-between py-2">
                                <div>
                                    <p className="font-medium text-gray-900">Bank Transfer</p>
                                    <p className="text-xs text-gray-500">Customers transfer to you</p>
                                </div>
                                <Switch
                                    checked={paymentMethods.bankTransfer}
                                    onCheckedChange={(c: boolean) => setPaymentMethods(p => ({ ...p, bankTransfer: c }))}
                                />
                            </div>

                            <div className="flex items-center justify-between py-2 pt-4">
                                <div>
                                    <p className="font-medium text-gray-900">Cash on Delivery</p>
                                    <p className="text-xs text-gray-500">Pay when delivered</p>
                                </div>
                                <Switch
                                    checked={paymentMethods.cash}
                                    onCheckedChange={(c: boolean) => setPaymentMethods(p => ({ ...p, cash: c }))}
                                />
                            </div>

                            <div className="flex items-center justify-between py-2 pt-4">
                                <div>
                                    <p className="font-medium text-gray-900">POS on Delivery</p>
                                    <p className="text-xs text-gray-500">Use terminal on arrival</p>
                                </div>
                                <Switch
                                    checked={paymentMethods.pos}
                                    onCheckedChange={(c: boolean) => setPaymentMethods(p => ({ ...p, pos: c }))}
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="flex justify-end pt-8">
                <Button
                    onClick={handleContinue}
                    disabled={paymentMethods.bankTransfer && !bankDetails.accountName}
                    className="!bg-black text-white px-10 rounded-xl h-12 shadow-lg hover:shadow-xl transition-all"
                >
                    Continue
                    <Icon name="ArrowRight" className="ml-2 w-4 h-4" />
                </Button>
            </div>
        </div>
    );
}
