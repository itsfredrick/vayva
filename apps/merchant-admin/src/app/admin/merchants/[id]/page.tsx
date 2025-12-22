'use client';

import React, { useEffect, useState } from 'react';
import { Icon } from '@vayva/ui';

export default function MerchantAdminDetail({ params }: { params: { id: string } }) {
    const [snapshot, setSnapshot] = useState<any>(null);
    const [activeTab, setActiveTab] = useState('overview');
    const [reason, setReason] = useState('');
    const [modalAction, setModalAction] = useState<string | null>(null);
    const [processing, setProcessing] = useState(false);

    useEffect(() => {
        // Fetch snapshot via Admin API
        fetch(`/api/admin/ops/merchant-snapshot?merchant_id=${params.id}`)
            .then(res => res.json())
            .then(data => setSnapshot(data));
    }, [params.id]);

    if (!snapshot) return <div className="p-8">Loading mission control...</div>;

    const executeAction = async () => {
        if (!reason && modalAction !== 'fix_readiness') return alert('Reason required');
        setProcessing(true);
        try {
            let res;
            if (modalAction === 'fix_readiness') {
                res = await fetch('/api/admin/ops/merchant-snapshot/fix', {
                    method: 'POST',
                    body: JSON.stringify({ merchant_id: params.id, mode: 'safe' })
                });
            } else if (modalAction === 'grant_pro') {
                // TODO: Endpoint
                alert('Grant logic pending impl');
                res = { ok: true } as any;
            } else if (modalAction === 'force_publish') {
                res = await fetch('/api/admin/store/publish/override', {
                    method: 'POST',
                    body: JSON.stringify({ merchant_id: params.id, reason })
                });
            }

            if (res?.ok) {
                alert('Action completed successfully');
                window.location.reload();
            } else {
                alert('Failed');
            }
        } finally {
            setProcessing(false);
            setModalAction(null);
            setReason('');
        }
    };

    return (
        <div>
            <div className="flex items-center gap-4 mb-6">
                <div className="w-16 h-16 bg-gray-200 rounded-lg flex items-center justify-center font-bold text-2xl text-gray-500">
                    {snapshot.store.name.substring(0, 2).toUpperCase()}
                </div>
                <div>
                    <h1 className="text-3xl font-bold">{snapshot.store.name}</h1>
                    <div className="flex gap-2 text-sm text-gray-500">
                        <span>ID: {snapshot.merchant.id}</span> •
                        <span>Slug: {snapshot.store.slug}</span>
                    </div>
                </div>
            </div>

            <div className="flex gap-6 border-b border-gray-200 mb-6">
                {['overview', 'readiness', 'billing', 'publishing'].map(tab => (
                    <button
                        key={tab}
                        onClick={() => setActiveTab(tab)}
                        className={`pb-3 text-sm font-bold uppercase tracking-wider ${activeTab === tab ? 'border-b-2 border-black text-black' : 'text-gray-400 hover:text-gray-600'
                            }`}
                    >
                        {tab}
                    </button>
                ))}
            </div>

            {activeTab === 'overview' && (
                <div className="grid grid-cols-2 gap-8">
                    <div className="space-y-4">
                        <div className="bg-white p-6 border rounded-xl">
                            <h3 className="font-bold text-gray-500 text-xs uppercase mb-4">Readiness Level</h3>
                            <div className={`text-4xl font-bold capitalize ${snapshot.store.readinessLevel === 'ready' ? 'text-green-600' : 'text-red-500'
                                }`}>
                                {snapshot.store.readinessLevel}
                            </div>
                        </div>
                    </div>
                    <div className="bg-gray-900 text-green-400 font-mono text-xs p-6 rounded-xl overflow-auto h-64">
                        {JSON.stringify(snapshot, null, 2)}
                    </div>
                </div>
            )}

            {activeTab === 'readiness' && (
                <div className="bg-white border rounded-xl p-8">
                    <h3 className="font-bold mb-4">Readiness Issues</h3>
                    {snapshot.readiness.issues.length === 0 ? (
                        <p className="text-green-600">No issues found.</p>
                    ) : (
                        <ul className="space-y-2 mb-8">
                            {snapshot.readiness.issues.map((i: any) => (
                                <li key={i.code} className="text-red-600">
                                    <Icon name={"CircleX" as any} size={14} className="mr-1" /> {i.title}: {i.description}
                                </li>
                            ))}
                        </ul>
                    )}

                    <button
                        onClick={() => setModalAction('fix_readiness')}
                        className="bg-blue-600 text-white px-4 py-2 rounded font-bold hover:bg-blue-700"
                    >
                        Run Safe Auto-Fix
                    </button>
                </div>
            )}

            {activeTab === 'publishing' && (
                <div className="bg-white border rounded-xl p-8">
                    <h3 className="font-bold mb-4">Force Actions</h3>
                    <p className="text-sm text-gray-500 mb-4">Dangerous actions. Audit log entry will be created.</p>
                    <button
                        onClick={() => setModalAction('force_publish')}
                        className="bg-red-600 text-white px-4 py-2 rounded font-bold hover:bg-red-700"
                    >
                        Force Publish (Admin Override)
                    </button>
                </div>
            )}

            {modalAction && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                    <div className="bg-white p-8 rounded-xl max-w-md w-full">
                        <h3 className="font-bold text-xl mb-4 capitalize">{modalAction.replace('_', ' ')}</h3>
                        {modalAction !== 'fix_readiness' && (
                            <div className="mb-4">
                                <label className="block text-sm font-bold mb-1">Reason (Required)</label>
                                <textarea
                                    className="w-full border p-2 rounded"
                                    value={reason}
                                    onChange={e => setReason(e.target.value)}
                                    placeholder="Ticket # or explanation..."
                                />
                            </div>
                        )}
                        <div className="flex justify-end gap-2">
                            <button onClick={() => setModalAction(null)} className="px-4 py-2 text-gray-500">Cancel</button>
                            <button
                                onClick={executeAction}
                                disabled={processing}
                                className="px-4 py-2 bg-red-600 text-white font-bold rounded"
                            >
                                {processing ? 'Running...' : 'Confirm & Execute'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
