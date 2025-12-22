'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { AppShell, Button, GlassPanel, StatusChip, Icon } from '@vayva/ui';
import { PaymentService, PaymentTransaction } from '@/services/payments';
import { useAuth } from '@/context/AuthContext';

export default function PaymentsPage() {
    const router = useRouter();
    const { user } = useAuth();
    const [transactions, setTransactions] = useState<PaymentTransaction[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        PaymentService.listTransactions()
            .then(setTransactions)
            .catch(console.error)
            .finally(() => setLoading(false));
    }, []);

    return (
        <AppShell sidebar={<></>} header={<></>}>
            <div className="space-y-6">
                <div className="flex items-center justify-between">
                    <h1 className="text-2xl font-bold bg-white/5 inline-block px-4 py-2 rounded-lg text-[#0B0B0B]">Payments</h1>
                    <Button variant="secondary" onClick={() => router.push('/admin/payments/payouts')}>
                        View Payouts
                    </Button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="bg-white border border-gray-100 p-6 rounded-xl shadow-sm">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-sm font-medium text-gray-500">Total Revenue</h3>
                            <Icon name={"CreditCard" as any} className="text-blue-500" size={20} />
                        </div>
                        <p className="text-2xl font-bold text-[#0B0B0B]">₦0.00</p>
                    </div>
                </div>

                <GlassPanel className="p-0 overflow-hidden">
                    {loading ? (
                        <div className="p-12 text-center text-text-secondary animate-pulse">Loading transactions...</div>
                    ) : transactions.length === 0 ? (
                        <div className="p-12 text-center text-gray-500">
                            <Icon name={"CreditCard" as any} size={48} className="mx-auto mb-4 opacity-50" />
                            <h3 className="font-bold mb-2">No Payments Yet</h3>
                            <p>No transactions found for your store.</p>
                        </div>
                    ) : (
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="border-b border-white/10 bg-white/5">
                                    <th className="p-4 text-sm font-medium text-text-secondary">Reference</th>
                                    <th className="p-4 text-sm font-medium text-text-secondary">Date</th>
                                    <th className="p-4 text-sm font-medium text-text-secondary">Order</th>
                                    <th className="p-4 text-sm font-medium text-text-secondary">Customer</th>
                                    <th className="p-4 text-sm font-medium text-text-secondary">Amount</th>
                                    <th className="p-4 text-sm font-medium text-text-secondary">Status</th>
                                </tr>
                            </thead>
                            <tbody>
                                {transactions.map((tx) => (
                                    <tr key={tx.id} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                                        <td className="p-4 text-white font-mono text-sm">{tx.reference}</td>
                                        <td className="p-4 text-text-secondary">{new Date(tx.createdAt).toLocaleDateString()}</td>
                                        <td className="p-4">
                                            <button onClick={() => router.push(`/admin/orders/${tx.order.id}`)} className="text-primary hover:underline">
                                                #{tx.order.id.substring(0, 8)}
                                            </button>
                                        </td>
                                        <td className="p-4 text-white">{tx.order.customer?.name || 'Guest'}</td>
                                        <td className="p-4 text-white font-bold">{tx.currency} {tx.amount.toLocaleString()}</td>
                                        <td className="p-4"><StatusChip status={tx.status} /></td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}
                </GlassPanel>
            </div>
        </AppShell>
    );
}
