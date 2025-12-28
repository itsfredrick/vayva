'use client';

import { useState } from 'react';
import { Button, Input, GlassPanel, AppShell } from '@vayva/ui';

export default function WhatsAppDebugPage() {
    const [message, setMessage] = useState('Please deliver to: John Buyer, 12 Victoria Island, Lagos');
    const [phone, setPhone] = useState('08012345678');
    const [result, setResult] = useState<any>(null);
    const [loading, setLoading] = useState(false);

    const handleSimulate = async () => {
        setLoading(true);
        try {
            // Hardcode a storeId for testing or fetch from session if available
            // In a real debug tool we'd pick the store
            const res = await fetch('/api/debug/mock-whatsapp-order', {
                method: 'POST',
                body: JSON.stringify({
                    message,
                    customerPhone: phone,
                    storeId: 'test-store-id' // Ideally we get this from context, but for verify we might just fail if auth wrapper isn't there
                })
            });
            const data = await res.json();
            setResult(data);
        } catch (err) {
            console.error(err);
            setResult({ error: 'Failed to request' });
        } finally {
            setLoading(false);
        }
    };

    return (
        <AppShell sidebar={<></>} header={<></>}>
            <div className="p-8 max-w-2xl mx-auto">
                <GlassPanel className="p-6 space-y-4">
                    <h1 className="text-xl font-bold text-white">Mock WhatsApp Order Trigger</h1>
                    <p className="text-gray-400 text-sm">Simulate an incoming message that triggers the AI Agent order flow.</p>

                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-1">Customer Message</label>
                        <textarea
                            className="w-full p-2 rounded bg-white/10 text-white border border-white/20"
                            rows={3}
                            value={message}
                            onChange={e => setMessage(e.target.value)}
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-1">Customer Phone</label>
                        <Input value={phone} onChange={e => setPhone(e.target.value)} />
                    </div>

                    <Button onClick={handleSimulate} isLoading={loading}>Simulate "Create Order"</Button>

                    {result && (
                        <div className="mt-4 p-4 bg-black/50 rounded-lg overflow-auto">
                            <pre className="text-xs text-green-400 font-mono">
                                {JSON.stringify(result, null, 2)}
                            </pre>
                        </div>
                    )}
                </GlassPanel>
            </div>
        </AppShell>
    );
}
