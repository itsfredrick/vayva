'use client';

import React, { useState } from 'react';
import { AdminShell } from '@/components/admin-shell';
import { GlassPanel } from '@/components/ui/glass-panel';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Icon } from '@/components/ui/icon';

type StaffMember = {
    id: string;
    name: string;
    email: string;
    phone: string;
    role: 'Owner' | 'Admin' | 'Staff';
    status: 'Active' | 'Invited' | 'Suspended';
    lastActive: string;
};

const MOCK_STAFF: StaffMember[] = [
    { id: '1', name: 'John Doe', email: 'john@store.com', phone: '08123456789', role: 'Owner', status: 'Active', lastActive: '2 mins ago' },
    { id: '2', name: 'Sarah Smith', email: 'sarah@store.com', phone: '08098765432', role: 'Staff', status: 'Active', lastActive: '1 hr ago' },
    { id: '3', name: 'Mike Johnson', email: 'mike@store.com', phone: '07012345678', role: 'Admin', status: 'Invited', lastActive: '-' },
];

export default function StaffSettingsPage() {
    const [selectedMember, setSelectedMember] = useState<StaffMember | null>(null);
    const [isInviteOpen, setIsInviteOpen] = useState(false);

    // Invite Form State
    const [inviteEmail, setInviteEmail] = useState('');
    const [inviteRole, setInviteRole] = useState('Staff');
    const [isInviting, setIsInviting] = useState(false);

    const handleInvite = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsInviting(true);
        setTimeout(() => {
            setIsInviting(false);
            setIsInviteOpen(false);
            setInviteEmail('');
            alert('Invite sent!');
        }, 1500);
    };

    return (
        <AdminShell breadcrumb="Settings / Staff" title="Staff & Roles">
            <div className="max-w-6xl mx-auto">

                {/* Toolbar */}
                <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-6">
                    <div className="relative w-full md:w-auto">
                        <Icon name="search" size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-secondary" />
                        <input
                            className="bg-white/5 border border-white/5 rounded-full pl-10 pr-4 py-2 text-sm text-white focus:outline-none focus:border-primary w-full md:w-64"
                            placeholder="Search staff..."
                        />
                    </div>
                    <div className="flex gap-2 w-full md:w-auto">
                        <select className="bg-white/5 border border-white/5 rounded-full px-4 py-2 text-xs text-white focus:outline-none">
                            <option>All Roles</option>
                            <option>Admin</option>
                            <option>Staff</option>
                        </select>
                        <Button className="bg-primary text-black border-none" onClick={() => setIsInviteOpen(true)}>
                            <Icon name="person_add" className="mr-2" /> Invite Staff
                        </Button>
                    </div>
                </div>

                {/* Staff Table */}
                <GlassPanel className="p-0 overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-sm">
                            <thead className="bg-white/5 text-text-secondary uppercase text-xs font-bold border-b border-white/5">
                                <tr>
                                    <th className="p-4">Staff Member</th>
                                    <th className="p-4">Contact</th>
                                    <th className="p-4">Role</th>
                                    <th className="p-4">Status</th>
                                    <th className="p-4">Last Active</th>
                                    <th className="p-4"></th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-white/5">
                                {MOCK_STAFF.map((member) => (
                                    <tr key={member.id} className="hover:bg-white/5 transition-colors group">
                                        <td className="p-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-9 h-9 rounded-full bg-indigo-500/20 text-indigo-300 flex items-center justify-center font-bold">
                                                    {member.name.charAt(0)}
                                                </div>
                                                <span className="font-bold text-white">{member.name}</span>
                                            </div>
                                        </td>
                                        <td className="p-4 text-text-secondary">{member.email}<br /><span className="text-xs opacity-50">{member.phone}</span></td>
                                        <td className="p-4">
                                            <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider 
                                                ${member.role === 'Owner' ? 'bg-amber-500/20 text-amber-400' : ''}
                                                ${member.role === 'Admin' ? 'bg-purple-500/20 text-purple-400' : ''}
                                                ${member.role === 'Staff' ? 'bg-blue-500/20 text-blue-400' : ''}
                                            `}>
                                                {member.role}
                                            </span>
                                        </td>
                                        <td className="p-4">
                                            <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider 
                                                ${member.status === 'Active' ? 'bg-state-success/10 text-state-success' : ''}
                                                ${member.status === 'Invited' ? 'bg-white/10 text-white/70' : ''}
                                                ${member.status === 'Suspended' ? 'bg-state-danger/10 text-state-danger' : ''}
                                            `}>
                                                {member.status}
                                            </span>
                                        </td>
                                        <td className="p-4 text-xs text-text-secondary">{member.lastActive}</td>
                                        <td className="p-4 text-right">
                                            {member.role !== 'Owner' && (
                                                <Button size="sm" variant="ghost" className="h-8 opacity-0 group-hover:opacity-100 transition-opacity" onClick={() => setSelectedMember(member)}>Manage</Button>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </GlassPanel>

                {/* Manage Drawer Mock (Modal) */}
                {selectedMember && (
                    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex justify-end">
                        <div className="w-full max-w-md h-full bg-[#142210] border-l border-white/10 p-6 flex flex-col animate-slide-in-right">
                            <div className="flex justify-between items-center mb-6">
                                <h2 className="text-xl font-bold text-white">Manage Access</h2>
                                <Button variant="ghost" size="icon" onClick={() => setSelectedMember(null)}><Icon name="close" /></Button>
                            </div>

                            <div className="flex flex-col gap-6 flex-1">
                                <div className="flex items-center gap-4 p-4 rounded-xl bg-white/5 border border-white/5">
                                    <div className="w-12 h-12 rounded-full bg-indigo-500/20 text-indigo-300 flex items-center justify-center font-bold text-lg">
                                        {selectedMember.name.charAt(0)}
                                    </div>
                                    <div>
                                        <div className="font-bold text-white">{selectedMember.name}</div>
                                        <div className="text-sm text-text-secondary">{selectedMember.email}</div>
                                    </div>
                                </div>

                                <div>
                                    <label className="text-xs text-text-secondary uppercase font-bold tracking-wider mb-2 block">Role</label>
                                    <select className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-primary" defaultValue={selectedMember.role}>
                                        <option value="Admin">Admin</option>
                                        <option value="Staff">Staff</option>
                                    </select>
                                    <p className="text-xs text-text-secondary mt-2">
                                        Admins can manage products, orders, and WA settings. Staff handle day-to-day operations but cannot change critical settings.
                                    </p>
                                </div>

                                {selectedMember.status === 'Invited' && (
                                    <Button variant="outline" className="w-full">Resend Invite</Button>
                                )}

                                <div className="mt-auto pt-6 border-t border-white/10">
                                    <Button className="w-full mb-3 bg-primary text-black hover:bg-primary/90">Save Changes</Button>
                                    <Button variant="outline" className="w-full text-state-danger hover:text-state-danger hover:bg-state-danger/10 border-state-danger/20">
                                        Remove Access
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Invite Modal */}
                {isInviteOpen && (
                    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
                        <GlassPanel className="w-full max-w-lg p-6 relative">
                            <button onClick={() => setIsInviteOpen(false)} className="absolute top-4 right-4 text-text-secondary hover:text-white"><Icon name="close" /></button>
                            <h2 className="text-xl font-bold text-white mb-2">Invite Staff Members</h2>
                            <p className="text-text-secondary text-sm mb-6">Send an invite link to your team member's email.</p>

                            <form onSubmit={handleInvite} className="space-y-4">
                                <Input
                                    label="Email Address"
                                    placeholder="colleague@store.com"
                                    value={inviteEmail}
                                    onChange={(e) => setInviteEmail(e.target.value)}
                                />
                                <div>
                                    <label className="text-xs text-text-secondary uppercase font-bold tracking-wider mb-2 block">Role</label>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div onClick={() => setInviteRole('Staff')} className={`cursor-pointer p-3 rounded-lg border transition-colors ${inviteRole === 'Staff' ? 'bg-primary/10 border-primary' : 'bg-white/5 border-white/10 hover:border-white/30'}`}>
                                            <div className={`font-bold text-sm mb-1 ${inviteRole === 'Staff' ? 'text-primary' : 'text-white'}`}>Staff</div>
                                            <div className="text-xs text-text-secondary">Day-to-day operations. No billing access.</div>
                                        </div>
                                        <div onClick={() => setInviteRole('Admin')} className={`cursor-pointer p-3 rounded-lg border transition-colors ${inviteRole === 'Admin' ? 'bg-primary/10 border-primary' : 'bg-white/5 border-white/10 hover:border-white/30'}`}>
                                            <div className={`font-bold text-sm mb-1 ${inviteRole === 'Admin' ? 'text-primary' : 'text-white'}`}>Admin</div>
                                            <div className="text-xs text-text-secondary">Full management access. No payout edit.</div>
                                        </div>
                                    </div>
                                </div>

                                <div className="pt-4 flex justify-end gap-3">
                                    <Button type="button" variant="ghost" onClick={() => setIsInviteOpen(false)}>Cancel</Button>
                                    <Button type="submit" className="bg-primary text-black min-w-[120px]" isLoading={isInviting}>Send Invite</Button>
                                </div>
                            </form>
                        </GlassPanel>
                    </div>
                )}

            </div>
        </AdminShell>
    );
}
