
'use client';

import React, { useState, useEffect } from 'react';
import {
    Users,
    UserPlus,
    Mail,
    Shield,
    Trash2,
    Clock,
    MoreVertical,
    CheckCircle2,
    AlertCircle
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from '@/components/ui/use-toast';

export default function TeamSettingsPage() {
    const [members, setMembers] = useState<any[]>([]);
    const [invites, setInvites] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isInviting, setIsInviting] = useState(false);
    const [inviteEmail, setInviteEmail] = useState('');
    const [inviteRole, setInviteRole] = useState('staff');

    useEffect(() => {
        fetchTeamData();
    }, []);

    const fetchTeamData = async () => {
        try {
            setIsLoading(true);
            const res = await fetch('/api/team');
            const data = await res.json();
            setMembers(data.members || []);
            setInvites(data.invites || []);
        } catch (error) {
            toast({ title: 'Error', description: 'Failed to fetch team data', variant: 'destructive' });
        } finally {
            setIsLoading(false);
        }
    };

    const handleInvite = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!inviteEmail) return;

        try {
            setIsInviting(true);
            const res = await fetch('/api/team/invite', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email: inviteEmail, role: inviteRole })
            });

            if (!res.ok) {
                const error = await res.json();
                throw new Error(error.error || 'Failed to send invite');
            }

            toast({ title: 'Success', description: 'Invitation sent' });
            setInviteEmail('');
            fetchTeamData();
        } catch (error: any) {
            toast({ title: 'Error', description: error.message, variant: 'destructive' });
        } finally {
            setIsInviting(false);
        }
    };

    return (
        <div className="p-6 max-w-6xl mx-auto space-y-8">
            <div className="flex justify-between items-end">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Team Management</h1>
                    <p className="text-muted-foreground mt-1">Manage your store staff and their permissions.</p>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <Card className="p-6 md:col-span-2">
                    <div className="flex items-center gap-2 mb-6">
                        <Users className="w-5 h-5 text-primary" />
                        <h2 className="text-xl font-semibold">Active Members</h2>
                    </div>

                    <div className="space-y-4">
                        {isLoading ? (
                            <div className="animate-pulse space-y-4">
                                {[1, 2].map(i => <div key={i} className="h-16 bg-muted rounded-lg" />)}
                            </div>
                        ) : members.length === 0 ? (
                            <div className="text-center py-12 text-muted-foreground">No members found.</div>
                        ) : (
                            members.map((member) => (
                                <div key={member.id} className="flex items-center justify-between p-4 border rounded-lg bg-card hover:bg-accent/5 transition-colors">
                                    <div className="flex items-center gap-4">
                                        <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold">
                                            {member.User?.name?.charAt(0) || member.User?.email.charAt(0).toUpperCase()}
                                        </div>
                                        <div>
                                            <div className="font-medium">{member.User?.name || 'Unknown User'}</div>
                                            <div className="text-sm text-muted-foreground flex items-center gap-2">
                                                <Mail className="w-3 h-3" /> {member.User?.email}
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-4">
                                        <div className={`px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider ${member.role === 'owner' ? 'bg-orange-100 text-orange-700 dark:bg-orange-900/30' :
                                                member.role === 'admin' ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30' :
                                                    'bg-slate-100 text-slate-700 dark:bg-slate-800'
                                            }`}>
                                            {member.role}
                                        </div>
                                        <Button variant="ghost" size="icon">
                                            <MoreVertical className="w-4 h-4" />
                                        </Button>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>

                    {invites.length > 0 && (
                        <div className="mt-10">
                            <div className="flex items-center gap-2 mb-6">
                                <Clock className="w-5 h-5 text-primary" />
                                <h2 className="text-xl font-semibold">Pending Invitations</h2>
                            </div>
                            <div className="space-y-4">
                                {invites.map((invite) => (
                                    <div key={invite.id} className="flex items-center justify-between p-4 border border-dashed rounded-lg bg-muted/30">
                                        <div className="flex items-center gap-4">
                                            <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center text-muted-foreground">
                                                <Mail className="w-5 h-5" />
                                            </div>
                                            <div>
                                                <div className="font-medium">{invite.email}</div>
                                                <div className="text-xs text-muted-foreground">Invited as {invite.role}</div>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <span className="text-xs text-muted-foreground px-2 py-1 bg-muted rounded">Exp: {new Date(invite.expiresAt).toLocaleDateString()}</span>
                                            <Button variant="outline" size="sm" className="text-destructive hover:bg-destructive/10">Revoke</Button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </Card>

                <div className="space-y-6">
                    <Card className="p-6 border-primary/20 bg-primary/5">
                        <div className="flex items-center gap-2 mb-4 text-primary">
                            <UserPlus className="w-5 h-5" />
                            <h2 className="text-lg font-semibold">Invite New Member</h2>
                        </div>
                        <form onSubmit={handleInvite} className="space-y-4">
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Email Address</label>
                                <Input
                                    placeholder="colleague@example.com"
                                    type="email"
                                    value={inviteEmail}
                                    onChange={(e: any) => setInviteEmail(e.target.value)}
                                    required
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Role</label>
                                <Select value={inviteRole} onValueChange={setInviteRole}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select a role" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="admin">Admin</SelectItem>
                                        <SelectItem value="staff">Staff</SelectItem>
                                        <SelectItem value="finance">Finance</SelectItem>
                                        <SelectItem value="support">Support</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <Button className="w-full" type="submit" disabled={isInviting}>
                                {isInviting ? 'Sending...' : 'Send Invitation'}
                            </Button>
                        </form>
                    </Card>

                    <Card className="p-6">
                        <div className="flex items-center gap-2 mb-4">
                            <Shield className="w-5 h-5 text-primary" />
                            <h2 className="text-lg font-semibold">Roles Guide</h2>
                        </div>
                        <div className="space-y-4 text-sm">
                            <div>
                                <div className="font-semibold text-orange-600">Owner</div>
                                <div className="text-muted-foreground text-xs leading-relaxed">Full control over Billing, Payouts, and Ownership.</div>
                            </div>
                            <div>
                                <div className="font-semibold text-blue-600">Admin</div>
                                <div className="text-muted-foreground text-xs leading-relaxed">Can manage staff, products, and settings. No Billing access.</div>
                            </div>
                            <div>
                                <div className="font-semibold text-slate-700">Staff</div>
                                <div className="text-muted-foreground text-xs leading-relaxed">Daily operations: Orders, Products, Customers. Limited Settings.</div>
                            </div>
                        </div>
                    </Card>
                </div>
            </div>
        </div>
    );
}
