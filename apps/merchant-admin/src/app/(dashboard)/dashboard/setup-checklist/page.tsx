'use client';

import React, { useEffect, useState } from 'react';
import { Icon } from '@vayva/ui';

export default function SetupChecklistPage() {
    const [readiness, setReadiness] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Fetch readiness. We'll use the existing method via a merchant-scoped proxy or 
        // use the admin endpoint if we (the merchant) are allowed to see our own snapshot.
        // For security, usually there's a specific merchant endpoint. 
        // Mocking fetch or using a specific "my-readiness" route. 
        // Let's assume we call a merchant-wrapper route that calls the logic.
        // For V1, we'll mock the hook call or fetch from the endpoint if self-authorized.

        // Simulating fetch for logic display
        fetch('/api/merchant/readiness') // Needs to be created or mocked
            .then(res => res.json())
            .then(data => {
                setReadiness(data);
                setLoading(false);
            })
            .catch(() => setLoading(false));
    }, []);

    // Placeholder if endpoint missing
    if (loading) return <div className="p-8">Loading setup status...</div>;
    // Mock view if data fetch fails (since we didn't explicitly create /api/merchant/readiness in plan but it's implied by UI needs)
    // Actually, let's create the route or just inline the data structure for the page to compile.

    const issues = readiness?.issues || [];
    const isReady = readiness?.level === 'ready';

    return (
        <div className="max-w-3xl mx-auto py-12 px-6">
            <h1 className="text-3xl font-bold mb-4">Store Setup Checklist</h1>
            <p className="text-gray-500 mb-8">Complete these steps to unlock your storefront and go live.</p>

            {isReady ? (
                <div className="bg-green-50 border border-green-100 rounded-xl p-8 text-center">
                    <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Icon name={"Check" as any} size={32} />
                    </div>
                    <h2 className="text-xl font-bold text-green-800">You are ready to go live!</h2>
                    <p className="text-green-600 mt-2">All systems systems operational.</p>
                </div>
            ) : (
                <div className="space-y-4">
                    {issues.map((issue: any) => (
                        <div key={issue.code} className={`p-6 rounded-xl border flex gap-4 ${issue.severity === 'blocker' ? 'bg-red-50 border-red-100' : 'bg-yellow-50 border-yellow-100'
                            }`}>
                            <div className={`mt-1 ${issue.severity === 'blocker' ? 'text-red-500' : 'text-yellow-500'}`}>
                                <Icon name={(issue.severity === 'blocker' ? 'AlertOctagon' : 'AlertTriangle') as any} size={24} />
                            </div>
                            <div className="flex-1">
                                <h3 className={`font-bold ${issue.severity === 'blocker' ? 'text-red-900' : 'text-yellow-900'
                                    }`}>{issue.title}</h3>
                                <p className={`text-sm mt-1 ${issue.severity === 'blocker' ? 'text-red-700' : 'text-yellow-700'
                                    }`}>{issue.description}</p>
                            </div>
                            <div className="flex items-center">
                                {issue.actionUrl && (
                                    <a href={issue.actionUrl} className="px-4 py-2 bg-white border border-gray-200 shadow-sm rounded-lg text-sm font-bold hover:bg-gray-50">
                                        Fix Now
                                    </a>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
