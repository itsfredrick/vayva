
'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { format } from 'date-fns';

const legalDocuments = [
    { title: 'Legal Hub', href: '/legal' },
    { title: 'Terms of Service', href: '/legal/terms' },
    { title: 'Privacy Policy', href: '/legal/privacy' },
    { title: 'Acceptable Use Policy', href: '/legal/acceptable-use' },
    { title: 'Prohibited Items', href: '/legal/prohibited-items' },
    { title: 'Refund Policy', href: '/legal/refund-policy' },
    { title: 'KYC & Compliance', href: '/legal/kyc-safety' },
    { title: 'Manage Cookies', href: '/legal/cookies', active: true },
];

export default function ManageCookiesPage() {
    const [essentialEnabled] = useState(true); // Always enabled
    const [analyticsEnabled, setAnalyticsEnabled] = useState(false);
    const [marketingEnabled, setMarketingEnabled] = useState(false);
    const [status, setStatus] = useState<'idle' | 'saving' | 'success' | 'error'>('idle');
    const [errorMsg, setErrorMsg] = useState('');
    const [isLoading, setIsLoading] = useState(true);
    const [updatedAt, setUpdatedAt] = useState<string | null>(null);

    // Load initial state from API (which reads cookie)
    useEffect(() => {
        async function loadConsent() {
            try {
                const res = await fetch('/api/consent/cookies');
                if (res.ok) {
                    const data = await res.json();
                    setAnalyticsEnabled(!!data.analytics);
                    setMarketingEnabled(!!data.marketing);
                    if (data.updatedAt) setUpdatedAt(data.updatedAt);
                }
            } catch (error) {
                // Silent fail on load, default strict
            } finally {
                setIsLoading(false);
            }
        }
        loadConsent();
    }, []);

    const handleSave = async () => {
        setStatus('saving');
        setErrorMsg('');

        try {
            const res = await fetch('/api/consent/cookies', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    analytics: analyticsEnabled,
                    marketing: marketingEnabled,
                    essential: true
                })
            });

            if (res.ok) {
                const data = await res.json();
                setStatus('success');
                if (data.updatedAt) setUpdatedAt(data.updatedAt);
                setTimeout(() => setStatus('idle'), 3000);
            } else {
                const err = await res.json().catch(() => ({}));
                setStatus('error');
                setErrorMsg(err.message || 'Failed to save preferences');
            }
        } catch (error) {
            setStatus('error');
            setErrorMsg('Network error occurred');
        }
    };

    if (isLoading) {
        return <div className="min-h-screen bg-white flex items-center justify-center">Loading preferences...</div>;
    }

    return (
        <div className="min-h-screen bg-white">
            <div className="max-w-7xl mx-auto px-6 py-16">
                <div className="flex gap-12">
                    {/* Sidebar Navigation */}
                    <aside className="w-64 flex-shrink-0 hidden md:block">
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
                            <p><strong>Last Updated:</strong> {updatedAt ? format(new Date(updatedAt), 'MMMM d, yyyy') : 'Never'}</p>
                            <p><strong>Jurisdiction:</strong> Federal Republic of Nigeria</p>
                            <p><strong>Governing Entity:</strong> Vayva Inc. (operating in Nigeria)</p>
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
                            </div>

                            {/* Marketing Cookies */}
                            <div className="border border-gray-200 rounded-lg p-6">
                                <div className="flex items-start justify-between mb-4">
                                    <div className="flex-1">
                                        <h3 className="text-lg font-semibold text-gray-900 mb-2">Marketing Cookies</h3>
                                        <p className="text-sm text-gray-700 mb-4">
                                            These cookies are used to track visitors across websites. The intention is to display ads that are relevant
                                            and engaging for the individual user.
                                        </p>
                                    </div>
                                    <div className="ml-4">
                                        <div className="flex items-center">
                                            <input
                                                type="checkbox"
                                                checked={marketingEnabled}
                                                onChange={(e) => setMarketingEnabled(e.target.checked)}
                                                className="w-5 h-5 text-[#22C55E] border-gray-300 rounded focus:ring-[#22C55E]"
                                            />
                                            <span className="ml-2 text-sm text-gray-700">
                                                {marketingEnabled ? 'Enabled' : 'Disabled'}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Save Button */}
                        <div className="flex items-center gap-4 mb-12">
                            <button
                                onClick={handleSave}
                                disabled={status === 'saving'}
                                className={`px-6 py-3 font-semibold rounded transition-colors ${status === 'saving'
                                    ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                                    : 'bg-[#22C55E] hover:bg-[#16A34A] text-white'
                                    }`}
                            >
                                {status === 'saving' ? 'Saving...' : 'Save Preferences'}
                            </button>

                            {status === 'success' && (
                                <span className="text-sm text-[#22C55E] flex items-center">
                                    <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                    </svg>
                                    Saved successfully
                                </span>
                            )}

                            {status === 'error' && (
                                <span className="text-sm text-red-600 flex items-center">
                                    <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                    {errorMsg}
                                </span>
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
