'use client';

import React, { useEffect, useState } from 'react';
import { GlassPanel, Button, Icon } from '@vayva/ui';
import { Spinner } from '@/components/Spinner';
import { ControlCenterService } from '@/services/control-center.service';
import { StoreConfig, StorePolicy } from '@/types/control-center';
import Link from 'next/link';

const POLICY_TYPES = ['returns', 'shipping', 'privacy', 'contact'] as const;

export default function PoliciesPage() {
    const [config, setConfig] = useState<StoreConfig | null>(null);
    const [policies, setPolicies] = useState<StorePolicy[]>([]);
    const [selectedType, setSelectedType] = useState<string>('returns');
    const [isSaving, setIsSaving] = useState(false);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const load = async () => {
            const c = await ControlCenterService.getStoreConfig();
            setConfig(c);
            if (c) setPolicies(c.policies || []);
            setLoading(false);
        };
        load();
    }, []);

    if (loading || !config) return <div className="p-12 text-center"><Spinner /></div>;

    const currentPolicy = policies.find(p => p.type === selectedType) || {
        type: selectedType as any,
        title: selectedType.charAt(0).toUpperCase() + selectedType.slice(1),
        content: '',
        isEnabled: false
    };

    const handleUpdate = (content: string) => {
        const updatedPolicies = policies.map(p =>
            p.type === selectedType ? { ...p, content } : p
        );
        // If it didn't exist, add it
        if (!policies.find(p => p.type === selectedType)) {
            updatedPolicies.push({ ...currentPolicy, content, isEnabled: true });
        }
        setPolicies(updatedPolicies);
    };

    // Need a save function in service, assuming existence or mock
    const handleSave = async () => {
        setIsSaving(true);
        // Mock save delay
        await new Promise(r => setTimeout(r, 500));
        setIsSaving(false);
    };

    return (
        <div className="flex h-[calc(100vh-100px)] -m-6">
            {/* Sidebar List */}
            <div className="w-72 border-r border-white/10 bg-black/20 p-6 flex flex-col gap-2">
                <Link href="/admin/control-center" className="mb-6 flex items-center text-sm text-text-secondary hover:text-white">
                    <Icon name="ArrowLeft" size={16} className="mr-2" />
                    Back
                </Link>
                <h2 className="mb-4 text-xs font-semibold uppercase tracking-wider text-text-secondary">Store Policies</h2>

                {POLICY_TYPES.map(type => (
                    <button
                        key={type}
                        onClick={() => setSelectedType(type)}
                        className={`flex items-center justify-between rounded-lg px-3 py-2 text-sm font-medium transition-all ${selectedType === type
                            ? 'bg-white/10 text-white'
                            : 'text-text-secondary hover:bg-white/5 hover:text-white'
                            }`}
                    >
                        {type.charAt(0).toUpperCase() + type.slice(1)}
                        {policies.find(p => p.type === type)?.isEnabled && (
                            <div className="h-1.5 w-1.5 rounded-full bg-green-500" />
                        )}
                    </button>
                ))}
            </div>

            {/* Editor Area */}
            <div className="flex-1 p-8 flex flex-col">
                <div className="mb-6 flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold text-white uppercase tracking-tight">{currentPolicy.title}</h1>
                        <p className="text-text-secondary text-sm">Define your store's {selectedType} policy.</p>
                    </div>
                    <Button
                        variant="primary"
                        onClick={handleSave}
                        disabled={isSaving}
                    >
                        {isSaving ? <Spinner size="sm" /> : 'Save Changes'}
                    </Button>
                </div>

                <GlassPanel className="flex-1 flex flex-col p-6">
                    <textarea
                        className="flex-1 w-full bg-transparent border-none resize-none text-white focus:ring-0 placeholder:text-white/20 p-0 leading-relaxed"
                        placeholder={`Enter your ${selectedType} policy here...`}
                        value={currentPolicy.content}
                        onChange={(e) => handleUpdate(e.target.value)}
                    />
                </GlassPanel>
            </div>
        </div>
    );
}
