'use client';

import React, { useState, useEffect } from 'react';
import { AdminShell } from '@/components/admin-shell';
import { Button, Icon, cn } from '@vayva/ui';
import { motion } from 'framer-motion';
import { api } from '@/services/api';

interface Customer {
    id: string;
    firstName?: string;
    lastName?: string;
    name?: string; // computed
    email?: string;
    phone?: string;
    ordersCount?: number;
    totalSpent?: number;
    createdAt: string;
}

export default function CustomersPage() {
    const [customers, setCustomers] = useState<Customer[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    const fetchCustomers = async () => {
        try {
            // Mock API or Real - assuming /v1/customers exists or I need to add it to Orders Service (CRM)
            // For now, let's assume specific CRM endpoint or Orders Service handles it
            // Ideally: GET /v1/customers via Orders Service
            const res = await api.get('/customers');
            setCustomers(res.data);
        } catch (err) {
            console.error(err);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchCustomers();
    }, []);

    return (
        <AdminShell title="Customers">
            <div className="flex flex-col gap-6">

                {/* Header Actions */}
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 max-w-md w-full">
                        <div className="relative flex-1">
                            <Icon name={"Search" as any} size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                            <input
                                type="text"
                                placeholder="Search customers..."
                                className="w-full h-10 pl-10 pr-4 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-black/5"
                            />
                        </div>
                    </div>
                </div>

                {/* Table */}
                <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden min-h-[400px]">
                    <table className="w-full text-left text-sm">
                        <thead className="bg-gray-50 border-b border-gray-100 text-xs uppercase text-gray-500 font-medium">
                            <tr>
                                <th className="px-6 py-4">Customer</th>
                                <th className="px-6 py-4">Contact</th>
                                <th className="px-6 py-4">Orders</th>
                                <th className="px-6 py-4">Spent</th>
                                <th className="px-6 py-4">Joined</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {isLoading ? (
                                <tr><td colSpan={5} className="p-6 text-center text-gray-400">Loading...</td></tr>
                            ) : customers.length === 0 ? (
                                <tr><td colSpan={5} className="p-12 text-center text-gray-400">No customers found.</td></tr>
                            ) : (
                                customers.map((c) => (
                                    <motion.tr
                                        key={c.id}
                                        whileHover={{ backgroundColor: "#F9FAFB" }}
                                        className="cursor-pointer"
                                    >
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-xs font-bold text-gray-600">
                                                    {(c.firstName?.[0] || c.email?.[0] || '?').toUpperCase()}
                                                </div>
                                                <span className="font-medium text-[#0B0B0B]">{c.firstName} {c.lastName}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-[#525252]">
                                            <div className="flex flex-col text-xs">
                                                <span>{c.email}</span>
                                                <span>{c.phone}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-[#0B0B0B]">{c.ordersCount || 0} orders</td>
                                        <td className="px-6 py-4 font-medium">₦ {(c.totalSpent || 0).toLocaleString()}</td>
                                        <td className="px-6 py-4 text-[#525252]">{new Date(c.createdAt).toLocaleDateString()}</td>
                                    </motion.tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>

            </div>
        </AdminShell>
    );
}
