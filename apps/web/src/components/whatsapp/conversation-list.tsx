import React from 'react';
import Link from 'next/link';
import { Icon } from '@/components/ui/icon';

type Conversation = {
    id: string;
    user: string;
    avatarVal: string;
    lastMsg: string;
    time: string;
    tags: string[];
    unread?: boolean;
    active?: boolean;
};

export function ConversationList({ items, activeId }: { items: Conversation[], activeId?: string }) {
    return (
        <div className="flex flex-col h-full bg-white/5 border-r border-white/5">
            {/* Toolbar */}
            <div className="p-4 border-b border-white/5 space-y-3">
                <div className="relative">
                    <Icon name="search" size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-secondary" />
                    <input
                        className="w-full bg-white/5 border border-white/5 rounded-full pl-9 pr-4 py-2 text-sm text-white focus:outline-none focus:border-primary placeholder:text-text-secondary/50"
                        placeholder="Search conversations..."
                    />
                </div>
                <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
                    {['All', 'New', 'Escalated', 'Pending'].map((filter, i) => (
                        <button key={filter} className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider whitespace-nowrap ${i === 0 ? 'bg-white text-black' : 'bg-white/5 text-text-secondary hover:bg-white/10'}`}>
                            {filter}
                        </button>
                    ))}
                </div>
            </div>

            {/* List */}
            <div className="flex-1 overflow-y-auto">
                {items.map((item) => {
                    const isActive = item.id === activeId;
                    return (
                        <Link key={item.id} href={`/admin/whatsapp/inbox/${item.id}`}>
                            <div className={`p-4 border-b border-white/5 hover:bg-white/5 transition-colors cursor-pointer ${isActive ? 'bg-white/5 border-l-2 border-l-primary' : 'border-l-2 border-l-transparent'}`}>
                                <div className="flex justify-between items-start mb-1">
                                    <div className="flex items-center gap-3">
                                        <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm ${isActive ? 'bg-primary text-black' : 'bg-white/10 text-text-secondary'}`}>
                                            {item.avatarVal}
                                        </div>
                                        <div>
                                            <div className={`text-sm font-bold ${isActive ? 'text-white' : item.unread ? 'text-white' : 'text-text-secondary'}`}>{item.user}</div>
                                            {item.tags.length > 0 && (
                                                <div className="flex gap-1 mt-0.5">
                                                    {item.tags.map(tag => (
                                                        <span key={tag} className={`text-[9px] px-1 rounded uppercase font-bold tracking-wider 
                                                            ${tag === 'New' ? 'bg-blue-500/20 text-blue-400' : ''}
                                                            ${tag === 'Escalated' ? 'bg-state-danger/20 text-state-danger' : ''}
                                                            ${tag === 'Pending' ? 'bg-state-warning/20 text-state-warning' : ''}
                                                        `}>
                                                            {tag}
                                                        </span>
                                                    ))}
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                    <span className="text-[10px] text-text-secondary">{item.time}</span>
                                </div>
                                <div className={`text-xs pl-[52px] truncate ${item.unread ? 'text-white font-medium' : 'text-text-secondary'}`}>
                                    {item.lastMsg}
                                </div>
                            </div>
                        </Link>
                    );
                })}
            </div>
        </div>
    );
}
