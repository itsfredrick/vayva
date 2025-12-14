'use client';

import React from 'react';
import Link from 'next/link';
import { AdminShell } from '@/components/admin-shell';
import { GlassPanel } from '@/components/ui/glass-panel';
import { Button } from '@/components/ui/button';
import { Icon } from '@/components/ui/icon';
import { TrendChart } from '@/components/trend-chart';

function KPICard({ title, value, sub, trend, link }: { title: string, value: string, sub: string, trend?: { val: string, up: boolean }, link?: string }) {
    return (
        <component className={`block p-6 rounded-xl border border-white/5 bg-gradient-to-br from-white/5 to-transparent hover:border-white/10 transition-colors relative group ${link ? 'cursor-pointer' : ''}`}>
            {link && <Link href={link} className="absolute inset-0" />}
            <div className="text-text-secondary text-sm mb-2">{title}</div>
            <div className="text-2xl font-bold text-white mb-1">{value}</div>
            <div className="flex items-center justify-between">
                <div className="text-xs text-text-secondary">{sub}</div>
                {trend && (
                    <div className={`flex items-center text-xs font-bold ${trend.up ? 'text-state-success' : 'text-state-danger'}`}>
                        <Icon name={trend.up ? 'trending_up' : 'trending_down'} size={14} className="mr-1" />
                        {trend.val}
                    </div>
                )}
            </div>
        </component>
    );
}

