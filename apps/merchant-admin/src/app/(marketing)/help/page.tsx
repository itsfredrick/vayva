'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Button } from '@vayva/ui';

const QUICK_ACTIONS = [
    { id: 'getting-started', label: 'Getting started', icon: '📖' },
    { id: 'orders-payments', label: 'Orders & payments', icon: '💰' },
    { id: 'deliveries-inventory', label: 'Deliveries & inventory', icon: '📦' },
    { id: 'account-billing', label: 'Account & billing', icon: '⚙️' },
    { id: 'team-permissions', label: 'Team & permissions', icon: '👥' },
    { id: 'reports-records', label: 'Reports & records', icon: '📊' },
];

const GETTING_STARTED_ARTICLES = [
    { title: 'Creating your account', description: 'Set up your Vayva account in minutes', readTime: '2 min read' },
    { title: 'Connecting WhatsApp', description: 'Link your WhatsApp Business number', readTime: '3 min read' },
    { title: 'Creating your first order', description: 'Capture and track orders from WhatsApp', readTime: '4 min read' },
    { title: 'Recording a payment', description: 'Track payments for your orders', readTime: '2 min read' },
    { title: 'Completing a delivery', description: 'Update delivery status and confirm completion', readTime: '3 min read' },
];

const WORKFLOWS = [
    {
        id: 'orders',
        title: 'Managing orders',
        problems: [
            { q: 'How do I create an order from WhatsApp?', a: 'Orders are automatically captured from WhatsApp conversations. You can also manually create orders in the dashboard.' },
            { q: 'Can I edit an order after creating it?', a: 'Yes. Go to Orders, select the order, and click Edit. All changes are logged in the order history.' },
        ],
    },
    {
        id: 'payments',
        title: 'Handling payments',
        problems: [
            { q: 'How do I record a payment?', a: 'Open the order and click "Record Payment". Enter the amount and payment method. The order status updates automatically.' },
            { q: 'What if a customer pays in installments?', a: 'Record each payment separately. Vayva tracks the total paid and outstanding balance automatically.' },
        ],
    },
    {
        id: 'inventory',
        title: 'Tracking inventory',
        problems: [
            { q: 'How does inventory tracking work?', a: 'Stock levels update automatically when orders are created. You\'ll get alerts when stock is low.' },
            { q: 'Can I manually adjust inventory?', a: 'Yes. Go to Products, select the item, and adjust the stock level. Include a reason for the adjustment.' },
        ],
    },
    {
        id: 'deliveries',
        title: 'Coordinating deliveries',
        problems: [
            { q: 'How do I assign a delivery?', a: 'Open the order, go to Delivery tab, and assign a rider or delivery partner. They\'ll receive a notification.' },
            { q: 'How do I update delivery status?', a: 'Click on the delivery, select the new status (Out for delivery, Delivered, etc.). Customers are notified automatically.' },
        ],
    },
    {
        id: 'customers',
        title: 'Managing customers',
        problems: [
            { q: 'How are customer profiles created?', a: 'Customer profiles are created automatically from WhatsApp conversations. All their orders and payments are linked.' },
            { q: 'Can I see a customer\'s purchase history?', a: 'Yes. Go to Customers, select the customer, and view their complete order and payment history.' },
        ],
    },
    {
        id: 'staff',
        title: 'Working with staff',
        problems: [
            { q: 'How do I add a staff member?', a: 'Go to Settings > Team, click Add Member, enter their details and assign a role. They\'ll receive an invitation email.' },
            { q: 'What permissions can I set?', a: 'You can control access to orders, payments, inventory, deliveries, and reports. Each role has specific permissions.' },
        ],
    },
    {
        id: 'records',
        title: 'Reviewing records',
        problems: [
            { q: 'How do I export my data?', a: 'Go to Reports, select the date range and data type, then click Export. You\'ll receive a CSV or PDF file.' },
            { q: 'How long are records kept?', a: 'Free plan: 3 months. Growth plan: 12 months. Pro plan: Unlimited retention.' },
        ],
    },
];

