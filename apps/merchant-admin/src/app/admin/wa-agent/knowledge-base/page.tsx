'use client';

import React, { useState, useEffect } from 'react';
import { AdminShell } from '@/components/admin-shell';
import { WaAgentService, KbItem } from '@/services/wa-agent';
import { Button, Icon } from '@vayva/ui';

export default function KnowledgeBasePage() {
    const [kbItems, setKbItems] = useState<KbItem[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const load = async () => {
            const data = await WaAgentService.getKnowledgeBase();
            setKbItems(data);
            setIsLoading(false);
        };
        load();
    }, []);

    return (
        <AdminShell title="Knowledge Base" breadcrumb="WhatsApp Agent">
            <div className="flex flex-col gap-6">

                {/* Header Actions */}
                <div className="flex justify-between items-center">
                    <p className="text-gray-500 text-sm">Manage the answers your AI agent uses to respond to customers.</p>
                    <div className="flex gap-2">
                        <Button variant="outline"><Icon name="Upload" size={16} className="mr-2" /> Import CSV</Button>
                        <Button><Icon name="Plus" size={16} className="mr-2" /> Add Q&A</Button>
                    </div>
                </div>

                {/* Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {isLoading ? (
                        <div className="col-span-2 text-center p-12 text-gray-400">Loading knowledge base...</div>
                    ) : (
                        kbItems.map(item => (
                            <div key={item.id} className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm flex flex-col gap-3 group hover:border-blue-100 transition-colors">
                                <div className="flex justify-between items-start">
                                    <span className="text-[10px] uppercase font-bold text-gray-400 tracking-wider bg-gray-50 px-2 py-1 rounded">{item.category}</span>
                                    {item.status === 'synced' && <Icon name={"CheckCircle" as any} size={14} className="text-green-500" />}
                                </div>
                                <h3 className="font-bold text-[#0B0B0B]">{item.question}</h3>
                                <p className="text-sm text-gray-600 line-clamp-3 group-hover:line-clamp-none transition-all">{item.answer}</p>
                                <div className="pt-3 mt-auto flex justify-end">
                                    <button className="text-xs font-bold text-gray-400 hover:text-black">Edit</button>
                                </div>
                            </div>
                        ))
                    )}
                </div>

            </div>
        </AdminShell>
    );
}
