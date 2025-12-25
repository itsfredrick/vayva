'use client';

import React, { useState } from 'react';
import { Button, Icon, cn, Drawer } from '@vayva/ui';
import { useOnboarding } from '@/context/OnboardingContext';
import { RetailTemplate } from '@/components/templates/storefront/RetailTemplate';
import { FoodTemplate } from '@/components/templates/storefront/FoodTemplate';
import { ServiceTemplate } from '@/components/templates/storefront/ServiceTemplate';
import { StorefrontConfig, StorefrontTheme, MicroTemplateId, StorefrontId } from '@/types/storefront';
import { getDefaultConfig, MICRO_TEMPLATES } from '@/lib/template-presets';

// Master Prompt Step 5: Templates (Expanded)
// Intelligence: Badge, Capacity, Complexity
// Deep Preview: Horizontal flow, Data captured, Roles
// Comparison: Side-by-side table

type TemplateId = 'retail' | 'food' | 'services' | 'wholesale';
type Complexity = 'Simple' | 'Moderate' | 'Advanced';

const TEMPLATES: {
    id: TemplateId;
    name: string;
    description: string;
    bestFor: string; // Matches segment keys if needed
    capacity: string;
    complexity: Complexity;
    workflows: { name: string; roles: string[]; data: string[] }[];
    isPro?: boolean;
    icon: string;
    features: { orders: string; payment: string; delivery: string; reporting: string };
}[] = [
        {
            id: 'retail',
            name: 'Simple Retail',
            description: 'Standard product sales flow.',
            bestFor: 'retail',
            capacity: '50-100 orders/day',
            complexity: 'Simple',
            workflows: [
                { name: 'Inventory', roles: ['Merchant'], data: ['Stock Level'] },
                { name: 'Order Placed', roles: ['Customer'], data: ['Items', 'Address'] },
                { name: 'Payment', roles: ['Merchant', 'Customer'], data: ['Receipt'] },
                { name: 'Shipping', roles: ['Logistics'], data: ['Tracking ID'] }
            ],
            icon: 'ShoppingBag',
            features: {
                orders: 'Linear flow',
                payment: 'Upfront / On Delivery',
                delivery: 'Third-party / Manual',
                reporting: 'Sales & Stock'
            }
        },
        {
            id: 'food',
            name: 'Food & Catering',
            description: 'Menu-based ordering system.',
            bestFor: 'food',
            capacity: '200+ orders/day',
            complexity: 'Moderate',
            workflows: [
                { name: 'Menu', roles: ['Merchant'], data: ['Dishes', 'Options'] },
                { name: 'Order', roles: ['Customer'], data: ['Table/Address', 'Modifiers'] },
                { name: 'Kitchen', roles: ['Chef'], data: ['KOT Ticket'] },
                { name: 'Delivery', roles: ['Rider'], data: ['Route'] }
            ],
            icon: 'Soup',
            features: {
                orders: 'Real-time Kitchen Display',
                payment: 'Post-meal / Upfront',
                delivery: 'Local Radius',
                reporting: 'Item Popularity'
            }
        },
        {
            id: 'services',
            name: 'Services & Bookings',
            description: 'Appointment scheduling and invoicing.',
            bestFor: 'services',
            capacity: '20-50 appts/day',
            complexity: 'Moderate',
            workflows: [
                { name: 'Calendar', roles: ['Merchant'], data: ['Slots'] },
                { name: 'Booking', roles: ['Client'], data: ['Time', 'Service'] },
                { name: 'Reminder', roles: ['System'], data: ['SMS/WhatsApp'] },
                { name: 'Invoice', roles: ['Merchant'], data: ['Bill'] }
            ],
            icon: 'Calendar',
            features: {
                orders: 'Calendar-based',
                payment: 'Deposit + Balance',
                delivery: 'N/A',
                reporting: 'Utilization'
            }
        },
        {
            id: 'wholesale',
            name: 'Wholesale B2B',
            description: 'Bulk ordering and invoicing.',
            bestFor: 'mixed', // Fallback or specific
            capacity: 'Unlimited volume',
            complexity: 'Advanced',
            workflows: [
                { name: 'Catalog', roles: ['Merchant'], data: ['Tiers'] },
                { name: 'Bulk Order', roles: ['Buyer'], data: ['PO Number'] },
                { name: 'Invoice', roles: ['Finance'], data: ['Credit Terms'] },
                { name: 'Fulfillment', roles: ['Warehouse'], data: ['Waybill'] }
            ],
            isPro: true,
            icon: 'Container',
            features: {
                orders: 'Bulk Import / PO',
                payment: 'Net 30 / Terms',
                delivery: 'Freight / LTL',
                reporting: 'AR Aging'
            }
        }
    ];

