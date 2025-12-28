'use client';

import React from 'react';
import { AdminShell } from '@/components/admin-shell';
import { SupportInbox } from '@/components/support/SupportInbox';
import { FEATURES } from '@/lib/env-validation';
import { Icon } from '@vayva/ui';

export default function SupportInboxPage() {
    if (!FEATURES.WHATSAPP_ENABLED) {
        return (
            <AdminShell title="Inbox" breadcrumb="Inbox">
                <div className="flex items-center justify-center min-h-[600px]">
                    <div className="max-w-md text-center">
                        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                            <Icon name="MessageSquare" size={32} className="text-gray-400" />
                        </div>
                        <h1 className="text-2xl font-bold text-[#0B0B0B] mb-4">
                            WhatsApp Not Configured
                        </h1>
                        <p className="text-[#525252] mb-6">
                            WhatsApp integration is not configured for your account.
                            Contact support to enable this feature.
                        </p>
                        <a
                            href="mailto:support@vayva.ng?subject=Enable WhatsApp Integration"
                            className="inline-flex items-center gap-2 px-6 py-3 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors font-medium"
                        >
                            <Icon name="Mail" size={16} />
                            Contact Support
                        </a>
                    </div>
                </div>
            </AdminShell>
        );
    }

    return (
        <AdminShell title="Support Inbox" breadcrumb="Inbox">
            <div className="max-w-6xl mx-auto py-8">
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-[#0B0B0B]">Support Inbox</h1>
                    <p className="text-[#525252] mt-2">Handle customer escalations and business-critical inquiries.</p>
                </div>

                <SupportInbox />
            </div>
        </AdminShell>
    );
}
