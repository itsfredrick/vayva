"use client";

import { FileText, Download } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@vayva/ui";

export default function StatementsPage() {
    const statements = generatePastMonths(12);

    const handleDownload = (statement: { month: string; year: number }) => {
        toast.success(`Generating statement for ${statement.month} ${statement.year}...`);
        // In a real app, this would trigger a server-side PDF generation job
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight text-slate-900">Statements</h1>
                    <p className="text-slate-500">Monthly financial statements for accounting.</p>
                </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left">
                        <thead className="bg-slate-50 text-slate-600 font-medium border-b border-slate-100">
                            <tr>
                                <th className="px-6 py-3">Period</th>
                                <th className="px-6 py-3">Format</th>
                                <th className="px-6 py-3 text-right">Action</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {statements.map((stmt, idx) => (
                                <tr key={idx} className="hover:bg-slate-50/50">
                                    <td className="px-6 py-4 flex items-center gap-3">
                                        <div className="h-8 w-8 rounded-lg bg-indigo-50 flex items-center justify-center text-indigo-600">
                                            <FileText className="h-4 w-4" />
                                        </div>
                                        <span className="font-medium text-slate-900">
                                            {stmt.month} {stmt.year}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-slate-500">PDF, CSV</td>
                                    <td className="px-6 py-4 text-right">
                                        <Button
                                            onClick={() => handleDownload(stmt)}
                                            variant="ghost"
                                            size="sm"
                                            className="text-indigo-600 hover:text-indigo-700 hover:bg-indigo-50 font-medium h-8"
                                        >
                                            <Download className="h-4 w-4 mr-2" />
                                            Download
                                        </Button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}

function generatePastMonths(count: number) {
    const result = [];
    const date = new Date();

    // Start from previous month
    date.setDate(1);
    date.setMonth(date.getMonth() - 1);

    for (let i = 0; i < count; i++) {
        result.push({
            month: date.toLocaleString('default', { month: 'long' }),
            year: date.getFullYear()
        });
        date.setMonth(date.getMonth() - 1);
    }
    return result;
}
