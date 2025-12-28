'use client';

import React from 'react';
import { AdminShell } from '@/components/admin-shell';
import { DataPrivacySettings } from '@/components/settings/DataPrivacySettings';

export default function GovernancePage() {
    return (
        <AdminShell title="Data & Governance" breadcrumb="Trust Center">
            <div className="max-w-4xl mx-auto py-8">
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-[#0B0B0B]">Data & Governance</h1>
                    <p className="text-[#525252] mt-2">Manage your data portability, retention policies, and account lifecycle.</p>
                </div>

                <DataPrivacySettings />
            </div>
        </AdminShell>
    );
}
