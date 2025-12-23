import React from 'react';
import Link from 'next/link';

const legalDocuments = [
    { title: 'Legal Hub', href: '/legal', active: true },
    { title: 'Terms of Service', href: '/legal/terms' },
    { title: 'Privacy Policy', href: '/legal/privacy' },
    { title: 'Acceptable Use Policy', href: '/legal/acceptable-use' },
    { title: 'Prohibited Items', href: '/legal/prohibited-items' },
    { title: 'Refund Policy', href: '/legal/refund-policy' },
    { title: 'KYC & Safety', href: '/legal/kyc-safety' },
    { title: 'Manage Cookies', href: '/legal/cookies' },
];

export default function LegalHubPage() {
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
                        {/* Hero */}
                        <div className="mb-12">
                            <h1 className="text-4xl font-bold text-gray-900 mb-4">Legal & Compliance</h1>
                            <p className="text-lg text-gray-700 leading-relaxed">
                                This Legal Hub provides access to Vayva's policies, terms, and compliance documents.
                                These documents govern how the Vayva platform operates and how users are expected to use it.
                            </p>
                        </div>

                        {/* Core Legal Documents */}
                        <section className="mb-12">
                            <h2 className="text-2xl font-bold text-gray-900 mb-6">Core Legal Documents</h2>
                            <div className="space-y-6">
                                <div className="border-l-4 border-gray-900 pl-6">
                                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                                        <Link href="/legal/terms" className="hover:underline">Terms of Service</Link>
                                    </h3>
                                    <p className="text-gray-700">Governs platform use and defines the legal contract between Vayva and merchants.</p>
                                </div>

                                <div className="border-l-4 border-gray-900 pl-6">
                                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                                        <Link href="/legal/privacy" className="hover:underline">Privacy Policy</Link>
                                    </h3>
                                    <p className="text-gray-700">Explains data handling practices and compliance with Nigeria Data Protection Regulation (NDPR).</p>
                                </div>

                                <div className="border-l-4 border-gray-900 pl-6">
                                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                                        <Link href="/legal/acceptable-use" className="hover:underline">Acceptable Use Policy</Link>
                                    </h3>
                                    <p className="text-gray-700">Defines permitted behavior and prohibited activities on the Vayva platform.</p>
                                </div>

                                <div className="border-l-4 border-gray-900 pl-6">
                                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                                        <Link href="/legal/prohibited-items" className="hover:underline">Prohibited Items</Link>
                                    </h3>
                                    <p className="text-gray-700">Lists restricted goods and services that cannot be sold using Vayva.</p>
                                </div>

                                <div className="border-l-4 border-gray-900 pl-6">
                                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                                        <Link href="/legal/refund-policy" className="hover:underline">Refund Policy</Link>
                                    </h3>
                                    <p className="text-gray-700">Explains billing practices and refund eligibility for Vayva subscriptions.</p>
                                </div>
                            </div>
                        </section>

                        {/* Safety & Compliance */}
                        <section className="mb-12">
                            <h2 className="text-2xl font-bold text-gray-900 mb-6">Safety & Compliance</h2>
                            <div className="space-y-6">
                                <div className="border-l-4 border-gray-900 pl-6">
                                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                                        <Link href="/legal/kyc-safety" className="hover:underline">KYC & Safety</Link>
                                    </h3>
                                    <p className="text-gray-700">Identity verification requirements, risk mitigation, and enforcement procedures.</p>
                                </div>

                                <div className="border-l-4 border-gray-900 pl-6">
                                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                                        <Link href="/legal/cookies" className="hover:underline">Cookie Management</Link>
                                    </h3>
                                    <p className="text-gray-700">Consent controls and tracking preferences for Vayva web properties.</p>
                                </div>
                            </div>
                        </section>

                        {/* Disclaimer */}
                        <div className="border-t border-gray-200 pt-8">
                            <p className="text-sm text-gray-600">
                                These documents are intended to provide transparency. If you have legal questions, consult a qualified legal professional.
                            </p>
                        </div>

                        {/* Meta Information */}
                        <div className="mt-8 pt-8 border-t border-gray-200">
                            <dl className="grid grid-cols-2 gap-4 text-sm">
                                <div>
                                    <dt className="font-semibold text-gray-900">Jurisdiction</dt>
                                    <dd className="text-gray-700">Federal Republic of Nigeria</dd>
                                </div>
                                <div>
                                    <dt className="font-semibold text-gray-900">Governing Entity</dt>
                                    <dd className="text-gray-700">Vayva Inc.</dd>
                                </div>
                            </dl>
                        </div>
                    </main>
                </div>
            </div>
        </div>
    );
}
