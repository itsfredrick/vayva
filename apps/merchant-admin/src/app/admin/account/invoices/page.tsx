'use client';

import React, { useEffect, useState } from 'react';
import { GlassPanel, Button, Icon } from '@vayva/ui';
import { BillingService } from '@/services/billing.service';
import { Invoice } from '@/types/billing';
import { Spinner } from '@/components/Spinner';

export default function InvoicesPage() {
    const [invoices, setInvoices] = useState<Invoice[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const load = async () => {
            const data = await BillingService.getInvoices();
            setInvoices(data);
            setIsLoading(false);
        };
        load();
    }, []);

    if (isLoading) return <div className="text-text-secondary flex items-center gap-2"><Spinner size="sm" /> Loading invoices...</div>;

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h3 className="text-lg font-bold text-white">Invoice History</h3>
                <Button variant="outline" size="sm" disabled>Download All</Button>
            </div>

            <GlassPanel className="overflow-hidden">
                <table className="w-full text-left text-sm">
                    <thead className="bg-white/5 text-text-secondary uppercase text-xs font-medium">
                        <tr>
                            <th className="px-6 py-4">Date</th>
                            <th className="px-6 py-4">Amount</th>
                            <th className="px-6 py-4">Status</th>
                            <th className="px-6 py-4">Invoice ID</th>
                            <th className="px-6 py-4 text-right">Action</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                        {invoices.length === 0 ? (
                            <tr>
                                <td colSpan={5} className="px-6 py-8 text-center text-text-secondary">
                                    No invoices found.
                                </td>
                            </tr>
                        ) : (
                            invoices.map((invoice) => (
                                <tr key={invoice.id} className="hover:bg-white/5 transition-colors">
                                    <td className="px-6 py-4 text-white">
                                        {new Date(invoice.date).toLocaleDateString()}
                                    </td>
                                    <td className="px-6 py-4 text-white font-medium">
                                        ₦{invoice.amount.toLocaleString()}
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className={`px-2 py-1 rounded-full text-xs font-medium capitalize ${invoice.status === 'paid' ? 'bg-green-500/10 text-green-500' :
                                            invoice.status === 'pending' ? 'bg-yellow-500/10 text-yellow-500' :
                                                'bg-red-500/10 text-red-500'
                                            }`}>
                                            {invoice.status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-text-secondary">
                                        {invoice.id}
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <Button variant="ghost" size="sm" className="gap-2">
                                            <Icon name={"Download" as any} size={14} />
                                            Download
                                        </Button>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </GlassPanel>
        </div>
    );
}
