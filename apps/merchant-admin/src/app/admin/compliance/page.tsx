'use client';

import { useState } from 'react';
import { useAuth } from '@/context/AuthContext';

export default function CompliancePage() {
    const { user } = useAuth();
    const [reportType, setReportType] = useState('withdrawals');
    const [dateFrom, setDateFrom] = useState('');
    const [dateTo, setDateTo] = useState('');
    const [loading, setLoading] = useState(false);
    const [exportId, setExportId] = useState<string | null>(null);
    const [expiresAt, setExpiresAt] = useState<string | null>(null);

    const isAdmin = user?.role === 'ADMIN' || user?.role === 'OWNER';

    const generateReport = async () => {
        try {
            setLoading(true);
            const res = await fetch('/api/compliance/reports/create', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    type: reportType,
                    dateFrom,
                    dateTo
                })
            });

            if (!res.ok) throw new Error('Failed to generate report');

            const data = await res.json();
            setExportId(data.exportId);
            setExpiresAt(data.expiresAt);
        } catch (error) {
            console.error('Report generation error:', error);
            alert('Failed to generate report');
        } finally {
            setLoading(false);
        }
    };

    if (!isAdmin) {
        return (
            <div className="p-8">
                <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-800">
                    ⚠️ Access denied. Admin or Owner privileges required.
                </div>
            </div>
        );
    }

    return (
        <div className="p-8 max-w-4xl mx-auto">
            {/* Header */}
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-900 mb-2">Compliance Reports</h1>
                <p className="text-gray-600">
                    Reports are generated for accounting and compliance use. Exports are timestamped and auditable.
                </p>
            </div>

            {/* Report Generator */}
            <div className="bg-white border border-gray-200 rounded-lg p-6 mb-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Generate Report</h2>

                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Report Type
                        </label>
                        <select
                            value={reportType}
                            onChange={(e) => setReportType(e.target.value)}
                            className="w-full border border-gray-300 rounded-lg px-3 py-2"
                        >
                            <option value="withdrawals">Withdrawal & Fees Report</option>
                            <option value="activity">Activity Summary Report</option>
                        </select>
                        <p className="mt-1 text-sm text-gray-500">
                            {reportType === 'withdrawals'
                                ? 'Includes date, reference, gross, fee (5%), net, and status. Fees are shown exactly as applied.'
                                : 'Includes date, action, actor role, reference, and summary.'}
                        </p>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                From Date
                            </label>
                            <input
                                type="date"
                                value={dateFrom}
                                onChange={(e) => setDateFrom(e.target.value)}
                                className="w-full border border-gray-300 rounded-lg px-3 py-2"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                To Date
                            </label>
                            <input
                                type="date"
                                value={dateTo}
                                onChange={(e) => setDateTo(e.target.value)}
                                className="w-full border border-gray-300 rounded-lg px-3 py-2"
                            />
                        </div>
                    </div>

                    <button
                        onClick={generateReport}
                        disabled={loading}
                        className="w-full bg-blue-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {loading ? 'Generating...' : 'Generate Report'}
                    </button>
                </div>
            </div>

            {/* Download Link */}
            {exportId && (
                <div className="bg-green-50 border border-green-200 rounded-lg p-6">
                    <h3 className="text-lg font-semibold text-green-900 mb-2">Report Ready</h3>
                    <p className="text-sm text-green-700 mb-4">
                        Your report is ready to download. This link expires in 10 minutes.
                    </p>
                    <a
                        href={`/api/exports/${exportId}/download`}
                        download
                        className="inline-block bg-green-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-green-700"
                    >
                        Download CSV
                    </a>
                    {expiresAt && (
                        <p className="mt-2 text-xs text-green-600">
                            Expires: {new Date(expiresAt).toLocaleString()}
                        </p>
                    )}
                </div>
            )}

            {/* Info Box */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mt-6">
                <h4 className="font-medium text-blue-900 mb-2">About Compliance Reports</h4>
                <ul className="text-sm text-blue-800 space-y-1">
                    <li>• Reports are generated on-demand for your specified date range</li>
                    <li>• All exports are tokenized and expire after 10 minutes</li>
                    <li>• Download activity is logged for audit purposes</li>
                    <li>• CSV format is suitable for accounting software</li>
                </ul>
            </div>
        </div>
    );
}