const TROUBLESHOOTING = [
    { issue: 'Missing orders', solution: 'Check your WhatsApp connection status. Go to Settings > WhatsApp to reconnect if needed.' },
    { issue: 'Payment mismatch', solution: 'Verify the payment amount and method. Check if multiple payments were recorded for the same order.' },
    { issue: 'Delivery not updating', solution: 'Ensure you have a stable internet connection. Refresh the page and check again. Contact support if the issue persists.' },
    { issue: 'Staff access issues', solution: 'Verify the staff member\'s role and permissions. They may need to log out and log back in for changes to take effect.' },
    { issue: 'WhatsApp connection problems', solution: 'Go to Settings > WhatsApp and follow the reconnection steps. Make sure you\'re using WhatsApp Business.' },
];

export default function HelpPage() {
    const [searchQuery, setSearchQuery] = useState('');
    const [expandedWorkflow, setExpandedWorkflow] = useState<string | null>(null);

    return (
        <div className="min-h-screen bg-white">
            {/* Page Header */}
            <section className="pt-32 pb-16 px-4 text-center">
                <div className="max-w-4xl mx-auto">
                    <h1 className="text-4xl md:text-5xl font-bold text-[#0F172A] mb-6">
                        Help when you need it. Clear answers when it matters.
                    </h1>
                    <p className="text-xl text-[#64748B] mb-8 max-w-2xl mx-auto">
                        Find guides, answers, and support for running your business on Vayva.
                    </p>

                    {/* Search Input */}
                    <div className="max-w-2xl mx-auto">
                        <input
                            type="text"
                            placeholder="Search for help articles, guides, or questions…"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full px-6 py-4 text-lg border-2 border-gray-300 rounded-lg focus:outline-none focus:border-[#22C55E] transition-colors"
                        />
                    </div>
                </div>
            </section>

            {/* Quick Help Actions */}
            <section className="py-16 px-4 bg-gray-50">
                <div className="max-w-6xl mx-auto">
                    <h2 className="text-2xl font-bold text-[#0F172A] mb-8 text-center">Common actions</h2>
                    <div className="grid md:grid-cols-3 lg:grid-cols-6 gap-4">
                        {QUICK_ACTIONS.map((action) => (
                            <button
                                key={action.id}
                                className="bg-white border border-gray-200 rounded-lg p-4 hover:border-[#22C55E] hover:shadow-sm transition-all text-center"
                            >
                                <div className="text-3xl mb-2">{action.icon}</div>
                                <p className="text-sm font-semibold text-[#0F172A]">{action.label}</p>
                            </button>
                        ))}
                    </div>
                </div>
            </section>

            {/* Getting Started */}
            <section className="py-16 px-4">
                <div className="max-w-4xl mx-auto">
                    <h2 className="text-3xl font-bold text-[#0F172A] mb-8">Getting started with Vayva</h2>
                    <div className="space-y-4">
                        {GETTING_STARTED_ARTICLES.map((article, i) => (
                            <div key={i} className="bg-white border border-gray-200 rounded-lg p-6 hover:border-[#22C55E] transition-colors cursor-pointer">
                                <div className="flex justify-between items-start">
                                    <div>
                                        <h3 className="text-lg font-semibold text-[#0F172A] mb-2">{article.title}</h3>
                                        <p className="text-[#64748B]">{article.description}</p>
                                    </div>
                                    <span className="text-sm text-[#64748B] whitespace-nowrap ml-4">{article.readTime}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Help by Workflow */}
            <section className="py-16 px-4 bg-gray-50">
                <div className="max-w-4xl mx-auto">
                    <h2 className="text-3xl font-bold text-[#0F172A] mb-8">Help by workflow</h2>
                    <div className="space-y-4">
                        {WORKFLOWS.map((workflow) => (
                            <div key={workflow.id} className="bg-white border border-gray-200 rounded-lg overflow-hidden">
                                <button
                                    onClick={() => setExpandedWorkflow(expandedWorkflow === workflow.id ? null : workflow.id)}
                                    className="w-full px-6 py-4 flex justify-between items-center hover:bg-gray-50 transition-colors"
                                >
                                    <span className="text-lg font-semibold text-[#0F172A]">{workflow.title}</span>
                                    <span className="text-[#64748B]">{expandedWorkflow === workflow.id ? '−' : '+'}</span>
                                </button>
                                {expandedWorkflow === workflow.id && (
                                    <div className="px-6 pb-6 space-y-4">
                                        {workflow.problems.map((problem, i) => (
                                            <div key={i} className="border-l-2 border-[#22C55E] pl-4">
                                                <p className="font-semibold text-[#0F172A] mb-2">{problem.q}</p>
                                                <p className="text-[#64748B]">{problem.a}</p>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Troubleshooting */}
            <section className="py-16 px-4">
                <div className="max-w-4xl mx-auto">
                    <h2 className="text-3xl font-bold text-[#0F172A] mb-4">Troubleshooting</h2>
                    <p className="text-[#64748B] mb-8">What to do when something doesn\'t look right</p>
                    <div className="space-y-4">
                        {TROUBLESHOOTING.map((item, i) => (
                            <div key={i} className="bg-gray-50 rounded-lg p-6">
                                <h3 className="font-semibold text-[#0F172A] mb-2">{item.issue}</h3>
                                <p className="text-[#64748B]">{item.solution}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Billing & Account Support */}
            <section className="py-16 px-4 bg-gray-50">
                <div className="max-w-4xl mx-auto">
                    <h2 className="text-3xl font-bold text-[#0F172A] mb-8">Account & billing</h2>
                    <div className="grid md:grid-cols-2 gap-6">
                        {[
                            { title: 'Managing your plan', desc: 'Upgrade, downgrade, or cancel your subscription' },
                            { title: 'Payment issues', desc: 'Resolve billing and payment problems' },
                            { title: 'Account ownership', desc: 'Transfer or manage account ownership' },
                            { title: 'Data access & exports', desc: 'Download and export your business data' },
                        ].map((topic, i) => (
                            <div key={i} className="bg-white border border-gray-200 rounded-lg p-6 hover:border-[#22C55E] transition-colors cursor-pointer">
                                <h3 className="font-semibold text-[#0F172A] mb-2">{topic.title}</h3>
                                <p className="text-sm text-[#64748B]">{topic.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Contact Support */}
            <section className="py-16 px-4">
                <div className="max-w-3xl mx-auto text-center">
                    <h2 className="text-3xl font-bold text-[#0F172A] mb-4">Still need help?</h2>
                    <p className="text-lg text-[#64748B] mb-8 max-w-2xl mx-auto">
                        For issues that need personal attention, our support team is available to help you resolve them.
                    </p>
                    <div className="grid md:grid-cols-3 gap-6 text-left">
                        <div className="bg-gray-50 rounded-lg p-6">
                            <h3 className="font-semibold text-[#0F172A] mb-2">In-app support</h3>
                            <p className="text-sm text-[#64748B] mb-4">Get help directly in your dashboard</p>
                            <Link href="/signup">
                                <Button variant="outline" className="w-full border-2 border-gray-300">
                                    Sign in
                                </Button>
                            </Link>
                        </div>
                        <div className="bg-gray-50 rounded-lg p-6">
                            <h3 className="font-semibold text-[#0F172A] mb-2">Email support</h3>
                            <p className="text-sm text-[#64748B] mb-4">Send us a detailed message</p>
                            <a href="mailto:support@vayva.ng">
                                <Button variant="outline" className="w-full border-2 border-gray-300">
                                    Email us
                                </Button>
                            </a>
                        </div>
                        <div className="bg-gray-50 rounded-lg p-6">
                            <h3 className="font-semibold text-[#0F172A] mb-2">Priority support</h3>
                            <p className="text-sm text-[#64748B] mb-4">Available on Pro plan</p>
                            <Link href="/pricing">
                                <Button variant="outline" className="w-full border-2 border-gray-300">
                                    View plans
                                </Button>
                            </Link>
                        </div>
                    </div>
                </div>
            </section>

            {/* System Status */}
            <section className="py-16 px-4 bg-gray-50">
                <div className="max-w-3xl mx-auto text-center">
                    <h2 className="text-2xl font-bold text-[#0F172A] mb-4">System status</h2>
                    <div className="bg-white border border-gray-200 rounded-lg p-6">
                        <div className="flex items-center justify-center gap-3 mb-4">
                            <div className="w-3 h-3 bg-[#22C55E] rounded-full"></div>
                            <span className="font-semibold text-[#0F172A]">All systems operational</span>
                        </div>
                        <p className="text-sm text-[#64748B]">
                            We monitor our systems 24/7. Any issues are communicated immediately via email and in-app notifications.
                        </p>
                    </div>
                </div>
            </section>

            {/* Self-Service Philosophy */}
            <section className="py-16 px-4">
                <div className="max-w-3xl mx-auto text-center">
                    <p className="text-lg text-[#64748B] italic">
                        Vayva is designed so most issues can be understood and resolved without waiting on support.
                    </p>
                </div>
            </section>
        </div>
    );
}
