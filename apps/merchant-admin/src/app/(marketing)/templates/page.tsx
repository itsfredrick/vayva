'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Button } from '@vayva/ui';

const TEMPLATES = [
    {
        id: 'retail',
        name: 'Retail Selling',
        category: 'retail',
        description: 'Structured orders, simple payments, delivery tracking for everyday selling.',
        workflows: ['Orders', 'Payments', 'Deliveries', 'Records'],
        setupTime: '5–10 minutes',
        volume: 'medium',
        teamSize: 'solo',
    },
    {
        id: 'food-catering',
        name: 'Food & Catering',
        category: 'food',
        description: 'Order scheduling, payment tracking, delivery coordination for food businesses.',
        workflows: ['Orders', 'Payments', 'Deliveries', 'Inventory', 'Records'],
        setupTime: '10–15 minutes',
        volume: 'medium',
        teamSize: 'small',
    },
    {
        id: 'services',
        name: 'Services & Bookings',
        category: 'services',
        description: 'Appointment tracking, payment recording, customer history for service providers.',
        workflows: ['Orders', 'Payments', 'Customers', 'Records'],
        setupTime: '5–10 minutes',
        volume: 'low',
        teamSize: 'solo',
    },
    {
        id: 'online-selling',
        name: 'Online Selling',
        category: 'online',
        description: 'Full e-commerce setup with inventory, payments, and delivery management.',
        workflows: ['Orders', 'Payments', 'Inventory', 'Deliveries', 'Customers', 'Records'],
        setupTime: '15–20 minutes',
        volume: 'high',
        teamSize: 'small',
    },
    {
        id: 'wholesale',
        name: 'Wholesale / Bulk Orders',
        category: 'wholesale',
        description: 'Large order management, payment terms, delivery coordination for bulk selling.',
        workflows: ['Orders', 'Payments', 'Inventory', 'Deliveries', 'Records'],
        setupTime: '10–15 minutes',
        volume: 'high',
        teamSize: 'multi',
    },
    {
        id: 'custom',
        name: 'Custom Setup',
        category: 'custom',
        description: 'Start from scratch and configure exactly what you need.',
        workflows: ['Customizable'],
        setupTime: '20+ minutes',
        volume: 'any',
        teamSize: 'any',
    },
];

const CATEGORIES = [
    { id: 'all', label: 'All templates' },
    { id: 'retail', label: 'Retail selling' },
    { id: 'food', label: 'Food & catering' },
    { id: 'services', label: 'Services & bookings' },
    { id: 'online', label: 'Online selling' },
    { id: 'wholesale', label: 'Wholesale / bulk orders' },
    { id: 'custom', label: 'Custom setup' },
];

