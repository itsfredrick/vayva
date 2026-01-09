"use client";

import { useState, useEffect } from "react";
import {
    Wallet,
    Download,
    ReceiptText,
    ChevronRight,
    ShieldCheck,
    AlertCircle,
    Building2,
    FileText,
    ArrowUpRight
} from "lucide-react";
import { Button, EmptyState, cn } from "@vayva/ui";

export default function FinancePage() {
    const [activeTab, setActiveTab] = useState<"wallet" | "tax">("wallet");
    const [transactions, setTransactions] = useState<any[]>([]);
    const [invoices, setInvoices] = useState<any[]>([
        {
            id: "inv_001",
            date: "2026-01-08",
            plan: "GROWTH",
            baseAmount: 30000,
            vat: 2250,
            total: 32250,
            status: "PAID"
        }
    ]);

    return (
        <div className="p-8">
            <div className="flex justify-between items-end mb-8">
                <div>
                    <h1 className="text-4xl font-black text-gray-900 tracking-tight">Finance</h1>
                    <p className="text-gray-500 mt-1 text-lg">Manage your earnings, payouts, and tax compliance.</p>
                </div>

                <div className="flex bg-gray-100 p-1 rounded-xl border border-gray-200">
                    <button
                        onClick={() => setActiveTab("wallet")}
                        className={cn(
                            "px-4 py-2 rounded-lg text-sm font-bold transition-all flex items-center gap-2",
                            activeTab === "wallet" ? "bg-white text-gray-900 shadow-sm" : "text-gray-500 hover:text-gray-700"
                        )}
                    >
                        <Wallet size={16} /> Wallet
                    </button>
                    <button
                        onClick={() => setActiveTab("tax")}
                        className={cn(
                            "px-4 py-2 rounded-lg text-sm font-bold transition-all flex items-center gap-2",
                            activeTab === "tax" ? "bg-white text-indigo-600 shadow-sm" : "text-gray-500 hover:text-gray-700"
                        )}
                    >
                        <ReceiptText size={16} /> Tax Receipts
                    </button>
                </div>
            </div>

            {activeTab === "wallet" ? (
                <div className="space-y-6">
                    {/* Wallet Hero */}
                    <div className="bg-gray-900 rounded-3xl p-10 text-white relative overflow-hidden shadow-2xl">
                        <div className="absolute -right-20 -bottom-20 w-80 h-80 bg-indigo-500/20 rounded-full blur-3xl" />

                        <div className="relative z-10">
                            <h3 className="text-gray-400 text-xs font-black uppercase tracking-[0.2em] mb-4 flex items-center gap-2">
                                <Building2 size={14} className="text-indigo-400" /> Available Balance
                            </h3>
                            <div className="flex items-baseline gap-3">
                                <span className="text-6xl font-black tracking-tighter">₦0.00</span>
                                <span className="text-indigo-400 font-bold uppercase tracking-widest text-xs">NGN</span>
                            </div>

                            <div className="flex gap-4 mt-10">
                                <Button className="bg-indigo-600 hover:bg-indigo-500 text-white border-0 px-8 py-6 rounded-2xl font-black shadow-lg shadow-indigo-500/20">
                                    Withdraw Funds
                                </Button>
                                <Button variant="outline" className="border-gray-700 bg-transparent text-gray-300 hover:bg-white/5 px-8 py-6 rounded-2xl font-black">
                                    Wallet Settings
                                </Button>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-3xl border border-gray-100 p-8 shadow-sm">
                        <h3 className="text-xl font-black text-gray-900 mb-6">Recent Transactions</h3>
                        <div className="py-12">
                            <EmptyState
                                title="No transactions yet"
                                icon="Wallet"
                                description="Your earnings and payouts will appear here once you start making sales."
                            />
                        </div>
                    </div>
                </div>
            ) : (
                <div className="space-y-6">
                    {/* Compliance Alert */}
                    <div className="bg-indigo-50 border border-indigo-100 p-6 rounded-3xl flex items-start gap-4">
                        <div className="p-3 bg-indigo-100 text-indigo-600 rounded-2xl">
                            <ShieldCheck size={24} />
                        </div>
                        <div>
                            <h4 className="font-black text-indigo-900 text-sm mb-1 uppercase tracking-widest">Nigerian Tax Compliance (NDPC/VAT)</h4>
                            <p className="text-indigo-700 text-sm leading-relaxed max-w-2xl">
                                Vayva automatically applies a **7.5% VAT** to all subscription cycles in accordance with Nigerian tax laws.
                                Download your tax-compliant receipts below for your annual NDPC audits.
                            </p>
                        </div>
                    </div>

                    {/* Invoice Table */}
                    <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
                        <div className="p-8 border-b border-gray-50 flex justify-between items-center">
                            <h3 className="text-xl font-black text-gray-900">Subscription History</h3>
                            <Button variant="outline" className="rounded-xl font-bold flex items-center gap-2">
                                <FileText size={16} /> Export CSV
                            </Button>
                        </div>

                        <div className="overflow-x-auto">
                            <table className="w-full text-left">
                                <thead className="bg-gray-50 border-b border-gray-100">
                                    <tr>
                                        <th className="px-8 py-4 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Transaction ID</th>
                                        <th className="px-8 py-4 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Date</th>
                                        <th className="px-8 py-4 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Plan</th>
                                        <th className="px-8 py-4 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">VAT (7.5%)</th>
                                        <th className="px-8 py-4 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Total Amount</th>
                                        <th className="px-8 py-4 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Status</th>
                                        <th className="px-8 py-4"></th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-50">
                                    {invoices.map((inv) => (
                                        <tr key={inv.id} className="group hover:bg-gray-50/50 transition-colors">
                                            <td className="px-8 py-5">
                                                <span className="font-mono text-xs font-bold text-gray-500">#{inv.id}</span>
                                            </td>
                                            <td className="px-8 py-5 text-sm font-bold text-gray-800">{inv.date}</td>
                                            <td className="px-8 py-5">
                                                <span className="px-3 py-1 bg-indigo-50 text-indigo-600 rounded-full text-[10px] font-black uppercase tracking-widest">
                                                    {inv.plan}
                                                </span>
                                            </td>
                                            <td className="px-8 py-5 text-sm font-bold text-gray-600">₦{inv.vat.toLocaleString()}</td>
                                            <td className="px-8 py-5 text-lg font-black text-gray-900">₦{inv.total.toLocaleString()}</td>
                                            <td className="px-8 py-5">
                                                <div className="flex items-center gap-1.5 text-green-600 text-[10px] font-black uppercase tracking-widest">
                                                    <div className="w-1.5 h-1.5 bg-green-500 rounded-full" />
                                                    {inv.status}
                                                </div>
                                            </td>
                                            <td className="px-8 py-5 text-right">
                                                <button className="p-2 text-gray-400 hover:text-gray-900 hover:bg-white rounded-xl border border-transparent hover:border-gray-200 transition-all shadow-sm group-hover:shadow-indigo-500/5">
                                                    <Download size={18} />
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
