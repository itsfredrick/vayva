'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Button } from '@vayva/ui';

const FEATURE_MODULES = [
    { id: 'orders', label: 'Orders' },
    { id: 'payments', label: 'Payments' },
    { id: 'inventory', label: 'Inventory' },
    { id: 'deliveries', label: 'Deliveries' },
    { id: 'customers', label: 'Customers' },
    { id: 'records', label: 'Records & Reports' },
    { id: 'team', label: 'Team & Permissions' },
    { id: 'integrations', label: 'Integrations' },
];

export default function FeaturesPage() {
    const [activeModule, setActiveModule] = useState('orders');

    return (
        <div className="min-h-screen bg-white">
            {/* Page Header / Hero */}
            <section className="pt-32 pb-16 px-4 border-b border-gray-200">
                <div className="max-w-6xl mx-auto">
                    <p className="text-sm text-[#64748B] mb-4">Product → Features</p>
                    <h1 className="text-4xl md:text-5xl font-bold text-[#0F172A] mb-6 leading-tight">
                        Everything you need to run a business on WhatsApp.<br />
                        Nothing you don't.
                    </h1>
                    <p className="text-xl text-[#64748B] max-w-3xl leading-relaxed">
                        Vayva turns conversations into structured operations—orders, payments, deliveries, records, and accountability—all in one system.
                    </p>
                </div>
            </section>

            {/* Feature Navigation + Content */}
            <section className="py-16 px-4">
                <div className="max-w-6xl mx-auto">
                    <div className="grid lg:grid-cols-4 gap-12">
                        {/* Sticky Feature Selector */}
                        <div className="lg:col-span-1">
                            <div className="lg:sticky lg:top-24">
                                <h3 className="text-sm font-semibold text-[#64748B] mb-4 uppercase tracking-wide">Modules</h3>
                                <nav className="space-y-2">
                                    {FEATURE_MODULES.map((module) => (
                                        <button
                                            key={module.id}
                                            onClick={() => setActiveModule(module.id)}
                                            className={`w-full text-left px-4 py-3 rounded-lg transition-colors ${activeModule === module.id
                                                ? 'bg-[#22C55E]/10 text-[#22C55E] font-semibold'
                                                : 'text-[#0F172A] hover:bg-gray-50'
                                                }`}
                                        >
                                            {module.label}
                                        </button>
                                    ))}
                                </nav>
                            </div>
                        </div>

                        {/* Feature Content */}
                        <div className="lg:col-span-3">
                            {activeModule === 'orders' && <OrdersModule />}
                            {activeModule === 'payments' && <PaymentsModule />}
                            {activeModule === 'inventory' && <InventoryModule />}
                            {activeModule === 'deliveries' && <DeliveriesModule />}
                            {activeModule === 'customers' && <CustomersModule />}
                            {activeModule === 'records' && <RecordsModule />}
                            {activeModule === 'team' && <TeamModule />}
                            {activeModule === 'integrations' && <IntegrationsModule />}
                        </div>
                    </div>
                </div>
            </section>

            {/* Connective Section */}
            <section className="py-20 px-4 bg-gray-50">
                <div className="max-w-4xl mx-auto text-center">
                    <h2 className="text-3xl font-bold text-[#0F172A] mb-6">
                        Not separate tools. One system.
                    </h2>
                    <p className="text-lg text-[#64748B] mb-12 max-w-2xl mx-auto">
                        Every part of Vayva connects to create a complete business operating system.
                    </p>

                    <div className="bg-white rounded-lg border border-gray-200 p-8">
                        <div className="grid md:grid-cols-2 gap-6 text-left">
                            <div className="flex items-start gap-3">
                                <div className="w-8 h-8 bg-[#22C55E]/10 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                                    <span className="text-[#22C55E] font-bold text-sm">→</span>
                                </div>
                                <div>
                                    <p className="font-semibold text-[#0F172A] mb-1">Orders connect to payments</p>
                                    <p className="text-sm text-[#64748B]">Every order tracks its payment status for easy reconciliation</p>
                                </div>
                            </div>
                            <div className="flex items-start gap-3">
                                <div className="w-8 h-8 bg-[#22C55E]/10 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                                    <span className="text-[#22C55E] font-bold text-sm">→</span>
                                </div>
                                <div>
                                    <p className="font-semibold text-[#0F172A] mb-1">Payments connect to deliveries</p>
                                    <p className="text-sm text-[#64748B]">Confirmed payments trigger delivery workflows</p>
                                </div>
                            </div>
                            <div className="flex items-start gap-3">
                                <div className="w-8 h-8 bg-[#22C55E]/10 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                                    <span className="text-[#22C55E] font-bold text-sm">→</span>
                                </div>
                                <div>
                                    <p className="font-semibold text-[#0F172A] mb-1">Deliveries update records</p>
                                    <p className="text-sm text-[#64748B]">Completed deliveries feed into business reports</p>
                                </div>
                            </div>
                            <div className="flex items-start gap-3">
                                <div className="w-8 h-8 bg-[#22C55E]/10 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                                    <span className="text-[#22C55E] font-bold text-sm">→</span>
                                </div>
                                <div>
                                    <p className="font-semibold text-[#0F172A] mb-1">Records build trust</p>
                                    <p className="text-sm text-[#64748B]">Clean history helps with banks, taxes, and growth</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Performance & Reliability */}
            <section className="py-16 px-4">
                <div className="max-w-4xl mx-auto">
                    <div className="bg-white border border-gray-200 rounded-lg p-8">
                        <h3 className="text-xl font-semibold text-[#0F172A] mb-6">Built for real conditions</h3>
                        <div className="grid md:grid-cols-3 gap-6">
                            <div>
                                <p className="font-semibold text-[#0F172A] mb-2">Unreliable networks</p>
                                <p className="text-sm text-[#64748B]">Works even when connection is slow or unstable</p>
                            </div>
                            <div>
                                <p className="font-semibold text-[#0F172A] mb-2">Low-end devices</p>
                                <p className="text-sm text-[#64748B]">Runs smoothly on basic smartphones</p>
                            </div>
                            <div>
                                <p className="font-semibold text-[#0F172A] mb-2">Real operations</p>
                                <p className="text-sm text-[#64748B]">Designed for how Nigerian businesses actually work</p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Final CTA */}
            <section className="py-20 px-4 bg-gray-50">
                <div className="max-w-3xl mx-auto text-center">
                    <h2 className="text-3xl font-bold text-[#0F172A] mb-6">
                        See how this works for your business.
                    </h2>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <Link href="/signup">
                            <Button className="bg-[#22C55E] hover:bg-[#16A34A] text-white px-8 py-4 text-lg font-semibold">
                                Create account
                            </Button>
                        </Link>
                        <Link href="/onboarding/welcome">
                            <Button variant="outline" className="border-2 border-gray-300 text-[#0F172A] px-8 py-4 text-lg font-semibold">
                                View onboarding flow
                            </Button>
                        </Link>
                    </div>
                    <div className="flex flex-wrap justify-center gap-6 text-sm text-[#64748B] mt-6">
                        <span>✔ No credit card required</span>
                        <span>✔ Set up in 5 minutes</span>
                    </div>
                </div>
            </section>
        </div>
    );
}

// Feature Module Components
function OrdersModule() {
    return (
        <div className="space-y-8">
            <div>
                <h2 className="text-3xl font-bold text-[#0F172A] mb-4">Orders — from chat to confirmation</h2>
                <p className="text-lg text-[#64748B] leading-relaxed">
                    Orders usually live inside long message threads. Vayva extracts them, structures them, and keeps them traceable from start to finish.
                </p>
            </div>

            {/* Interactive Visual */}
            <div className="bg-gray-50 rounded-lg p-8 border border-gray-200">
                <div className="space-y-4">
                    <div className="bg-white rounded p-4 border border-gray-200">
                        <p className="text-sm text-[#64748B] mb-2">WhatsApp conversation</p>
                        <p className="text-[#0F172A]">"I need 2 bags of rice, how much?"</p>
                    </div>
                    <div className="flex items-center justify-center">
                        <span className="text-2xl text-[#22C55E]">↓</span>
                    </div>
                    <div className="bg-[#22C55E]/10 rounded p-4 border border-[#22C55E]/20">
                        <p className="text-sm text-[#22C55E] font-semibold mb-2">Vayva Order #1234</p>
                        <p className="text-sm text-[#0F172A]">2x Rice bags • ₦15,000 • Pending payment</p>
                    </div>
                </div>
            </div>

            {/* Key Capabilities */}
            <div>
                <h3 className="font-semibold text-[#0F172A] mb-4">Key capabilities</h3>
                <ul className="space-y-2 text-[#64748B]">
                    <li>• Order capture from chat</li>
                    <li>• Order status tracking</li>
                    <li>• Price locking</li>
                    <li>• Edit history</li>
                    <li>• Order search</li>
                </ul>
            </div>

            {/* Real-World Use */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <p className="text-sm text-blue-900">
                    <strong>Real-world use:</strong> Useful when you handle many orders daily and need proof of what was agreed.
                </p>
            </div>
        </div>
    );
}

function PaymentsModule() {
    return (
        <div className="space-y-8">
            <div>
                <h2 className="text-3xl font-bold text-[#0F172A] mb-4">Payments — track every naira</h2>
                <p className="text-lg text-[#64748B] leading-relaxed">
                    Know exactly what's been paid, what's pending, and what's owed. Vayva tracks payments across all methods and assists with reconciliation.
                </p>
            </div>

            <div className="bg-gray-50 rounded-lg p-8 border border-gray-200">
                <div className="space-y-4">
                    <div className="flex justify-between items-center p-4 bg-white rounded border border-gray-200">
                        <span className="text-[#0F172A]">Order #1234</span>
                        <span className="text-[#64748B]">₦15,000</span>
                    </div>
                    <div className="flex justify-between items-center p-4 bg-[#22C55E]/10 rounded border border-[#22C55E]/20">
                        <span className="text-[#0F172A] font-semibold">Payment received</span>
                        <span className="text-[#22C55E] font-semibold">₦15,000</span>
                    </div>
                </div>
            </div>

            <div>
                <h3 className="font-semibold text-[#0F172A] mb-4">Key capabilities</h3>
                <ul className="space-y-2 text-[#64748B]">
                    <li>• Payment tracking across all methods</li>
                    <li>• Partial payment support</li>
                    <li>• Assisted reconciliation</li>
                    <li>• Payment proof attached to orders</li>
                    <li>• Outstanding balance alerts</li>
                </ul>
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <p className="text-sm text-blue-900">
                    <strong>Real-world use:</strong> Essential when customers pay in installments or use multiple payment methods.
                </p>
            </div>
        </div>
    );
}

function InventoryModule() {
    return (
        <div className="space-y-8">
            <div>
                <h2 className="text-3xl font-bold text-[#0F172A] mb-4">Inventory — never oversell again</h2>
                <p className="text-lg text-[#64748B] leading-relaxed">
                    Real-time stock tracking prevents overselling and alerts you before you run out. Inventory updates with each confirmed sale.
                </p>
            </div>

            <div className="bg-gray-50 rounded-lg p-8 border border-gray-200">
                <div className="space-y-4">
                    <div className="p-4 bg-white rounded border border-gray-200">
                        <p className="text-sm text-[#64748B] mb-2">Rice bags</p>
                        <div className="flex items-center gap-4">
                            <div className="flex-1 bg-gray-200 rounded-full h-2">
                                <div className="bg-[#22C55E] h-2 rounded-full" style={{ width: '30%' }}></div>
                            </div>
                            <span className="text-[#0F172A] font-semibold">15 left</span>
                        </div>
                    </div>
                    <div className="p-4 bg-yellow-50 rounded border border-yellow-200">
                        <p className="text-sm text-yellow-900">⚠️ Low stock alert: Only 15 units remaining</p>
                    </div>
                </div>
            </div>

            <div>
                <h3 className="font-semibold text-[#0F172A] mb-4">Key capabilities</h3>
                <ul className="space-y-2 text-[#64748B]">
                    <li>• Real-time stock levels</li>
                    <li>• Low stock alerts</li>
                    <li>• Overselling prevention</li>
                    <li>• Smart inventory updates</li>
                    <li>• Stock history tracking</li>
                </ul>
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <p className="text-sm text-blue-900">
                    <strong>Real-world use:</strong> Critical when managing limited stock or fast-moving products.
                </p>
            </div>
        </div>
    );
}

function DeliveriesModule() {
    return (
        <div className="space-y-8">
            <div>
                <h2 className="text-3xl font-bold text-[#0F172A] mb-4">Deliveries — full visibility</h2>
                <p className="text-lg text-[#64748B] leading-relaxed">
                    Track deliveries from dispatch to completion. Assign riders, update statuses, and maintain proof of delivery for every order.
                </p>
            </div>

            <div className="bg-gray-50 rounded-lg p-8 border border-gray-200">
                <div className="space-y-3">
                    {['Order placed', 'Payment confirmed', 'Out for delivery', 'Delivered'].map((status, i) => (
                        <div key={i} className="flex items-center gap-3">
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center ${i < 3 ? 'bg-[#22C55E] text-white' : 'bg-gray-200 text-gray-400'
                                }`}>
                                {i < 3 ? '✓' : i + 1}
                            </div>
                            <span className={i < 3 ? 'text-[#0F172A] font-semibold' : 'text-[#64748B]'}>{status}</span>
                        </div>
                    ))}
                </div>
            </div>

            <div>
                <h3 className="font-semibold text-[#0F172A] mb-4">Key capabilities</h3>
                <ul className="space-y-2 text-[#64748B]">
                    <li>• Delivery status tracking</li>
                    <li>• Rider assignment</li>
                    <li>• Proof of delivery</li>
                    <li>• Timeline visibility</li>
                    <li>• Delivery confirmation</li>
                </ul>
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <p className="text-sm text-blue-900">
                    <strong>Real-world use:</strong> Essential for maintaining customer trust and resolving delivery disputes.
                </p>
            </div>
        </div>
    );
}

function CustomersModule() {
    return (
        <div className="space-y-8">
            <div>
                <h2 className="text-3xl font-bold text-[#0F172A] mb-4">Customers — build relationships</h2>
                <p className="text-lg text-[#64748B] leading-relaxed">
                    Every WhatsApp conversation creates a customer profile. See purchase history, payment patterns, and conversation threads in one place.
                </p>
            </div>

            <div className="bg-gray-50 rounded-lg p-8 border border-gray-200">
                <div className="bg-white rounded p-4 border border-gray-200">
                    <p className="font-semibold text-[#0F172A] mb-3">Chioma Okafor</p>
                    <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                            <span className="text-[#64748B]">Total orders</span>
                            <span className="text-[#0F172A] font-semibold">12</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-[#64748B]">Total spent</span>
                            <span className="text-[#0F172A] font-semibold">₦180,000</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-[#64748B]">Last order</span>
                            <span className="text-[#0F172A] font-semibold">2 days ago</span>
                        </div>
                    </div>
                </div>
            </div>

            <div>
                <h3 className="font-semibold text-[#0F172A] mb-4">Key capabilities</h3>
                <ul className="space-y-2 text-[#64748B]">
                    <li>• Guided customer profiles</li>
                    <li>• Purchase history</li>
                    <li>• Payment patterns</li>
                    <li>• Conversation threads</li>
                    <li>• Repeat buyer identification</li>
                </ul>
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <p className="text-sm text-blue-900">
                    <strong>Real-world use:</strong> Helps identify your best customers and personalize service.
                </p>
            </div>
        </div>
    );
}

function RecordsModule() {
    return (
        <div className="space-y-8">
            <div>
                <h2 className="text-3xl font-bold text-[#0F172A] mb-4">Records & Reports — clean data</h2>
                <p className="text-lg text-[#64748B] leading-relaxed">
                    Streamlined record-keeping for every transaction. Export clean data for banks, taxes, or investors anytime.
                </p>
            </div>

            <div className="bg-gray-50 rounded-lg p-8 border border-gray-200">
                <div className="bg-white rounded p-4 border border-gray-200">
                    <div className="flex justify-between items-center mb-4">
                        <h4 className="font-semibold text-[#0F172A]">December 2025</h4>
                        <button className="text-sm text-[#22C55E] font-semibold">Export</button>
                    </div>
                    <div className="space-y-3">
                        <div className="flex justify-between">
                            <span className="text-[#64748B]">Total orders</span>
                            <span className="text-[#0F172A] font-semibold">127</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-[#64748B]">Revenue</span>
                            <span className="text-[#0F172A] font-semibold">₦2,400,000</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-[#64748B]">Completed deliveries</span>
                            <span className="text-[#0F172A] font-semibold">103</span>
                        </div>
                    </div>
                </div>
            </div>

            <div>
                <h3 className="font-semibold text-[#0F172A] mb-4">Key capabilities</h3>
                <ul className="space-y-2 text-[#64748B]">
                    <li>• Guided record generation</li>
                    <li>• Exportable data (CSV, PDF)</li>
                    <li>• Daily/weekly/monthly summaries</li>
                    <li>• Business visibility</li>
                    <li>• Audit trail</li>
                </ul>
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <p className="text-sm text-blue-900">
                    <strong>Real-world use:</strong> Critical for tax compliance, bank applications, and investor presentations.
                </p>
            </div>
        </div>
    );
}

function TeamModule() {
    return (
        <div className="space-y-8">
            <div>
                <h2 className="text-3xl font-bold text-[#0F172A] mb-4">Team & Permissions — controlled access</h2>
                <p className="text-lg text-[#64748B] leading-relaxed">
                    Add team members with specific roles and permissions. Everyone sees what they need, nothing more. Full accountability for every action.
                </p>
            </div>

            <div className="bg-gray-50 rounded-lg p-8 border border-gray-200">
                <div className="space-y-3">
                    {[
                        { name: 'You (Owner)', role: 'Full access', color: 'bg-[#22C55E]' },
                        { name: 'Tunde (Manager)', role: 'Orders, Inventory, Reports', color: 'bg-blue-500' },
                        { name: 'Ada (Staff)', role: 'Orders only', color: 'bg-gray-400' },
                    ].map((member, i) => (
                        <div key={i} className="bg-white rounded p-4 border border-gray-200 flex items-center gap-3">
                            <div className={`w-10 h-10 ${member.color} rounded-full flex items-center justify-center text-white font-bold`}>
                                {member.name[0]}
                            </div>
                            <div className="flex-1">
                                <p className="font-semibold text-[#0F172A]">{member.name}</p>
                                <p className="text-sm text-[#64748B]">{member.role}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            <div>
                <h3 className="font-semibold text-[#0F172A] mb-4">Key capabilities</h3>
                <ul className="space-y-2 text-[#64748B]">
                    <li>• Multiple staff accounts</li>
                    <li>• Role-based permissions</li>
                    <li>• Action accountability</li>
                    <li>• Activity logs</li>
                    <li>• Access control</li>
                </ul>
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <p className="text-sm text-blue-900">
                    <strong>Real-world use:</strong> Essential when growing beyond a one-person operation.
                </p>
            </div>
        </div>
    );
}

function IntegrationsModule() {
    return (
        <div className="space-y-8">
            <div>
                <h2 className="text-3xl font-bold text-[#0F172A] mb-4">Integrations — WhatsApp first</h2>
                <p className="text-lg text-[#64748B] leading-relaxed">
                    WhatsApp is your interface. Other systems connect quietly underneath. No juggling multiple apps.
                </p>
            </div>

            <div className="bg-gray-50 rounded-lg p-8 border border-gray-200">
                <div className="text-center">
                    <div className="inline-block bg-[#22C55E] text-white px-6 py-3 rounded-lg font-semibold mb-6">
                        WhatsApp
                    </div>
                    <div className="flex items-center justify-center gap-4 mb-6">
                        <div className="h-px bg-gray-300 flex-1"></div>
                        <span className="text-[#64748B] text-sm">connects to</span>
                        <div className="h-px bg-gray-300 flex-1"></div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        {['Orders', 'Payments', 'Inventory', 'Deliveries'].map((system) => (
                            <div key={system} className="bg-white border border-gray-200 rounded p-3 text-sm text-[#0F172A]">
                                {system}
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            <div>
                <h3 className="font-semibold text-[#0F172A] mb-4">Key capabilities</h3>
                <ul className="space-y-2 text-[#64748B]">
                    <li>• WhatsApp-first design</li>
                    <li>• Background system connections</li>
                    <li>• Unified interface</li>
                    <li>• No app switching</li>
                    <li>• Seamless data flow</li>
                </ul>
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <p className="text-sm text-blue-900">
                    <strong>Real-world use:</strong> Simplifies operations by keeping everything in one familiar interface.
                </p>
            </div>
        </div>
    );
}
