"use client";

import { useOnboarding } from "../OnboardingContext";
import { Button, Input, Label } from "@vayva/ui";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { Loader2, CheckCircle2, CreditCard, ArrowRight, ArrowLeft, Shield } from "lucide-react";

interface Bank {
    name: string;
    code: string;
}

export default function PaymentStep() {
    const { nextStep, prevStep, updateData, state: rawState, isSaving } = useOnboarding();
    const state = rawState as any;
    const [accountNumber, setAccountNumber] = useState(state.finance?.accountNumber || "");
    const [selectedBankCode, setSelectedBankCode] = useState(state.finance?.bankCode || "");
    const [banks, setBanks] = useState<Bank[]>([]);
    const [resolvedName, setResolvedName] = useState(state.finance?.accountName || "");
    const [resolving, setResolving] = useState(false);
    const [loadingBanks, setLoadingBanks] = useState(true);

    useEffect(() => {
        fetch("/api/payments/banks")
            .then(res => res.json())
            .then((data: any) => {
                if (Array.isArray(data)) setBanks(data);
            })
            .catch(() => toast.error("Failed to load banks"))
            .finally(() => setLoadingBanks(false));
    }, []);

    useEffect(() => {
        if (accountNumber.length === 10 && selectedBankCode) {
            resolveAccount();
        } else {
            if (resolvedName && (accountNumber.length !== 10 || !selectedBankCode)) {
                setResolvedName("");
            }
        }
    }, [accountNumber, selectedBankCode]);

    const resolveAccount = async () => {
        setResolving(true);
        try {
            const res = await fetch(`/api/payments/resolve?account_number=${accountNumber}&bank_code=${selectedBankCode}`);
            const data = await res.json();

            if (!res.ok) throw new Error(data.error || "Could not resolve account");

            setResolvedName(data.account_name);
            toast.success("Account verified!");
        } catch (error: any) {
            setResolvedName("");
            toast.error(error.message);
        } finally {
            setResolving(false);
        }
    };

    const handleContinue = () => {
        if (!resolvedName) {
            toast.error("Please resolve the account name first.");
            return;
        }

        const bank = banks.find(b => b.code === selectedBankCode);

        updateData({
            finance: {
                bankCode: selectedBankCode,
                bankName: bank?.name || "",
                accountNumber,
                accountName: resolvedName,
                methods: {
                    bankTransfer: true,
                    cash: false,
                    pos: false
                }
            },
        } as any);
        nextStep();
    };

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="space-y-2 text-center">
                <div className="inline-flex items-center justify-center p-3 bg-vayva-green/10 rounded-2xl mb-2">
                    <CreditCard className="text-vayva-green h-6 w-6" />
                </div>
                <h2 className="text-3xl font-black text-black">Payout Details</h2>
                <p className="text-gray-500">Where should we send your money? Powered by Paystack.</p>
            </div>

            <div className="space-y-5">
                <div className="space-y-2">
                    <Label htmlFor="bankSelect" className="text-black font-semibold">Select Bank</Label>
                    <select
                        id="bankSelect"
                        value={(selectedBankCode as any)}
                        onChange={(e: any) => setSelectedBankCode(e.target.value)}
                        disabled={loadingBanks}
                        className="flex h-12 w-full rounded-xl border border-gray-200 bg-white px-4 py-2 text-sm focus:outline-none focus:border-vayva-green focus:ring-2 focus:ring-vayva-green/20 disabled:cursor-not-allowed disabled:opacity-50"
                        title="Select Bank"
                    >
                        <option value="" disabled>Select a bank</option>
                        {banks.map((bank: any) => (
                            <option key={bank.code} value={(bank.code as any)}>{bank.name}</option>
                        ))}
                    </select>
                </div>

                <div className="space-y-2">
                    <Label htmlFor="accountNumber" className="text-black font-semibold">Account Number</Label>
                    <div className="relative">
                        <Input
                            id="accountNumber"
                            placeholder="0123456789"
                            value={(accountNumber as any)}
                            onChange={(e: any) => setAccountNumber(e.target.value.replace(/\D/g, '').slice(0, 10))}
                            maxLength={10}
                            className={`h-12 rounded-xl border-gray-200 focus:border-vayva-green focus:ring-vayva-green/20 ${resolvedName ? "border-vayva-green pr-10" : ""}`}
                        />
                        {resolving && (
                            <div className="absolute right-3 top-3.5">
                                <Loader2 className="h-5 w-5 animate-spin text-gray-400" />
                            </div>
                        )}
                        {resolvedName && !resolving && (
                            <div className="absolute right-3 top-3.5">
                                <CheckCircle2 className="h-5 w-5 text-vayva-green" />
                            </div>
                        )}
                    </div>
                </div>

                {resolvedName && (
                    <div className="p-4 bg-vayva-green/5 text-vayva-green rounded-xl text-sm font-medium border border-vayva-green/20 flex items-center justify-between animate-in fade-in slide-in-from-top-2">
                        <span className="text-gray-600">Account Name:</span>
                        <span className="font-bold text-black">{resolvedName}</span>
                    </div>
                )}

                <div className="flex items-center gap-2 text-xs text-gray-400 bg-gray-50 p-3 rounded-xl">
                    <Shield className="h-4 w-4 text-vayva-green" />
                    <span>Your bank details are securely encrypted and processed by Paystack.</span>
                </div>
            </div>

            <div className="pt-4 flex gap-3">
                <Button 
                    variant="outline" 
                    onClick={prevStep} 
                    disabled={isSaving}
                    className="h-12 px-6 rounded-xl border-gray-200 hover:bg-gray-50"
                >
                    <ArrowLeft className="mr-2 h-4 w-4" /> Back
                </Button>
                <Button 
                    className="flex-1 h-12 bg-vayva-green hover:bg-vayva-green/90 text-white rounded-xl font-bold" 
                    onClick={handleContinue} 
                    disabled={!resolvedName || isSaving || resolving}
                >
                    Continue <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
            </div>
        </div>
    );
}
