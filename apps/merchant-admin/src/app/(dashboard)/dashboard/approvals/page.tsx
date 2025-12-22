'use client';

import React, { useState, useEffect } from 'react';
import { Icon } from '@vayva/ui'; // Assuming this exists or using lucide-react directly
import { motion, AnimatePresence } from 'framer-motion';

type ApprovalRequest = {
    id: string;
    actionType: string;
    requestedByLabel: string;
    createdAt: string;
    payload: any;
    status: 'pending' | 'approved' | 'rejected' | 'executed' | 'failed';
    reason?: string;
    decisionReason?: string;
    decidedByLabel?: string;
    entityType?: string;
    entityId?: string;
};

export default function ApprovalsPage() {
    const [activeTab, setActiveTab] = useState<'pending' | 'history'>('pending');
    const [items, setItems] = useState<ApprovalRequest[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedItem, setSelectedItem] = useState<ApprovalRequest | null>(null);

    // Decide Reason Input
    const [decisionReason, setDecisionReason] = useState('');
    const [actionLoading, setActionLoading] = useState(false);

    const fetchItems = async () => {
        setLoading(true);
        // status=pending or status=all depending on tab.
        // If pending tab, fetch pending. If history, fetch approved/rejected/filtered?
        // We'll simplistic "all" and filter client side or 2 requests.
        const status = activeTab === 'pending' ? 'pending' : 'all';
        try {
            const res = await fetch(`/api/merchant/approvals?status=${status}&limit=50`);
            const data = await res.json();
            setItems(data.items || []);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchItems();
    }, [activeTab]);

    const handleDecision = async (decision: 'approve' | 'reject') => {
        if (!selectedItem) return;
        setActionLoading(true);
        try {
            const res = await fetch(`/api/merchant/approvals/${selectedItem.id}/${decision}`, {
                method: 'POST',
                body: JSON.stringify({ decisionReason })
            });
            if (!res.ok) {
                const txt = await res.text();
                alert('Failed: ' + txt);
                return;
            }
            // Success
            setSelectedItem(null);
            setDecisionReason('');
            fetchItems();
        } catch (err) {
            console.error(err);
            alert('Error');
        } finally {
            setActionLoading(false);
        }
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div>
                <h1 className="text-2xl font-bold text-[#0B0B0B]">Approvals Queue</h1>
                <p className="text-gray-500">Review and authorize sensitive actions</p>
            </div>

            {/* Tabs */}
            <div className="flex border-b border-gray-100">
                <button
                    onClick={() => setActiveTab('pending')}
                    className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${activeTab === 'pending' ? 'border-black text-black' : 'border-transparent text-gray-400 hover:text-black'}`}
                >
                    Pending Reviews
                </button>
                <button
                    onClick={() => setActiveTab('history')}
                    className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${activeTab === 'history' ? 'border-black text-black' : 'border-transparent text-gray-400 hover:text-black'}`}
                >
                    History
                </button>
            </div>

            {/* List */}
            <div className="space-y-3">
                {loading && <div className="text-center py-10 text-gray-400">Loading...</div>}

                {!loading && items.length === 0 && (
                    <div className="text-center py-20 bg-gray-50 rounded-xl border border-dashed border-gray-200">
                        <p className="text-gray-400 font-medium">No {activeTab} approvals found.</p>
                    </div>
                )}

                {!loading && items.map(item => (
                    <motion.div
                        layoutId={item.id}
                        key={item.id}
                        onClick={() => setSelectedItem(item)}
                        className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow cursor-pointer flex items-center justify-between group"
                    >
                        <div className="flex items-center gap-4">
                            {/* Status Icon */}
                            <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${item.status === 'pending' ? 'bg-blue-50 text-blue-600' :
                                item.status === 'approved' || item.status === 'executed' ? 'bg-green-50 text-green-600' :
                                    'bg-red-50 text-red-600'
                                }`}>
                                {item.status === 'pending' && <Icon name={"Clock" as any} size={20} />}
                                {(item.status === 'approved' || item.status === 'executed') && <Icon name={"CheckCircle" as any} size={20} />}
                                {(item.status === 'rejected' || item.status === 'failed') && <Icon name={"XCircle" as any} size={20} />}
                            </div>

                            <div>
                                <div className="flex items-center gap-2">
                                    <h3 className="font-bold text-sm text-[#0B0B0B] capitalize">{item.actionType.replace('.', ' ')}</h3>
                                    {item.entityType && (
                                        <span className="px-1.5 py-0.5 bg-gray-100 text-gray-500 text-[10px] rounded uppercase font-medium">
                                            {item.entityType}
                                        </span>
                                    )}
                                </div>
                                <p className="text-xs text-gray-500">
                                    Requested by <span className="text-[#0B0B0B] font-medium">{item.requestedByLabel}</span> &bull; {new Date(item.createdAt).toLocaleDateString()}
                                </p>
                            </div>
                        </div>

                        <div className="flex items-center gap-4">
                            {item.status === 'pending' && (
                                <div className="px-3 py-1 bg-blue-100 text-blue-700 text-xs font-bold rounded-full">Pending</div>
                            )}
                            {activeTab === 'history' && (
                                <span className={`text-xs font-bold uppercase ${item.status === 'executed' ? 'text-green-600' :
                                    item.status === 'failed' ? 'text-red-600' :
                                        item.status === 'rejected' ? 'text-gray-500' : 'text-gray-400'
                                    }`}>
                                    {item.status}
                                </span>
                            )}

                            <Icon name={"ChevronRight" as any} size={16} className="text-gray-300 group-hover:text-black transition-colors" />
                        </div>
                    </motion.div>
                ))}
            </div>

            {/* Detail Drawer / Modal */}
            <AnimatePresence>
                {selectedItem && (
                    <>
                        <motion.div
                            key="backdrop"
                            initial={{ opacity: 0 }} animate={{ opacity: 0.5 }} exit={{ opacity: 0 }}
                            className="fixed inset-0 bg-black z-40"
                            onClick={() => setSelectedItem(null)}
                        />
                        <motion.div
                            key="drawer"
                            initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }}
                            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                            className="fixed right-0 top-0 h-screen w-[480px] bg-white z-50 shadow-2xl flex flex-col"
                        >
                            {/* Drawer Header */}
                            <div className="p-6 border-b border-gray-100 flex items-center justify-between bg-gray-50/50">
                                <div>
                                    <h2 className="text-lg font-bold">Request Details</h2>
                                    <p className="text-xs text-gray-400 font-mono mt-1">{selectedItem.id}</p>
                                </div>
                                <button onClick={() => setSelectedItem(null)} className="p-2 hover:bg-gray-200 rounded-full transition">
                                    <Icon name={"X" as any} size={20} />
                                </button>
                            </div>

                            {/* Content */}
                            <div className="flex-1 overflow-y-auto p-6 space-y-6">

                                {/* Reason Card */}
                                {selectedItem.reason && (
                                    <div className="p-4 bg-yellow-50 border border-yellow-100 rounded-lg">
                                        <p className="text-xs font-bold text-yellow-800 uppercase mb-1">Requester Note</p>
                                        <p className="text-sm text-yellow-900">{selectedItem.reason}</p>
                                    </div>
                                )}

                                {/* Payload */}
                                <div>
                                    <p className="text-xs font-bold text-gray-400 uppercase mb-2">Payload Data</p>
                                    <div className="bg-gray-900 text-gray-300 p-4 rounded-lg overflow-x-auto text-xs font-mono">
                                        <pre>{JSON.stringify(selectedItem.payload, null, 2)}</pre>
                                    </div>
                                </div>

                                {/* Metadata */}
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="p-3 bg-gray-50 rounded-lg">
                                        <p className="text-[10px] uppercase text-gray-400 font-bold">Requested By</p>
                                        <p className="text-sm font-medium">{selectedItem.requestedByLabel}</p>
                                    </div>
                                    <div className="p-3 bg-gray-50 rounded-lg">
                                        <p className="text-[10px] uppercase text-gray-400 font-bold">Date</p>
                                        <p className="text-sm font-medium">{new Date(selectedItem.createdAt).toLocaleString()}</p>
                                    </div>
                                </div>

                                {/* Decision Info */}
                                {selectedItem.status !== 'pending' && (
                                    <div className="border-t border-gray-100 pt-4">
                                        <p className="text-xs font-bold text-gray-400 uppercase mb-2">Decision</p>
                                        <div className="p-3 bg-gray-50 rounded-lg border border-gray-100">
                                            <div className="flex justify-between mb-1">
                                                <span className="text-sm font-bold capitalize">{selectedItem.status}</span>
                                                <span className="text-xs text-gray-500">by {selectedItem.decidedByLabel || 'System'}</span>
                                            </div>
                                            {selectedItem.decisionReason && (
                                                <p className="text-sm text-gray-600 mt-2 italic">"{selectedItem.decisionReason}"</p>
                                            )}
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Footer Actions */}
                            {selectedItem.status === 'pending' && (
                                <div className="p-6 border-t border-gray-100 bg-gray-50 flex flex-col gap-4">
                                    <textarea
                                        placeholder="Add a note (optional)..."
                                        className="w-full border border-gray-200 rounded-lg p-3 text-sm focus:ring-2 focus:ring-black/5 outline-none resize-none h-20"
                                        value={decisionReason}
                                        onChange={(e) => setDecisionReason(e.target.value)}
                                    />
                                    <div className="flex gap-3">
                                        <button
                                            onClick={() => handleDecision('reject')}
                                            disabled={actionLoading}
                                            className="flex-1 py-3 px-4 border border-gray-200 bg-white text-red-600 font-bold rounded-lg hover:bg-red-50 transition active:scale-95 text-sm"
                                        >
                                            Reject
                                        </button>
                                        <button
                                            onClick={() => handleDecision('approve')}
                                            disabled={actionLoading}
                                            className="flex-1 py-3 px-4 bg-black text-white font-bold rounded-lg hover:bg-gray-800 transition active:scale-95 text-sm"
                                        >
                                            {actionLoading ? 'Processing...' : 'Approve & Execute'}
                                        </button>
                                    </div>
                                </div>
                            )}
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </div>
    );
}
