'use client';

import React, { useState, useEffect } from 'react';
import { Button, Icon, cn } from '@vayva/ui';

interface ExportRequest {
    id: string;
    scopes: string[];
    status: 'PENDING' | 'RUNNING' | 'COMPLETED' | 'FAILED' | 'EXPIRED';
    createdAt: string;
    expiresAt?: string;
    artifacts?: { signedUrl: string; sizeBytes: number }[];
}

export function DataPrivacySettings() {
    const [exports, setExports] = useState<ExportRequest[]>([]);
    const [isRequesting, setIsRequesting] = useState(false);
    const [selectedScopes, setSelectedScopes] = useState<string[]>(['CATALOG', 'ORDERS']);

    const scopesList = [
        { id: 'CATALOG', label: 'Product Catalog', icon: 'Package' },
        { id: 'ORDERS', label: 'Sales & Orders', icon: 'ShoppingBag' },
        { id: 'CONVERSATIONS', label: 'Chat History (Redacted)', icon: 'MessageCircle' },
        { id: 'AI_USAGE', label: 'AI Usage Logs', icon: 'Cpu' },
    ];

    const toggleScope = (id: string) => {
        if (selectedScopes.includes(id)) {
            setSelectedScopes(selectedScopes.filter(s => s !== id));
        } else {
            setSelectedScopes([...selectedScopes, id]);
        }
    };

    const handleRequestExport = async () => {
        setIsRequesting(true);
        // await fetch('/api/seller/data/export', { method: 'POST', body: JSON.stringify({ scopes: selectedScopes }) });
        // Mock success
        setTimeout(() => setIsRequesting(false), 1500);
    };

    return (
        <div className="space-y-12 pb-24">

            {/* 1. Export Section */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                <div className="p-8 border-b border-gray-50">
                    <h3 className="text-lg font-bold text-[#0B0B0B]">Export Your Data</h3>
                    <p className="text-sm text-gray-500 mt-1">Download a portable archive of your business data in JSON and CSV formats.</p>
                </div>

                <div className="p-8 space-y-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {scopesList.map(scope => (
                            <button
                                key={scope.id}
                                onClick={() => toggleScope(scope.id)}
                                className={cn(
                                    "flex items-center gap-4 p-4 rounded-xl border text-left transition-all",
                                    selectedScopes.includes(scope.id)
                                        ? "border-black bg-gray-50 ring-1 ring-black"
                                        : "border-gray-100 hover:border-gray-200"
                                )}
                            >
                                <div className={cn(
                                    "w-10 h-10 rounded-lg flex items-center justify-center",
                                    selectedScopes.includes(scope.id) ? "bg-black text-white" : "bg-gray-100 text-gray-400"
                                )}>
                                    <Icon name={scope.icon as any} size={20} />
                                </div>
                                <div className="flex-1">
                                    <p className="text-sm font-bold text-[#0B0B0B]">{scope.label}</p>
                                    <p className="text-[10px] text-gray-400">Portable JSON/CSV</p>
                                </div>
                                {selectedScopes.includes(scope.id) && <Icon name="Check" size={16} className="text-black" />}
                            </button>
                        ))}
                    </div>

                    <div className="flex items-center justify-between pt-4">
                        <div className="flex items-center gap-2 text-xs text-gray-400">
                            <Icon name="ShieldCheck" size={14} />
                            <span>Exports are tenant-isolated and encrypted at rest.</span>
                        </div>
                        <Button
                            className="bg-[#0B0B0B] text-white px-8 py-2 rounded-full font-bold"
                            onClick={handleRequestExport}
                            isLoading={isRequesting}
                            disabled={selectedScopes.length === 0}
                        >
                            Generate Export
                        </Button>
                    </div>
                </div>

                {/* Export History */}
                <div className="bg-gray-50 p-6 border-t border-gray-100">
                    <h4 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-4">Export History</h4>
                    <div className="space-y-3">
                        {exports.length === 0 ? (
                            <div className="text-center py-4 bg-white rounded-xl border border-dashed border-gray-200">
                                <p className="text-xs text-gray-400">No active or past exports found.</p>
                            </div>
                        ) : (
                            exports.map(exp => (
                                <div key={exp.id} className="bg-white p-4 rounded-xl border border-gray-100 flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 rounded-full bg-green-50 text-green-600 flex items-center justify-center">
                                            <Icon name="Download" size={14} />
                                        </div>
                                        <div>
                                            <p className="text-xs font-bold text-[#0B0B0B]">Data Archive ({exp.scopes.join(', ')})</p>
                                            <p className="text-[10px] text-gray-400">{exp.createdAt}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-4">
                                        <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-gray-100 text-gray-500 uppercase">{exp.status}</span>
                                        {exp.status === 'COMPLETED' && (
                                            <Button size="sm" variant="outline" className="h-8 text-[10px] font-bold">Download</Button>
                                        )}
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            </div>

            {/* 2. Retention Status */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-8 flex items-start justify-between">
                <div className="flex gap-6">
                    <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center">
                        <Icon name="Clock" size={24} />
                    </div>
                    <div>
                        <h3 className="text-lg font-bold text-[#0B0B0B]">Data Retention Status</h3>
                        <p className="text-sm text-gray-500 mt-1">Your account is active. Audit logs are kept for 365 days per legal compliance.</p>
                        <div className="mt-4 flex gap-8">
                            <div>
                                <p className="text-[10px] font-bold text-gray-400 uppercase">Conversations</p>
                                <p className="text-sm font-bold text-[#0B0B0B]">180 Days</p>
                            </div>
                            <div>
                                <p className="text-[10px] font-bold text-gray-400 uppercase">AI Traces</p>
                                <p className="text-sm font-bold text-[#0B0B0B]">30 Days</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* 3. Danger Zone */}
            <div className="bg-red-50 rounded-2xl border border-red-100 shadow-sm p-8">
                <div className="flex items-start justify-between">
                    <div>
                        <h3 className="text-lg font-bold text-red-900">Danger Zone</h3>
                        <p className="text-sm text-red-700 mt-1">Requesting account deletion is permanent and cannot be undone after the 30-day grace period.</p>
                        <ul className="mt-4 space-y-2">
                            <li className="text-xs text-red-600 flex items-center gap-2">
                                <div className="w-1 h-1 bg-red-400 rounded-full" />
                                AI Assistant will be disabled immediately.
                            </li>
                            <li className="text-xs text-red-600 flex items-center gap-2">
                                <div className="w-1 h-1 bg-red-400 rounded-full" />
                                Storefront will be soft-closed.
                            </li>
                        </ul>
                    </div>
                    <Button variant="outline" className="border-red-200 text-red-600 hover:bg-red-100 font-bold px-6">
                        Request Account Deletion
                    </Button>
                </div>
            </div>

        </div>
    );
}
