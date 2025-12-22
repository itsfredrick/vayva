'use client';

import React, { useEffect, useState } from 'react';
import { GlassPanel, Button, Icon, Input } from '@vayva/ui';
import { Spinner } from '@/components/Spinner';
import { ControlCenterService } from '@/services/control-center.service';
import { StoreConfig, StoreBranding } from '@/types/control-center';
import Link from 'next/link';

const COLORS = [
    '#000000', '#FFFFFF', '#FF3B30', '#FF9500', '#FFCC00',
    '#4CD964', '#5AC8FA', '#007AFF', '#5856D6', '#FF2D55',
    '#8E8E93', '#C7C7CC'
];

const FONTS = [
    { heading: 'Space Grotesk', body: 'Inter', label: 'Modern (Default)' },
    { heading: 'Playfair Display', body: 'Lato', label: 'Elegant' },
    { heading: 'Roboto', body: 'Roboto', label: 'Industrial' },
    { heading: 'Montserrat', body: 'Open Sans', label: 'Clean' },
];

export default function BrandingPage() {
    const [config, setConfig] = useState<StoreConfig | null>(null);
    const [branding, setBranding] = useState<StoreBranding | null>(null);
    const [isSaving, setIsSaving] = useState(false);

    useEffect(() => {
        const load = async () => {
            const c = await ControlCenterService.getStoreConfig();
            setConfig(c);
            setBranding(c.branding);
        };
        load();
    }, []);

    const handleSave = async () => {
        if (!branding) return;
        setIsSaving(true);
        await ControlCenterService.updateBranding(branding);
        setIsSaving(false);
    };

    if (!config || !branding) return <div className="p-12 text-center"><Spinner /></div>;

    return (
        <div className="flex h-[calc(100vh-100px)] -m-6">
            {/* Editor Sidebar */}
            <div className="w-96 border-r border-white/10 bg-black/20 p-6 overflow-y-auto">
                <Link href="/admin/control-center" className="mb-6 flex items-center text-sm text-text-secondary hover:text-white">
                    <Icon name="ArrowLeft" size={16} className="mr-2" />
                    Back
                </Link>

                <h1 className="mb-6 text-2xl font-bold text-white">Branding</h1>

                {/* Logo */}
                <div className="mb-8">
                    <h3 className="mb-3 text-sm font-medium text-white">Logo</h3>
                    <GlassPanel className="p-4 flex flex-col items-center justify-center gap-4 cursor-pointer hover:bg-white/5 transition-colors border-dashed border-white/20">
                        {branding.logoUrl ? (
                            <img src={branding.logoUrl} alt="Logo" className="h-16 w-auto object-contain" />
                        ) : (
                            <div className="h-16 w-16 rounded-full bg-white/10 flex items-center justify-center text-white/30">
                                <Icon name="Image" size={24} />
                            </div>
                        )}
                        <span className="text-xs text-primary">Upload Logo</span>
                    </GlassPanel>
                </div>

                {/* Store Name */}
                <div className="mb-8">
                    <h3 className="mb-3 text-sm font-medium text-white">Store Name</h3>
                    <Input
                        value={branding.storeName}
                        onChange={(e) => setBranding({ ...branding, storeName: e.target.value })}
                        className="bg-black/50 border-white/10"
                    />
                </div>

                {/* Accent Color */}
                <div className="mb-8">
                    <h3 className="mb-3 text-sm font-medium text-white">Accent Color</h3>
                    <div className="grid grid-cols-6 gap-2">
                        {COLORS.map(color => (
                            <button
                                key={color}
                                onClick={() => setBranding({ ...branding, accentColor: color })}
                                className={`h-8 w-8 rounded-full border-2 transition-transform hover:scale-110 ${branding.accentColor === color ? 'border-white' : 'border-transparent'
                                    }`}
                                style={{ backgroundColor: color }}
                            />
                        ))}
                    </div>
                    <div className="mt-4 flex items-center gap-2">
                        <span className="text-xs text-text-secondary">Custom:</span>
                        <div className="h-6 w-6 rounded border border-white/20" style={{ backgroundColor: branding.accentColor }} />
                        <span className="text-xs text-white family-mono">{branding.accentColor}</span>
                    </div>
                </div>

                {/* Typography */}
                <div className="mb-8">
                    <h3 className="mb-3 text-sm font-medium text-white">Typography</h3>
                    <div className="space-y-2">
                        {FONTS.map((font, i) => (
                            <button
                                key={i}
                                onClick={() => setBranding({ ...branding, fontHeading: font.heading, fontBody: font.body })}
                                className={`w-full text-left p-3 rounded-lg border transition-all ${branding.fontHeading === font.heading
                                    ? 'bg-white/10 border-white/30'
                                    : 'border-transparent hover:bg-white/5'
                                    }`}
                            >
                                <div className="text-sm text-white font-medium">{font.label}</div>
                                <div className="text-xs text-text-secondary flex gap-2">
                                    <span>H: {font.heading}</span>
                                    <span>B: {font.body}</span>
                                </div>
                            </button>
                        ))}
                    </div>
                </div>

                <Button
                    variant="primary"
                    className="w-full"
                    onClick={handleSave}
                    disabled={isSaving}
                >
                    {isSaving ? <Spinner size="sm" /> : 'Save Changes'}
                </Button>
            </div>

            {/* Live Preview Panel */}
            <div className="flex-1 bg-neutral-900 p-8 flex items-center justify-center overflow-hidden relative">
                <div className="absolute inset-0 bg-grid-white/[0.02] -z-0" />

                {/* Mock Store Preview */}
                <div className="w-full max-w-4xl bg-white rounded-xl shadow-2xl overflow-hidden aspect-[16/9] flex flex-col relative z-10 transition-all duration-500 ease-in-out">
                    {/* Preview Header */}
                    <div className="h-16 px-8 flex items-center justify-between border-b border-gray-100 bg-white">
                        <div
                            className="font-bold text-xl tracking-tight transition-colors duration-300"
                            style={{
                                fontFamily: branding.fontHeading,
                                color: branding.accentColor === '#FFFFFF' ? '#000000' : branding.accentColor
                            }}
                        >
                            {branding.storeName}
                        </div>
                        <div className="flex gap-6 text-sm text-gray-500" style={{ fontFamily: branding.fontBody }}>
                            <span>Home</span>
                            <span>Shop</span>
                            <span>About</span>
                        </div>
                    </div>

                    {/* Preview Hero */}
                    <div className="flex-1 bg-gray-50 p-12 flex flex-col justify-center items-start">
                        <h1
                            className="text-5xl font-bold text-gray-900 mb-6 leading-tight max-w-lg"
                            style={{ fontFamily: branding.fontHeading }}
                        >
                            Summer Collection 2025
                        </h1>
                        <p
                            className="text-gray-500 mb-8 max-w-md"
                            style={{ fontFamily: branding.fontBody }}
                        >
                            Discover the new aesthetic. Minimalist designs for the modern era.
                        </p>
                        <button
                            className="px-8 py-3 rounded text-white font-medium transition-colors"
                            style={{
                                backgroundColor: branding.accentColor === '#FFFFFF' ? '#000000' : branding.accentColor,
                                fontFamily: branding.fontBody
                            }}
                        >
                            Shop Now
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
