'use client';

import React, { useState, useEffect } from 'react';
import { AppShell, GlassPanel, Input, Button, Icon } from '@vayva/ui';
import { apiClient } from '@vayva/api-client';
import { UserRole } from '@vayva/shared';


export default function StaffSettingsPage() {
    const [staff, setStaff] = useState<any[]>([]);
    const [invites, setInvites] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [selectedMember, setSelectedMember] = useState<any | null>(null);
    const [isInviteOpen, setIsInviteOpen] = useState(false);

    // Invite Form State
    const [inviteEmail, setInviteEmail] = useState('');
    const [inviteRole, setInviteRole] = useState('STAFF');
    const [isInviting, setIsInviting] = useState(false);

    const fetchData = async () => {
        setIsLoading(true);
        try {
            const [staffList, inviteList] = await Promise.all([
                apiClient.staff.list(),
                // Note: apiClient.staff.getInvites() was missing in my index.ts but I'll add it or proxy correctly
                fetch('http://localhost:4000/v1/staff/invites', { credentials: 'include' }).then(r => r.json())
            ]);
            setStaff(staffList);
            setInvites(inviteList);
        } catch (error) {
            console.error('Failed to fetch staff data', error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handleInvite = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsInviting(true);
        try {
            await apiClient.staff.invite({ email: inviteEmail, role: inviteRole });
            await fetchData();
            setIsInviteOpen(false);
            setInviteEmail('');
        } catch (error: any) {
            alert(error.message || 'Failed to send invite');
        } finally {
            setIsInviting(false);
        }
    };

    const handleRemove = async (id: string) => {
        if (!confirm('Are you sure you want to remove this staff member?')) return;
        try {
            await apiClient.staff.remove(id);
            await fetchData();
            setSelectedMember(null);
        } catch (error: any) {
            alert(error.message || 'Failed to remove staff');
        }
    };


    return (
        <AppShell sidebar={<></>} header={<></>}>
            <div className="max-w-6xl mx-auto flex flex-col gap-4 mb-6">
                <h1 className="text-2xl font-bold text-white">Staff & Roles</h1>
            </div>
            <div className="max-w-6xl mx-auto">

                {/* Toolbar */}
                <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-6">
                    <div className="relative w-full md:w-auto">
                        <Icon name="Search" size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-secondary" />
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
                            <Icon name="UserPlus" className="mr-2" /> Invite Staff
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
                                {staff.map((member) => (
                                    <tr key={member.id} className="hover:bg-white/5 transition-colors group">
                                        <td className="p-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-9 h-9 rounded-full bg-indigo-500/20 text-indigo-300 flex items-center justify-center font-bold">
                                                    {member.firstName?.charAt(0) || member.email?.charAt(0)}
                                                </div>
                                                <span className="font-bold text-white">{member.firstName} {member.lastName}</span>
                                            </div>
                                        </td>
                                        <td className="p-4 text-text-secondary">{member.email}<br /><span className="text-xs opacity-50">{member.phone || 'No phone'}</span></td>
                                        <td className="p-4">
                                            <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider 
                                                ${member.role === 'OWNER' ? 'bg-amber-500/20 text-amber-400' : ''}
                                                ${member.role === 'ADMIN' ? 'bg-purple-500/20 text-purple-400' : ''}
                                                ${member.role === 'STAFF' ? 'bg-blue-500/20 text-blue-400' : ''}
                                            `}>
                                                {member.role}
                                            </span>
                                        </td>
                                        <td className="p-4">
                                            <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-state-success/10 text-state-success`}>
                                                Active
                                            </span>
                                        </td>
                                        <td className="p-4 text-xs text-text-secondary">Recent</td>
                                        <td className="p-4 text-right">
                                            {member.role !== 'OWNER' && (
                                                <Button size="sm" variant="ghost" className="h-8 opacity-0 group-hover:opacity-100 transition-opacity" onClick={() => setSelectedMember({ ...member, status: 'Active' })}>Manage</Button>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                                {invites.map((invite) => (
                                    <tr key={invite.id} className="hover:bg-white/5 transition-colors group">
                                        <td className="p-4 opacity-70">
                                            <div className="flex items-center gap-3">
                                                <div className="w-9 h-9 rounded-full bg-gray-500/20 text-gray-400 flex items-center justify-center font-bold">
                                                    ?
                                                </div>
                                                <span className="font-bold text-white">Pending Invite</span>
                                            </div>
                                        </td>
                                        <td className="p-4 text-text-secondary opacity-70">{invite.email}</td>
                                        <td className="p-4">
                                            <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-blue-500/20 text-blue-400`}>
                                                {invite.role}
                                            </span>
                                        </td>
                                        <td className="p-4">
                                            <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-white/10 text-white/70`}>
                                                Invited
                                            </span>
                                        </td>
                                        <td className="p-4 text-xs text-text-secondary">Sent {new Date(invite.createdAt).toLocaleDateString()}</td>
                                        <td className="p-4 text-right">
                                            <Button size="sm" variant="ghost" className="h-8 opacity-0 group-hover:opacity-100 transition-opacity" onClick={() => setSelectedMember({ ...invite, status: 'Invited' })}>Manage</Button>
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
                                <Button variant="ghost" size="icon" onClick={() => setSelectedMember(null)}><Icon name="X" /></Button>
                            </div>

                            <div className="flex flex-col gap-6 flex-1">
                                <div className="flex items-center gap-4 p-4 rounded-xl bg-white/5 border border-white/5">
                                    <div className="w-12 h-12 rounded-full bg-indigo-500/20 text-indigo-300 flex items-center justify-center font-bold text-lg">
                                        {selectedMember.firstName?.charAt(0) || selectedMember.email?.charAt(0)}
                                    </div>
                                    <div>
                                        <div className="font-bold text-white">{selectedMember.firstName} {selectedMember.lastName}</div>
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
                                    <Button
                                        variant="outline"
                                        className="w-full text-state-danger hover:text-state-danger hover:bg-state-danger/10 border-state-danger/20"
                                        onClick={() => handleRemove(selectedMember.id || selectedMember.email)}
                                    >
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
                            <button onClick={() => setIsInviteOpen(false)} className="absolute top-4 right-4 text-text-secondary hover:text-white"><Icon name="X" /></button>
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
        </AppShell>
    );
}
