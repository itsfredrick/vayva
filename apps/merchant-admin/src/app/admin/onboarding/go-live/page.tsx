'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { AdminShell } from '@/components/admin-shell';
import { Button, Icon, cn } from '@vayva/ui';
import { api } from '@/services/api';

export default function GoLivePage() {
    const [checklist, setChecklist] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    const fetchChecklist = async () => {
        try {
            const res = await api.get('/onboarding/checklist');
            setChecklist(res.data || []);
        } catch (err) {
            console.error(err);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchChecklist();
    }, []);

    const blockers = checklist.filter(item => item.status === 'BLOCKED' || (item.status === 'TODO' && item.category === 'PAYMENTS'));
    const canGoLive = blockers.length === 0;

    return (
        <AdminShell title="Go Live" breadcrumb="Onboarding">
            <div className="max-w-4xl mx-auto flex flex-col gap-8">

                {/* Header */}
                <div className="bg-gradient-to-br from-green-50 to-blue-50 rounded-2xl p-8 border border-green-100">
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-2xl font-bold text-[#0B1220] mb-2">Ready to Go Live?</h1>
                            <p className="text-[#525252]">Complete the checklist below to launch your store.</p>
                        </div>
                        <div className="w-20 h-20 bg-white/50 backdrop-blur-sm rounded-full flex items-center justify-center border border-green-200">
                            <Icon name={"Rocket" as any} size={40} className="text-green-600" />
                        </div>
                    </div>
                </div>

                {/* Blockers Alert */}
                {!canGoLive && (
                    <div className="p-4 rounded-xl bg-orange-50 border border-orange-200 flex gap-4 items-start">
                        <Icon name={"AlertTriangle" as any} className="text-orange-600 shrink-0 mt-0.5" size={20} />
                        <div>
                            <h4 className="font-bold text-orange-900 text-sm mb-1">Pre-Launch Checklist</h4>
                            <p className="text-xs text-orange-700 mb-3">Ensure you've completed all required steps before requesting go-live review.</p>
                            <Link href="/admin/settings/compliance">
                                <Button size="sm" variant="outline" className="w-full">Review Compliance</Button>
                            </Link>
                        </div>
                    </div>
                )}

                {/* Checklist */}
                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                    <div className="p-6 border-b border-gray-50">
                        <h2 className="font-bold text-[#0B1220]">Launch Checklist</h2>
                    </div>
                    <div className="divide-y divide-gray-50">
                        {isLoading ? (
                            <div className="p-12 text-center text-gray-400">Loading checklist...</div>
                        ) : (
                            checklist.map(item => (
                                <div key={item.id} className="p-6 flex items-start gap-4">
                                    <div className={cn(
                                        "w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5",
                                        item.status === 'DONE' ? "bg-green-100 text-green-600" :
                                            item.status === 'BLOCKED' ? "bg-red-100 text-red-600" :
                                                "bg-gray-100 text-gray-400"
                                    )}>
                                        {item.status === 'DONE' ? <Icon name={"Check" as any} size={14} /> : <Icon name={"Circle" as any} size={14} />}
                                    </div>
                                    <div className="flex-1">
                                        <h3 className="font-medium text-[#0B1220] mb-1">{item.title}</h3>
                                        <p className="text-sm text-[#525252]">{item.description}</p>
                                        {item.status === 'BLOCKED' && item.blockerReason && (
                                            <p className="text-xs text-red-600 mt-2">⚠️ {item.blockerReason}</p>
                                        )}
                                    </div>
                                    <span className={cn(
                                        "text-xs font-bold uppercase px-2 py-1 rounded",
                                        item.status === 'DONE' ? "bg-green-50 text-green-600" :
                                            item.status === 'BLOCKED' ? "bg-red-50 text-red-600" :
                                                "bg-gray-50 text-gray-500"
                                    )}>
                                        {item.status}
                                    </span>
                                </div>
                            ))
                        )}
                    </div>
                </div>

                {/* Actions */}
                <div className="flex items-center justify-between">
                    <Link href="/admin/onboarding">
                        <Button variant="outline">
                            <Icon name={"ArrowLeft" as any} size={16} className="mr-2" />
                            Back to Setup
                        </Button>
                    </Link>
                    <div className="flex gap-3">
                        <Button variant="outline">Preview Store</Button>
                        <Button disabled={!canGoLive}>
                            <Icon name={"Rocket" as any} size={16} className="mr-2" />
                            {canGoLive ? 'Launch Store' : 'Complete Checklist First'}
                        </Button>
                    </div>
                </div>

            </div>
        </AdminShell>
    );
}
