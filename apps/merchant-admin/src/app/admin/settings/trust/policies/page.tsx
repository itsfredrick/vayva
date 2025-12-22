'use client';

import React, { useState, useEffect } from 'react';
import { AdminShell } from '@/components/admin-shell';
import { Button, Icon, cn } from '@vayva/ui';
import { api } from '@/services/api';

const POLICY_TYPES = [
    { key: 'PRIVACY', title: 'Privacy Policy', icon: 'Shield' },
    { key: 'TERMS', title: 'Terms of Service', icon: 'FileText' },
    { key: 'REFUNDS', title: 'Refund Policy', icon: 'RotateCcw' },
    { key: 'SHIPPING', title: 'Shipping & Delivery', icon: 'Truck' },
    { key: 'COOKIES', title: 'Cookies Policy', icon: 'Cookie' },
];

export default function PoliciesPage() {
    const [selectedPolicy, setSelectedPolicy] = useState(POLICY_TYPES[0]);
    const [content, setContent] = useState('');
    const [title, setTitle] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [isSaving, setIsSaving] = useState(false);

    const fetchPolicy = async (key: string) => {
        setIsLoading(true);
        try {
            const res = await api.get(`/compliance/policies/${key}`);
            if (res.data) {
                setContent(res.data.content);
                setTitle(res.data.title);
            } else {
                setContent('');
                setTitle(POLICY_TYPES.find(p => p.key === key)?.title || '');
            }
        } catch (err) {
            console.error(err);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchPolicy(selectedPolicy.key);
    }, [selectedPolicy]);

    const handleSave = async () => {
        setIsSaving(true);
        try {
            await api.post('/compliance/policies', {
                key: selectedPolicy.key,
                title,
                content
            });
            alert('Policy saved successfully');
        } catch (err) {
            console.error(err);
            alert('Failed to save policy');
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <AdminShell title="Policies" breadcrumb="Trust Center">
            <div className="flex gap-8 h-[calc(100vh-200px)]">

                {/* Sidebar */}
                <div className="w-64 flex flex-col gap-2">
                    {POLICY_TYPES.map(p => (
                        <button
                            key={p.key}
                            onClick={() => setSelectedPolicy(p)}
                            className={cn(
                                "flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all",
                                selectedPolicy.key === p.key
                                    ? "bg-white border border-gray-100 shadow-sm text-[#0B0B0B]"
                                    : "text-[#525252] hover:bg-white/50"
                            )}
                        >
                            <Icon name={p.icon as any} size={18} />
                            {p.title}
                        </button>
                    ))}
                </div>

                {/* Editor Area */}
                <div className="flex-1 bg-white rounded-2xl border border-gray-100 shadow-sm flex flex-col overflow-hidden">
                    <div className="p-6 border-b border-gray-50 flex items-center justify-between">
                        <div className="flex-1 mr-4">
                            <input
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                className="text-xl font-bold text-[#0B0B0B] w-full focus:outline-none"
                                placeholder="Policy Title"
                            />
                        </div>
                        <Button onClick={handleSave} isLoading={isSaving}>
                            <Icon name="Save" size={16} className="mr-2" />
                            Save Policy
                        </Button>
                    </div>

                    <div className="flex-1 flex overflow-hidden">
                        {/* Markdown Input */}
                        <div className="flex-1 p-6 border-r border-gray-50 bg-gray-50/30">
                            <textarea
                                value={content}
                                onChange={(e) => setContent(e.target.value)}
                                className="w-full h-full bg-transparent resize-none focus:outline-none font-mono text-sm leading-relaxed"
                                placeholder="Enter policy content in Markdown..."
                            />
                        </div>

                        {/* Preview */}
                        <div className="flex-1 p-8 overflow-y-auto prose prose-sm max-w-none prose-slate">
                            {isLoading ? (
                                <div className="flex items-center justify-center h-full text-gray-400">Loading...</div>
                            ) : content ? (
                                <div dangerouslySetInnerHTML={{ __html: 'Preview rendered here (Mock)' }} />
                            ) : (
                                <div className="text-gray-400 italic">No content yet. Start typing to see preview.</div>
                            )}
                        </div>
                    </div>
                </div>

            </div>
        </AdminShell>
    );
}
