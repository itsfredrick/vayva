'use client';

import React, { useState } from 'react';
import { AdminShell } from '@/components/admin-shell';
import { useAuth } from '@/context/AuthContext';
import { WalletProvider, useWallet } from '@/context/WalletContext';
import { KycBlockScreen, PinSetupScreen, UnlockScreen } from '@/components/wallet/WalletGuards';
import { WithdrawModal } from '@/components/wallet/WithdrawModal';
import { AddBankModal } from '@/components/wallet/AddBankModal';
import { Button, Icon, cn } from '@vayva/ui';
import { motion, AnimatePresence } from 'framer-motion';

// --- Sub-components for Cleanliness ---

const WalletHeader = () => {
    const { summary, refreshWallet } = useWallet();
    const [loading, setLoading] = useState(false);

    const handleCreateVA = async () => {
        setLoading(true);
        try {
            const { WalletService } = await import('@/services/wallet');
            await WalletService.createVirtualAccount();
            await refreshWallet();
        } catch (e) {
            console.error('VA Error', e);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex flex-col gap-6">
            <div className="flex items-center justify-between">
                <div className="flex flex-col gap-1">
                    <h1 className="text-2xl font-bold text-[#0B0B0B]">Wallet</h1>
                    <div className="flex gap-2 text-xs">
                        <span className={`px-2 py-0.5 rounded-full border ${summary?.status === 'active' ? 'bg-green-50 text-green-700 border-green-200' : 'bg-red-50 text-red-700 border-red-200'}`}>
                            {summary?.status === 'active' ? 'Active' : 'Locked'}
                        </span>
                        {summary?.virtualAccount ? (
                            <span className="px-2 py-0.5 rounded-full border bg-gray-50 text-gray-700 border-gray-200">
                                VA: {summary.virtualAccount.bankName} • {summary.virtualAccount.accountNumber}
                            </span>
                        ) : (
                            <button
                                onClick={handleCreateVA}
                                disabled={loading}
                                className="px-2 py-0.5 rounded-full border bg-blue-50 text-blue-700 border-blue-200 hover:bg-blue-100 disabled:opacity-50"
                            >
                                {loading ? 'Creating VA...' : '+ Get Virtual Account'}
                            </button>
                        )}
                    </div>
                </div>
                <div className="flex gap-2 text-xs text-gray-500 bg-gray-50 px-3 py-2 rounded-lg border border-gray-100">
                    <Icon name={"ShieldCheck" as any} size={14} className="text-green-600" />
                    Securely Encrypted
                </div>
            </div>
        </div>
    );
};

const WalletKPIs = () => {
    const { summary } = useWallet();
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* 1. Available Balance */}
            <div className="bg-black text-white rounded-xl p-6 flex flex-col justify-between shadow-lg relative overflow-hidden group">
                <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:scale-110 transition-transform">
                    <Icon name={"Wallet" as any} size={64} />
                </div>
                <div className="flex flex-col gap-1 relative z-10">
                    <span className="text-xs uppercase tracking-widest text-gray-400">Available Balance</span>
                    <h2 className="text-3xl font-bold">₦ {summary?.availableBalance.toLocaleString() || '0.00'}</h2>
                </div>
                <div className="flex items-center gap-2 mt-4 text-xs text-gray-400 relative z-10">
                    Settled and ready for withdrawal
                </div>
            </div>

            {/* 2. Pending Settlement */}
            <div className="bg-white border border-gray-100 rounded-xl p-6 flex flex-col justify-between shadow-sm">
                <div className="flex flex-col gap-1">
                    <div className="flex items-center gap-2">
                        <span className="text-xs uppercase tracking-widest text-[#525252]">Pending Settlement</span>
                        <Icon name={"Clock" as any} size={12} className="text-gray-400" />
                    </div>
                    <h2 className="text-2xl font-bold text-[#0B0B0B]">₦ {summary?.pendingPayouts.toLocaleString() || '0.00'}</h2>
                </div>
                <p className="text-xs text-[#525252]">Processing next business day.</p>
            </div>
        </div>
    );
};

