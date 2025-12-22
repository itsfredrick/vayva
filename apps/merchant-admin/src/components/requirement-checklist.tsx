
import React from 'react';
import { Icon } from '@vayva/ui';

type Item = {
    label: string;
    met: boolean;
    link?: string;
};

const ICON_MAP: Record<string, string> = {
    'done': 'Check',
    'pending': 'Clock',
    'error': 'AlertTriangle',
    'check': 'Check',
    'priority_high': 'AlertCircle'
};

export function RequirementChecklist({ items }: { items: Item[] }) {
    return (
        <div className="space-y-3">
            {items.map((item, i) => (
                <div key={i} className="flex items-start justify-between p-3 bg-white/5 rounded-lg border border-white/5">
                    <div className="flex items-start gap-3">
                        <div className={`mt - 0.5 w - 5 h - 5 rounded - full flex items - center justify - center shrink - 0 ${item.met ? 'bg-state-success/20 text-state-success' : 'bg-state-warning/20 text-state-warning'} `}>
                            <Icon name={(item.met ? 'Check' : 'AlertTriangle') as any} size={14} />
                        </div>
                        <span className={`text - sm ${item.met ? 'text-white' : 'text-text-secondary'} `}>{item.label}</span>
                    </div>
                    {!item.met && item.link && (
                        <button className="text-xs text-primary font-bold hover:underline whitespace-nowrap ml-4">
                            Fix now
                        </button>
                    )}
                </div>
            ))}
        </div>
    );
}
