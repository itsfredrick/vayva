'use client';

import React from 'react';
import { AdminShell } from '@/components/admin-shell';
import { Icon, cn } from '@vayva/ui';
import Link from 'next/link';

const TRUST_MODULES = [
    {
        title: 'Policies',
        description: 'Edit your Privacy Policy, Terms of Service, and Refund Policy.',
        href: '/admin/settings/trust/policies',
        icon: 'Shield',
        color: 'bg-blue-50 text-blue-600'
    },
    {
        title: 'Data & Governance',
        description: 'Export your data, manage retention, or request account deletion.',
        href: '/admin/settings/governance',
        icon: 'Database',
        color: 'bg-indigo-50 text-indigo-600'
    },
    {
        title: 'Consent & Messaging',
        description: 'Manage WhatsApp marketing and transactional consent settings.',
        href: '/admin/settings/trust/consent',
        icon: 'MessageCircle',
        color: 'bg-green-50 text-green-600'
    },
    {
        title: 'Security Posture',
        description: 'Audit logs and security configuration details.',
        href: '/admin/settings/security',
        icon: 'Lock',
        color: 'bg-gray-50 text-gray-600'
    }
];

export default function TrustCenterPage() {
    return (
        <AdminShell title="Trust Center" breadcrumb="Settings">
            <div className="max-w-5xl mx-auto flex flex-col gap-8">

                <div className="flex flex-col gap-1">
                    <h1 className="text-2xl font-bold text-[#0B0B0B]">Trust Center</h1>
                    <p className="text-[#525252]">Comprehensive controls for compliance, privacy, and security.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {TRUST_MODULES.map(m => (
                        <Link
                            key={m.title}
                            href={m.href}
                            className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all flex gap-6 items-start group"
                        >
                            <div className={cn("p-4 rounded-2xl transition-all group-hover:scale-110", m.color)}>
                                <Icon name={m.icon as any} size={24} />
                            </div>
                            <div className="flex-1">
                                <h3 className="font-bold text-lg text-[#0B0B0B] mb-1 group-hover:text-green-600 transition-colors">{m.title}</h3>
                                <p className="text-sm text-[#525252] leading-relaxed">{m.description}</p>
                            </div>
                            <Icon name="ChevronRight" size={20} className="text-[#525252] mt-1 opacity-0 group-hover:opacity-100 transition-all" />
                        </Link>
                    ))}
                </div>

                {/* Compliance Badge */}
                <div className="mt-8 bg-green-50/50 border border-green-100 rounded-2xl p-6 flex items-center justify-between">
                    <div className="flex gap-4 items-center">
                        <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center text-green-500 shadow-sm border border-green-50">
                            <Icon name="ShieldCheck" size={24} />
                        </div>
                        <div>
                            <h4 className="font-bold text-green-800">Compliance Readiness</h4>
                            <p className="text-sm text-green-700/70">These tools help you comply with Nigerian Data Protection Regulation (NDPR) requirements.</p>
                        </div>
                    </div>
                </div>

            </div>
        </AdminShell>
    );
}
