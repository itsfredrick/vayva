'use client';

import React from 'react';
import Link from 'next/link';
import { AdminShell } from '@/components/admin-shell'; // Use local localized shell
import { GlassPanel } from '@vayva/ui';
import { Button } from '@vayva/ui';
import { Icon } from '@vayva/ui';

const THEMES = [
    { id: 't1', name: 'Dawn', description: 'A chic, minimalist theme for fashion brands.', category: 'Fashion', image: 'bg-gradient-to-br from-indigo-900 to-purple-900', current: true },
    { id: 't2', name: 'Empire', description: 'Built for large catalogs and electronics.', category: 'Electronics', image: 'bg-gradient-to-br from-gray-800 to-black', current: false },
    { id: 't3', name: 'Crave', description: 'Vibrant and playful, perfect for food.', category: 'Food', image: 'bg-gradient-to-br from-orange-900 to-red-900', current: false },
    { id: 't4', name: 'Studio', description: 'Elegant layout for artists and services.', category: 'Services', image: 'bg-gradient-to-br from-blue-900 to-cyan-900', current: false },
];

export default function ThemesPage() {
    return (
        <AdminShell title="Storefront" breadcrumb="Storefront / Themes">
            <div className="flex flex-col gap-6">
                {/* Header */}
                <div className="flex flex-col gap-1">
                    <h1 className="text-2xl font-bold text-white">Themes</h1>
                    <p className="text-text-secondary">Choose a template and customize it anytime.</p>
                </div>

                {/* Filters */}
                <GlassPanel className="p-4 flex flex-col md:flex-row gap-4 justify-between items-center">
                    <div className="w-full md:w-auto relative">
                        <Icon name={"Search" as any} size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-secondary" />
                        <input
                            className="bg-white/5 border border-white/5 rounded-full pl-10 pr-4 py-2 text-sm text-white focus:outline-none focus:border-primary w-full md:w-64"
                            placeholder="Search templates..."
                        />
                    </div>
                    <div className="flex gap-2 overflow-x-auto w-full md:w-auto pb-2 md:pb-0">
                        {['All', 'Fashion', 'Beauty', 'Electronics', 'Food'].map((cat, i) => (
                            <button key={cat} className={`px-4 py-2 rounded-full text-xs font-bold whitespace-nowrap ${i === 0 ? 'bg-white text-background-dark' : 'bg-white/5 text-text-secondary hover:bg-white/10'}`}>
                                {cat}
                            </button>
                        ))}
                    </div>
                </GlassPanel>

                {/* Current Theme */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <div className="col-span-1 lg:col-span-2">
                        <GlassPanel className="p-6 h-full flex flex-col justify-between relative overflow-hidden group">
                            <div className={`absolute inset-0 opacity-20 ${THEMES[0].image}`} />
                            <div className="relative z-10 flex flex-col md:flex-row gap-6 items-start md:items-center h-full">
                                <div className="w-full md:w-1/2 aspect-video bg-black/40 rounded-xl border border-white/10 flex items-center justify-center shadow-2xl">
                                    <span className="text-text-secondary text-sm">Preview Thumbnail</span>
                                </div>
                                <div className="flex-1 flex flex-col gap-3">
                                    <div className="flex items-center gap-2">
                                        <span className="px-2 py-0.5 rounded bg-primary/20 text-primary text-[10px] font-bold uppercase tracking-wider">Current Theme</span>
                                        <span className="text-xs text-text-secondary">Last saved 2 hours ago</span>
                                    </div>
                                    <h2 className="text-3xl font-bold text-white">{THEMES[0].name}</h2>
                                    <p className="text-text-secondary">{THEMES[0].description}</p>
                                    <div className="flex gap-3 mt-4">
                                        <Link href="/admin/store/themes/customize">
                                            <Button className="px-8">Customize</Button>
                                        </Link>
                                        <Button variant="outline">
                                            <Icon name={"Eye" as any} size={18} className="mr-2" />
                                            Preview
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        </GlassPanel>
                    </div>

                    {/* Stats / Info (Optional slot) */}
                    <div className="col-span-1">
                        <GlassPanel className="p-6 h-full flex flex-col justify-center items-center text-center">
                            <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center mb-4">
                                <Icon name={"Gauge" as any} size={32} className="text-primary" />
                            </div>
                            <h3 className="font-bold text-white mb-2">High Performance</h3>
                            <p className="text-sm text-text-secondary">Your store speed score is 92/100. This theme is optimized for mobile conversions in Nigeria.</p>
                        </GlassPanel>
                    </div>
                </div>

                <h3 className="text-lg font-bold text-white mt-4">Theme Library</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {THEMES.slice(1).map(theme => (
                        <GlassPanel key={theme.id} className="overflow-hidden p-0 group">
                            <div className={`h-48 ${theme.image} relative`}>
                                <div className="absolute inset-0 bg-black/50 group-hover:bg-black/40 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100 duration-300">
                                    <Button variant="secondary" className="bg-white text-black">Preview Theme</Button>
                                </div>
                            </div>
                            <div className="p-6">
                                <div className="flex justify-between items-start mb-2">
                                    <div>
                                        <h3 className="font-bold text-white">{theme.name}</h3>
                                        <p className="text-xs text-text-secondary">{theme.category}</p>
                                    </div>
                                </div>
                                <p className="text-sm text-text-secondary mb-4 line-clamp-2">{theme.description}</p>
                                <div className="flex gap-2">
                                    <Button variant="outline" className="flex-1 text-xs">Try Theme</Button>
                                </div>
                            </div>
                        </GlassPanel>
                    ))}
                </div>
            </div>
        </AdminShell>
    );
}
