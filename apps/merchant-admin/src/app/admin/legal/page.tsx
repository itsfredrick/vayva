'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthContext';

interface LegalRecord {
    version: string;
    acceptedAt: string;
    acceptedBy: string;
    isAssumed?: boolean;
}

export default function LegalPage() {
    const { user } = useAuth();
    const [records, setRecords] = useState<{
        terms?: LegalRecord;
        privacy?: LegalRecord;
        refund?: LegalRecord;
    }>({});
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchRecords();
    }, []);

    const fetchRecords = async () => {
        try {
            // For MVP, show assumed acceptance based on account creation
            // In production, this would fetch from LegalAcceptance table
            setRecords({
                terms: {
                    version: '1.0',
                    acceptedAt: user?.createdAt || new Date().toISOString(),
                    acceptedBy: 'OWNER',
                    isAssumed: true
                },
                privacy: {
                    version: '1.0',
                    acceptedAt: user?.createdAt || new Date().toISOString(),
                    acceptedBy: 'OWNER',
                    isAssumed: true
                },
                refund: {
                    version: '1.0',
                    acceptedAt: user?.createdAt || new Date().toISOString(),
                    acceptedBy: 'OWNER',
                    isAssumed: true
                }
            });
        } catch (error) {
            console.error('Legal records fetch error:', error);
        } finally {
            setLoading(false);
        }
    };

    if (!user) {
        return (
            <div className="p-8">
                <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-800">
                    Please log in to view legal records.
                </div>
            </div>
        );
    }

    return (
        <div className="p-8 max-w-4xl mx-auto">
            {/* Header */}
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-900 mb-2">Legal Documents</h1>
                <p className="text-gray-600">
                    These records reflect acceptance history. Displayed for compliance purposes.
                </p>
            </div>

            {/* Disclaimer */}
            <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mb-6">
                <p className="text-sm text-amber-800">
                    <strong>Note:</strong> Historical acceptance inferred from account creation date.
                    New versions will require explicit acceptance.
                </p>
            </div>

            {loading ? (
                <div className="bg-white border border-gray-200 rounded-lg p-8 text-center">
                    <div className="animate-pulse">Loading records...</div>
                </div>
            ) : (
                <div className="space-y-4">
                    {/* Terms of Service */}
                    <div className="bg-white border border-gray-200 rounded-lg p-6">
                        <h2 className="text-lg font-semibold text-gray-900 mb-4">Terms of Service</h2>
                        {records.terms && (
                            <div className="space-y-2 text-sm">
                                <div className="flex justify-between">
                                    <span className="text-gray-600">Version:</span>
                                    <span className="font-medium text-gray-900">{records.terms.version}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-600">Accepted At:</span>
                                    <span className="font-medium text-gray-900">
                                        {new Date(records.terms.acceptedAt).toLocaleString()}
                                        {records.terms.isAssumed && (
                                            <span className="ml-2 text-xs text-amber-600">(assumed)</span>
                                        )}
                                    </span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-600">Accepted By:</span>
                                    <span className="font-medium text-gray-900">{records.terms.acceptedBy}</span>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Privacy Policy */}
                    <div className="bg-white border border-gray-200 rounded-lg p-6">
                        <h2 className="text-lg font-semibold text-gray-900 mb-4">Privacy Policy</h2>
                        {records.privacy && (
                            <div className="space-y-2 text-sm">
                                <div className="flex justify-between">
                                    <span className="text-gray-600">Version:</span>
                                    <span className="font-medium text-gray-900">{records.privacy.version}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-600">Accepted At:</span>
                                    <span className="font-medium text-gray-900">
                                        {new Date(records.privacy.acceptedAt).toLocaleString()}
                                        {records.privacy.isAssumed && (
                                            <span className="ml-2 text-xs text-amber-600">(assumed)</span>
                                        )}
                                    </span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-600">Accepted By:</span>
                                    <span className="font-medium text-gray-900">{records.privacy.acceptedBy}</span>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Refund Policy */}
                    <div className="bg-white border border-gray-200 rounded-lg p-6">
                        <h2 className="text-lg font-semibold text-gray-900 mb-4">Refund Policy</h2>
                        {records.refund && (
                            <div className="space-y-2 text-sm">
                                <div className="flex justify-between">
                                    <span className="text-gray-600">Version:</span>
                                    <span className="font-medium text-gray-900">{records.refund.version}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-600">Accepted At:</span>
                                    <span className="font-medium text-gray-900">
                                        {new Date(records.refund.acceptedAt).toLocaleString()}
                                        {records.refund.isAssumed && (
                                            <span className="ml-2 text-xs text-amber-600">(assumed)</span>
                                        )}
                                    </span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-600">Accepted By:</span>
                                    <span className="font-medium text-gray-900">{records.refund.acceptedBy}</span>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            )}

            {/* Info Box */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mt-6">
                <h4 className="font-medium text-blue-900 mb-2">About Legal Records</h4>
                <ul className="text-sm text-blue-800 space-y-1">
                    <li>• Records are maintained for compliance and audit purposes</li>
                    <li>• Acceptance dates reflect when documents were agreed to</li>
                    <li>• Version updates will require new acceptance</li>
                    <li>• Contact support if you have questions about these records</li>
                </ul>
            </div>
        </div>
    );
}
