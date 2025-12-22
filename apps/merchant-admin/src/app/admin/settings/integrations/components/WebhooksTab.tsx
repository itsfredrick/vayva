'use client';

import { useState } from 'react';
import { GlassPanel, Button, StatusChip } from '@vayva/ui';
import { createWebhook, deleteWebhook } from '../actions';
import { Trash2, Plus, RefreshCw } from 'lucide-react';

export function WebhooksTab({ webhooks }: { webhooks: any[] }) {
    const [isCreating, setIsCreating] = useState(false);

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h3 className="text-lg font-medium text-foreground">Webhooks</h3>
                    <p className="text-sm text-muted-foreground">Receive real-time notifications for store events.</p>
                </div>
                <Button onClick={() => setIsCreating(true)}>
                    <Plus className="w-4 h-4 mr-2" />
                    Add Endpoint
                </Button>
            </div>

            {isCreating && (
                <CreateWebhookForm
                    onCancel={() => setIsCreating(false)}
                    onSuccess={() => setIsCreating(false)}
                />
            )}

            <div className="grid gap-4">
                {webhooks.map(hook => (
                    <GlassPanel key={hook.id} className="p-4">
                        <div className="flex justify-between items-start">
                            <div className="break-all">
                                <div className="font-medium flex items-center gap-2">
                                    {hook.url}
                                    <StatusChip status={hook.isActive ? 'active' : 'inactive'} />
                                </div>
                                <div className="text-sm text-muted-foreground mt-1 flex gap-2 flex-wrap">
                                    {hook.events.map((ev: string) => (
                                        <span key={ev} className="bg-accent/10 px-1.5 py-0.5 rounded text-xs">{ev}</span>
                                    ))}
                                </div>
                                <div className="text-xs text-muted-foreground mt-2 font-mono">
                                    Secret: {hook.secret.substring(0, 8)}...
                                </div>
                            </div>
                            <div className="flex gap-2">
                                <Button
                                    variant="destructive"
                                    size="sm"
                                    onClick={async () => {
                                        if (confirm('Delete this webhook?')) {
                                            await deleteWebhook(hook.id);
                                        }
                                    }}
                                >
                                    <Trash2 className="w-4 h-4 mr-2" />
                                    Delete
                                </Button>
                            </div>
                        </div>
                    </GlassPanel>
                ))}
                {webhooks.length === 0 && (
                    <div className="text-center py-8 text-muted-foreground">No webhooks configured</div>
                )}
            </div>
        </div>
    );
}

function CreateWebhookForm({ onCancel, onSuccess }: { onCancel: () => void, onSuccess: () => void }) {
    const [url, setUrl] = useState('');
    // Simple event selection for v1
    const [events, setEvents] = useState<string[]>(['order.created']);
    const [loading, setLoading] = useState(false);

    const AVAILABLE_EVENTS = ['order.created', 'order.updated', 'product.updated', 'customer.created'];

    function toggleEvent(ev: string) {
        if (events.includes(ev)) setEvents(events.filter(e => e !== ev));
        else setEvents([...events, ev]);
    }

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        setLoading(true);
        const formData = new FormData();
        formData.append('url', url);
        formData.append('events', JSON.stringify(events));

        const res = await createWebhook(formData);
        setLoading(false);
        if (res.success) {
            onSuccess();
        } else {
            alert(res.error || 'Failed');
        }
    }

    return (
        <GlassPanel className="p-4 border-primary/50">
            <form onSubmit={handleSubmit} className="space-y-4">
                <h4 className="font-medium">Add Webhook Endpoint</h4>
                <div>
                    <label className="text-sm block mb-1">Endpoint URL</label>
                    <input
                        className="w-full bg-background/50 border border-border rounded px-3 py-2 outline-none focus:border-primary"
                        value={url}
                        onChange={e => setUrl(e.target.value)}
                        placeholder="https://api.yourapp.com/webhooks"
                        type="url"
                        required
                    />
                </div>
                <div>
                    <label className="text-sm block mb-1">Events</label>
                    <div className="flex flex-wrap gap-2">
                        {AVAILABLE_EVENTS.map(ev => (
                            <button
                                key={ev}
                                type="button"
                                onClick={() => toggleEvent(ev)}
                                className={`text-xs px-2 py-1 rounded border ${events.includes(ev) ? 'bg-primary/20 border-primary text-primary-foreground' : 'bg-background border-border text-muted-foreground'}`}
                            >
                                {ev}
                            </button>
                        ))}
                    </div>
                </div>
                <div className="flex justify-end gap-2">
                    <Button type="button" variant="ghost" onClick={onCancel}>Cancel</Button>
                    <Button type="submit" isLoading={loading}>Add Webhook</Button>
                </div>
            </form>
        </GlassPanel>
    )
}
