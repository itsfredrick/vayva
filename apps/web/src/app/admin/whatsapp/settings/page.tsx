'use client';

import React, { useState } from 'react';
import { AdminShell } from '@/components/admin-shell';
import { GlassPanel } from '@/components/ui/glass-panel';
import { Button } from '@/components/ui/button';
import { Icon } from '@/components/ui/icon';

type BusinessHours = {
    day: string;
    enabled: boolean;
    start: string;
    end: string;
};

export default function WhatsAppSettingsPage() {
    const [isDirty, setIsDirty] = useState(false);
    const [agentEnabled, setAgentEnabled] = useState(true);
    const [connected, setConnected] = useState(true);
    const [tone, setTone] = useState<'Professional' | 'Friendly' | 'Playful'>('Friendly');
    const [useEmojis, setUseEmojis] = useState(false);
    const [approvals, setApprovals] = useState({
        delivery: true,
        discounts: true,
        refunds: true,
        delivered: false,
    });

    // Default Schedule
    const [schedule, setSchedule] = useState<BusinessHours[]>([
        { day: 'Mon', enabled: true, start: '09:00', end: '17:00' },
        { day: 'Tue', enabled: true, start: '09:00', end: '17:00' },
        { day: 'Wed', enabled: true, start: '09:00', end: '17:00' },
        { day: 'Thu', enabled: true, start: '09:00', end: '17:00' },
        { day: 'Fri', enabled: true, start: '09:00', end: '17:00' },
        { day: 'Sat', enabled: false, start: '10:00', end: '14:00' },
        { day: 'Sun', enabled: false, start: '10:00', end: '14:00' },
    ]);

    const handleSave = () => {
        setIsDirty(false);
        // Simulate save
    };

    const handleChange = () => {
        setIsDirty(true);
    };

    return (
        <AdminShell title="WhatsApp AI Settings" breadcrumb="WhatsApp / Settings">
            <div className="max-w-4xl mx-auto space-y-6 pb-24">

                {/* 1. Agent Status */}
                <GlassPanel className="p-6">
                    <div className="flex items-center justify-between mb-6">
                        <div className="flex items-center gap-3">
                            <div className={`w-10 h-10 rounded-full flex items-center justify-center ${agentEnabled ? 'bg-state-success/20 text-state-success' : 'bg-white/5 text-text-secondary'}`}>
                                <Icon name="smart_toy" size={24} />
                            </div>
                            <div>
                                <h2 className="font-bold text-white text-lg">AI Agent Status</h2>
                                <p className="text-sm text-text-secondary">Control whether the AI automatically replies to customers.</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-3">
                            <span className={`text-sm font-bold ${agentEnabled ? 'text-state-success' : 'text-text-secondary'}`}>
                                {agentEnabled ? 'Enabled' : 'Paused'}
                            </span>
                            <input
                                type="checkbox"
                                className="toggle toggle-success toggle-lg"
                                checked={agentEnabled}
                                onChange={(e) => {
                                    if (!e.target.checked && !confirm('Are you sure you want to pause AI replies?')) return;
                                    setAgentEnabled(e.target.checked);
                                    handleChange();
                                }}
                            />
                        </div>
                    </div>

                    <div className="p-4 bg-white/5 border border-white/5 rounded-xl flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            {connected ? (
                                <>
                                    <div className="w-2 h-2 rounded-full bg-state-success animate-pulse" />
                                    <div>
                                        <div className="text-sm text-text-secondary uppercase font-bold tracking-wider mb-0.5">Connected Number</div>
                                        <div className="text-white font-mono font-bold">+234 812 ••• ••• 45</div>
                                    </div>
                                </>
                            ) : (
                                <div className="flex items-center gap-2 text-state-warning">
                                    <Icon name="warning" />
                                    <span className="font-bold">WhatsApp not connected</span>
                                </div>
                            )}
                        </div>
                        <div className="flex items-center gap-3">
                            <Button size="sm" variant="ghost" className="text-white hover:text-white hover:bg-white/10">Change</Button>
                            {connected && <Button size="sm" variant="outline" onClick={() => alert('Test message sent!')}>Send test message</Button>}
                            {!connected && <Button size="sm" className="bg-state-success hover:bg-state-success/80 text-black border-none">Connect WhatsApp</Button>}
                        </div>
                    </div>
                </GlassPanel>

                {/* 2. Identity & Tone */}
                <GlassPanel className="p-6">
                    <h2 className="font-bold text-white text-lg mb-6">Identity & Tone</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="space-y-6">
                            <div>
                                <label className="text-xs text-text-secondary uppercase font-bold tracking-wider mb-2 block">Respond as</label>
                                <input
                                    className="w-full bg-white/5 border border-white/10 rounded-full px-4 py-2 text-sm text-white focus:outline-none focus:border-primary"
                                    defaultValue="Vayva Assistant"
                                    onChange={handleChange}
                                />
                            </div>
                            <div>
                                <label className="text-xs text-text-secondary uppercase font-bold tracking-wider mb-2 block">Tone</label>
                                <div className="bg-white/5 p-1 rounded-full inline-flex border border-white/5">
                                    {(['Professional', 'Friendly', 'Playful'] as const).map((t) => (
                                        <button
                                            key={t}
                                            onClick={() => { setTone(t); handleChange(); }}
                                            className={`px-4 py-1.5 rounded-full text-xs font-bold transition-colors ${tone === t ? 'bg-primary text-black' : 'text-text-secondary hover:text-white'}`}
                                        >
                                            {t}
                                        </button>
                                    ))}
                                </div>
                            </div>
                            <div className="flex items-center gap-3">
                                <input
                                    type="checkbox"
                                    className="toggle toggle-primary toggle-sm"
                                    checked={useEmojis}
                                    onChange={(e) => { setUseEmojis(e.target.checked); handleChange(); }}
                                />
                                <span className="text-sm text-white">Use emojis in responses</span>
                            </div>
                        </div>

                        {/* Preview */}
                        <div className="bg-[#0b141a] rounded-xl border border-white/10 p-4 relative overflow-hidden flex flex-col justify-center">
                            <div className="absolute inset-0 bg-[url('https://user-images.githubusercontent.com/1500684/233226343-6dfc1266-9c96-444e-b5c6-946401087e35.png')] opacity-10 bg-repeat" />
                            <div className="relative z-10 self-start max-w-[90%] bg-[#202c33] p-3 rounded-lg rounded-tl-none shadow-sm mb-2">
                                <p className="text-sm text-white/90">Do you have this in size M?</p>
                                <span className="text-[10px] text-white/40 block text-right mt-1">10:42 AM</span>
                            </div>
                            <div className="relative z-10 self-end max-w-[90%] bg-[#005c4b] p-3 rounded-lg rounded-tr-none shadow-sm">
                                <p className="text-sm text-white/90">
                                    {tone === 'Professional' && "Yes, we currently have the Black T-Shirt in Medium size available in stock."}
                                    {tone === 'Friendly' && "Yes! We do have the Black T-Shirt in size Medium available right now."}
                                    {tone === 'Playful' && "You're in luck! 🎉 We totally have the Black T-Shirt in Medium waiting for you!"}
                                    {useEmojis && " 👕✨"}
                                </p>
                                <span className="text-[10px] text-white/40 block text-right mt-1">10:42 AM</span>
                            </div>
                        </div>
                    </div>
                </GlassPanel>

                {/* 3. Approvals (Safety Gates) */}
                <GlassPanel className="p-6">
                    <div className="flex items-center gap-3 mb-6">
                        <h2 className="font-bold text-white text-lg">Safety Gates & Approvals</h2>
                        <span className="px-2 py-0.5 bg-blue-500/10 text-blue-400 text-[10px] uppercase font-bold rounded tracking-wider border border-blue-500/20">Recommended</span>
                    </div>
                    <div className="p-4 bg-blue-500/5 border border-blue-500/10 rounded-xl mb-6 flex gap-3">
                        <Icon name="shield" className="text-blue-400 shrink-0" />
                        <p className="text-sm text-blue-100/80">Approvals prevent the AI from making irreversible decisions or financial mistakes. We recommend keeping these enabled.</p>
                    </div>

                    <div className="space-y-4">
                        {[
                            { id: 'delivery', label: 'Delivery scheduling requires approval', locked: false },
                            { id: 'discounts', label: 'Discounts require approval', locked: false },
                            { id: 'refunds', label: 'Refunds require approval', locked: true, note: 'Required for safety' },
                            { id: 'delivered', label: 'Mark order as delivered requires approval', locked: false, note: 'Optional' },
                        ].map((item: any) => (
                            <div key={item.id} className="flex items-center justify-between p-3 bg-white/5 rounded-lg border border-white/5">
                                <div className="flex flex-col">
                                    <span className={`text-sm font-bold ${item.locked ? 'text-white/50' : 'text-white'}`}>{item.label}</span>
                                    {item.note && <span className="text-xs text-text-secondary">{item.note}</span>}
                                </div>
                                <input
                                    type="checkbox"
                                    className={`toggle ${item.locked ? 'toggle-disabled' : 'toggle-primary'}`}
                                    checked={approvals[item.id as keyof typeof approvals]}
                                    disabled={item.locked}
                                    onChange={(e) => {
                                        if (item.locked) return;
                                        setApprovals({ ...approvals, [item.id]: e.target.checked });
                                        handleChange();
                                    }}
                                />
                            </div>
                        ))}
                    </div>
                </GlassPanel>

                {/* 4. Business Hours */}
                <GlassPanel className="p-6">
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="font-bold text-white text-lg">Business Hours</h2>
                        <div className="flex items-center gap-2">
                            <input type="checkbox" className="checkbox checkbox-xs border-white/20" defaultChecked />
                            <span className="text-xs text-white">Allow urgent escalations after hours</span>
                        </div>
                    </div>

                    <div className="space-y-2">
                        {schedule.map((day, i) => (
                            <div key={day.day} className="flex items-center gap-4">
                                <div className="w-12 text-sm font-bold text-white">{day.day}</div>
                                <input
                                    type="checkbox"
                                    className="toggle toggle-xs toggle-neutral"
                                    checked={day.enabled}
                                    onChange={(e) => {
                                        const newSchedule = [...schedule];
                                        newSchedule[i].enabled = e.target.checked;
                                        setSchedule(newSchedule);
                                        handleChange();
                                    }}
                                />
                                <div className={`flex items-center gap-2 ${!day.enabled ? 'opacity-30 pointer-events-none' : ''}`}>
                                    <input
                                        type="time"
                                        className="bg-white/5 border border-white/10 rounded px-2 py-1 text-xs text-white"
                                        defaultValue={day.start}
                                        onChange={handleChange}
                                    />
                                    <span className="text-text-secondary text-xs">to</span>
                                    <input
                                        type="time"
                                        className="bg-white/5 border border-white/10 rounded px-2 py-1 text-xs text-white"
                                        defaultValue={day.end}
                                        onChange={handleChange}
                                    />
                                </div>
                                {!day.enabled && <span className="text-xs text-text-secondary italic">Closed</span>}
                            </div>
                        ))}
                    </div>

                    <div className="mt-6 pt-6 border-t border-white/5">
                        <label className="text-xs text-text-secondary uppercase font-bold tracking-wider mb-2 block">After-hours behavior</label>
                        <div className="flex gap-4">
                            <label className="flex items-center gap-2 cursor-pointer">
                                <input type="radio" name="afterHours" className="radio radio-primary radio-sm" defaultChecked onChange={handleChange} />
                                <span className="text-sm text-white">Collect details + promise callback</span>
                            </label>
                            <label className="flex items-center gap-2 cursor-pointer">
                                <input type="radio" name="afterHours" className="radio radio-primary radio-sm" onChange={handleChange} />
                                <span className="text-sm text-white">Auto-reply: "We'll respond tomorrow"</span>
                            </label>
                        </div>
                    </div>
                </GlassPanel>

                {/* 5. Escalation Rules */}
                <GlassPanel className="p-6">
                    <h2 className="font-bold text-white text-lg mb-6">Escalation Rules</h2>
                    <div className="space-y-6">
                        <div className="flex items-center justify-between p-4 bg-white/5 rounded-lg">
                            <div>
                                <span className="font-bold text-white block">Always allow "Talk to a human"</span>
                                <span className="text-xs text-text-secondary">If a customer asks for a human, immediately escalate.</span>
                            </div>
                            <input type="checkbox" className="toggle toggle-primary" defaultChecked onChange={handleChange} />
                        </div>

                        <div>
                            <label className="text-xs text-text-secondary uppercase font-bold tracking-wider mb-2 block">Keyword Triggers</label>
                            <div className="p-2 border border-white/10 rounded-lg bg-white/5 flex flex-wrap gap-2">
                                {['refund', 'scam', 'police', 'chargeback', 'angry', 'complaint'].map(keyword => (
                                    <span key={keyword} className="px-2 py-1 rounded bg-white/10 text-white text-xs font-bold flex items-center gap-1 group">
                                        {keyword}
                                        <button className="text-white/50 hover:text-white"><Icon name="close" size={12} /></button>
                                    </span>
                                ))}
                                <input
                                    className="bg-transparent text-sm text-white focus:outline-none min-w-[100px] my-1 ml-1"
                                    placeholder="Add keyword..."
                                />
                            </div>
                            <p className="text-[10px] text-text-secondary mt-1">Conversations containing these words will be flagged for review.</p>
                        </div>

                        <div className="grid grid-cols-2 gap-6">
                            <div>
                                <label className="text-xs text-text-secondary uppercase font-bold tracking-wider mb-2 block">Escalation Destination</label>
                                <select className="w-full bg-white/5 border border-white/10 rounded-lg p-2 text-sm text-white focus:outline-none focus:border-primary" onChange={handleChange}>
                                    <option>Inbox only (Unassigned)</option>
                                    <option>Assign to Support Lead</option>
                                    <option>Assign to Manager</option>
                                </select>
                            </div>
                            <div>
                                <label className="text-xs text-text-secondary uppercase font-bold tracking-wider mb-2 block">Data Retention</label>
                                <select className="w-full bg-white/5 border border-white/10 rounded-lg p-2 text-sm text-white focus:outline-none focus:border-primary" onChange={handleChange} defaultValue="30">
                                    <option value="7">7 Days</option>
                                    <option value="30">30 Days</option>
                                    <option value="90">90 Days</option>
                                </select>
                                <span className="text-[10px] text-text-secondary mt-1">Retains chat content for support and auditing.</span>
                            </div>

                        </div>
                    </div>
                </GlassPanel>

                {/* Sticky Save Bar */}
                <div className={`fixed bottom-0 left-0 right-0 p-4 bg-[#142210]/95 border-t border-white/10 backdrop-blur-md z-50 flex items-center justify-between transition-transform duration-300 ${isDirty ? 'translate-y-0' : 'translate-y-full'}`}>
                    <div className="max-w-4xl mx-auto w-full flex items-center justify-between px-4">
                        <span className="text-sm text-white">You have unsaved changes</span>
                        <div className="flex gap-3">
                            <Button variant="ghost" className="text-white hover:bg-white/10" onClick={() => setIsDirty(false)}>Discard</Button>
                            <Button className="bg-primary hover:bg-primary/90 text-black border-none" onClick={handleSave}>Save Changes</Button>
                        </div>
                    </div>
                </div>

            </div>
        </AdminShell>
    );
}
