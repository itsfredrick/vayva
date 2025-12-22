import { GlassPanel, Button, Icon } from '@vayva/ui';
import { StoreTemplate } from '@/types/control-center';
import Link from 'next/link';

interface TemplateCardProps {
    template: StoreTemplate;
    isActive: boolean;
    onSelect: (id: string) => void;
    onPreview: (id: string) => void;
    canSelect: boolean;
}

export function TemplateCard({ template, isActive, onSelect, onPreview, canSelect }: TemplateCardProps) {
    return (
        <GlassPanel className={`group relative overflow-hidden transition-all duration-300 ${isActive ? 'ring-2 ring-primary' : ''}`}>
            {/* Thumbnail Placeholder */}
            <div className="aspect-[4/3] w-full bg-white/5 relative">
                <div className="absolute inset-0 flex items-center justify-center text-white/10 group-hover:text-white/20 transition-colors">
                    <Icon name={"Layout" as any} size={48} />
                </div>
                {/* ID Overlay for debug/clarity */}
                <div className="absolute top-2 right-2 px-2 py-1 bg-black/50 rounded text-xs text-white/50 backdrop-blur-sm">
                    {template.category}
                </div>
            </div>

            <div className="p-4">
                <div className="mb-2">
                    <h3 className="text-lg font-medium text-white flex items-center gap-2">
                        {template.name}
                        {isActive && <Icon name={"CheckCircle" as any} size={16} className="text-primary" />}
                    </h3>
                    <p className="text-sm text-text-secondary line-clamp-2 h-10">{template.description}</p>
                </div>

                <div className="flex gap-2 mt-4">
                    <Button
                        variant="secondary"
                        size="sm"
                        className="flex-1"
                        onClick={() => onPreview(template.id)}
                    >
                        Preview
                    </Button>
                    {isActive ? (
                        <Button variant="outline" size="sm" className="flex-1 cursor-default opacity-50" disabled>
                            Active
                        </Button>
                    ) : (
                        <Button
                            variant="primary"
                            size="sm"
                            className="flex-1"
                            onClick={() => onSelect(template.id)}
                            disabled={!canSelect}
                        >
                            {canSelect ? 'Select' : 'Upgrade'}
                        </Button>
                    )}
                </div>
            </div>

            {/* Lock Overlay for Gated content */}
            {!canSelect && !isActive && (
                <div className="absolute inset-0 z-10 flex items-center justify-center bg-black/60 backdrop-blur-[2px]">
                    <div className="text-center p-4">
                        <Icon name={"Lock" as any} size={24} className="mx-auto mb-2 text-white/70" />
                        <p className="text-sm font-medium text-white">Upgrade to unlock</p>
                    </div>
                </div>
            )}
        </GlassPanel>
    );
}
