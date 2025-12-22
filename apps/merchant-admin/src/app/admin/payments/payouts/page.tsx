'use client';

import { useRouter } from 'next/navigation';
import { AppShell, Button, GlassPanel, StatusChip } from '@vayva/ui';
import { useAuth } from '@/context/AuthContext';

export default function PayoutsPage() {
    const router = useRouter();
    const { user } = useAuth();

    // Mock Data for V1
    const payouts = [
        { id: 'po_123', amount: 50000, status: 'PAID', date: '2023-10-25', bank: 'GTBank •••• 1234' },
        { id: 'po_124', amount: 25000, status: 'PROCESSING', date: '2023-11-01', bank: 'GTBank •••• 1234' },
    ];

    return (
        <AppShell sidebar={<></>} header={<></>}>
            <GlassPanel className="p-0 overflow-hidden">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="border-b border-white/10 bg-white/5">
                            <th className="p-4 text-sm font-medium text-text-secondary">Payout ID</th>
                            <th className="p-4 text-sm font-medium text-text-secondary">Date</th>
                            <th className="p-4 text-sm font-medium text-text-secondary">Bank Account</th>
                            <th className="p-4 text-sm font-medium text-text-secondary">Amount</th>
                            <th className="p-4 text-sm font-medium text-text-secondary">Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        {payouts.map((po) => (
                            <tr key={po.id} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                                <td className="p-4 text-white font-mono text-sm">{po.id}</td>
                                <td className="p-4 text-text-secondary">{po.date}</td>
                                <td className="p-4 text-white">{po.bank}</td>
                                <td className="p-4 text-white font-bold">NGN {po.amount.toLocaleString()}</td>
                                <td className="p-4"><StatusChip status={po.status} /></td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </GlassPanel>
        </AppShell>
    );
}
