'use client';

import React, { useEffect, useState } from 'react';
import { Icon } from '@vayva/ui';

export default function StatusPage() {
    const [status, setStatus] = useState<any>(null);

    useEffect(() => {
        fetch('/api/status')
            .then(res => res.json())
            .then(setStatus)
            .catch(console.error);
    }, []);

    if (!status) return <div className="min-h-screen flex items-center justify-center">Loading...</div>;

    const isGood = status.indicator === 'none';

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col items-center py-20 px-4">
            <div className="w-full max-w-2xl">
                <div className="text-center mb-12">
                    <h1 className="text-3xl font-bold mb-2">Vayva System Status</h1>
                    <p className="text-gray-500">Live updates on platform health.</p>
                </div>

                <div className={`p-8 rounded-2xl border shadow-sm mb-8 flex items-center gap-6 ${isGood ? 'bg-green-50 border-green-100' : 'bg-yellow-50 border-yellow-100'
                    }`}>
                    <div className={`w-16 h-16 rounded-full flex items-center justify-center ${isGood ? 'bg-green-100 text-green-600' : 'bg-yellow-100 text-yellow-600'
                        }`}>
                        <Icon name={(isGood ? 'Check' : 'AlertTriangle') as any} size={32} />
                    </div>
                    <div>
                        <h2 className={`text-xl font-bold ${isGood ? 'text-green-800' : 'text-yellow-800'}`}>
                            {status.description}
                        </h2>
                        <p className={`text-sm ${isGood ? 'text-green-600' : 'text-yellow-600'}`}>
                            Checked just now
                        </p>
                    </div>
                </div>

                <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                    <div className="px-6 py-4 border-b border-gray-100 bg-gray-50 font-bold text-sm text-gray-500 uppercase">
                        Active Incidents
                    </div>
                    <div className="divide-y divide-gray-100">
                        {status.incidents && status.incidents.length > 0 ? (
                            status.incidents.map((inc: any) => (
                                <div key={inc.id} className="p-6">
                                    <div className="flex justify-between items-start mb-2">
                                        <h3 className="font-bold text-lg">{inc.title}</h3>
                                        <span className="px-2 py-1 bg-yellow-100 text-yellow-800 text-xs font-bold rounded uppercase">{inc.status}</span>
                                    </div>
                                    <p className="text-gray-600 mb-4">{inc.description}</p>
                                    <p className="text-xs text-gray-400">Started: {new Date(inc.startedAt).toLocaleString()}</p>
                                </div>
                            ))
                        ) : (
                            <div className="p-12 text-center text-gray-400 italic">No active incidents reported.</div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
