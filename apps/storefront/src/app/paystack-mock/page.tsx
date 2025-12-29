'use client';

import React, { useState, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';

function PaystackMockContent() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const reference = searchParams.get('reference');
    const amount = searchParams.get('amount');
    const [loading, setLoading] = useState(false);

    const handleSimulate = async (status: 'success' | 'failed') => {
        setLoading(true);
        // Simulate webhook call to backend (Gateway -> Payments Service)
        try {
            if (status === 'success') {
                const apiBase = (process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/v1').replace(/\/v1$/, '');
                await fetch(`${apiBase}/webhooks/paystack`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        event: 'charge.success',
                        data: {
                            reference,
                            status: 'success',
                            amount: Number(amount),
                            id: Math.floor(Math.random() * 1000000000)
                        }
                    })
                });
            } else {
                // Simulate failure (optional, based on requirements)
                // Just redirecting back is enough to trigger verify fail
            }
        } catch (e) {
            console.error('Webhook simulation failed', e);
        }

        // Redirect back to confirmation
        // Note: In real life, Paystack redirects back and we call Verify API.
        // Our webhook simulation already updated the DB, so Verify will return SUCCESS.
        router.push(`/order/confirmation?reference=${reference}&store=demo`); // slug demo for now
    };

    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4 font-sans">
            <div className="bg-white max-w-md w-full rounded-2xl shadow-xl overflow-hidden">
                <div className="bg-[#011b33] p-8 text-white flex justify-between items-center">
                    <div>
                        <h1 className="text-xl font-bold italic tracking-tighter">paystack</h1>
                        <p className="text-[10px] opacity-70 uppercase tracking-widest mt-1">Checkout Simulation</p>
                    </div>
                    <div className="text-right">
                        <p className="text-xs opacity-70">Pay</p>
                        <p className="text-xl font-bold">₦{(Number(amount) / 100).toLocaleString()}</p>
                    </div>
                </div>

                <div className="p-10 space-y-8">
                    <div className="text-center">
                        <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                            <span className="text-2xl font-bold">P</span>
                        </div>
                        <h2 className="text-lg font-bold">Transaction Reference</h2>
                        <code className="bg-gray-100 px-3 py-1 rounded text-sm text-gray-600 mt-2 inline-block font-mono">
                            {reference || 'N/A'}
                        </code>
                    </div>

                    <div className="space-y-3">
                        <button
                            onClick={() => handleSimulate('success')}
                            disabled={loading}
                            className="w-full bg-[#3bb75e] text-white py-4 rounded-lg font-bold hover:bg-[#34a353] transition-colors disabled:opacity-50"
                        >
                            {loading ? 'Processing...' : 'Simulate Successful Payment'}
                        </button>
                        <button
                            onClick={() => handleSimulate('failed')}
                            disabled={loading}
                            className="w-full bg-white text-red-500 border border-red-100 py-4 rounded-lg font-bold hover:bg-red-50 transition-colors disabled:opacity-50"
                        >
                            Simulate Payment Failure
                        </button>
                    </div>

                    <p className="text-[10px] text-gray-400 text-center uppercase tracking-widest leading-loose">
                        Securely processed by Paystack Mock<br />
                        This is a simulated environment
                    </p>
                </div>
            </div>
        </div>
    );
}

export default function PaystackMockPage() {
    return (
        <Suspense fallback={<div>Loading simulation...</div>}>
            <PaystackMockContent />
        </Suspense>
    );
}