export default function WhatsAppOverviewPage() {
    return (
        <AdminShell title="WhatsApp AI" breadcrumb="WhatsApp / Overview">
            <div className="flex flex-col gap-6 max-w-7xl mx-auto">
                {/* Top Status Hero */}
                <div className="flex flex-col md:flex-row items-center justify-between p-6 rounded-xl bg-gradient-to-r from-emerald-900/40 to-[#142210] border border-emerald-500/20 relative overflow-hidden">
                    <div className="relative z-10 flex items-center gap-4">
                        <div className="w-12 h-12 rounded-full bg-state-success/20 flex items-center justify-center text-state-success">
                            <Icon name="smart_toy" size={24} />
                        </div>
                        <div>
                            <h2 className="font-bold text-white text-lg flex items-center gap-2">
                                AI Agent Active
                                <span className="w-2 h-2 rounded-full bg-state-success animate-pulse" />
                            </h2>
                            <p className="text-sm text-emerald-100/60">+234 812 ••• ••• 45 • Responding to customers</p>
                        </div>
                    </div>
                    <div className="relative z-10 flex gap-3 mt-4 md:mt-0">
                        <Button variant="ghost" className="text-emerald-100 hover:text-white hover:bg-emerald-500/20">Manage Settings</Button>
                        <Button className="bg-emerald-500 hover:bg-emerald-400 text-black border-none" onClick={() => alert('Test message sent')}>Test Message</Button>
                    </div>

                    {/* Decorative bg */}
                    <Icon name="whatsapp" className="absolute -right-10 -top-10 text-emerald-500/10 text-[200px]" />
                </div>

                {/* KPI Row */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    <KPICard title="Conversations Today" value="142" sub="Active chats" trend={{ val: '+12%', up: true }} link="/admin/whatsapp/inbox" />
                    <KPICard title="Containment Rate" value="86%" sub="Resolved by AI" trend={{ val: '+4%', up: true }} />
                    <KPICard title="Avg Response Time" value="1.2s" sub="Instant replies" trend={{ val: '-0.3s', up: true }} />
                    <KPICard title="Sales Assisted" value="₦ 450k" sub="Generated via chat" trend={{ val: '+24%', up: true }} link="/admin/analytics/sales" />
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Left Col: Activity */}
                    <div className="lg:col-span-2 flex flex-col gap-6">
                        {/* Needs Approval */}
                        <GlassPanel className="p-0 overflow-hidden flex flex-col">
                            <div className="p-4 border-b border-white/5 flex justify-between items-center bg-white/5">
                                <h3 className="font-bold text-white flex items-center gap-2">
                                    Needs Your Approval
                                    <span className="px-1.5 py-0.5 rounded bg-state-warning/20 text-state-warning text-[10px]">3</span>
                                </h3>
                                <Link href="/admin/whatsapp/approvals" className="text-xs text-primary font-bold hover:underline">View all</Link>
                            </div>
                            <div className="divide-y divide-white/5">
                                {[
                                    { id: 1, type: 'Refund', user: 'Chidinma O.', amount: '₦ 12,500', time: '10m ago' },
                                    { id: 2, type: 'Delivery', user: 'Emeka J.', detail: 'Schedule Change', time: '25m ago' },
                                    { id: 3, type: 'Discount', user: 'Sarah K.', amount: '10% Off', time: '1h ago' },
                                ].map((item) => (
                                    <div key={item.id} className="p-4 flex items-center justify-between hover:bg-white/5 transition-colors group">
                                        <div className="flex items-center gap-4">
                                            <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center font-bold text-xs text-text-secondary">
                                                {item.user.charAt(0)}
                                            </div>
                                            <div>
                                                <div className="flex items-center gap-2">
                                                    <span className="font-bold text-white">{item.type} Request</span>
                                                    <span className="text-xs text-text-secondary">• {item.user}</span>
                                                </div>
                                                <div className="text-xs text-text-secondary">
                                                    {item.amount || item.detail} • <span className="text-state-warning">{item.time}</span>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <Button size="sm" variant="ghost" className="h-8">Review</Button>
                                            <Button size="sm" className="h-8 bg-white text-black border-none">Approve</Button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </GlassPanel>

                        {/* Recent Conversations */}
                        <GlassPanel className="p-0 overflow-hidden">
                            <div className="p-4 border-b border-white/5 flex justify-between items-center">
                                <h3 className="font-bold text-white">Recent Conversations</h3>
                                <Link href="/admin/whatsapp/inbox" className="text-xs text-primary font-bold hover:underline">Go to Inbox</Link>
                            </div>
                            <div className="divide-y divide-white/5">
                                {[
                                    { id: 1, user: 'Biodun A.', msg: 'Where is my order?', tag: 'New', time: '2m' },
                                    { id: 2, user: 'Fatima B.', msg: 'How much is delivery to Lagos?', tag: 'AI Reply', time: '5m' },
                                    { id: 3, user: 'John D.', msg: 'I want to speak to a human', tag: 'Escalated', time: '12m' },
                                    { id: 4, user: 'Grace E.', msg: 'Thanks for the help!', tag: 'Resolved', time: '1h' },
                                    { id: 5, user: 'Samuel K.', msg: 'Do you have size 45?', tag: 'AI Reply', time: '2h' },
                                ].map((chat) => (
                                    <div key={chat.id} className="p-4 flex items-center justify-between hover:bg-white/5 transition-colors cursor-pointer">
                                        <div className="flex items-center gap-4">
                                            <div className="w-8 h-8 rounded-full bg-indigo-500/20 flex items-center justify-center text-xs font-bold text-indigo-300">
                                                {chat.user.charAt(0)}
                                            </div>
                                            <div>
                                                <div className="font-bold text-white text-sm">{chat.user}</div>
                                                <div className="text-xs text-text-secondary truncate max-w-[200px]">{chat.msg}</div>
                                            </div>
                                        </div>
                                        <div className="flex flex-col items-end gap-1">
                                            <span className="text-[10px] text-text-secondary">{chat.time} ago</span>
                                            <span className={`px-1.5 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider 
                                                ${chat.tag === 'New' ? 'bg-blue-500/20 text-blue-400' : ''}
                                                ${chat.tag === 'Escalated' ? 'bg-state-danger/20 text-state-danger' : ''}
                                                ${chat.tag === 'AI Reply' ? 'bg-emerald-500/10 text-emerald-400' : ''}
                                                ${chat.tag === 'Resolved' ? 'bg-white/10 text-text-secondary' : ''}
                                             `}>
                                                {chat.tag}
                                            </span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </GlassPanel>
                    </div>

                    {/* Right Col: Knowledge Base Health */}
                    <div className="flex flex-col gap-6">
                        <GlassPanel className="p-6">
                            <div className="flex items-center gap-3 mb-4">
                                <div className="p-2 rounded bg-purple-500/20 text-purple-400">
                                    <Icon name="library_books" />
                                </div>
                                <h3 className="font-bold text-white">Knowledge Base</h3>
                            </div>
                            <p className="text-sm text-text-secondary mb-6">Your AI uses these sources to answer customer questions accurately.</p>

                            <div className="space-y-4 mb-6">
                                <div className="flex justify-between items-center text-sm">
                                    <span className="text-white">FAQs</span>
                                    <span className="font-bold text-white">24 active</span>
                                </div>
                                <div className="flex justify-between items-center text-sm">
                                    <span className="text-white">Store Policies</span>
                                    <span className="font-bold text-state-success flex items-center gap-1"><Icon name="check" size={14} /> Set</span>
                                </div>
                                <div className="flex justify-between items-center text-sm">
                                    <span className="text-white">Product Guidance</span>
                                    <span className="font-bold text-state-warning flex items-center gap-1"><Icon name="priority_high" size={14} /> Review</span>
                                </div>
                            </div>

                            <Button className="w-full bg-white/10 hover:bg-white/20 text-white border-none">Edit Knowledge Base</Button>
                        </GlassPanel>

                        <GlassPanel className="p-6 bg-gradient-to-br from-indigo-900/20 to-transparent border-indigo-500/10">
                            <div className="mb-4">
                                <h3 className="font-bold text-white">Smart Suggestions</h3>
                                <p className="text-xs text-text-secondary mt-1">Based on recent conversations</p>
                            </div>
                            <ul className="space-y-3">
                                <li className="text-sm text-white flex gap-2">
                                    <Icon name="lightbulb" size={16} className="text-yellow-400 shrink-0 mt-0.5" />
                                    <span>Add "Delivery to Abuja" to FAQs (asked 12 times today)</span>
                                </li>
                                <li className="text-sm text-white flex gap-2">
                                    <Icon name="lightbulb" size={16} className="text-yellow-400 shrink-0 mt-0.5" />
                                    <span>Clarify "Return Policy" for damaged items.</span>
                                </li>
                            </ul>
                        </GlassPanel>
                    </div>
                </div>
            </div>
        </AdminShell>
    );
}
