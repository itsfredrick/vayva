'use client';

import React, { useState } from 'react';
import Link from 'next/link';

const legalDocuments = [
    { title: 'Legal Hub', href: '/legal' },
    { title: 'Terms of Service', href: '/legal/terms' },
    { title: 'Privacy Policy', href: '/legal/privacy' },
    { title: 'Acceptable Use Policy', href: '/legal/acceptable-use' },
    { title: 'Prohibited Items', href: '/legal/prohibited-items' },
    { title: 'Refund Policy', href: '/legal/refund-policy' },
    { title: 'KYC & Safety', href: '/legal/kyc-safety' },
    { title: 'Manage Cookies', href: '/legal/cookies', active: true },
];

export default function ManageCookiesPage() {
    const [essentialEnabled] = useState(true); // Always enabled
    const [analyticsEnabled, setAnalyticsEnabled] = useState(false);
    const [saved, setSaved] = useState(false);

    const handleSave = () => {
        // TODO: Implement actual cookie consent storage
        localStorage.setItem('vayva_cookie_consent', JSON.stringify({
            essential: true,
            analytics: analyticsEnabled,
            timestamp: new Date().toISOString(),
        }));
        setSaved(true);
        setTimeout(() => setSaved(false), 3000);
    };

    return (
        <div className="min-h-screen bg-white">
            <div className="max-w-7xl mx-auto px-6 py-16">
                <div className="flex gap-12">
                    {/* Sidebar Navigation */}
                    <aside className="w-64 flex-shrink-0">
                        <nav className="sticky top-24">
                            <h3 className="text-sm font-semibold text-gray-900 mb-4">Legal Documents</h3>
                            <ul className="space-y-2">
                                {legalDocuments.map((doc) => (
                                    <li key={doc.href}>
                                        <Link
                                            href={doc.href}
                                            className={`block px-3 py-2 text-sm rounded ${doc.active
                                                    ? 'bg-gray-100 text-gray-900 font-medium'
                                                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                                                }`}
                                        >
                                            {doc.title}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </nav>
                    </aside>

                    {/* Main Content */}
                    <main className="flex-1 max-w-3xl">
                        <h1 className="text-4xl font-bold text-gray-900 mb-4">Manage Cookies</h1>

                        <div className="mb-8 text-sm text-gray-600">
                            <p><strong>Last Updated:</strong> January 1, 2025</p>
                            <p><strong>Jurisdiction:</strong> Federal Republic of Nigeria</p>
                            <p><strong>Governing Entity:</strong> Vayva Inc.</p>
                        </div>

                        <div className="prose prose-gray mb-12">
                            <h2>What Are Cookies?</h2>
                            <p>
                                Cookies are small text files stored on your device when you visit a website.
                                They help websites remember your preferences, improve functionality, and analyze usage patterns.
                            </p>

                            <h2>How Vayva Uses Cookies</h2>
                            <p>
                                We use cookies to provide and improve the Vayva platform.
                                Cookies help us understand how you use the Service, remember your settings, and keep your account secure.
                            </p>
                        </div>

                        {/* Cookie Categories */}
                        <div className="space-y-6 mb-12">
                            {/* Essential Cookies */}
                            <div className="border border-gray-200 rounded-lg p-6">
                                <div className="flex items-start justify-between mb-4">
                                    <div className="flex-1">
                                        <h3 className="text-lg font-semibold text-gray-900 mb-2">Essential Cookies</h3>
                                        <p className="text-sm text-gray-700 mb-4">
                                            These cookies are necessary for the Service to function. They enable core features like account authentication,
                                            security, and session management. These cookies cannot be disabled.
                                        </p>
                                    </div>
                                    <div className="ml-4">
                                        <div className="flex items-center">
                                            <input
                                                type="checkbox"
                                                checked={essentialEnabled}
                                                disabled
                                                className="w-5 h-5 text-gray-400 border-gray-300 rounded cursor-not-allowed"
                                            />
                                            <span className="ml-2 text-sm text-gray-500">Always Active</span>
                                        </div>
                                    </div>
                                </div>

                                <div className="border-t border-gray-200 pt-4">
                                    <h4 className="text-sm font-semibold text-gray-900 mb-2">Examples:</h4>
                                    <ul className="text-sm text-gray-700 space-y-1">
                                        <li>• Session authentication tokens</li>
                                        <li>• Security and fraud prevention</li>
                                        <li>• Load balancing and performance</li>
                                        <li>• User preferences and settings</li>
                                    </ul>
                                </div>
                            </div>

                            {/* Analytics Cookies */}
                            <div className="border border-gray-200 rounded-lg p-6">
                                <div className="flex items-start justify-between mb-4">
                                    <div className="flex-1">
                                        <h3 className="text-lg font-semibold text-gray-900 mb-2">Analytics Cookies</h3>
                                        <p className="text-sm text-gray-700 mb-4">
                                            These cookies help us understand how you use the Service.
                                            They collect information about pages visited, features used, and errors encountered.
                                            This data is used to improve the Service.
                                        </p>
                                    </div>
                                    <div className="ml-4">
                                        <div className="flex items-center">
                                            <input
                                                type="checkbox"
                                                checked={analyticsEnabled}
                                                onChange={(e) => setAnalyticsEnabled(e.target.checked)}
                                                className="w-5 h-5 text-[#22C55E] border-gray-300 rounded focus:ring-[#22C55E]"
                                            />
                                            <span className="ml-2 text-sm text-gray-700">
                                                {analyticsEnabled ? 'Enabled' : 'Disabled'}
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                <div className="border-t border-gray-200 pt-4">
                                    <h4 className="text-sm font-semibold text-gray-900 mb-2">Examples:</h4>
                                    <ul className="text-sm text-gray-700 space-y-1">
                                        <li>• Page views and navigation patterns</li>
                                        <li>• Feature usage and engagement metrics</li>
                                        <li>• Error tracking and performance monitoring</li>
                                        <li>• A/B testing and optimization</li>
                                    </ul>
                                </div>
                            </div>
                        </div>

                        {/* Save Button */}
                        <div className="flex items-center gap-4 mb-12">
                            <button
                                onClick={handleSave}
                                className="px-6 py-3 bg-[#22C55E] hover:bg-[#16A34A] text-white font-semibold rounded transition-colors"
                            >
                                Save Preferences
                            </button>
                            {saved && (
                                <span className="text-sm text-[#22C55E]">✓ Preferences saved successfully</span>
                            )}
                        </div>

                        {/* Additional Information */}
                        <div className="prose prose-gray">
                            <h2>Managing Cookies in Your Browser</h2>
                            <p>
                                You can also control cookies through your browser settings. Most browsers allow you to:
                            </p>
                            <ul>
                                <li>View and delete existing cookies</li>
                                <li>Block all cookies</li>
                                <li>Block third-party cookies</li>
                                <li>Clear cookies when you close your browser</li>
                            </ul>
                            <p>
                                <strong>Note:</strong> Blocking essential cookies will prevent you from using the Vayva platform.
                            </p>

                            <h2>Third-Party Cookies</h2>
                            <p>
                                Vayva does not use third-party advertising cookies.
                                We may use third-party analytics services (e.g., Google Analytics) to understand Service usage.
                                These services are bound by their own privacy policies.
                            </p>

                            <h2>Cookie Retention</h2>
                            <p>
                                Cookies are retained for the following periods:
                            </p>
                            <ul>
                                <li><strong>Session Cookies:</strong> Deleted when you close your browser</li>
                                <li><strong>Authentication Cookies:</strong> 30 days or until you log out</li>
                                <li><strong>Analytics Cookies:</strong> 12 months</li>
                            </ul>

                            <h2>Changes to Cookie Usage</h2>
                            <p>
                                We may update our use of cookies from time to time.
                                We will notify you of material changes through the Service or by email.
                            </p>

                            <h2>Contact Information</h2>
                            <p>
                                For questions about cookies or this page, please contact:
                            </p>
                            <p>
                                <strong>Vayva Inc.</strong><br />
                                Email: privacy@vayva.shop<br />
                                Support: support@vayva.shop
                            </p>
                        </div>

                        <div className="mt-12 pt-8 border-t border-gray-200">
                            <p className="text-sm text-gray-600">
                                This Cookie Management page is part of Vayva's <Link href="/legal/privacy" className="text-[#22C55E] hover:underline">Privacy Policy</Link> and is governed by Nigerian law.
                            </p>
                        </div>
                    </main>
                </div>
            </div>
        </div>
    );
}
