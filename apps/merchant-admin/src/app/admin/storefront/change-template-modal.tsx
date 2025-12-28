
'use client';

import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog'; // Assuming these exist
import { Button } from '@/components/ui/button';
import { Loader2, AlertTriangle } from 'lucide-react';
import { useRouter } from 'next/navigation';

interface ChangeTemplateModalProps {
    isOpen: boolean;
    onClose: () => void;
    currentTemplateId: string;
}

// Mock available templates for V1 switch (ideally fetched from API)
const AVAILABLE_TEMPLATES = [
    { id: 'simple-retail', name: 'Simple Retail', description: 'Clean, product-focused layout.' },
    { id: 'perfume-luxury', name: 'Luxury (Perfume)', description: 'Elegant dark mode for premium items.' },
    { id: 'food-catering', name: 'Food & Catering', description: 'Menu-focused for food businesses.' },
];

export function ChangeTemplateModal({ isOpen, onClose, currentTemplateId }: ChangeTemplateModalProps) {
    const router = useRouter();
    const [selectedTemplateId, setSelectedTemplateId] = useState<string | null>(null);
    const [isSwitching, setIsSwitching] = useState(false);

    const handleSwitch = async () => {
        if (!selectedTemplateId) return;
        setIsSwitching(true);
        try {
            const res = await fetch('/api/storefront/draft', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    activeTemplateId: selectedTemplateId,
                    // We reset specific configs on switch to avoid incompatible keys
                    themeConfig: {},
                    sectionConfig: {}
                })
            });

            if (!res.ok) throw new Error("Failed to switch");

            router.refresh();
            onClose();
        } catch (e) {
            console.error(e);
            alert("Failed to switch template");
        } finally {
            setIsSwitching(false);
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle>Change Template</DialogTitle>
                    <DialogDescription>
                        Switching templates will apply new styles. Your product data will remain safe, but you may need to reconfigure some visuals.
                    </DialogDescription>
                </DialogHeader>

                <div className="space-y-4 py-4">
                    <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4">
                        <div className="flex">
                            <div className="flex-shrink-0">
                                <AlertTriangle className="h-5 w-5 text-yellow-400" aria-hidden="true" />
                            </div>
                            <div className="ml-3">
                                <p className="text-sm text-yellow-700">
                                    Current design customizations (colors, fonts) will be reset to the new template default.
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="grid gap-2">
                        {AVAILABLE_TEMPLATES.map(template => (
                            <div
                                key={template.id}
                                onClick={() => setSelectedTemplateId(template.id)}
                                className={`cursor-pointer rounded-lg border p-4 hover:border-green-500 transition-all ${selectedTemplateId === template.id ? 'border-green-500 ring-1 ring-green-500 bg-green-50' : 'border-gray-200'
                                    } ${currentTemplateId === template.id ? 'opacity-50 pointer-events-none' : ''}`}
                            >
                                <div className="flex justify-between items-center">
                                    <h3 className="font-semibold text-sm">{template.name}</h3>
                                    {currentTemplateId === template.id && <span className="text-xs text-gray-500">Current</span>}
                                </div>
                                <p className="text-xs text-gray-500 mt-1">{template.description}</p>
                            </div>
                        ))}
                    </div>
                </div>

                <DialogFooter>
                    <Button variant="ghost" onClick={onClose} disabled={isSwitching}>Cancel</Button>
                    <Button onClick={handleSwitch} disabled={!selectedTemplateId || isSwitching}>
                        {isSwitching ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
                        Switch to Selected
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