export default function TemplatesPage() {
    const [selectedCategory, setSelectedCategory] = useState('all');
    const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null);

    const filteredTemplates = selectedCategory === 'all'
        ? TEMPLATES
        : TEMPLATES.filter(t => t.category === selectedCategory);

    const currentTemplate = TEMPLATES.find(t => t.id === selectedTemplate);

    return (
        <div className="min-h-screen bg-white">
            {/* Page Header */}
            <section className="pt-32 pb-16 px-4">
                <div className="max-w-6xl mx-auto">
                    <p className="text-sm text-[#64748B] mb-4">Product → Templates</p>
                    <h1 className="text-4xl md:text-5xl font-bold text-[#0F172A] mb-6 leading-tight">
                        Start with a structure that fits your business.
                    </h1>
                    <p className="text-xl text-[#64748B] max-w-3xl">
                        Templates give you proven operational setups for common WhatsApp-based businesses—orders, payments, deliveries, and records already aligned.
                    </p>
                </div>
            </section>

            {/* Template Selector */}
            <section className="py-16 px-4">
                <div className="max-w-6xl mx-auto">
                    <div className="grid lg:grid-cols-4 gap-8">
                        {/* Filters (Sticky on desktop) */}
                        <div className="lg:col-span-1">
                            <div className="lg:sticky lg:top-24">
                                <h3 className="text-sm font-semibold text-[#64748B] mb-4 uppercase tracking-wide">
                                    Business Type
                                </h3>
                                <nav className="space-y-2">
                                    {CATEGORIES.map((category) => (
                                        <button
                                            key={category.id}
                                            onClick={() => setSelectedCategory(category.id)}
                                            className={`w-full text-left px-4 py-3 rounded-lg transition-colors ${selectedCategory === category.id
                                                    ? 'bg-[#22C55E]/10 text-[#22C55E] font-semibold'
                                                    : 'text-[#0F172A] hover:bg-gray-50'
                                                }`}
                                        >
                                            {category.label}
                                        </button>
                                    ))}
                                </nav>
                            </div>
                        </div>

                        {/* Template Cards */}
                        <div className="lg:col-span-3">
                            <div className="grid md:grid-cols-2 gap-6">
                                {filteredTemplates.map((template) => (
                                    <div
                                        key={template.id}
                                        className="bg-white border border-gray-200 rounded-lg p-6 hover:border-[#22C55E] hover:shadow-sm transition-all cursor-pointer"
                                        onClick={() => setSelectedTemplate(template.id)}
                                    >
                                        <h3 className="text-xl font-bold text-[#0F172A] mb-2">
                                            {template.name}
                                        </h3>
                                        <p className="text-[#64748B] mb-4">
                                            {template.description}
                                        </p>

                                        {/* Workflows */}
                                        <div className="flex flex-wrap gap-2 mb-4">
                                            {template.workflows.map((workflow) => (
                                                <span
                                                    key={workflow}
                                                    className="text-xs bg-gray-100 text-[#64748B] px-2 py-1 rounded"
                                                >
                                                    {workflow}
                                                </span>
                                            ))}
                                        </div>

                                        <div className="flex justify-between items-center">
                                            <span className="text-sm text-[#64748B]">
                                                Setup: {template.setupTime}
                                            </span>
                                            <Button
                                                variant="outline"
                                                className="border-2 border-gray-300 text-sm"
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    setSelectedTemplate(template.id);
                                                }}
                                            >
                                                Preview template
                                            </Button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Educational Note */}
            <section className="py-16 px-4 bg-gray-50">
                <div className="max-w-3xl mx-auto text-center">
                    <p className="text-lg text-[#64748B] italic">
                        Templates don\'t replace understanding your business. They give you a clean starting structure you can adapt as you grow.
                    </p>
                </div>
            </section>

            {/* Custom Template Option */}
            <section className="py-16 px-4">
                <div className="max-w-3xl mx-auto text-center">
                    <h2 className="text-2xl font-bold text-[#0F172A] mb-4">
                        Prefer to start from scratch?
                    </h2>
                    <p className="text-[#64748B] mb-6">
                        Templates are optional. You can start with a blank setup and configure everything yourself.
                    </p>
                    <Link href="/signup">
                        <Button variant="outline" className="border-2 border-gray-300 px-8 py-4 text-lg font-semibold">
                            Start with a blank setup
                        </Button>
                    </Link>
                </div>
            </section>

            {/* Template Preview Modal */}
            {selectedTemplate && currentTemplate && (
                <div
                    className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 overflow-y-auto"
                    onClick={() => setSelectedTemplate(null)}
                >
                    <div
                        className="bg-white rounded-lg max-w-3xl w-full my-8"
                        onClick={(e) => e.stopPropagation()}
                    >
                        {/* Preview Header */}
                        <div className="p-8 border-b border-gray-200">
                            <div className="flex justify-between items-start mb-4">
                                <div>
                                    <h2 className="text-3xl font-bold text-[#0F172A] mb-2">
                                        {currentTemplate.name}
                                    </h2>
                                    <p className="text-[#64748B]">{currentTemplate.description}</p>
                                </div>
                                <button
                                    onClick={() => setSelectedTemplate(null)}
                                    className="text-[#64748B] hover:text-[#0F172A] text-2xl"
                                >
                                    ×
                                </button>
                            </div>
                        </div>

                        {/* Overview Panel */}
                        <div className="p-8 border-b border-gray-200">
                            <h3 className="font-semibold text-[#0F172A] mb-4">What this template is for</h3>
                            <div className="space-y-3 text-[#64748B]">
                                <p>
                                    <strong>Best for:</strong> {currentTemplate.category === 'retail' && 'Merchants selling physical products daily'}
                                    {currentTemplate.category === 'food' && 'Food vendors and catering services'}
                                    {currentTemplate.category === 'services' && 'Service providers and consultants'}
                                    {currentTemplate.category === 'online' && 'Online stores with inventory management'}
                                    {currentTemplate.category === 'wholesale' && 'Bulk sellers and distributors'}
                                    {currentTemplate.category === 'custom' && 'Businesses with unique requirements'}
                                </p>
                                <p>
                                    <strong>Solves:</strong> Reduces setup time by pre-configuring common workflows and defaults
                                </p>
                            </div>
                        </div>

                        {/* Included Workflows */}
                        <div className="p-8 border-b border-gray-200">
                            <h3 className="font-semibold text-[#0F172A] mb-4">Included workflows</h3>
                            <div className="space-y-3">
                                {currentTemplate.workflows.map((workflow) => (
                                    <div key={workflow} className="flex items-start gap-3">
                                        <div className="w-6 h-6 bg-[#22C55E]/10 rounded flex items-center justify-center flex-shrink-0 mt-0.5">
                                            <span className="text-[#22C55E] text-sm">✓</span>
                                        </div>
                                        <div>
                                            <p className="font-semibold text-[#0F172A]">{workflow}</p>
                                            <p className="text-sm text-[#64748B]">
                                                {workflow === 'Orders' && 'Pre-configured order statuses and tracking'}
                                                {workflow === 'Payments' && 'Payment recording and reconciliation setup'}
                                                {workflow === 'Inventory' && 'Stock tracking and low-stock alerts'}
                                                {workflow === 'Deliveries' && 'Delivery status management'}
                                                {workflow === 'Customers' && 'Customer profile and history tracking'}
                                                {workflow === 'Records' && 'Automatic record generation'}
                                                {workflow === 'Customizable' && 'Configure everything from scratch'}
                                            </p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Apply Template */}
                        <div className="p-8">
                            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                                <p className="text-sm text-blue-900">
                                    Applying a template sets up workflows and defaults. You can change everything later. No data is locked, and templates do not limit features.
                                </p>
                            </div>
                            <div className="flex gap-4">
                                <Link href="/signup" className="flex-1">
                                    <Button className="w-full bg-[#22C55E] hover:bg-[#16A34A] text-white py-4 text-lg font-semibold">
                                        Apply template
                                    </Button>
                                </Link>
                                <Link href="/signup" className="flex-1">
                                    <Button variant="outline" className="w-full border-2 border-gray-300 py-4 text-lg font-semibold">
                                        Customize first
                                    </Button>
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
