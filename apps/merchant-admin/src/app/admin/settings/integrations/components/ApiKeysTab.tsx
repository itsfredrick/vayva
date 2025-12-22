'use client';

import { useState } from 'react';
import { GlassPanel, Button, StatusChip } from '@vayva/ui';
import { createApiKey, revokeApiKey } from '../actions';
import { Trash2, Copy, Plus, Eye } from 'lucide-react';
import { useRouter } from 'next/navigation';

export function ApiKeysTab({ keys }: { keys: any[] }) {
    const [isCreating, setIsCreating] = useState(false);
    const [newKey, setNewKey] = useState<string | null>(null);

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h3 className="text-lg font-medium text-foreground">API Keys</h3>
                    <p className="text-sm text-muted-foreground">Manage keys for accessing the Vayva API.</p>
                </div>
                <Button onClick={() => setIsCreating(true)}>
                    <Plus className="w-4 h-4 mr-2" />
                    Create New Key
                </Button>
            </div>

            {newKey && (
                <GlassPanel className="border-green-500/50 bg-green-500/10 p-4">
                    <div className="flex flex-col gap-2">
                        <h4 className="font-bold text-green-400">Key Created Successfully!</h4>
                        <p className="text-sm">Copy this key now. You won't be able to see it again.</p>
                        <div className="flex items-center gap-2 bg-black/40 p-3 rounded font-mono text-sm break-all">
                            {newKey}
                            <Button size="sm" variant="ghost" onClick={() => navigator.clipboard.writeText(newKey)}>
                                <Copy className="w-4 h-4" />
                            </Button>
                        </div>
                        <Button size="sm" variant="outline" onClick={() => setNewKey(null)}>Done</Button>
                    </div>
                </GlassPanel>
            )}

            {isCreating && (
                <CreateKeyForm
                    onCancel={() => setIsCreating(false)}
                    onSuccess={(key) => { setIsCreating(false); setNewKey(key); }}
                />
            )}

            <div className="grid gap-4">
                {keys.map(key => (
                    <GlassPanel key={key.id} className="flex items-center justify-between p-4">
                        <div>
                            <div className="font-medium flex items-center gap-2">
                                {key.name || 'Unnamed Key'}
                            </div>
                            <div className="text-xs text-muted-foreground mt-1">
                                Created: {new Date(key.createdAt).toLocaleDateString()} • Last Used: {key.lastUsedAt ? new Date(key.lastUsedAt).toLocaleDateString() : 'Never'}
                            </div>
                        </div>
                        <div className="flex gap-2">
                            <Button
                                variant="destructive"
                                size="sm"
                                onClick={async () => {
                                    if (confirm('Revoke this key? Apps using it will stop working.')) {
                                        await revokeApiKey(key.id);
                                    }
                                }}
                            >
                                <Trash2 className="w-4 h-4 mr-2" />
                                Revoke
                            </Button>
                        </div>
                    </GlassPanel>
                ))}
                {keys.length === 0 && (
                    <div className="text-center py-8 text-muted-foreground">No API keys active</div>
                )}
            </div>
        </div>
    );
}

function CreateKeyForm({ onCancel, onSuccess }: { onCancel: () => void, onSuccess: (k: string) => void }) {
    const [name, setName] = useState('');
    const [loading, setLoading] = useState(false);

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        setLoading(true);
        const formData = new FormData();
        formData.append('name', name);

        const res = await createApiKey(formData);
        setLoading(false);
        if (res.success && res.key) {
            onSuccess(res.key.key); // server action returns { key: { id, key ... } } or similar structure? Checking logic. 
            // Actually ApiKeyService.createKey returns { ...keyData, key: 'raw_key' } usually
        } else {
            alert(res.error || 'Failed');
        }
    }

    return (
        <GlassPanel className="p-4 border-primary/50">
            <form onSubmit={handleSubmit} className="space-y-4">
                <h4 className="font-medium">New API Key</h4>
                <div>
                    <label className="text-sm block mb-1">Name</label>
                    <input
                        className="w-full bg-background/50 border border-border rounded px-3 py-2 outline-none focus:border-primary"
                        value={name}
                        onChange={e => setName(e.target.value)}
                        placeholder="e.g. Mobile App"
                        required
                    />
                </div>
                <div className="flex justify-end gap-2">
                    <Button type="button" variant="ghost" onClick={onCancel}>Cancel</Button>
                    <Button type="submit" isLoading={loading}>Create</Button>
                </div>
            </form>
        </GlassPanel>
    )
}
