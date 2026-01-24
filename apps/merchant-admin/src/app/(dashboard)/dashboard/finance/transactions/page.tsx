"use client";

import { useState, useEffect } from "react";
import { formatCurrency } from "@/lib/format";
import { toast } from "sonner";
import { Loader2, ArrowUpRight, ArrowDownLeft, RefreshCcw } from "lucide-react";
import { Button } from "@vayva/ui";

interface Transaction {
    id: string;
    reference: string;
    type: "CHARGE" | "REFUND" | "PAYOUT";
    amount: number;
    currency: string;
    status: "SUCCESS" | "FAILED" | "PENDING";
    date: string;
    provider: string;
}

export default function TransactionsPage() {
    const [loading, setLoading] = useState(true);
    const [transactions, setTransactions] = useState<Transaction[]>([]);

    useEffect(() => {
        fetchTransactions();
    }, []);

    const fetchTransactions = async () => {
        try {
            const res = await fetch("/api/finance/transactions?limit=50");
            if (!res.ok) throw new Error("Failed to load transactions");
            const data = await res.json();
            setTransactions(data.data || []);
        } catch (error: any) {
            console.error(error);
            toast.error("Could not load transaction history");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight text-slate-900">Transactions</h1>
                    <p className="text-slate-500">Real-time ledger of all payments and refunds.</p>
                </div>
                <Button
                    onClick={fetchTransactions}
                    disabled={loading}
                    variant="outline"
                    size="icon"
                    className="h-9 w-9 text-slate-500 hover:text-slate-700 bg-white border-slate-200 hover:bg-slate-50"
                    title="Refresh"
                >
                    <RefreshCcw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
                </Button>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                {loading && transactions.length === 0 ? (
                    <div className="p-12 flex justify-center">
                        <Loader2 className="h-6 w-6 animate-spin text-slate-400" />
                    </div>
                ) : transactions.length === 0 ? (
                    <div className="p-12 text-center text-slate-500">
                        <p className="mb-2">No transactions recorded yet.</p>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm text-left">
                            <thead className="bg-slate-50 text-slate-600 font-medium border-b border-slate-100">
                                <tr>
                                    <th className="px-6 py-3">Date</th>
                                    <th className="px-6 py-3">Type</th>
                                    <th className="px-6 py-3">Reference</th>
                                    <th className="px-6 py-3">Amount</th>
                                    <th className="px-6 py-3">Status</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {transactions.map((tx: any) => (
                                    <tr key={tx.id} className="hover:bg-slate-50/50">
                                        <td className="px-6 py-4 text-slate-900 whitespace-nowrap">
                                            {new Date(tx.date).toLocaleDateString()}
                                            <span className="text-slate-400 text-xs ml-2">
                                                {new Date(tx.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <TypeBadge type={tx.type} />
                                        </td>
                                        <td className="px-6 py-4 font-mono text-slate-500">
                                            {tx.reference}
                                        </td>
                                        <td className="px-6 py-4 font-medium text-slate-900">
                                            {formatCurrency(tx.amount, tx.currency)}
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`inline-flex px-2 py-1 rounded-full text-xs font-medium ${tx.status === "SUCCESS" ? "bg-emerald-100 text-emerald-700" :
                                                tx.status === "FAILED" ? "bg-red-100 text-red-700" :
                                                    "bg-amber-100 text-amber-700"
                                                }`}>
                                                {tx.status}
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
}

function TypeBadge({ type }: { type: string }) {
    if (type === "CHARGE") {
        return (
            <span className="inline-flex items-center gap-1.5 text-slate-700">
                <div className="p-1 bg-emerald-100 text-emerald-600 rounded">
                    <ArrowDownLeft className="h-3 w-3" />
                </div>
                Sale
            </span>
        );
    }
    if (type === "REFUND") {
        return (
            <span className="inline-flex items-center gap-1.5 text-slate-700">
                <div className="p-1 bg-red-100 text-red-600 rounded">
                    <ArrowUpRight className="h-3 w-3" />
                </div>
                Refund
            </span>
        );
    }
    return <span className="text-slate-600">{type}</span>;
}
