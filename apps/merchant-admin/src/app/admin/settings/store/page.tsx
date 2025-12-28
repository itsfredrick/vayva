'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { AppShell, GlassPanel, Button, Icon } from '@vayva/ui';

export default function StoreSettingsPage() {
    const [isDirty, setIsDirty] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [formData, setFormData] = useState<any>({
        name: '',
        businessType: '',
        supportEmail: '',
        supportPhone: '',
        description: '',
        address: {
            street: '',
            city: '',
            state: '',
            landmark: ''
        },
        whatsappNumber: '',
        logoUrl: '',
        slug: ''
    });

    useEffect(() => {
        const fetchStoreData = async () => {
            try {
                const response = await fetch('/api/account/store');
                const data = await response.json();
                if (data.error) throw new Error(data.error);
                setFormData(data);
            } catch (error) {
                console.error('Failed to fetch store data:', error);
            } finally {
                setIsLoading(false);
            }
        };
        fetchStoreData();
    }, []);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setIsDirty(true);

        if (name.startsWith('address.')) {
            const field = name.split('.')[1];
            setFormData((prev: any) => ({
                ...prev,
                address: { ...prev.address, [field]: value }
            }));
        } else {
            setFormData((prev: any) => ({ ...prev, [name]: value }));
        }
    };

    const handleSave = async () => {
        setIsSaving(true);
        try {
            const response = await fetch('/api/account/store', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            });
            const result = await response.json();
            if (result.success) {
                setIsDirty(false);
            } else {
                alert(result.error || 'Failed to save changes');
            }
        } catch (error) {
            console.error('Save error:', error);
            alert('An unexpected error occurred');
        } finally {
            setIsSaving(false);
        }
    };

    if (isLoading) {
        return (
            <AppShell sidebar={<></>} header={<></>}>
                <div className="flex items-center justify-center h-64 text-white">Loading store settings...</div>
            </AppShell>
        );
    }

    return (
        <AppShell sidebar={<></>} header={<></>}>
            <div className="max-w-4xl mx-auto mb-6">
                <h1 className="text-2xl font-bold text-white">Store Settings</h1>
            </div>
            <div className="max-w-4xl mx-auto space-y-6 pb-24">

                {/* 1. Store Identity */}
                <GlassPanel className="p-6">
                    <h2 className="font-bold text-white text-lg mb-6">Store Identity</h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="col-span-1">
                            <label className="text-xs text-text-secondary uppercase font-bold tracking-wider mb-2 block">Store Logo</label>
                            <div className="aspect-square rounded-xl bg-white/5 border border-white/10 flex flex-col items-center justify-center cursor-pointer hover:bg-white/10 transition-colors group relative overflow-hidden">
                                {formData.logoUrl ? (
                                    <img src={formData.logoUrl} alt="Logo" className="w-full h-full object-cover" />
                                ) : (
                                    <>
                                        <Icon name="ImagePlus" size={32} className="text-white/20 group-hover:text-white/50 transition-colors" />
                                        <span className="text-xs text-text-secondary mt-2">Upload Logo</span>
                                    </>
                                )}
                                <input type="file" className="absolute inset-0 opacity-0 cursor-pointer" onChange={() => setIsDirty(true)} />
                            </div>
                        </div>
                        <div className="md:col-span-2 space-y-4">
                            <div>
                                <label className="text-xs text-text-secondary uppercase font-bold tracking-wider mb-2 block">Store Name</label>
                                <input
                                    name="name"
                                    className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-primary"
                                    value={formData.name}
                                    onChange={handleChange}
                                />
                            </div>
                            <div>
                                <label className="text-xs text-text-secondary uppercase font-bold tracking-wider mb-2 block">Store Category</label>
                                <select
                                    name="businessType"
                                    className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-primary"
                                    value={formData.businessType}
                                    onChange={handleChange}
                                >
                                    <option value="fashion">Fashion & Apparel</option>
                                    <option value="electronics">Electronics</option>
                                    <option value="beauty">Beauty & Health</option>
                                    <option value="home">Home & Garden</option>
                                    <option value="general">General Commerce</option>
                                </select>
                            </div>
                            <div>
                                <label className="text-xs text-text-secondary uppercase font-bold tracking-wider mb-2 block">Store URL</label>
                                <div className="flex gap-2">
                                    <div className="flex-1 bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-text-secondary font-mono text-sm flex items-center justify-between">
                                        <span>{formData.slug || 'my-store'}.vayva.shop</span>
                                        <Link href="/admin/store/domains" className="text-primary hover:underline text-xs">Manage Domains</Link>
                                    </div>
                                    <Button variant="ghost" size="icon" className="text-text-secondary"><Icon name="Copy" size={18} /></Button>
                                </div>
                            </div>
                        </div>
                    </div>
                </GlassPanel>

                {/* 2. Contact Information */}
                <GlassPanel className="p-6">
                    <h2 className="font-bold text-white text-lg mb-6">Contact Information</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="text-xs text-text-secondary uppercase font-bold tracking-wider mb-2 block">Support Phone <span className="text-state-warning">*</span></label>
                            <input
                                name="supportPhone"
                                className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-primary"
                                value={formData.supportPhone}
                                onChange={handleChange}
                            />
                        </div>
                        <div>
                            <label className="text-xs text-text-secondary uppercase font-bold tracking-wider mb-2 block">Support Email</label>
                            <input
                                name="supportEmail"
                                className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-primary"
                                value={formData.supportEmail}
                                onChange={handleChange}
                            />
                        </div>
                        <div className="md:col-span-2">
                            <div className="flex items-center justify-between p-4 bg-white/5 rounded-lg border border-white/5">
                                <div>
                                    <div className="text-xs text-text-secondary uppercase font-bold tracking-wider mb-1">WhatsApp Number</div>
                                    <div className="text-white font-mono">{formData.whatsappNumber || 'Not Linked'}</div>
                                </div>
                                <Link href="/admin/account/connected-services">
                                    <Button variant="outline" size="sm">Manage Connection</Button>
                                </Link>
                            </div>
                        </div>
                    </div>
                </GlassPanel>

                {/* 3. Business Address */}
                <GlassPanel className="p-6">
                    <h2 className="font-bold text-white text-lg mb-6">Business Address</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="md:col-span-2">
                            <label className="text-xs text-text-secondary uppercase font-bold tracking-wider mb-2 block">Street Address <span className="text-state-warning">*</span></label>
                            <input
                                name="address.street"
                                className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-primary"
                                value={formData.address.street}
                                onChange={handleChange}
                            />
                        </div>
                        <div>
                            <label className="text-xs text-text-secondary uppercase font-bold tracking-wider mb-2 block">City <span className="text-state-warning">*</span></label>
                            <input
                                name="address.city"
                                className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-primary"
                                value={formData.address.city}
                                onChange={handleChange}
                            />
                        </div>
                        <div>
                            <label className="text-xs text-text-secondary uppercase font-bold tracking-wider mb-2 block">State <span className="text-state-warning">*</span></label>
                            <select
                                name="address.state"
                                className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-primary"
                                value={formData.address.state}
                                onChange={handleChange}
                            >
                                <option value="Lagos">Lagos</option>
                                <option value="Abuja">Abuja (FCT)</option>
                                <option value="Rivers">Rivers</option>
                                <option value="Ogun">Ogun</option>
                                <option value="Oyo">Oyo</option>
                            </select>
                        </div>
                        <div className="md:col-span-2">
                            <label className="text-xs text-text-secondary uppercase font-bold tracking-wider mb-2 block">Landmark (Optional)</label>
                            <input
                                name="address.landmark"
                                className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-primary"
                                value={formData.address.landmark}
                                onChange={handleChange}
                            />
                        </div>
                    </div>
                </GlassPanel>

                <div className={`fixed bottom-0 left-0 right-0 p-4 bg-[#142210]/95 border-t border-white/10 backdrop-blur-md z-50 flex items-center justify-between transition-transform duration-300 ${isDirty ? 'translate-y-0' : 'translate-y-full'}`}>
                    <div className="max-w-4xl mx-auto w-full flex items-center justify-between px-4">
                        <span className="text-sm text-white">You have unsaved changes</span>
                        <div className="flex gap-3">
                            <Button variant="ghost" className="text-white hover:bg-white/10" onClick={() => setIsDirty(false)} disabled={isSaving}>Discard</Button>
                            <Button className="bg-primary hover:bg-primary/90 text-black border-none" onClick={handleSave} isLoading={isSaving} disabled={isSaving}>
                                {isSaving ? 'Saving...' : 'Save Changes'}
                            </Button>
                        </div>
                    </div>
                </div>

            </div>
        </AppShell>
    );
}
