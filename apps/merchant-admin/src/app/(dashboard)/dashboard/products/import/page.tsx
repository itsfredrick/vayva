'use client';

import React, { useState, useEffect } from 'react';
import { Icon } from '@vayva/ui'; // Mock or lucide
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';

export default function ProductImportPage() {
    const router = useRouter();
    const [step, setStep] = useState(1); // 1=Upload, 2=Preview, 3=Running, 4=Complete
    const [fileUrl, setFileUrl] = useState('');
    const [fileName, setFileName] = useState('');
    const [jobId, setJobId] = useState('');
    const [validation, setValidation] = useState<any>(null);
    const [importResult, setImportResult] = useState<any>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    // --- STEP 1: UPLOAD ---
    const handleFileSelect = async (e: any) => {
        const file = e.target.files[0];
        if (!file) return;

        // In real app, upload to S3 here.
        // For V1 mock, we use a data URL or mock URL
        // Simple trick: create object URL for local preview, but backend needs access.
        // Since V1 backend mock fetches via 'mock://', let's use that for dev testing 
        // OR simulate upload by just passing filename if we Mock the validation content.

        setLoading(true);
        // Simulate upload
        setTimeout(async () => {
            // Create Job with "mock://" URL for testing logic
            setFileName(file.name);
            const fakeUrl = 'mock://test.csv'; // Trigger mock content in backend
            setFileUrl(fakeUrl);

            try {
                const res = await fetch('/api/merchant/imports/init', {
                    method: 'POST',
                    body: JSON.stringify({ filename: file.name, fileUrl: fakeUrl })
                });
                if (!res.ok) throw new Error('Init Failed');
                const job = await res.json();
                setJobId(job.id);
                setStep(2); // Go to Preview/Validate automatically? Or Map?
                // Plan says Upload -> Map -> Preview.
                // We'll skip Mapping UI for V1 (assume auto-map) and go straight to Validation Preview.
                validateJob(job.id);
            } catch (err: any) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        }, 1000);
    };

    // --- STEP 2: VALIDATE ---
    const validateJob = async (id: string) => {
        try {
            setLoading(true);
            const res = await fetch('/api/merchant/imports/validate', {
                method: 'POST',
                body: JSON.stringify({ jobId: id })
            });
            if (!res.ok) throw new Error('Validation Failed');
            const job = await res.json();
            setValidation(job); // Contains preview, counts
            setStep(2);
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    // --- STEP 3: RUN ---
    const runImport = async () => {
        try {
            setStep(3);
            const res = await fetch('/api/merchant/imports/run', {
                method: 'POST',
                body: JSON.stringify({ jobId })
            });
            if (!res.ok) throw new Error('Run Failed');

            // Poll for completion
            pollStatus();
        } catch (err: any) {
            setError(err.message);
            setStep(2); // Back to validate?
        }
    };

    const pollStatus = async () => {
        const interval = setInterval(async () => {
            const res = await fetch(`/api/merchant/imports/${jobId}`);
            const job = await res.json();
            if (job.status === 'completed' || job.status === 'failed') {
                clearInterval(interval);
                setImportResult(job);
                setStep(4);
            }
        }, 1000);
    };

    return (
        <div className="max-w-4xl mx-auto py-12 px-6">
            <div className="mb-8">
                <button onClick={() => router.back()} className="text-sm text-gray-500 hover:text-black mb-2 flex items-center gap-1">
                    <Icon name={"ArrowLeft" as any} size={14} /> Back to Products
                </button>
                <h1 className="text-2xl font-bold">Import Products</h1>
                <p className="text-gray-500">Upload a CSV file to bulk add products.</p>
            </div>

            {/* Stepper Stub */}
            <div className="flex items-center gap-4 mb-8 text-sm text-gray-400">
                <span className={step >= 1 ? 'text-black font-bold' : ''}>1. Upload</span>
                <span>&rarr;</span>
                <span className={step >= 2 ? 'text-black font-bold' : ''}>2. Preview</span>
                <span>&rarr;</span>
                <span className={step >= 3 ? 'text-black font-bold' : ''}>3. Import</span>
            </div>

            <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-8 min-h-[400px]">
                {error && <div className="bg-red-50 text-red-600 p-4 rounded-lg mb-4">{error}</div>}

                {/* STEP 1: UPLOAD */}
                {step === 1 && (
                    <div className="flex flex-col items-center justify-center h-full py-12 border-2 border-dashed border-gray-200 rounded-xl hover:bg-gray-50 transition">
                        <Icon name={"UploadCloud" as any} size={48} className="text-gray-300 mb-4" />
                        <p className="font-bold text-gray-700 mb-2">Click to upload CSV</p>
                        <p className="text-sm text-gray-400 mb-6">or drag and drop file here</p>
                        <input
                            type="file"
                            accept=".csv"
                            onChange={handleFileSelect}
                            className="absolute inset-0 opacity-0 cursor-pointer"
                        />
                        {loading && <p className="text-green-600 animate-pulse">Uploading...</p>}
                    </div>
                )}

                {/* STEP 2: PREVIEW / VALIDATE */}
                {step === 2 && validation && (
                    <div>
                        <div className="flex items-center justify-between mb-6">
                            <div>
                                <h3 className="font-bold text-lg">Verification</h3>
                                <p className="text-sm text-gray-500">Review the data before importing.</p>
                            </div>
                            <div className="flex gap-4 text-sm">
                                <div className="text-center">
                                    <span className="block font-bold text-green-600 text-xl">{validation.validRows}</span>
                                    <span className="text-gray-400">Valid</span>
                                </div>
                                <div className="text-center">
                                    <span className="block font-bold text-red-600 text-xl">{validation.invalidRows}</span>
                                    <span className="text-gray-400">Invalid</span>
                                </div>
                            </div>
                        </div>

                        {/* Preview Table */}
                        <div className="bg-gray-50 rounded-lg overflow-hidden border border-gray-200 mb-6">
                            <table className="w-full text-sm text-left">
                                <thead className="bg-gray-100 text-gray-500 font-medium">
                                    <tr>
                                        <th className="p-3">Name</th>
                                        <th className="p-3">Price</th>
                                        <th className="p-3">Stock</th>
                                        <th className="p-3">Category</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {validation.summary?.preview?.map((row: any, i: number) => (
                                        <tr key={i} className="border-t border-gray-200">
                                            <td className="p-3 font-medium">{row.name}</td>
                                            <td className="p-3 text-green-600">₦{row.price}</td>
                                            <td className="p-3">{row.stock}</td>
                                            <td className="p-3"><span className="bg-gray-200 px-2 py-0.5 rounded text-xs">{row.category}</span></td>
                                        </tr>
                                    ))}
                                    {validation.summary?.preview?.length === 0 && (
                                        <tr><td colSpan={4} className="p-4 text-center text-gray-400">No valid preview data</td></tr>
                                    )}
                                </tbody>
                            </table>
                        </div>

                        {validation.summary?.errors?.length > 0 && (
                            <div className="bg-red-50 p-4 rounded-lg mb-6 max-h-40 overflow-y-auto">
                                <h4 className="font-bold text-xs uppercase text-red-700 mb-2">Errors</h4>
                                {validation.summary.errors.map((e: any, i: number) => (
                                    <div key={i} className="text-xs text-red-600 mb-1">Row {e.row}: {e.msgs.join(', ')}</div>
                                ))}
                            </div>
                        )}

                        <div className="flex justify-end gap-3">
                            <button onClick={() => setStep(1)} className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg">Cancel</button>
                            <button
                                onClick={runImport}
                                disabled={validation.validRows === 0}
                                className="px-6 py-2 bg-black text-white rounded-lg font-bold hover:bg-gray-900 disabled:opacity-50"
                            >
                                Import {validation.validRows} Products
                            </button>
                        </div>
                    </div>
                )}

                {/* STEP 3: RUNNING */}
                {step === 3 && (
                    <div className="text-center py-20">
                        <div className="w-16 h-16 border-4 border-gray-100 border-t-black rounded-full animate-spin mx-auto mb-6" />
                        <h3 className="font-bold text-xl mb-2">Importing...</h3>
                        <p className="text-gray-500">Please do not close this window.</p>
                    </div>
                )}

                {/* STEP 4: COMPLETE */}
                {step === 4 && importResult && (
                    <div className="text-center py-12">
                        <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
                            <Icon name={"Check" as any} size={32} />
                        </div>
                        <h3 className="font-bold text-2xl mb-2">Import Complete</h3>
                        <p className="text-gray-500 mb-8">Successfully processed {importResult.processedRows} rows.</p>

                        <div className="flex justify-center gap-4">
                            <button onClick={() => router.push('/dashboard/products')} className="px-6 py-2 border border-gray-200 rounded-lg font-bold hover:bg-gray-50">
                                View Products
                            </button>
                            <button onClick={() => { setStep(1); setValidation(null); setImportResult(null); }} className="px-6 py-2 bg-black text-white rounded-lg font-bold hover:bg-gray-900">
                                Import More
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
