'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Cookies from 'js-cookie';
import { Button, GlassPanel, Icon } from '@vayva/ui';
import { useAuth } from '@/context/AuthContext';

export default function SelectStorePage() {
    const { user } = useAuth();
    const router = useRouter();
    const [stores, setStores] = useState<any[]>([]);
    // In real app, we would fetch store details by IDs from /api/stores?ids=...
    // For V1, we might only have IDs in user.memberships. The token might need store names, 
    // or we fetch them. 
    // Updated Plan: Let's assume user.memberships structure in auth-service response 
    // contains { storeId, storeName } or similar.
    // For now, I'll mock the names or fetch them mockingly.

    // Actually, let's fix auth-service to return { storeId, store: { name, ... } } if possible. 
    // But for simplicity, I will just list IDs for now or fetch.

    // Wait, the prompt implies "Store selector".

    const [loading, setLoading] = useState(false);

    const handleSelect = (storeId: string) => {
        setLoading(true);
        Cookies.set('vayva_store_id', storeId, { expires: 1 });
        router.push('/admin/dashboard');
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-background-dark p-4">
            <GlassPanel className="w-full max-w-md p-8">
                <div className="text-center mb-8">
                    <div className="flex justify-center mb-4">
                        <div className="w-12 h-12 bg-white/10 rounded-xl flex items-center justify-center">
                            <Icon name="Store" className="text-white" />
                        </div>
                    </div>
                    <h1 className="text-2xl font-bold text-white mb-2">Select Store</h1>
                    <p className="text-text-secondary">Choose the store you want to manage.</p>
                </div>

                <div className="space-y-3">
                    {(user as any)?.memberships?.map((storeId: string) => (
                        <div
                            key={storeId}
                            onClick={() => handleSelect(storeId)}
                            className="p-4 border border-white/10 rounded-xl hover:bg-white/5 cursor-pointer transition-colors flex items-center justify-between group"
                        >
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-lg bg-gray-800 flex items-center justify-center">
                                    <span className="text-white font-bold">{storeId.substring(0, 2).toUpperCase()}</span>
                                </div>
                                <div className="flex flex-col">
                                    <span className="text-white font-medium">Store {storeId}</span>
                                    <span className="text-xs text-text-secondary">Owner</span>
                                </div>
                            </div>
                            <Icon name="ChevronRight" className="text-text-secondary group-hover:text-primary transition-colors" />
                        </div>
                    ))}

                    {(!(user as any)?.memberships || (user as any).memberships.length === 0) && (
                        <div className="text-center text-text-secondary py-4">No stores found.</div>
                    )}
                </div>

                <div className="mt-8 pt-6 border-t border-white/10 text-center">
                    <Button
                        variant="secondary"
                        onClick={() => router.push('/onboarding')}
                        className="w-full"
                    >
                        Create New Store
                    </Button>
                </div>
            </GlassPanel>
        </div>
    );
}
