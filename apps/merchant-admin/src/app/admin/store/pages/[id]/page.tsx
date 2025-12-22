'use client';

import React, { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { AppShell , GlassPanel , Button , Icon, IconName } from '@vayva/ui';

const BLOCKS: { id: string; name: string; icon: IconName }[] = [
    { id: 'heading', name: 'Heading', icon: 'Heading' },
    { id: 'text', name: 'Text Block', icon: 'FileText' },
    { id: 'image', name: 'Image', icon: 'Image' },
    { id: 'accordion', name: 'FAQ / Accordion', icon: 'ChevronDown' },
    { id: 'contact', name: 'Contact Form', icon: 'Mail' },
];

export default function PageEditor() {
    const params = useParams();
    const router = useRouter();
    const isNew = params.id === 'new';

    // Mock State
    const [title, setTitle] = useState(isNew ? '' : 'About Us');
    const [blocks, setBlocks] = useState([
        { id: 1, type: 'heading', content: 'Our Story' },
        { id: 2, type: 'text', content: 'We started in 2024...' }
    ]);

    return (
        <div className="flex flex-col h-screen bg-[#142210] text-white overflow-hidden">
            {/* Sticky Header */}
            <div className="h-16 border-b border-white/5 bg-[#142210]/50 backdrop-blur-xl flex items-center justify-between px-4 z-50">
                <div className="flex items-center gap-4">
                    <Button variant="ghost" size="icon" onClick={() => router.back()}>
                        <Icon name="ArrowLeft" />
                    </Button>
                    <span className="font-bold text-lg">{isNew ? 'Create Page' : `Edit Page: ${title}`}</span>
                    <span className="px-2 py-0.5 rounded bg-white/10 text-xs font-bold uppercase tracking-wider text-text-secondary">Draft</span>
                </div>
                <div className="flex items-center gap-2">
                    <Button variant="ghost" size="sm">
                        <Icon name="Eye" size={18} className="mr-2" />
                        Preview
                    </Button>
                    <Button size="sm">Save Page</Button>
                </div>
            </div>

            {/* Main Editor */}
            <div className="flex-1 flex overflow-hidden">
                {/* Left: Block Canvas */}
                <div className="flex-1 bg-black/20 p-8 overflow-y-auto flex justify-center">
                    <div className="w-full max-w-2xl flex flex-col gap-4">
                        {/* Page Title Field */}
                        <input
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            placeholder="Page Title"
                            className="bg-transparent text-4xl font-bold text-white placeholder:text-white/20 focus:outline-none mb-4"
                        />

                        {/* Blocks */}
                        {blocks.map((block) => (
                            <div key={block.id} className="bg-[#142210] border border-white/10 rounded-xl overflow-hidden group hover:border-white/30 transition-colors">
                                <div className="bg-white/5 px-4 py-2 flex items-center justify-between border-b border-white/5">
                                    <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-text-secondary">
                                        <Icon name="GripVertical" size={16} className="cursor-grab" />
                                        {block.type}
                                    </div>
                                    <button className="text-text-secondary hover:text-state-danger transition-colors">
                                        <Icon name="Trash" size={16} />
                                    </button>
                                </div>
                                <div className="p-4">
                                    {block.type === 'heading' && <input className="w-full bg-transparent font-bold text-xl focus:outline-none" defaultValue={block.content} />}
                                    {block.type === 'text' && <textarea className="w-full bg-transparent resize-none focus:outline-none min-h-[100px]" defaultValue={block.content} />}
                                </div>
                            </div>
                        ))}

                        {/* Add Block */}
                        <div className="border-2 border-dashed border-white/10 rounded-xl p-6 text-center hover:bg-white/5 transition-colors cursor-pointer">
                            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
                                {BLOCKS.map(b => (
                                    <div key={b.id} className="flex flex-col items-center gap-2 group" onClick={() => setBlocks([...blocks, { id: Date.now(), type: b.id, content: '' }])}>
                                        <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center group-hover:bg-primary group-hover:text-black transition-colors">
                                            <Icon name={b.icon} size={20} />
                                        </div>
                                        <span className="text-xs text-text-secondary font-bold">{b.name}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right: Settings */}
                <div className="w-[320px] bg-[#142210] border-l border-white/5 flex flex-col">
                    <div className="p-4 border-b border-white/5">
                        <h3 className="font-bold text-white">Page Settings</h3>
                    </div>
                    <div className="p-4 space-y-6 overflow-y-auto">
                        <div>
                            <label className="text-xs text-text-secondary uppercase font-bold tracking-wider mb-2 block">URL Slug</label>
                            <div className="flex items-center bg-white/5 border border-white/10 rounded-lg px-3 py-2">
                                <span className="text-text-secondary text-sm">/pages/</span>
                                <input
                                    className="bg-transparent border-none outline-none text-white text-sm w-full ml-1"
                                    value={isNew ? title.toLowerCase().replace(/\s+/g, '-') : 'about-us'}
                                    readOnly
                                />
                            </div>
                        </div>

                        <div>
                            <label className="text-xs text-text-secondary uppercase font-bold tracking-wider mb-2 block">SEO</label>
                            <div className="space-y-3">
                                <input className="w-full bg-white/5 border border-white/10 rounded-lg p-2 text-sm text-white focus:outline-none focus:border-primary" placeholder="Meta Title" />
                                <textarea className="w-full bg-white/5 border border-white/10 rounded-lg p-2 text-sm text-white focus:outline-none focus:border-primary min-h-[80px]" placeholder="Meta Description" />
                            </div>
                        </div>

                        <div>
                            <label className="text-xs text-text-secondary uppercase font-bold tracking-wider mb-2 block">Visibility</label>
                            <div className="space-y-2">
                                <label className="flex items-center gap-2 cursor-pointer group">
                                    <input type="checkbox" className="w-4 h-4 rounded border-white/20 bg-white/5 checked:bg-primary" />
                                    <span className="text-sm text-white group-hover:text-primary transition-colors">Visible</span>
                                </label>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
