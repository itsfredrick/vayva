'use client';

import React, { useState } from 'react';
import { AdminShell } from '@/components/admin-shell';
import { GlassPanel } from '@vayva/ui';
import { Button } from '@vayva/ui';
import { Icon } from '@vayva/ui';

const MOCK_MENU = [
    { id: '1', label: 'Home', type: 'Page', link: '/' },
    { id: '2', label: 'Shop', type: 'Collection', link: '/collections/all' },
    { id: '3', label: 'About Us', type: 'Page', link: '/about' },
    { id: '4', label: 'Contact', type: 'Page', link: '/contact' },
];

export default function NavigationPage() {
    const [activeMenu, setActiveMenu] = useState<'Main Menu' | 'Footer Menu'>('Main Menu');

    return (
        <AdminShell title="Navigation" breadcrumb="Storefront / Navigation">
            <div className="flex flex-col gap-6 max-w-5xl mx-auto">
                <div className="flex items-center justify-between">
                    <h1 className="text-2xl font-bold text-white">Menus</h1>
                    <Button>Save Menu</Button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {/* Menu Tree */}
                    <div className="md:col-span-2 flex flex-col gap-6">
                        <GlassPanel className="p-0 overflow-hidden">
                            {/* Tabs */}
                            <div className="flex border-b border-white/5">
                                {['Main Menu', 'Footer Menu'].map(menu => (
                                    <button
                                        key={menu}
                                        onClick={() => setActiveMenu(menu as any)}
                                        className={`flex-1 py-4 text-sm font-bold border-b-2 transition-colors ${activeMenu === menu ? 'border-primary text-white bg-white/5' : 'border-transparent text-text-secondary hover:text-white hover:bg-white/5'}`}
                                    >
                                        {menu}
                                    </button>
                                ))}
                            </div>

                            {/* List */}
                            <div className="p-6 flex flex-col gap-3">
                                {MOCK_MENU.map(item => (
                                    <div key={item.id} className="flex items-center gap-4 p-3 rounded-xl bg-white/5 border border-white/5 group hover:border-white/20 transition-colors">
                                        <Icon name={"GripVertical" as any} size={20} className="text-text-secondary cursor-grab" />
                                        <div className="flex-1">
                                            <p className="font-bold text-white">{item.label}</p>
                                            <div className="flex items-center gap-2 text-xs text-text-secondary">
                                                <span className="px-1.5 py-0.5 rounded bg-white/10 uppercase tracking-wider text-[10px]">{item.type}</span>
                                                <span className="font-mono">{item.link}</span>
                                            </div>
                                        </div>
                                        <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <Button size="icon" variant="ghost" className="w-8 h-8"><Icon name={"Pencil" as any} size={16} /></Button>
                                            <Button size="icon" variant="ghost" className="w-8 h-8 text-state-danger hover:bg-state-danger/20"><Icon name={"Trash" as any} size={16} /></Button>
                                        </div>
                                    </div>
                                ))}

                                <Button variant="outline" className="border-dashed border-white/20 text-text-secondary hover:text-white mt-2">
                                    <Icon name={"Plus" as any} className="mr-2" size={18} />
                                    Add menu item
                                </Button>
                            </div>
                        </GlassPanel>
                    </div>

                    {/* Right Panel: Add/Edit Item Context */}
                    <GlassPanel className="p-6 h-fit sticky top-6">
                        <h3 className="font-bold text-white mb-4">Add Menu Item</h3>
                        <div className="flex flex-col gap-4">
                            <div>
                                <label className="text-xs text-text-secondary uppercase font-bold tracking-wider mb-2 block">Label</label>
                                <input className="w-full bg-white/5 border border-white/10 rounded-lg p-2 text-sm text-white focus:outline-none focus:border-primary" />
                            </div>
                            <div>
                                <label className="text-xs text-text-secondary uppercase font-bold tracking-wider mb-2 block">Link Type</label>
                                <select className="w-full bg-white/5 border border-white/10 rounded-lg p-2 text-sm text-white focus:outline-none focus:border-primary mb-2">
                                    <option>Page</option>
                                    <option>Collection</option>
                                    <option>Product</option>
                                    <option>External URL</option>
                                </select>
                                <input placeholder="Search pages..." className="w-full bg-white/5 border border-white/10 rounded-lg p-2 text-sm text-white focus:outline-none focus:border-primary" />
                            </div>
                            <div className="pt-4 border-t border-white/5 flex gap-2">
                                <Button className="flex-1">Add</Button>
                                <Button variant="ghost" className="flex-1">Cancel</Button>
                            </div>
                        </div>
                    </GlassPanel>
                </div>
            </div>
        </AdminShell>
    );
}