export default function TemplatesPage() {
    const { state, updateState, goToStep } = useOnboarding();
    const [selected, setSelected] = useState<TemplateId | null>(null);
    const [preview, setPreview] = useState<TemplateId | null>(null);
    const [config, setConfig] = useState<StorefrontConfig | null>(null);
    const [compareMode, setCompareMode] = useState(false);

    // Business type matching for "Recommended"
    const businessSegment = state?.intent?.segment; // 'retail', 'food', 'services', 'mixed'

    // Default to 'free' plan integration
    const userPlan = state?.plan || 'free';

    const handleSelect = (id: TemplateId) => {
        const template = TEMPLATES.find(t => t.id === id);
        if (template?.isPro && userPlan !== 'pro') {
            return; // Locked
        }
        setSelected(id);
    };

    const handleContinue = async () => {
        if (!selected) return;

        await updateState({
            templateSelected: true,
            template: {
                id: selected,
                name: TEMPLATES.find(t => t.id === selected)?.name || ''
            }
        });
        await goToStep('order-flow');
    };

    const toggleCompare = () => setCompareMode(!compareMode);

    return (
        <div className="flex flex-col h-full max-w-6xl mx-auto">
            <div className="mb-8 flex flex-col md:flex-row md:items-end justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 mb-2">Choose your operational model</h1>
                    <p className="text-gray-500">Select a template to pre-configure your workflows.</p>
                </div>
                {!compareMode ? (
                    <Button variant="outline" onClick={toggleCompare} className="flex gap-2">
                        <Icon name="Columns2" size={16} /> Compare Templates
                    </Button>
                ) : (
                    <Button variant="ghost" onClick={toggleCompare}>Close Comparison</Button>
                )}
            </div>

            {compareMode ? (
                // Comparison Table View
                <div className="overflow-x-auto bg-white rounded-2xl border border-gray-200 shadow-sm animate-in fade-in slide-in-from-bottom-4">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-gray-50 border-b border-gray-100">
                                <th className="p-4 text-sm font-bold text-gray-500">Feature</th>
                                {TEMPLATES.map(t => (
                                    <th key={t.id} className="p-4 text-sm font-bold text-gray-900 min-w-[180px]">
                                        <div className="flex items-center gap-2">
                                            <Icon name={t.icon as any} size={16} /> {t.name}
                                            {t.isPro && <Icon name="Lock" size={12} className="text-gray-400" />}
                                        </div>
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100 text-sm">
                            <tr>
                                <td className="p-4 font-medium text-gray-500">Order Flow</td>
                                {TEMPLATES.map(t => <td key={t.id} className="p-4">{t.features.orders}</td>)}
                            </tr>
                            <tr>
                                <td className="p-4 font-medium text-gray-500">Payments</td>
                                {TEMPLATES.map(t => <td key={t.id} className="p-4">{t.features.payment}</td>)}
                            </tr>
                            <tr>
                                <td className="p-4 font-medium text-gray-500">Delivery</td>
                                {TEMPLATES.map(t => <td key={t.id} className="p-4">{t.features.delivery}</td>)}
                            </tr>
                            <tr>
                                <td className="p-4 font-medium text-gray-500">Reporting</td>
                                {TEMPLATES.map(t => <td key={t.id} className="p-4">{t.features.reporting}</td>)}
                            </tr>
                            <tr className="bg-gray-50">
                                <td className="p-4"></td>
                                {TEMPLATES.map(t => (
                                    <td key={t.id} className="p-4">
                                        <Button
                                            size="sm"
                                            variant={t.isPro && userPlan !== 'pro' ? 'ghost' : (selected === t.id ? 'primary' : 'outline')}
                                            disabled={t.isPro && userPlan !== 'pro'}
                                            onClick={() => { setSelected(t.id); setCompareMode(false); }}
                                            className="w-full"
                                        >
                                            {t.isPro && userPlan !== 'pro' ? 'Locked (Pro)' : (selected === t.id ? 'Selected' : 'Select')}
                                        </Button>
                                    </td>
                                ))}
                            </tr>
                        </tbody>
                    </table>
                </div>
            ) : (
                // Grid View
                <>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-2 gap-6 mb-8">
                        {TEMPLATES.map((template) => {
                            const isLocked = template.isPro && userPlan !== 'pro';
                            const isRecommended = businessSegment === template.bestFor;

                            return (
                                <div
                                    key={template.id}
                                    onClick={() => !isLocked && setSelected(template.id)}
                                    className={cn(
                                        "group relative overflow-hidden rounded-2xl border-2 transition-all duration-200 cursor-pointer p-6 flex flex-col gap-4 bg-white",
                                        selected === template.id
                                            ? "border-black ring-1 ring-black/5 shadow-lg scale-[1.01]"
                                            : "border-gray-200 hover:border-gray-300 hover:shadow-md",
                                        isLocked && "opacity-75 bg-gray-50 cursor-not-allowed border-gray-100"
                                    )}
                                >
                                    {isRecommended && (
                                        <div className="absolute top-0 left-0 bg-green-500 text-white text-[10px] font-bold px-3 py-1 rounded-br-lg z-10">
                                            RECOMMENDED
                                        </div>
                                    )}

                                    <div className="flex justify-between items-start mt-2">
                                        <div className={cn(
                                            "w-12 h-12 rounded-xl flex items-center justify-center transition-colors shadow-sm",
                                            selected === template.id ? "bg-black text-white" : "bg-gray-50 text-gray-500"
                                        )}>
                                            <Icon name={template.icon as any} size={24} />
                                        </div>

                                        {isLocked ? (
                                            <span className="bg-gray-100 text-gray-500 text-[10px] font-bold px-2 py-1 rounded-full uppercase tracking-wide flex items-center gap-1 border border-gray-200">
                                                <Icon name="Lock" size={10} /> Pro
                                            </span>
                                        ) : (
                                            <button
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    setPreview(template.id);
                                                    setConfig(getDefaultConfig(template.id as StorefrontId));
                                                }}
                                                className="text-xs font-medium text-gray-500 hover:text-black hover:underline z-10 flex items-center gap-1 bg-white px-2 py-1 rounded-full border border-gray-200 shadow-sm"
                                            >
                                                <Icon name="Eye" size={12} /> Preview
                                            </button>
                                        )}
                                    </div>

                                    <div>
                                        <h3 className="font-bold text-gray-900 text-lg mb-1">{template.name}</h3>
                                        <p className="text-sm text-gray-500 leading-relaxed">{template.description}</p>
                                    </div>

                                    <div className="grid grid-cols-2 gap-3 text-xs text-gray-500 mt-auto pt-4 border-t border-gray-50">
                                        <div>
                                            <span className="block text-gray-400 text-[10px] uppercase tracking-wide mb-1">Capacity</span>
                                            <span className="font-medium text-gray-700">{template.capacity}</span>
                                        </div>
                                        <div>
                                            <span className="block text-gray-400 text-[10px] uppercase tracking-wide mb-1">Complexity</span>
                                            <span className={cn(
                                                "font-medium px-2 py-0.5 rounded text-[10px] inline-block",
                                                template.complexity === 'Simple' ? "bg-green-100 text-green-700" :
                                                    template.complexity === 'Moderate' ? "bg-blue-100 text-blue-700" :
                                                        "bg-purple-100 text-purple-700"
                                            )}>{template.complexity}</span>
                                        </div>
                                    </div>

                                    {/* Locked Overlay */}
                                    {isLocked && (
                                        <div className="absolute inset-0 bg-white/60 backdrop-blur-[1px] flex items-center justify-center p-6 text-center z-20">
                                            <div className="bg-white p-5 rounded-2xl shadow-xl border border-gray-100 max-w-[240px]">
                                                <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3 text-gray-500">
                                                    <Icon name="Lock" size={18} />
                                                </div>
                                                <h4 className="text-sm font-bold text-gray-900 mb-1">Pro Feature</h4>
                                                <p className="text-xs text-gray-500 mb-3">Supports bulk workflows and compliance features available on Pro.</p>
                                                {/* Not blocking flow, just this card */}
                                            </div>
                                        </div>
                                    )}

                                    {/* Selection Indicator */}
                                    {selected === template.id && (
                                        <div className="absolute top-4 right-4 text-black animate-in zoom-in duration-200">
                                            <Icon name="CircleCheck" size={24} className="fill-black text-white" />
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                    </div>

                    <div className="flex justify-end gap-4 border-t border-gray-100 pt-6">
                        <Button
                            onClick={handleContinue}
                            disabled={!selected}
                            className="!bg-black text-white h-12 px-8 rounded-xl text-base shadow-lg hover:shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            Use this template
                        </Button>
                    </div>
                </>
            )}

            {/* Deep Preview Modal (Drawer) */}
            <Drawer
                isOpen={!!preview}
                onClose={() => setPreview(null)}
                title={TEMPLATES.find(t => t.id === preview)?.name || 'Template Preview'}
                className="max-w-3xl"
            >
                <div className="p-0 bg-gray-100 min-h-full pb-20">
                    <div className="bg-white p-4 border-b border-gray-200 sticky top-0 z-50 shadow-sm space-y-4">
                        <div className="flex justify-between items-center">
                            <div>
                                <h3 className="font-bold text-gray-900">{TEMPLATES.find(t => t.id === preview)?.name}</h3>
                                <p className="text-xs text-gray-500">Live Preview Mode</p>
                            </div>
                            <Button
                                className="!bg-black text-white px-6 h-9 text-xs"
                                onClick={() => {
                                    if (preview) setSelected(preview);
                                    setPreview(null);
                                }}
                            >
                                Use this template
                            </Button>
                        </div>

                        {/* Configuration Controls */}
                        {config && (
                            <div className="flex flex-wrap gap-4 pt-2 border-t border-gray-100">
                                {/* Industry/Micro-Template Selector */}
                                <div className="space-y-1">
                                    <label className="text-[10px] font-bold uppercase text-gray-400 tracking-wider">Industry</label>
                                    <div className="flex gap-2">
                                        {Object.entries(MICRO_TEMPLATES)
                                            .filter(([k]) => k.startsWith(preview || ''))
                                            .map(([key, val]) => (
                                                <button
                                                    key={key}
                                                    onClick={() => setConfig({ ...config, microTemplateId: key as MicroTemplateId, content: val.defaultContent })}
                                                    className={cn(
                                                        "px-3 py-1.5 rounded-lg text-xs font-medium transition-colors border",
                                                        config.microTemplateId === key
                                                            ? "bg-black text-white border-black"
                                                            : "bg-white text-gray-600 border-gray-200 hover:border-gray-300"
                                                    )}
                                                >
                                                    {val.name}
                                                </button>
                                            ))}
                                    </div>
                                </div>

                                {/* Theme Selector */}
                                <div className="space-y-1">
                                    <label className="text-[10px] font-bold uppercase text-gray-400 tracking-wider">Theme</label>
                                    <div className="flex gap-2">
                                        {(['minimal', 'bold', 'premium'] as const).map(theme => (
                                            <button
                                                key={theme}
                                                onClick={() => setConfig({ ...config, theme })}
                                                className={cn(
                                                    "px-3 py-1.5 rounded-lg text-xs font-medium capitalize transition-colors border",
                                                    config.theme === theme
                                                        ? "bg-black text-white border-black"
                                                        : "bg-white text-gray-600 border-gray-200 hover:border-gray-300"
                                                )}
                                            >
                                                {theme}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>

                    <div className="max-w-[400px] mx-auto my-8 shadow-2xl rounded-[32px] overflow-hidden border-[8px] border-gray-800 bg-white min-h-[800px]">
                        {/* Mobile Device Frame Content */}
                        {config && preview === 'retail' && <RetailTemplate config={config} />}
                        {config && preview === 'food' && <FoodTemplate config={config} />}
                        {config && preview === 'services' && <ServiceTemplate config={config} />}
                        {preview === 'wholesale' && (
                            <div className="p-10 text-center text-gray-500 pt-32">
                                <Icon name="Lock" className="mx-auto mb-4" size={32} />
                                <p>Pro Template. Upgrade to preview.</p>
                            </div>
                        )}
                    </div>
                </div>
            </Drawer>
        </div>
    );
}
