'use client';

import { useState } from 'react';
import { GlassPanel, Button, StatusChip } from '@vayva/ui';
import { toggleFlag, createFlag, updateFlagRules } from '../actions';
import { Edit2, Plus, AlertTriangle } from 'lucide-react';

export function FlagList({ flags }: { flags: any[] }) {
    const [isCreating, setIsCreating] = useState(false);
    const [editingId, setEditingId] = useState<string | null>(null);

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-2xl font-bold">Feature Flags & Kill Switches</h1>
                <Button onClick={() => setIsCreating(true)} icon={<Plus className="w-4 h-4" />}>
                    New Flag
                </Button>
            </div>

            {isCreating && (
                <CreateFlagForm onCancel={() => setIsCreating(false)} />
            )}

            {editingId && (
                <EditRulesModal
                    flag={flags.find(f => f.id === editingId)}
                    onClose={() => setEditingId(null)}
                />
            )}

            <div className="grid gap-3">
                {flags.map(flag => (
                    <GlassPanel key={flag.id} className="p-4 flex items-center justify-between">
                        <div>
                            <div className="font-mono font-bold text-lg text-primary">{flag.key}</div>
                            <div className="text-sm text-muted-foreground">{flag.description}</div>
                            {Object.keys(flag.rules as object).length > 0 && (
                                <div className="mt-1 text-xs bg-yellow-500/10 text-yellow-500 px-2 py-0.5 rounded inline-flex items-center gap-1">
                                    <AlertTriangle className="w-3 h-3" />
                                    Has Custom Rules
                                </div>
                            )}
                        </div>
                        <div className="flex items-center gap-4">
                            <div className="flex items-center gap-2">
                                <span className={flag.enabled ? 'text-green-400 font-bold' : 'text-muted-foreground'}>
                                    {flag.enabled ? 'ON' : 'OFF'}
                                </span>
                                <Button
                                    size="sm"
                                    variant={flag.enabled ? 'danger' : 'outline'}
                                    onClick={async () => await toggleFlag(flag.id, !flag.enabled)}
                                >
                                    {flag.enabled ? 'Disable' : 'Enable'}
                                </Button>
                            </div>
                            <Button size="sm" variant="ghost" icon={<Edit2 className="w-4 h-4" />} onClick={() => setEditingId(flag.id)}>
                                Rules
                            </Button>
                        </div>
                    </GlassPanel>
                ))}
            </div>
        </div>
    );
}

function CreateFlagForm({ onCancel }: { onCancel: () => void }) {
    const [key, setKey] = useState('');
    const [desc, setDesc] = useState('');

    return (
        <GlassPanel className="p-4 border-primary/50 mb-4">
            <form action={async () => { await createFlag(key, desc); onCancel(); }} className="space-y-3">
                <input className="w-full bg-background/50 border border-border rounded px-3 py-2" placeholder="Flag Key (e.g. feature.new_checkout)" value={key} onChange={e => setKey(e.target.value)} required />
                <input className="w-full bg-background/50 border border-border rounded px-3 py-2" placeholder="Description" value={desc} onChange={e => setDesc(e.target.value)} required />
                <div className="flex justify-end gap-2">
                    <Button type="button" variant="ghost" onClick={onCancel}>Cancel</Button>
                    <Button type="submit">Create</Button>
                </div>
            </form>
        </GlassPanel>
    )
}

function EditRulesModal({ flag, onClose }: { flag: any, onClose: () => void }) {
    const [json, setJson] = useState(JSON.stringify(flag.rules, null, 2));

    return (
        <div className="fixed inset-0 bg-black/50 backdrop-blur flex items-center justify-center z-50">
            <GlassPanel className="w-full max-w-lg p-6 bg-background border-border">
                <h3 className="text-xl font-bold mb-4">Edit Rules: {flag.key}</h3>
                <p className="text-xs text-muted-foreground mb-2">Configure allowlists, blocklists, rollout %.</p>
                <textarea
                    className="w-full h-64 bg-black/40 font-mono text-sm p-3 rounded border border-white/10"
                    value={json}
                    onChange={e => setJson(e.target.value)}
                />
                <div className="flex justify-end gap-2 mt-4">
                    <Button variant="ghost" onClick={onClose}>Cancel</Button>
                    <Button onClick={async () => {
                        const res = await updateFlagRules(flag.id, json);
                        if (res.success) onClose();
                        else alert(res.error);
                    }}>Save Rules</Button>
                </div>
            </GlassPanel>
        </div>
    )
}
