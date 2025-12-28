'use client';

import React, { useState, useEffect } from 'react';
import { Button, Input, Icon } from '@vayva/ui';
import { useOnboarding } from '@/context/OnboardingContext';
import { useAuth } from '@/context/AuthContext'; // Import useAuth to access user data // Import useAuth to access user data
import Link from 'next/link';

// Mock Categories
const CATEGORIES = [
    'Fashion & Apparel',
    'Beauty & Cosmetics',
    'Electronics',
    'Food & Beverage',
    'Home & Decor',
    'Health & Wellness',
    'Other'
];

export default function StoreDetailsPage() {
    const { state, updateState, goToStep } = useOnboarding();
    const { user } = useAuth(); // Access user info for plan gating check if needed but mainly for context
    const [formData, setFormData] = useState<{
        storeName: string;
        category: string;
        state: string;
        city: string;
        slug: string;
        domainPreference: 'subdomain' | 'custom';
        publishStatus: 'draft' | 'published';
    }>({
        storeName: '',
        category: '',
        state: '',
        city: '',
        slug: '',
        domainPreference: 'subdomain',
        publishStatus: 'draft'
    });

    const [slugAvailable, setSlugAvailable] = useState<boolean | null>(null);
    const [isCheckingSlug, setIsCheckingSlug] = useState(false);

    useEffect(() => {
        if (state?.storeDetails) {
            setFormData({
                storeName: state.storeDetails.storeName || '',
                category: state.storeDetails.category || '',
                state: state.storeDetails.state || '',
                city: state.storeDetails.city || '',
                slug: state.storeDetails.slug || '',
                domainPreference: state.storeDetails.domainPreference || 'subdomain',
                publishStatus: state.storeDetails.publishStatus || 'draft'
            });
            if (state.storeDetails.slug) {
                setSlugAvailable(true); // Assume valid if loading from state
            }
        }
    }, [state]);

    // Auto-generate slug from store name
    useEffect(() => {
        if (!state?.storeDetails?.slug && formData.storeName) {
            const slug = formData.storeName
                .toLowerCase()
                .replace(/[^a-z0-9]/g, '-')
                .replace(/-+/g, '-')
                .replace(/^-|-$/g, '');

            setFormData(prev => ({ ...prev, slug }));
            checkSlug(slug);
        }
    }, [formData.storeName]);

    const checkSlug = async (slug: string) => {
        if (!slug) {
            setSlugAvailable(null);
            return;
        }
        setIsCheckingSlug(true);
        // Mock API check
        await new Promise(resolve => setTimeout(resolve, 500));
        setSlugAvailable(slug !== 'google' && slug !== 'admin'); // Simple blocklist
        setIsCheckingSlug(false);
    };

    const handleSlugChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const slug = e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, '');
        setFormData({ ...formData, slug });
        checkSlug(slug);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        await updateState({
            storeDetails: {
                ...formData,
                domainPreference: formData.domainPreference as 'subdomain' | 'custom',
                publishStatus: formData.publishStatus as 'draft' | 'published'
            }
        });

        await goToStep('brand');
    };

    return (
        <div className="max-w-xl mx-auto">
            <div className="mb-8">
                <h1 className="text-2xl font-bold text-black mb-2">Store Details</h1>
                <p className="text-gray-600">Tell us about your business so we can set up your store correctly.</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6 bg-white p-8 rounded-2xl border border-gray-200 shadow-sm">

                <Input
                    label="Store Name"
                    value={formData.storeName}
                    onChange={(e) => setFormData({ ...formData, storeName: e.target.value })}
                    required
                    placeholder="My Awesome Store"
                />

                <div className="space-y-4">
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-black">Store Link</label>
                        <div className="flex rounded-xl border border-gray-200 overflow-hidden focus-within:ring-2 focus-within:ring-black/5 focus-within:border-black">
                            <div className="bg-gray-50 px-3 py-3 text-sm text-gray-500 border-r border-gray-200">
                                vayva.shop/
                            </div>
                            <input
                                type="text"
                                value={formData.slug}
                                onChange={handleSlugChange}
                                className="flex-1 px-3 py-3 text-sm outline-none text-black placeholder:text-gray-300"
                                placeholder="my-store"
                                required
                            />
                            <div className="px-3 flex items-center justify-center">
                                {isCheckingSlug ? (
                                    <Icon name={"Loader2" as any} className="animate-spin text-gray-400" size={16} />
                                ) : slugAvailable === true ? (
                                    <Icon name={"CircleCheck" as any} className="text-green-500" size={16} />
                                ) : slugAvailable === false ? (
                                    <Icon name={"CircleX" as any} className="text-red-500" size={16} />
                                ) : null}
                            </div>
                        </div>
                        {slugAvailable === false && (
                            <p className="text-xs text-red-500">This URL is not available. Please try another.</p>
                        )}
                    </div>

                    <div className="p-4 bg-gray-50 rounded-xl border border-gray-100 space-y-3">
                        <label className="text-sm font-medium text-black block">Domain Preference</label>
                        <div className="flex flex-col gap-2">
                            <label className="flex items-center gap-3 p-3 bg-white border border-gray-200 rounded-lg cursor-pointer hover:border-black transition-colors">
                                <input
                                    type="radio"
                                    name="domainPref"
                                    checked={formData.domainPreference === 'subdomain'}
                                    onChange={() => setFormData({ ...formData, domainPreference: 'subdomain' })}
                                    className="accent-black"
                                />
                                <div>
                                    <span className="block text-sm font-bold text-gray-900">Use Vayva Subdomain (Free)</span>
                                    <span className="block text-xs text-gray-500">Fastest way to get started.</span>
                                </div>
                            </label>
                            <label className="flex items-center gap-3 p-3 bg-white border border-gray-200 rounded-lg cursor-pointer hover:border-black transition-colors">
                                <input
                                    type="radio"
                                    name="domainPref"
                                    checked={formData.domainPreference === 'custom'}
                                    onChange={() => setFormData({ ...formData, domainPreference: 'custom' })}
                                    className="accent-black"
                                />
                                <div>
                                    <span className="block text-sm font-bold text-gray-900">Connect Custom Domain</span>
                                    <span className="block text-xs text-gray-500">Professional look (e.g. mystore.com).</span>
                                </div>
                            </label>
                        </div>
                    </div>
                </div>

                <div className="space-y-2">
                    <label className="text-sm font-medium text-black">Category</label>
                    <select
                        value={formData.category}
                        onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                        className="w-full h-[50px] rounded-xl border border-gray-200 px-3 text-sm outline-none focus:ring-2 focus:ring-black/5 focus:border-black bg-white"
                        required
                    >
                        <option value="">Select a category</option>
                        {CATEGORIES.map(cat => (
                            <option key={cat} value={cat}>{cat}</option>
                        ))}
                    </select>
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <Input
                        label="State"
                        value={formData.state}
                        onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                        required
                        placeholder="Lagos"
                    />
                    <Input
                        label="City"
                        value={formData.city}
                        onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                        required
                        placeholder="Ikeja"
                    />
                </div>

                <div className="flex items-center gap-4 pt-4">
                    <Button
                        type="button"
                        variant="ghost"
                        onClick={() => goToStep('identity')}
                        className="flex-1 text-gray-500 hover:text-black"
                    >
                        Back
                    </Button>
                    <Button
                        type="submit"
                        variant="primary"
                        className="flex-[2] !bg-black !text-white h-12 rounded-xl"
                        disabled={!formData.storeName || !formData.slug || !slugAvailable}
                    >
                        Continue
                        <Icon name="ArrowRight" className="ml-2 w-4 h-4" />
                    </Button>
                </div>
            </form>
        </div>
    );
}
