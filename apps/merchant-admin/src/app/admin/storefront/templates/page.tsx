'use client';

import React, { useState, useEffect } from 'react';
import { AdminShell } from '@/components/admin-shell';
import { Button, Icon, cn } from '@vayva/ui';
import { api } from '@/services/api';

export default function TemplateGalleryPage() {
    const [templates, setTemplates] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    const fetchTemplates = async () => {
        try {
            const res = await api.get('/themes/templates');
            setTemplates(res.data || []);
        } catch (err) {
            console.error(err);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchTemplates();
    }, []);

    const handleApply = async (templateKey: string) => {
        try {
            await api.post('/themes/theme/apply', { templateKey });
            window.location.href = '/admin/storefront/customize';
        } catch (err) {
            console.error(err);
        }
    };

    return (
        <AdminShell title="Templates" breadcrumb="Storefront">
            <div className="max-w-6xl mx-auto flex flex-col gap-8">

                <div>
                    <h1 className="text-2xl font-bold text-[#0B1220] mb-2">Choose a Website Template</h1>
                    <p className="text-[#525252]">Select a professional template for your storefront.</p>
                </div>

                {isLoading ? (
                    <div className="text-center text-gray-400 py-12">Loading templates...</div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {templates.map(template => (
                            <div key={template.id} className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden hover:shadow-lg transition-all">
                                <div className="aspect-video bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center">
                                    <Icon name={"Layout" as any} size={48} className="text-gray-300" />
                                </div>
                                <div className="p-6">
                                    <h3 className="font-bold text-[#0B1220] mb-2">{template.name}</h3>
                                    <p className="text-sm text-[#525252] mb-4">{template.description}</p>
                                    <div className="flex gap-2 mb-4">
                                        <span className="text-xs bg-green-50 text-green-600 px-2 py-1 rounded font-bold">Nigeria-ready</span>
                                        <span className="text-xs bg-blue-50 text-blue-600 px-2 py-1 rounded font-bold">WhatsApp-first</span>
                                    </div>
                                    <div className="flex gap-2">
                                        <Button variant="outline" size="sm" className="flex-1">Preview</Button>
                                        <Button size="sm" className="flex-1" onClick={() => handleApply(template.key)}>
                                            Apply
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

            </div>
        </AdminShell>
    );
}
