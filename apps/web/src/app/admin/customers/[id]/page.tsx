'use client';

import React, { useState } from 'react';
import { useParams } from 'next/navigation';
import { AdminShell } from '@/components/admin-shell';
import { GlassPanel } from '@/components/ui/glass-panel';
import { Button } from '@/components/ui/button';
import { Icon } from '@/components/ui/icon';
import { StatusBadge } from '@/components/ui/status-badge';

export default function CustomerProfilePage() {
    const params = useParams();
    const id = params.id as string;
    const [isNoteModalOpen, setIsNoteModalOpen] = useState(false);

    // Mock Data
    const customer = {
        id,
        name: 'Chinedu Okafor',
        since: 'Dec 2024',
        status: 'High Value',
        email: 'chinedu@example.com',
        phone: '+234 801 234 5678',
        address: '12 Admiralty Way, Lekki Phase 1, Lagos',
        stats: { orders: 8, spend: '₦ 320,500' },
        orders: [
            { id: 'VV-1024', date: 'Today', total: '₦ 51,500', payment: 'paid', fulfillment: 'processing' },
            { id: 'VV-1010', date: '2 days ago', total: '₦ 12,000', payment: 'paid', fulfillment: 'delivered' },
        ],
        notes: [
            { id: 1, author: 'You', date: 'Just now', text: 'Prefers delivery after 5pm.', tags: ['Delivery issue'] }
        ]
    };

    return (
        <AdminShell title={`Customer Profile`} breadcrumb={`Customers / ${customer.name}`}>
            <div className="flex flex-col gap-6 max-w-6xl mx-auto">
                {/* Header */}
                <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                    <div>
                        <h1 className="text-2xl font-bold text-white mb-1">{customer.name}</h1>
                        <div className="flex items-center gap-2 text-sm text-text-secondary">
                            <span>Customer since {customer.since}</span>
                            <span className="w-1 h-1 rounded-full bg-white/20" />
                            <span className="text-primary font-bold text-xs uppercase tracking-wider">{customer.status}</span>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* LEFT COLUMN */}
                    <div className="lg:col-span-2 flex flex-col gap-6">
                        {/* 1. Overview */}
                        <GlassPanel className="p-6">
                            <div className="flex items-start justify-between mb-6">
                                <div className="flex gap-4">
                                    <div className="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold text-2xl">
                                        {customer.name.charAt(0)}
                                    </div>
                                    <div className="space-y-1">
                                        <div className="flex items-center gap-2">
                                            <Icon name="call" size={16} className="text-text-secondary" />
                                            <span className="text-white text-sm">{customer.phone}</span>
                                            <button className="text-xs text-primary hover:underline">Copy</button>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <Icon name="email" size={16} className="text-text-secondary" />
                                            <span className="text-white text-sm">{customer.email}</span>
                                        </div>
                                        <div className="flex items-start gap-2 pt-1">
                                            <Icon name="location_on" size={16} className="text-text-secondary mt-0.5" />
                                            <span className="text-white text-sm max-w-xs">{customer.address}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="flex gap-2 pt-4 border-t border-white/5">
                                <Button variant="outline" size="sm" className="flex-1 text-xs">
                                    <Icon name="chat" size={16} className="mr-2" />
                                    View WhatsApp
                                </Button>
                                <Button variant="outline" size="sm" className="flex-1 text-xs">
                                    <Icon name="receipt_long" size={16} className="mr-2" />
                                    Copy Checkout Link
                                </Button>
                            </div>
                        </GlassPanel>

                        {/* 2. Order History */}
                        <GlassPanel className="overflow-hidden">
                            <div className="p-6 border-b border-white/5 flex justify-between items-center">
                                <h3 className="font-bold text-white">Order History</h3>
                                <div className="text-xs text-text-secondary font-mono">
                                    Total: {customer.stats.spend} ({customer.stats.orders} orders)
                                </div>
                            </div>
                            <div className="overflow-x-auto">
                                <table className="w-full text-left text-sm">
                                    <thead className="bg-white/5 text-text-secondary uppercase text-xs font-bold border-b border-white/5">
                                        <tr>
                                            <th className="p-4">Order</th>
                                            <th className="p-4">Date</th>
                                            <th className="p-4">Total</th>
                                            <th className="p-4">Payment</th>
                                            <th className="p-4">Fulfillment</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-white/5">
                                        {customer.orders.map((order) => (
                                            <tr key={order.id} className="group hover:bg-white/5 transition-colors cursor-pointer">
                                                <td className="p-4 font-bold text-white">{order.id}</td>
                                                <td className="p-4 text-text-secondary">{order.date}</td>
                                                <td className="p-4 font-mono text-white">{order.total}</td>
                                                <td className="p-4"><StatusBadge status={order.payment} /></td>
                                                <td className="p-4"><StatusBadge status={order.fulfillment} /></td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </GlassPanel>

                        {/* 3. Insights (v1 Placeholder) */}
                        <GlassPanel className="p-6">
                            <h3 className="font-bold text-white mb-2">Insights</h3>
                            <p className="text-sm text-text-secondary">More insights will appear here as this customer places more orders.</p>
                        </GlassPanel>
                    </div>

                    {/* RIGHT COLUMN */}
                    <div className="flex flex-col gap-6">
                        {/* Notes */}
                        <GlassPanel className="p-6 relative">
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="font-bold text-white">Internal Notes</h3>
                                <Button size="sm" variant="secondary" className="h-7 text-xs bg-white/10 text-white" onClick={() => setIsNoteModalOpen(true)}>Add Note</Button>
                            </div>
                            <div className="space-y-4">
                                {customer.notes.map(note => (
                                    <div key={note.id} className="p-4 rounded-xl bg-white/5 border border-white/5">
                                        <p className="text-sm text-white mb-2">{note.text}</p>
                                        <div className="flex items-center justify-between">
                                            <div className="flex gap-1">
                                                {note.tags.map(t => (
                                                    <span key={t} className="px-1.5 py-0.5 rounded text-[10px] uppercase font-bold bg-white/10 text-text-secondary">{t}</span>
                                                ))}
                                            </div>
                                            <span className="text-[10px] text-white/30">{note.author} • {note.date}</span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </GlassPanel>

                        {/* Communication */}
                        <GlassPanel className="p-6">
                            <h3 className="font-bold text-white mb-4">Communication</h3>
                            <div className="p-4 rounded-xl bg-white/5 border border-white/5 mb-4">
                                <p className="text-xs text-text-secondary mb-1">Last message via WhatsApp</p>
                                <p className="text-sm text-white italic">"Is the black one available in size 43?"</p>
                            </div>
                            <Button className="w-full text-xs" variant="outline">Open in WhatsApp AI Inkbox</Button>
                        </GlassPanel>
                    </div>
                </div>

                {/* Note Modal */}
                {isNoteModalOpen && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in">
                        <div className="w-full max-w-md bg-[#1a2c1e]/90 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl p-6 relative animate-in zoom-in-95 duration-200">
                            <h3 className="text-lg font-bold text-white mb-1">Add internal note</h3>
                            <p className="text-sm text-text-secondary mb-4">Visible only to your team</p>

                            <div className="space-y-4">
                                <textarea
                                    className="w-full bg-black/20 border border-white/10 rounded-xl p-3 text-sm text-white resize-none focus:outline-none focus:border-primary transition-colors min-h-[120px]"
                                    placeholder="e.g. Prefers delivery after 5pm..."
                                ></textarea>

                                <div>
                                    <p className="text-xs text-text-secondary uppercase font-bold tracking-wider mb-2">Quick Tags</p>
                                    <div className="flex flex-wrap gap-2">
                                        {['VIP', 'Delivery Issue', 'Refund History'].map(tag => (
                                            <button key={tag} className="px-2 py-1 rounded-md bg-white/5 border border-white/5 text-xs text-text-secondary hover:bg-white/10 hover:text-white transition-colors">
                                                {tag}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            <div className="flex gap-3 mt-6 pt-4 border-t border-white/5">
                                <Button className="flex-1" onClick={() => setIsNoteModalOpen(false)}>Save Note</Button>
                                <Button variant="ghost" className="flex-1" onClick={() => setIsNoteModalOpen(false)}>Cancel</Button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </AdminShell>
    );
}
