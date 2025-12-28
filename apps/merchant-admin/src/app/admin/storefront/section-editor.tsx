
import React from 'react';
import { Input } from '@/components/ui/input'; // Assuming standard shadcn input
import { Label } from '@/components/ui/label'; // You might need to install label too, or just use <label>
import { Textarea } from '@/components/ui/textarea';

interface SectionEditorProps {
    sectionId: string;
    config: any;
    onChange: (key: string, value: any) => void;
}

export function SectionEditor({ sectionId, config, onChange }: SectionEditorProps) {
    const handleChange = (key: string, value: any) => {
        onChange(key, value);
    };

    // Helper: Simple Field Renderer
    const renderField = (key: string, label: string, type: 'text' | 'color' | 'textarea' = 'text') => {
        const val = config?.[key] || '';
        return (
            <div className="space-y-2 mb-4">
                <label className="text-xs font-medium text-gray-700">{label}</label>
                {type === 'textarea' ? (
                    <Textarea
                        value={val}
                        onChange={(e: any) => handleChange(key, e.target.value)}
                        className="text-sm"
                    />
                ) : type === 'color' ? (
                    <div className="flex gap-2 items-center">
                        <input
                            type="color"
                            value={val || '#000000'} // Default fallback
                            onChange={(e: any) => handleChange(key, e.target.value)}
                            className="h-8 w-8 p-0 border-0 rounded overflow-hidden cursor-pointer"
                        />
                        <Input
                            value={val}
                            onChange={(e: any) => handleChange(key, e.target.value)}
                            className="flex-1 h-8 text-xs"
                            placeholder="#000000"
                        />
                    </div>
                ) : (
                    <Input
                        value={val}
                        onChange={(e: any) => handleChange(key, e.target.value)}
                        className="text-sm h-9"
                    />
                )}
            </div>
        );
    };

    // Generic Schema Switcher using Standard Sections
    switch (sectionId) {
        case 'header':
            return (
                <div>
                    {renderField('businessName', 'Business Name')}
                    {renderField('announcement', 'Announcement Bar')}
                    {renderField('navColor', 'Background Color', 'color')}
                    <div className="p-4 bg-gray-50 rounded text-xs text-gray-500 mt-4">
                        Upload logo in general settings.
                    </div>
                </div>
            );
        case 'hero':
            return (
                <div>
                    {renderField('heading', 'Main Heading')}
                    {renderField('subheading', 'Subheading')}
                    {renderField('buttonText', 'Button Text', 'text')}
                    {/* Image Upload would go here - using simple URL input for now */}
                    {renderField('imageUrl', 'Background Image URL')}
                    {renderField('overlayOpacity', 'Overlay Opacity (0-100)')}
                </div>
            );
        case 'products':
            return (
                <div>
                    {renderField('title', 'Section Title')}
                    {renderField('collectionId', 'Collection ID (Optional)')}
                    {renderField('layout', 'Grid Layout (2/3/4 cols)')}
                    <div className="mt-4 border-t pt-4">
                        <h4 className="text-xs font-bold mb-2">Display Options</h4>
                        {/* Toggle implementation would go here */}
                        <div className="flex items-center gap-2 mb-2">
                            <input type="checkbox" checked={config?.showPrice !== false} onChange={(e: any) => handleChange('showPrice', e.target.checked)} />
                            <span className="text-sm">Show Price</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <input type="checkbox" checked={config?.showAddToCart !== false} onChange={(e: any) => handleChange('showAddToCart', e.target.checked)} />
                            <span className="text-sm">Show Add to Cart</span>
                        </div>
                    </div>
                </div>
            );
        case 'footer':
            return (
                <div>
                    {renderField('copyrightText', 'Copyright Text')}
                    {renderField('showSocials', 'Show Social Links (true/false)')}
                    {renderField('backgroundColor', 'Background Color', 'color')}
                </div>
            );
        default:
            return (
                <div className="text-gray-500 text-sm">
                    No specific options for this section.
                    <div className="mt-4 pt-4 border-t">
                        <h4 className="text-xs font-bold mb-2">Advanced Visuals</h4>
                        {renderField('paddingTop', 'Padding Top')}
                        {renderField('paddingBottom', 'Padding Bottom')}
                        {renderField('backgroundColor', 'Background Color', 'color')}
                    </div>
                </div>
            );
    }
}
