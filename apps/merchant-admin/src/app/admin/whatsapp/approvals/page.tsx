'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { AppShell, Button, GlassPanel, StatusChip } from '@vayva/ui';
import { ApprovalService } from '@/services/approvals';
import { useAuth } from '@/context/AuthContext';

export default function ApprovalsPage() {
    const router = useRouter();
    const { user } = useAuth();
    const [approvals, setApprovals] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchApprovals = () => {
        setLoading(true);
        ApprovalService.list()
            .then(setApprovals)
            .catch(console.error)
            .finally(() => setLoading(false));
    };

    useEffect(() => {
        fetchApprovals();
    }, []);

    const handleApprove = async (id: string) => {
        try {
            await ApprovalService.approve(id);
            fetchApprovals();
        } catch (err) {
            console.error(err);
        }
    };

    return (
        <AppShell sidebar={<></>} header={<></>}>
            <div className="flex flex-col gap-4 p-4">
                <h1 className="text-2xl font-bold text-white">AI Approvals</h1>
            </div>
            <GlassPanel className="p-0 overflow-hidden">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="border-b border-white/10 bg-white/5">
                            <th className="p-4 text-sm font-medium text-text-secondary">Type</th>
                            <th className="p-4 text-sm font-medium text-text-secondary">Description</th>
                            <th className="p-4 text-sm font-medium text-text-secondary">Confidence</th>
                            <th className="p-4 text-sm font-medium text-text-secondary">Status</th>
                            <th className="p-4 text-sm font-medium text-text-secondary">Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {loading ? (
                            <tr><td colSpan={5} className="p-8 text-center text-text-secondary">Loading...</td></tr>
                        ) : approvals.length === 0 ? (
                            <tr><td colSpan={5} className="p-8 text-center text-text-secondary">No pending approvals.</td></tr>
                        ) : (
                            approvals.map((ap) => (
                                <tr key={ap.id} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                                    <td className="p-4 text-white font-medium">{ap.type}</td>
                                    <td className="p-4 text-text-secondary">{ap.data ? JSON.stringify(ap.data).substring(0, 50) + '...' : '-'}</td>
                                    <td className="p-4 text-green-400 font-bold">{(ap.confidenceScore * 100).toFixed(0)}%</td>
                                    <td className="p-4"><StatusChip status={ap.status} /></td>
                                    <td className="p-4">
                                        {ap.status === 'PENDING' && (
                                            <Button
                                                size="sm"
                                                onClick={() => handleApprove(ap.id)}
                                            >
                                                Approve
                                            </Button>
                                        )}
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </GlassPanel>
        </AppShell>
    );
}
