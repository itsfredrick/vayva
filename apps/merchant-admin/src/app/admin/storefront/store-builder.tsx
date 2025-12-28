
'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Loader2, Monitor, Smartphone, RotateCcw, Save } from 'lucide-react';
import { Button } from '@/components/ui/button'; // Assuming shadcn
// import { useToast } from '@/components/ui/use-toast'; 

import { ChangeTemplateModal } from './change-template-modal';
import { SectionEditor } from './section-editor';

// Types
interface StoreBuilderProps {
    initialDraft: any;
}

export default function StoreBuilder({ initialDraft }: StoreBuilderProps) {
    const router = useRouter();
    const [draft, setDraft] = useState(initialDraft);
    const [selectedSectionId, setSelectedSectionId] = useState<string | null>(null);
    const [viewMode, setViewMode] = useState<'desktop' | 'mobile'>('desktop');
    const [isSaving, setIsSaving] = useState(false);
    const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
    const [isTemplateModalOpen, setIsTemplateModalOpen] = useState(false);

    // Mock Sections if empty
    const sections = draft.sectionOrder?.length > 0
        ? draft.sectionOrder
        : ['header', 'hero', 'products', 'footer'];

    const handleSave = async () => {
        setIsSaving(true);
        try {
            const res = await fetch('/api/storefront/draft', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(draft)
            });
            if (!res.ok) throw new Error('Failed to save');
            setHasUnsavedChanges(false);
            // toast success
        } catch (e) {
            console.error(e);
            // toast error
        } finally {
            setIsSaving(false);
        }
    };

    const handleReset = async (scope: 'ALL' | 'THEME' | 'SECTION') => {
        if (!confirm('Are you sure you want to reset? This cannot be undone.')) return;

        try {
            await fetch('/api/storefront/reset', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ scope, sectionId: selectedSectionId })
            });
            router.refresh(); // Reload server data
        } catch (e) {
            console.error(e);
        }
    };

    return (
        <div className="h-[calc(100vh-64px)] flex flex-col bg-gray-50 overflow-hidden">
            {/* Top Toolbar */}
            <div className="h-14 border-b bg-white flex items-center justify-between px-4 shrink-0">
                <div className="flex items-center gap-4">
                    <h1 className="font-semibold text-sm text-gray-900">Store Builder</h1>
                    <div className="h-4 w-px bg-gray-200" />
                    <span className="text-xs text-gray-500">
                        {hasUnsavedChanges ? 'Unsaved changes' : 'All changes saved'}
                    </span>
                </div>

                <div className="flex items-center gap-2">
                    <Button variant="ghost" size="sm" onClick={() => setIsTemplateModalOpen(true)}>
                        Settings
                    </Button>
                    <div className="h-4 w-px bg-gray-200 mx-2" />
                    <div className="flex items-center bg-gray-100 rounded-md p-1 mr-4">
                        <button
                            onClick={() => setViewMode('desktop')}
                            className={`p-1.5 rounded ${viewMode === 'desktop' ? 'bg-white shadow-sm' : 'text-gray-500'}`}
                        >
                            <Monitor className="w-4 h-4" />
                        </button>
                        <button
                            onClick={() => setViewMode('mobile')}
                            className={`p-1.5 rounded ${viewMode === 'mobile' ? 'bg-white shadow-sm' : 'text-gray-500'}`}
                        >
                            <Smartphone className="w-4 h-4" />
                        </button>
                    </div>

                    <Button variant="outline" size="sm" onClick={() => handleReset('ALL')}>
                        <RotateCcw className="w-4 h-4 mr-2" />
                        Reset
                    </Button>
                    <Button size="sm" onClick={handleSave} disabled={isSaving}>
                        {isSaving ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Save className="w-4 h-4 mr-2" />}
                        Publish
                    </Button>
                </div>
            </div>

            {/* Main Workspace */}
            <div className="flex-1 flex overflow-hidden">

                {/* Left: Sections Panel */}
                <div className="w-64 border-r bg-white flex flex-col shrink-0">
                    <div className="p-4 border-b">
                        <h2 className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Sections</h2>
                    </div>
                    <div className="flex-1 overflow-y-auto p-2 space-y-1">
                        {sections.map((section: string) => (
                            <button
                                key={section}
                                onClick={() => setSelectedSectionId(section)}
                                className={`w-full text-left px-3 py-2 rounded-md text-sm transition-colors ${selectedSectionId === section
                                    ? 'bg-green-50 text-green-700 border border-green-200'
                                    : 'hover:bg-gray-50 text-gray-700'
                                    }`}
                            >
                                {section.charAt(0).toUpperCase() + section.slice(1)}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Center: Preview */}
                <div className="flex-1 bg-gray-100 flex items-center justify-center p-8 relative">
                    <div
                        className={`bg-white shadow-xl transition-all duration-300 overflow-hidden relative ${viewMode === 'mobile' ? 'w-[375px] h-[667px] rounded-3xl border-4 border-gray-900' : 'w-full h-full rounded-lg border border-gray-200'
                            }`}
                    >
                        <iframe
                            key={hasUnsavedChanges ? 'unsaved' : 'saved'} // Rudimentary reload trigger on save
                            src="/preview"
                            className="w-full h-full border-0"
                            title="Store Preview"
                        />
                        {isSaving && (
                            <div className="absolute inset-0 bg-white/50 flex items-center justify-center">
                                <Loader2 className="w-8 h-8 animate-spin text-gray-400" />
                            </div>
                        )}
                    </div>
                </div>

                {/* Right: Editor Panel */}
                <div className="w-80 border-l bg-white flex flex-col shrink-0">
                    {selectedSectionId ? (
                        <>
                            <div className="p-4 border-b flex justify-between items-center">
                                <h2 className="font-semibold text-sm capitalize">{selectedSectionId}</h2>
                                <Button variant="ghost" size="sm" className="h-6 text-xs text-red-500" onClick={() => handleReset('SECTION')}>
                                    Reset
                                </Button>
                            </div>
                            <div className="p-4 pb-20 overflow-y-auto flex-1 h-full">
                                <SectionEditor
                                    sectionId={selectedSectionId}
                                    config={draft.sectionConfig?.[selectedSectionId] || {}}
                                    onChange={(key, value) => {
                                        setDraft((prev: any) => ({
                                            ...prev,
                                            sectionConfig: {
                                                ...prev.sectionConfig,
                                                [selectedSectionId]: {
                                                    ...(prev.sectionConfig?.[selectedSectionId] || {}),
                                                    [key]: value
                                                }
                                            }
                                        }));
                                        setHasUnsavedChanges(true); // Flag change
                                    }}
                                />
                            </div>
                        </>
                    ) : (
                        <div className="flex-1 flex items-center justify-center text-sm text-gray-500 p-8 text-center">
                            Select a section on the left to edit its properties
                        </div>
                    )}
                </div>

            </div>

            {/* Template Modal */}
            <ChangeTemplateModal
                isOpen={isTemplateModalOpen}
                onClose={() => setIsTemplateModalOpen(false)}
                currentTemplateId={draft.activeTemplateId}
            />
        </div>
    );
}
