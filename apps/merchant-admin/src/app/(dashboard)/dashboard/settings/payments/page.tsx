"use client";

import { useState, useEffect } from "react";
import { toast } from "sonner";
import { Button } from "@vayva/ui";
import { Switch } from "@/components/ui/switch";
import { Building2, CreditCard, Wallet, Plus, Trash2, AlertCircle } from "lucide-react";

export default function PaymentsSettingsPage() {
    const [bankTransfers, setBankTransfers] = useState(true);
    const [settlementAccount, setSettlementAccount] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function loadData() {
            try {
                const res = await fetch("/api/settings/payments/beneficiaries");
                if (res.ok) {
                    const data = await res.json();
                    setSettlementAccount(data); // null if not set
                }
            } catch (e) {
                console.error(e);
            } finally {
                setLoading(false);
            }
        }
        loadData();
    }, []);

    return (
        <div className="space-y-6 max-w-4xl">
            <div>
                <h1 className="text-2xl font-bold tracking-tight text-slate-900">Payments</h1>
                <p className="text-slate-500">Manage how you get paid and how customers pay you.</p>
            </div>

            <div className="grid gap-6">
                {/* Settlement Account */}
                <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
                    <div className="flex items-start gap-4">
                        <div className="p-3 bg-indigo-50 text-indigo-600 rounded-lg">
                            <Building2 className="h-6 w-6" />
                        </div>
                        <div className="flex-1">
                            <div className="flex items-center justify-between mb-2">
                                <h3 className="text-lg font-medium text-slate-900">Settlement Account</h3>
                                <Button
                                    variant="link"
                                    onClick={() => toast.success("Bank details update requested")}
                                    className="text-sm font-medium text-indigo-600 hover:text-indigo-700 hover:underline px-0 h-auto"
                                >
                                    {settlementAccount ? "Edit" : "Add Account"}
                                </Button>
                            </div>
                            <p className="text-slate-500 text-sm mb-4">
                                Funds from your sales will be settled to this account.
                            </p>

                            {loading ? (
                                <div className="h-20 bg-slate-50 rounded-lg animate-pulse" />
                            ) : settlementAccount ? (
                                <div className="bg-slate-50 rounded-lg border border-slate-100 p-4 max-w-md">
                                    <div className="flex justify-between items-center mb-1">
                                        <span className="text-sm font-medium text-slate-900">{settlementAccount.bankName}</span>
                                        {settlementAccount.isVerified && (
                                            <span className="text-xs font-mono text-slate-500 bg-white px-2 py-0.5 rounded border border-slate-200">VERIFIED</span>
                                        )}
                                    </div>
                                    <div className="text-lg font-mono text-slate-700 tracking-wide mb-1">{settlementAccount.accountNumber}</div>
                                    <div className="text-sm text-slate-500">{settlementAccount.accountName}</div>
                                </div>
                            ) : (
                                <div className="bg-amber-50 rounded-lg border border-amber-100 p-4 flex gap-3 text-amber-900">
                                    <AlertCircle className="h-5 w-5 flex-shrink-0" />
                                    <div>
                                        <p className="text-sm font-medium">No settlement account</p>
                                        <p className="text-xs mt-1">Add a bank account to receive payouts.</p>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Accepted Payment Methods */}
                <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
                    <div className="flex items-center gap-4 mb-6">
                        <div className="p-3 bg-emerald-50 text-emerald-600 rounded-lg">
                            <CreditCard className="h-6 w-6" />
                        </div>
                        <div>
                            <h3 className="text-lg font-medium text-slate-900">Payment Methods</h3>
                            <p className="text-slate-500 text-sm">Methods available to your customers at checkout.</p>
                        </div>
                    </div>

                    <div className="space-y-4">
                        <div className="flex items-center justify-between p-4 border border-slate-100 rounded-lg">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-6 bg-slate-100 rounded border border-slate-200 flex items-center justify-center text-[10px] font-bold text-slate-600">CARD</div>
                                <div>
                                    <p className="font-medium text-slate-900">Debit / Credit Cards</p>
                                    <p className="text-xs text-slate-500">Visa, Mastercard, Verve</p>
                                </div>
                            </div>
                            <span className="text-xs font-medium text-emerald-600 bg-emerald-50 px-2 py-1 rounded">ACTIVE</span>
                        </div>

                        <div className="flex items-center justify-between p-4 border border-slate-100 rounded-lg">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-6 bg-slate-100 rounded border border-slate-200 flex items-center justify-center text-[10px] font-bold text-slate-600">XFER</div>
                                <div>
                                    <p className="font-medium text-slate-900">Bank Transfers</p>
                                    <p className="text-xs text-slate-500">Direct transfer to virtual account</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-2">
                                <label htmlFor="bank-transfers" className="sr-only">Accept bank transfers</label>
                                <Switch
                                    id="bank-transfers"
                                    checked={bankTransfers}
                                    onCheckedChange={setBankTransfers}
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
