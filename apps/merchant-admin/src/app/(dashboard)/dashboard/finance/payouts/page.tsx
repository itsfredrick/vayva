"use client";

import { useState, useEffect } from "react";
import { formatCurrency } from "@/lib/format";
import { toast } from "sonner";
import { Loader2, Plus, AlertCircle, CheckCircle2 } from "lucide-react";
import { Button, cn } from "@vayva/ui";

interface Payout {
    id: string;
    amount: number;
    currency: string;
    status: "PENDING" | "PROCESSING" | "SUCCESS" | "FAILED";
    reference: string;
    destination: {
        bankName: string;
        accountNumber: string;
        accountName: string;
    };
    createdAt: string;
}

interface BankAccount {
    id: string;
    bankName: string;
    bankCode: string;
    accountNumber: string;
    accountName: string;
    isDefault?: boolean;
}

export default function PayoutsPage() {
    const [loading, setLoading] = useState(true);
    const [payouts, setPayouts] = useState<Payout[]>([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [accounts, setAccounts] = useState<BankAccount[]>([]);
    const [accountsLoading, setAccountsLoading] = useState(true);

    useEffect(() => {
        fetchPayouts();
        fetchAccounts();
    }, []);

    const fetchPayouts = async () => {
        try {
            const res = await fetch("/api/wallet/payouts");
            if (!res.ok) throw new Error("Failed to load payouts");
            const data = await res.json();
            setPayouts(data.payouts || []);
        } catch (error) {
            console.error(error);
            toast.error("Could not load payout history");
        } finally {
            setLoading(false);
        }
    };

    const fetchAccounts = async () => {
        try {
            const res = await fetch("/api/wallet/payout-accounts");
            if (!res.ok) throw new Error("Failed to load payout accounts");
            const data = await res.json();
            setAccounts(Array.isArray(data) ? data : []);
        } catch (error) {
            console.error(error);
            toast.error("Could not load payout accounts");
        } finally {
            setAccountsLoading(false);
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight text-slate-900">Payouts</h1>
                    <p className="text-slate-500">View your withdrawal history and request new payouts.</p>
                </div>
                <Button
                    onClick={() => setIsModalOpen(true)}
                    className="gap-2 bg-indigo-600 text-white hover:bg-indigo-700 font-medium text-sm"
                >
                    <Plus className="h-4 w-4" />
                    Withdraw Funds
                </Button>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                {loading ? (
                    <div className="p-8 flex justify-center">
                        <Loader2 className="h-6 w-6 animate-spin text-slate-400" />
                    </div>
                ) : payouts.length === 0 ? (
                    <div className="p-12 text-center text-slate-500">
                        <p className="mb-2">No payouts found.</p>
                        <p className="text-sm">Initiate a withdrawal to get started.</p>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm text-left">
                            <thead className="bg-slate-50 text-slate-600 font-medium border-b border-slate-100">
                                <tr>
                                    <th className="px-6 py-3">Reference</th>
                                    <th className="px-6 py-3">Date</th>
                                    <th className="px-6 py-3">Amount</th>
                                    <th className="px-6 py-3">Destination</th>
                                    <th className="px-6 py-3">Status</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {payouts.map((payout) => (
                                    <tr key={payout.id} className="hover:bg-slate-50/50">
                                        <td className="px-6 py-4 font-mono text-slate-500">
                                            {payout.reference}
                                        </td>
                                        <td className="px-6 py-4 text-slate-900">
                                            {new Date(payout.createdAt).toLocaleDateString()}
                                        </td>
                                        <td className="px-6 py-4 font-medium text-slate-900">
                                            {formatCurrency(payout.amount, payout.currency)}
                                        </td>
                                        <td className="px-6 py-4 text-slate-600">
                                            <div className="flex flex-col">
                                                <span className="font-medium text-slate-900">{payout.destination.bankName}</span>
                                                <span className="text-xs text-slate-500">•••• {payout.destination.accountNumber.slice(-4)}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <StatusBadge status={payout.status} />
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            <WithdrawalModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSuccess={() => {
                    setIsModalOpen(false);
                    fetchPayouts();
                    toast.success("Withdrawal requested successfully");
                }}
                accounts={accounts}
                accountsLoading={accountsLoading}
            />
        </div>
    );
}

function StatusBadge({ status }: { status: string }) {
    const styles: Record<string, string> = {
        PENDING: "bg-amber-100 text-amber-700 border-amber-200",
        PROCESSING: "bg-blue-100 text-blue-700 border-blue-200",
        SUCCESS: "bg-emerald-100 text-emerald-700 border-emerald-200",
        FAILED: "bg-red-100 text-red-700 border-red-200",
    };

    const icons: Record<string, unknown> = {
        SUCCESS: CheckCircle2,
        FAILED: AlertCircle,
    };

    const Icon = icons[status];

    return (
        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border ${styles[status] || "bg-slate-100 text-slate-700 border-slate-200"}`}>
            {Icon && <Icon className="h-3 w-3" />}
            {status}
        </span>
    );
}

function WithdrawalModal({
    isOpen,
    onClose,
    onSuccess,
    accounts,
    accountsLoading,
}: {
    isOpen: boolean;
    onClose: () => void;
    onSuccess: () => void;
    accounts: BankAccount[];
    accountsLoading: boolean;
}) {
    const [loading, setLoading] = useState(false);
    const [amount, setAmount] = useState("");
    const [pin, setPin] = useState("");
    const [accountId, setAccountId] = useState("");
    const [showStepUp, setShowStepUp] = useState(false);
    const [pendingWithdrawal, setPendingWithdrawal] = useState<unknown>(null);

    useEffect(() => {
        if (!accountId && accounts.length > 0) {
            const preferred = accounts.find((a) => a.isDefault) || accounts[0];
            setAccountId(preferred.id);
        }
    }, [accounts, accountId]);

    if (!isOpen) return null;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            if (!accountId) {
                toast.error("Select a payout account first");
                return;
            }
            const res = await fetch("/api/wallet/withdraw", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    amount: parseFloat(amount),
                    bankAccountId: accountId,
                    pin
                }),
            });

            const data = await res.json();

            if (!res.ok) {
                if (data.code === "STEP_UP_REQUIRED") {
                    // Trigger step-up authentication flow
                    setPendingWithdrawal({
                        amount: parseFloat(amount),
                        bankAccountId: accountId,
                        pin
                    });
                    setShowStepUp(true);
                    return;
                }
                throw new Error(data.error || "Withdrawal failed");
            }

            onSuccess();
        } catch (error: unknown) {
            toast.error(error.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
            <div className="bg-white rounded-xl shadow-xl w-full max-w-md overflow-hidden">
                <div className="flex justify-between items-center bg-slate-50/50 px-6 py-4 border-b border-slate-100">
                    <h3 className="font-semibold text-slate-900">Request Withdrawal</h3>
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={onClose}
                        className="text-slate-400 hover:text-slate-600 h-8 w-8 rounded-full"
                    >
                        <span className="sr-only">Close</span>
                        <span aria-hidden="true" className="text-xl">×</span>
                    </Button>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Payout Account</label>
                        {accountsLoading ? (
                            <div className="text-sm text-slate-500">Loading accounts...</div>
                        ) : accounts.length === 0 ? (
                            <div className="text-sm text-amber-600 bg-amber-50 border border-amber-100 rounded-lg p-3">
                                No payout accounts found. Add one in Settings → Payments.
                            </div>
                        ) : (
                            <select
                                title="Payout Account"
                                required
                                value={accountId}
                                onChange={(e) => setAccountId(e.target.value)}
                                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
                            >
                                <option value="">Select bank account</option>
                                {accounts.map((acc) => (
                                    <option key={acc.id} value={acc.id}>
                                        {acc.bankName} •••• {acc.accountNumber.slice(-4)} ({acc.accountName})
                                    </option>
                                ))}
                            </select>
                        )}
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Amount (NGN)</label>
                        <div className="relative">
                            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 font-medium">₦</span>
                            <input
                                type="number"
                                required
                                min="1000"
                                step="0.01"
                                value={amount}
                                onChange={(e) => setAmount(e.target.value)}
                                className="w-full pl-8 pr-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all"
                                placeholder="0.00"
                            />
                        </div>
                        <p className="text-xs text-slate-500 mt-1">Minimum withdrawal: ₦1,000.00</p>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Transaction PIN</label>
                        <input
                            type="password"
                            required
                            value={pin}
                            onChange={(e) => setPin(e.target.value)}
                            className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all"
                            placeholder="Enter your PIN"
                        />
                    </div>

                    <div className="pt-4 flex gap-3">
                        <Button
                            type="button"
                            onClick={onClose}
                            variant="outline"
                            className="flex-1 text-slate-700 bg-white border-slate-300 hover:bg-slate-50 font-medium text-sm"
                        >
                            Cancel
                        </Button>
                        <Button
                            type="submit"
                            disabled={loading}
                            className="flex-1 text-white bg-indigo-600 hover:bg-indigo-700 font-medium text-sm"
                        >
                            {loading && <Loader2 className="h-4 w-4 animate-spin mr-2" />}
                            {loading ? "Processing..." : "Confirm Withdrawal"}
                        </Button>
                    </div>
                </form>

                {showStepUp && pendingWithdrawal && (
                    <StepUpDialog
                        isOpen={showStepUp}
                        onClose={() => {
                            setShowStepUp(false);
                            setPendingWithdrawal(null);
                        }}
                        onVerify={async (password) => {
                            try {
                                const res = await fetch("/api/wallet/withdraw", {
                                    method: "POST",
                                    headers: { "Content-Type": "application/json" },
                                    body: JSON.stringify({
                                        ...pendingWithdrawal,
                                        password // Step-up verification
                                    }),
                                });

                                const data = await res.json();

                                if (!res.ok) {
                                    throw new Error(data.error || "Withdrawal failed");
                                }

                                setShowStepUp(false);
                                setPendingWithdrawal(null);
                                onSuccess();
                            } catch (error: unknown) {
                                throw error; // Let StepUpDialog handle the error
                            }
                        }}
                    />
                )}
            </div>
        </div>
    );
}

function StepUpDialog({
    isOpen,
    onClose,
    onVerify,
}: {
    isOpen: boolean;
    onClose: () => void;
    onVerify: (password: string) => Promise<void>;
}) {
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);

    if (!isOpen) return null;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            await onVerify(password);
            toast.success("Withdrawal verified successfully");
        } catch (error: unknown) {
            toast.error(error.message || "Verification failed");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-sm overflow-hidden">
                <div className="px-6 py-4 border-b border-slate-100 bg-amber-50">
                    <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-full bg-amber-100 flex items-center justify-center">
                            <AlertCircle className="h-5 w-5 text-amber-600" />
                        </div>
                        <div>
                            <h3 className="font-semibold text-slate-900">Security Verification Required</h3>
                            <p className="text-xs text-slate-600">Confirm your identity to proceed</p>
                        </div>
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-4">
                    <div className="bg-blue-50 border border-blue-100 rounded-lg p-3 text-sm text-blue-800">
                        For your security, please re-enter your account password to authorize this withdrawal.
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Account Password</label>
                        <input
                            type="password"
                            required
                            autoFocus
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all"
                            placeholder="Enter your password"
                        />
                    </div>

                    <div className="pt-2 flex gap-3">
                        <Button
                            type="button"
                            onClick={onClose}
                            disabled={loading}
                            variant="outline"
                            className="flex-1 text-slate-700 bg-white border-slate-300 hover:bg-slate-50 font-medium text-sm"
                        >
                            Cancel
                        </Button>
                        <Button
                            type="submit"
                            disabled={loading}
                            className="flex-1 text-white bg-indigo-600 hover:bg-indigo-700 font-medium text-sm"
                        >
                            {loading && <Loader2 className="h-4 w-4 animate-spin mr-2" />}
                            {loading ? "Verifying..." : "Verify & Proceed"}
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );
}
