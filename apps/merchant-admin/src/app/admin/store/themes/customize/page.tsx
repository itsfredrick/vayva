'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Button } from '@vayva/ui';
import { Icon } from '@vayva/ui';
import { GlassPanel } from '@vayva/ui';

const SECTIONS = [
    { id: 'header', name: 'Header', visible: true, fixed: true },
    { id: 'hero', name: 'Hero Banner', visible: true },
    { id: 'featured', name: 'Featured Collection', visible: true },
    { id: 'text', name: 'Rich Text', visible: true },
    { id: 'footer', name: 'Footer', visible: true, fixed: true },
];

export default function ThemeCustomizePage() {
    const router = useRouter();
    const [viewMode, setViewMode] = useState<'desktop' | 'mobile'>('desktop');
    const [activeTab, setActiveTab] = useState<'sections' | 'settings'>('sections');
    const [sections, setSections] = useState(SECTIONS);

    const toggleMsg = (id: string) => {
        // Placeholder for toggle logic
        console.log('toggle', id);
    };

    return (
        <div className="flex flex-col h-screen bg-[#142210] text-white overflow-hidden">
            {/* Top Bar */}
            <div className="h-16 border-b border-white/5 bg-[#142210]/50 backdrop-blur-xl flex items-center justify-between px-4 z-50">
                <div className="flex items-center gap-4">
                    <Button variant="ghost" size="icon" onClick={() => router.back()}>
                        <Icon name={"ArrowLeft" as any} />
                    </Button>
                    <span className="font-bold hidden md:inline-block">Dawn Theme</span>
                    <div className="h-4 w-[1px] bg-white/10 hidden md:block" />
                    <div className="flex items-center gap-2 bg-white/5 rounded-full p-1 border border-white/5">
                        <button
                            onClick={() => setViewMode('desktop')}
                            className={`p-1.5 rounded-full transition-colors ${viewMode === 'desktop' ? 'bg-white/10 text-white' : 'text-text-secondary hover:text-white'}`}
                        >
                            <Icon name={"Monitor" as any} size={18} />
                        </button>
                        <button
                            onClick={() => setViewMode('mobile')}
                            className={`p-1.5 rounded-full transition-colors ${viewMode === 'mobile' ? 'bg-white/10 text-white' : 'text-text-secondary hover:text-white'}`}
                        >
                            <Icon name={"Smartphone" as any} size={18} />
                        </button>
                    </div>
                </div>

                <div className="flex items-center gap-2 text-xs font-bold text-primary uppercase tracking-wider animate-pulse">
                    <div className="w-2 h-2 rounded-full bg-primary" />
                    Live Preview
                </div>

                <div className="flex items-center gap-2">
                    <Button variant="ghost" size="sm">Discard</Button>
                    <Button size="sm">Save</Button>
                </div>
            </div>

            {/* Main Builder Area */}
            <div className="flex-1 flex overflow-hidden">
                {/* LEFT PANEL: Sections */}
                <div className="w-[300px] border-r border-white/5 bg-[#142210]/50 flex flex-col">
                    <div className="flex border-b border-white/5">
                        <button
                            onClick={() => setActiveTab('sections')}
                            className={`flex-1 py-3 text-sm font-bold border-b-2 transition-colors ${activeTab === 'sections' ? 'border-primary text-white' : 'border-transparent text-text-secondary hover:text-white'}`}
                        >
                            Sections
                        </button>
                        <button
                            onClick={() => setActiveTab('settings')}
                            className={`flex-1 py-3 text-sm font-bold border-b-2 transition-colors ${activeTab === 'settings' ? 'border-primary text-white' : 'border-transparent text-text-secondary hover:text-white'}`}
                        >
                            Theme Settings
                        </button>
                    </div>

                    <div className="flex-1 overflow-y-auto p-4 space-y-2">
                        {activeTab === 'sections' ? (
                            <>
                                {sections.map((section, idx) => (
                                    <div key={section.id} className="group p-3 rounded-lg bg-white/5 border border-transparent hover:border-white/10 flex items-center justify-between cursor-pointer active:cursor-grabbing hover:bg-white/10 transition-colors">
                                        <div className="flex items-center gap-3">
                                            <Icon name={"GripVertical" as any} size={16} className="text-white/20 group-hover:text-white/50 cursor-grab" />
                                            <span className="text-sm font-medium">{section.name}</span>
                                        </div>
                                        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <button className="p-1 hover:text-white text-text-secondary">
                                                <Icon name={"Eye" as any} size={16} />
                                            </button>
                                            <button className="p-1 hover:text-white text-text-secondary">
                                                <Icon name={"Settings" as any} size={16} />
                                            </button>
                                        </div>
                                    </div>
                                ))}
                                <Button variant="outline" className="w-full mt-4 text-xs border-dashed border-white/20 text-text-secondary hover:text-white hover:border-white/40">
                                    <Icon name={"Plus" as any} className="mr-2" size={16} />
                                    Add Section
                                </Button>
                            </>
                        ) : (
                            <div className="space-y-6">
                                <div>
                                    <h3 className="text-xs font-bold text-text-secondary uppercase tracking-wider mb-3">Colors</h3>
                                    <div className="space-y-3">
                                        <div className="flex items-center justify-between">
                                            <span className="text-sm">Primary</span>
                                            <div className="w-6 h-6 rounded-full bg-[#46EC13] border border-white/20 cursor-pointer" />
                                        </div>
                                        <div className="flex items-center justify-between">
                                            <span className="text-sm">Background</span>
                                            <div className="w-6 h-6 rounded-full bg-[#142210] border border-white/20 cursor-pointer" />
                                        </div>
                                    </div>
                                </div>
                                <div>
                                    <h3 className="text-xs font-bold text-text-secondary uppercase tracking-wider mb-3">Typography</h3>
                                    <select className="w-full bg-white/5 border border-white/10 rounded-lg p-2 text-sm outline-none">
                                        <option>Manrope (Modern)</option>
                                        <option>Inter (Clean)</option>
                                        <option>Roboto (Standard)</option>
                                    </select>
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* CENTER: Preview */}
                <div className="flex-1 bg-black/50 overflow-hidden flex items-center justify-center p-8 relative">
                    <div className={`transition-all duration-300 shadow-2xl overflow-hidden bg-white ${viewMode === 'mobile' ? 'w-[375px] h-[667px] rounded-3xl border-[8px] border-[#222]' : 'w-full h-full rounded-lg border border-white/10'
                        }`}>
                        {/* Mock Storefront Preview */}
                        <div className="w-full h-full overflow-y-auto bg-white text-black font-sans">
                            {/* Header */}
                            <div className="p-4 border-b flex justify-between items-center sticky top-0 bg-white z-10">
                                <span className="font-bold text-lg">STORE</span>
                                <div className="flex gap-4 text-sm">
                                    <span>Home</span>
                                    <span>Catalog</span>
                                    <span>Contact</span>
                                </div>
                                <span>🛒 (0)</span>
                            </div>

                            {/* Hero */}
                            <div className="h-64 bg-gray-100 flex items-center justify-center flex-col text-center p-8">
                                <h1 className="text-4xl font-bold mb-4">New Arrivals</h1>
                                <button className="px-6 py-2 bg-black text-white rounded-full">Shop Now</button>
                            </div>

                            {/* Collections */}
                            <div className="p-8">
                                <h2 className="text-xl font-bold mb-6 text-center">Featured Collection</h2>
                                <div className="grid grid-cols-2 gap-4">
                                    {[1, 2, 3, 4].map(i => (
                                        <div key={i} className="space-y-2">
                                            <div className="aspect-square bg-gray-200 rounded-lg" />
                                            <p className="font-bold text-sm">Product Name</p>
                                            <p className="text-sm">₦ 15,000</p>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Footer */}
                            <div className="p-8 bg-gray-900 text-white text-center text-sm">
                                <p>© 2024 Vayva Store</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* RIGHT PANEL: Settings (Contextual) */}
                <div className="w-[300px] border-l border-white/5 bg-[#142210]/50 flex flex-col p-4">
                    <div className="mb-6">
                        <h3 className="text-sm font-bold text-white mb-1">Hero Banner</h3>
                        <p className="text-xs text-text-secondary">Edit settings for the selected section.</p>
                    </div>

                    <div className="space-y-6">
                        <div>
                            <label className="text-xs text-text-secondary uppercase font-bold tracking-wider mb-2 block">Heading</label>
                            <input
                                className="w-full bg-white/5 border border-white/10 rounded-lg p-2 text-sm text-white focus:outline-none focus:border-primary"
                                defaultValue="New Arrivals"
                            />
                        </div>
                        <div>
                            <label className="text-xs text-text-secondary uppercase font-bold tracking-wider mb-2 block">Button Label</label>
                            <input
                                className="w-full bg-white/5 border border-white/10 rounded-lg p-2 text-sm text-white focus:outline-none focus:border-primary"
                                defaultValue="Shop Now"
                            />
                        </div>
                        <div>
                            <label className="text-xs text-text-secondary uppercase font-bold tracking-wider mb-2 block">Background Image</label>
                            <div className="h-32 border border-dashed border-white/20 rounded-lg flex items-center justify-center hover:bg-white/5 cursor-pointer transition-colors">
                                <div className="text-center">
                                    <Icon name="Image" className="mx-auto mb-1 text-text-secondary" />
                                    <span className="text-xs text-text-secondary">Change</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