const LedgerPane = ({ selectedId, onSelect }: { selectedId: string | null, onSelect: (id: string) => void }) => {
    const { ledger } = useWallet();

    return (
        <div className="bg-white border border-gray-100 rounded-xl flex flex-col h-[600px] overflow-hidden shadow-sm">
            {/* Filters */}
            <div className="p-4 border-b border-gray-100 flex gap-2 overflow-x-auto">
                <Button variant="ghost" size="sm" className="bg-gray-100 font-bold">All</Button>
                <Button variant="ghost" size="sm">Inflow</Button>
                <Button variant="ghost" size="sm">Payouts</Button>
            </div>

            {/* List */}
            <div className="flex-1 overflow-y-auto">
                {ledger.map(tx => (
                    <div
                        key={tx.id}
                        onClick={() => onSelect(tx.id)}
                        className={cn(
                            "p-4 border-b border-gray-50 cursor-pointer hover:bg-gray-50 transition-colors flex items-center justify-between",
                            selectedId === tx.id && "bg-blue-50 hover:bg-blue-50"
                        )}
                    >
                        <div className="flex items-center gap-3">
                            <div className={cn(
                                "w-10 h-10 rounded-full flex items-center justify-center",
                                tx.type === 'inflow' ? "bg-green-100 text-green-600" : (tx.type === 'payout' ? "bg-black text-white" : "bg-gray-100 text-gray-600")
                            )}>
                                <Icon name={(tx.type === 'inflow' ? 'ArrowDownLeft' : (tx.type === 'payout' ? 'ArrowUpRight' : 'Info')) as any} size={18} />
                            </div>
                            <div>
                                <p className="text-sm font-bold text-[#0B0B0B]">{tx.description}</p>
                                <p className="text-xs text-[#525252]">{new Date(tx.date).toLocaleDateString()}</p>
                            </div>
                        </div>
                        <div className="text-right">
                            <p className={cn(
                                "text-sm font-bold",
                                tx.type === 'inflow' ? "text-green-600" : "text-[#0B0B0B]"
                            )}>
                                {tx.type === 'inflow' ? '+' : '-'} ₦{tx.amount.toLocaleString()}
                            </p>
                            <span className={cn(
                                "text-[10px] uppercase font-bold px-1.5 py-0.5 rounded",
                                tx.status === 'success' ? "bg-green-50 text-green-700" : "bg-yellow-50 text-yellow-700"
                            )}>
                                {tx.status}
                            </span>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

const DetailsPane = ({ txId }: { txId: string | null }) => {
    const { ledger } = useWallet();
    const tx = ledger.find(t => t.id === txId);

    if (!txId || !tx) return (
        <div className="h-full bg-gray-50 border border-gray-100 rounded-xl flex items-center justify-center text-[#525252] text-sm p-8 text-center">
            Select a transaction to view details
        </div>
    );

    return (
        <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            key={txId}
            className="bg-white border border-gray-100 rounded-xl h-full p-6 flex flex-col shadow-sm"
        >
            <div className="mb-6 pb-6 border-b border-gray-50">
                <span className="text-xs uppercase tracking-widest text-[#525252]">{tx.type}</span>
                <h3 className="text-xl font-bold mt-1 max-w-[80%]">{tx.description}</h3>
                <h4 className={cn("text-3xl font-bold mt-4", tx.type === 'inflow' ? "text-green-600" : "text-black")}>
                    ₦ {tx.amount.toLocaleString()}
                </h4>
            </div>

            <div className="flex flex-col gap-4 flex-1">
                <div className="flex flex-col gap-1">
                    <label className="text-xs text-[#525252]">Reference</label>
                    <p className="text-sm font-medium font-mono bg-gray-50 inline-block px-2 py-1 rounded">{tx.reference}</p>
                </div>
                <div className="flex flex-col gap-1">
                    <label className="text-xs text-[#525252]">Date & Time</label>
                    <p className="text-sm font-medium">{new Date(tx.date).toLocaleString()}</p>
                </div>
                {tx.customer && (
                    <div className="flex flex-col gap-1">
                        <label className="text-xs text-[#525252]">Customer</label>
                        <p className="text-sm font-medium">{tx.customer.name}</p>
                    </div>
                )}
                {tx.orderId && (
                    <div className="flex flex-col gap-1">
                        <label className="text-xs text-[#525252]">Related Order</label>
                        <p className="text-sm font-medium text-blue-600 hover:underline cursor-pointer">Order {tx.orderId}</p>
                    </div>
                )}
            </div>

            <div className="flex flex-col gap-3 mt-6 pt-6 border-t border-gray-50">
                <Button variant="outline" className="w-full justify-center">Download Receipt</Button>
                <Button variant="ghost" className="w-full justify-center text-red-600 hover:bg-red-50 hover:text-red-700">Report Issue</Button>
            </div>
        </motion.div>
    );
};

// --- Main Content Orchestrator ---

const WalletContent = () => {
    const { user, merchant } = useAuth();
    const { isLocked, hasPin, isLoading, summary, refreshWallet } = useWallet();
    const [selectedTx, setSelectedTx] = useState<string | null>(null);
    const [withdrawOpen, setWithdrawOpen] = useState(false);
    const [addBankOpen, setAddBankOpen] = useState(false);

    // 1. Loading State
    if (isLoading) return <div className="p-12 text-center text-gray-400">Loading wallet securely...</div>;

    // 2. KYC Gate (Check summary kycStatus or merchant context)
    const isKycVerified = summary?.kycStatus === 'VERIFIED' || merchant?.onboardingStatus === 'COMPLETE';
    if (!isKycVerified) return <KycBlockScreen />;

    // 3. PIN Setup Gate
    if (!hasPin) return <PinSetupScreen />;

    // 4. Unlock Gate
    if (isLocked) return <UnlockScreen />;

    // 5. Unlocked Dashboard
    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex flex-col gap-8"
        >
            <WalletHeader />
            <WalletKPIs />

            {/* Actions Row */}
            <div className="flex gap-3 overflow-x-auto pb-1">
                <Button className="shrink-0" onClick={() => setWithdrawOpen(true)}>
                    <Icon name={"ArrowUpRight" as any} size={16} className="mr-2" /> Withdraw Funds
                </Button>
                <Button variant="outline" className="shrink-0" onClick={() => setAddBankOpen(true)}>
                    <Icon name={"Plus" as any} size={16} className="mr-2" /> Add Bank Account
                </Button>
                <Button variant="outline" className="shrink-0" disabled><Icon name={"Download" as any} size={16} className="mr-2" /> Statements</Button>
                <div className="flex-1"></div>
            </div>

            {/* Split Pane */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 h-[600px]">
                <div className="lg:col-span-7 h-full">
                    <LedgerPane selectedId={selectedTx} onSelect={setSelectedTx} />
                </div>
                <div className="lg:col-span-5 h-full">
                    <DetailsPane txId={selectedTx} />
                </div>
            </div>

            {/* Modals */}
            <WithdrawModal isOpen={withdrawOpen} onClose={() => setWithdrawOpen(false)} />
            <AddBankModal
                isOpen={addBankOpen}
                onClose={() => setAddBankOpen(false)}
                onSuccess={() => refreshWallet()}
            />
        </motion.div>
    );
};

export default function WalletPage() {
    return (
        <AdminShell title="Wallet">
            <WalletProvider>
                <div className="max-w-[1400px] mx-auto">
                    <WalletContent />
                </div>
            </WalletProvider>
        </AdminShell>
    );
}
