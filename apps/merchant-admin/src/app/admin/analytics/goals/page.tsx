'use client';

import React, { useState, useEffect } from 'react';
import { AdminShell } from '@/components/admin-shell';
import { Button, Icon, cn } from '@vayva/ui';
import { api } from '@/services/api';

export default function GoalsPage() {
    const [goals, setGoals] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    const fetchGoals = async () => {
        try {
            const res = await api.get('/analytics/goals');
            setGoals(res.data || []);
        } catch (err) {
            console.error(err);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchGoals();
    }, []);

    return (
        <AdminShell title="Goals" breadcrumb="Analytics">
            <div className="max-w-4xl mx-auto flex flex-col gap-8">

                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold text-[#0B1220]">Sales Goals</h1>
                        <p className="text-[#525252]">Set and track your business targets.</p>
                    </div>
                    <Button><Icon name={"Plus" as any} size={16} className="mr-2" /> New Goal</Button>
                </div>

                {isLoading ? (
                    <div className="text-center text-gray-400 py-12">Loading goals...</div>
                ) : goals.length === 0 ? (
                    <div className="bg-white rounded-2xl p-12 border border-gray-100 text-center">
                        <Icon name={"Target" as any} size={48} className="mx-auto text-gray-300 mb-4" />
                        <h3 className="font-bold text-[#0B1220] mb-2">No goals set yet</h3>
                        <p className="text-[#525252] mb-6">Start tracking your progress by setting your first goal.</p>
                        <Button>Create Your First Goal</Button>
                    </div>
                ) : (
                    <div className="grid gap-6">
                        {goals.map(goal => (
                            <div key={goal.id} className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
                                <div className="flex items-center justify-between mb-4">
                                    <div>
                                        <h3 className="font-bold text-[#0B1220]">{goal.metricKey.replace('_', ' ').toUpperCase()}</h3>
                                        <p className="text-sm text-[#525252]">{goal.period} Target</p>
                                    </div>
                                    <span className="text-2xl font-bold text-green-600">₦ {Number(goal.targetValue).toLocaleString()}</span>
                                </div>
                                <div className="w-full bg-gray-100 rounded-full h-3 overflow-hidden">
                                    <div className="bg-green-500 h-full rounded-full" style={{ width: '65%' }} />
                                </div>
                                <p className="text-xs text-[#525252] mt-2">65% complete • On track</p>
                            </div>
                        ))}
                    </div>
                )}

            </div>
        </AdminShell>
    );
}
