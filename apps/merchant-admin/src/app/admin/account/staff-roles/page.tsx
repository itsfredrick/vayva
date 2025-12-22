'use client';

import React, { useEffect, useState } from 'react';
import { GlassPanel, Button, Input, Icon } from '@vayva/ui';
import { AccountService } from '@/services/account.service';
import { BillingService } from '@/services/billing.service';
import { StaffMember } from '@/types/account';
import { Spinner } from '@/components/Spinner';

export default function StaffRolesPage() {
    const [staff, setStaff] = useState<StaffMember[]>([]);
    const [planTier, setPlanTier] = useState<string>('STARTER');
    const [loading, setLoading] = useState(true);
    const [isInviting, setIsInviting] = useState(false);

    useEffect(() => {
        const load = async () => {
            const [s, sub] = await Promise.all([
                AccountService.getStaff(),
                BillingService.getSubscription()
            ]);
            setStaff(s);
            setPlanTier(sub.planId);
            setLoading(false);
        };
        load();
    }, []);

    // Placeholder Logic for Gating
    const canAddStaff = planTier === 'PRO'; // Only PRO can add staff in this demo logic

    if (loading) return <div className="text-text-secondary"><Spinner size="sm" /> Loading staff...</div>;

    return (
        <div className="space-y-6 max-w-4xl">
            <div className="flex justify-between items-center">
                <h2 className="text-xl font-bold text-white">Team & Roles</h2>
                <Button
                    variant="primary"
                    disabled={!canAddStaff}
                    title={!canAddStaff ? 'Upgrade to Pro to add staff' : 'Invite Staff'}
                >
                    <Icon name={"Plus" as any} size={16} className="mr-2" />
                    Invite Member
                </Button>
            </div>

            {!canAddStaff && (
                <div className="p-4 rounded-lg bg-white/5 border border-white/10 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <Icon name={"Lock" as any} className="text-yellow-500" />
                        <div>
                            <h4 className="text-white font-bold">Staff accounts are locked</h4>
                            <p className="text-sm text-text-secondary">Upgrade to the Pro plan to add up to 5 team members.</p>
                        </div>
                    </div>
                </div>
            )}

            <GlassPanel className="overflow-hidden">
                <table className="w-full text-left text-sm">
                    <thead className="bg-white/5 text-text-secondary uppercase text-xs font-medium">
                        <tr>
                            <th className="px-6 py-4">Name</th>
                            <th className="px-6 py-4">Email</th>
                            <th className="px-6 py-4">Role</th>
                            <th className="px-6 py-4">Status</th>
                            <th className="px-6 py-4 text-right">Action</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                        {staff.map((member) => (
                            <tr key={member.id} className="hover:bg-white/5 transition-colors">
                                <td className="px-6 py-4 text-white font-medium">{member.name}</td>
                                <td className="px-6 py-4 text-text-secondary">{member.email}</td>
                                <td className="px-6 py-4 capitalize text-white">{member.role}</td>
                                <td className="px-6 py-4">
                                    <span className={`px-2 py-1 rounded-full text-xs font-medium capitalize ${member.status === 'active' ? 'bg-green-500/10 text-green-500' : 'bg-yellow-500/10 text-yellow-500'
                                        }`}>
                                        {member.status}
                                    </span>
                                </td>
                                <td className="px-6 py-4 text-right">
                                    {member.role !== 'admin' && ( // Cannot remove main admin
                                        <Button variant="ghost" size="sm" className="text-red-500 hover:text-red-400 hover:bg-red-500/10">
                                            Remove
                                        </Button>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </GlassPanel>
        </div>
    );
}
