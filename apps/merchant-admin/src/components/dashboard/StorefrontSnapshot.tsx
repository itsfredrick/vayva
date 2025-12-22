'use client';

import React from 'react';
import Link from 'next/link';
import { Icon , cn } from '@vayva/ui';
import { Store } from '@/types'; // Ensure this matches your types

interface StorefrontSnapshotProps {
    store: Store | null;
}

export const StorefrontSnapshot = ({ store }: StorefrontSnapshotProps) => {
    if (!store) return null;

    const isPublished = store.status === 'published';
    const storeUrl = isPublished
        ? `https://${store.slug}.vayva.shop`
        : `http://localhost:3001?store=${store.slug}`;

    const handleCopyLink = () => {
        navigator.clipboard.writeText(storeUrl);
        // Toast would go here
    };

    return (
        <div className="bg-[#0A0F0D] border border-white/10 rounded-2xl p-6 flex flex-col h-full relative overflow-hidden group">
            <div className="flex items-start justify-between mb-6">
                <div className="flex items-center gap-4">
                    {/* Store Logo/Avatar */}
                    <div
                        className="w-16 h-16 rounded-xl border border-white/10 flex items-center justify-center overflow-hidden bg-white/5"
                        style={{ backgroundColor: (store as any).brandColor ? `${(store as any).brandColor}20` : undefined }}
                    >
                        {store.logoUrl ? (
                            <img src={store.logoUrl} alt={store.name} className="w-full h-full object-cover" />
                        ) : (
                            <span className="text-2xl font-bold text-white uppercase">{store.name[0]}</span>
                        )}
                    </div>

                    <div>
                        <h3 className="text-xl font-bold text-white mb-1">{store.name}</h3>
                        <div className="flex items-center gap-2">
                            <span className="text-sm text-text-secondary">vayva.shop/{store.slug}</span>
                            <button onClick={handleCopyLink} className="text-text-secondary hover:text-white transition-colors">
                                <Icon name="Copy" size={14} />
                            </button>
                        </div>
                    </div>
                </div>

                {/* Status Badge */}
                <div className={cn(
                    "px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider border",
                    isPublished
                        ? "bg-green-500/10 text-green-500 border-green-500/20"
                        : "bg-yellow-500/10 text-yellow-500 border-yellow-500/20"
                )}>
                    {isPublished ? 'Live' : store.status.replace('_', ' ')}
                </div>
            </div>

            {/* Template Info */}
            <div className="bg-white/5 rounded-xl p-4 mb-6 flex items-center justify-between">
                <div>
                    <p className="text-xs text-text-secondary mb-1">Current Theme</p>
                    <p className="text-sm font-bold text-white capitalize">{((store as any).selectedTemplateId || 'default').replace('-', ' ')}</p>
                </div>
                <Link href="/admin/control-center/templates">
                    <button className="text-xs text-primary hover:text-primary/80 font-medium transition-colors">
                        Change Theme
                    </button>
                </Link>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-3 mt-auto">
                <a href={storeUrl} target="_blank" rel="noreferrer" className="flex-1">
                    <button className="w-full h-10 rounded-lg bg-white text-black font-bold text-sm hover:bg-white/90 transition-colors">
                        Preview Store
                    </button>
                </a>
                <Link href="/admin/control-center" className="flex-1">
                    <button className="w-full h-10 rounded-lg border border-white/20 text-white font-bold text-sm hover:bg-white/5 transition-colors">
                        Customize
                    </button>
                </Link>
            </div>
        </div>
    );
};
