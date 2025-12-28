import React from 'react';
import Link from 'next/link';

const legalDocuments = [
    { title: 'Legal Hub', href: '/legal' },
    { title: 'Terms of Service', href: '/legal/terms' },
    { title: 'Privacy Policy', href: '/legal/privacy', active: true },
    { title: 'Acceptable Use Policy', href: '/legal/acceptable-use' },
    { title: 'Prohibited Items', href: '/legal/prohibited-items' },
    { title: 'Refund Policy', href: '/legal/refund-policy' },
    { title: 'KYC & Compliance', href: '/legal/kyc-safety' },
    { title: 'Manage Cookies', href: '/legal/cookies' },
];

export default function PrivacyPolicyPage() {
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
                    <main className="flex-1 max-w-3xl prose prose-gray">
                        <h1>Privacy Policy</h1>

                        <div className="not-prose mb-8 text-sm text-gray-600">
                            <p><strong>Last Updated:</strong> January 1, 2025</p>
                            <p><strong>Jurisdiction:</strong> Federal Republic of Nigeria</p>
                            <p><strong>Governing Entity:</strong> Vayva Inc. (operating in Nigeria)</p>
                            <p><strong>Primary Framework:</strong> Nigeria Data Protection Act (NDPA) 2023</p>
                        </div>

                        <h2>1. Data Protection Roles</h2>
                        <p>Under the <strong>Nigeria Data Protection Act (NDPA) 2023</strong>, roles are defined as follows:</p>
                        <ul>
                            <li><strong>Merchant as Data Controller:</strong> You (the Merchant) are the primary controller of your customer data. You decide what data to collect and how it is processed through the platform.</li>
                            <li><strong>Vayva as Data Processor:</strong> Vayva Inc. acts as a processor for your customer data, handling it solely on your instructions to provide platform services.</li>
                            <li><strong>Vayva as Data Controller:</strong> Vayva acts as a controller for the data you provide to create and manage your merchant account (e.g., your email and KYC documents).</li>
                        </ul>

                        <h2>2. Lawful Basis for Processing</h2>
                        <p>We process personal data only when there is a lawful basis under the NDPA, including:</p>
                        <ul>
                            <li><strong>Contractual Necessity:</strong> To provide the services you signed up for.</li>
                            <li><strong>Legal Obligation:</strong> To comply with tax, accounting, and regulatory requirements.</li>
                            <li><strong>Legitimate Interests:</strong> For platform security, fraud prevention, and service improvement.</li>
                            <li><strong>Consent:</strong> Where you have given clear permission for specific processing.</li>
                        </ul>

                        <h2>3. Data Categories Collected</h2>
                        <p>We process the following categories of data:</p>
                        <ul>
                            <li><strong>Account Data:</strong> Name, business email, and phone number.</li>
                            <li><strong>KYC Data:</strong> Identity documents and business registration files (used for platform integrity).</li>
                            <li><strong>Transactional Metadata:</strong> Timestamps, item names, and status logs.</li>
                            <li><strong>Customer Content:</strong> Delivery details provided by your customers via integrated channels.</li>
                            <li><strong>System Logs:</strong> IP addresses and browser types for security auditing.</li>
                        </ul>

                        <h2>4. Use of Category-Based Processors</h2>
                        <p>We utilize third-party sub-processors categorized as follows:</p>
                        <ul>
                            <li><strong>Infrastructure:</strong> Secure data storage and server hosting.</li>
                            <li><strong>Communications:</strong> Integration for WhatsApp and email notifications.</li>
                            <li><strong>Security & Analytics:</strong> Performance monitoring and audit logging.</li>
                        </ul>

                        <h2>5. Data Retention</h2>
                        <p>Retention is governed by necessity and legal mandate. We do not maintain a blanket retention period, but apply the following windows based on the category of record:</p>

                        <div className="not-prose overflow-x-auto my-6">
                            <table className="w-full text-sm text-left border-collapse border border-gray-200">
                                <thead className="bg-gray-50 uppercase text-[10px] font-black tracking-widest text-gray-500">
                                    <tr>
                                        <th className="px-4 py-3 border border-gray-200">Category</th>
                                        <th className="px-4 py-3 border border-gray-200">Retention Period</th>
                                        <th className="px-4 py-3 border border-gray-200">Rationale</th>
                                    </tr>
                                </thead>
                                <tbody className="text-gray-600">
                                    <tr>
                                        <td className="px-4 py-3 border border-gray-200 font-bold">Account Identity</td>
                                        <td className="px-4 py-3 border border-gray-200">Duration of active account + 3 years</td>
                                        <td className="px-4 py-3 border border-gray-200">Contractual necessity & Dispute resolution</td>
                                    </tr>
                                    <tr>
                                        <td className="px-4 py-3 border border-gray-200 font-bold">Billing & Invoices</td>
                                        <td className="px-4 py-3 border border-gray-200">7 Years</td>
                                        <td className="px-4 py-3 border border-gray-200">Statutory accounting & tax compliance</td>
                                    </tr>
                                    <tr>
                                        <td className="px-4 py-3 border border-gray-200 font-bold">Security & Access Logs</td>
                                        <td className="px-4 py-3 border border-gray-200">1 Year</td>
                                        <td className="px-4 py-3 border border-gray-200">Platform security auditing & forensics</td>
                                    </tr>
                                    <tr>
                                        <td className="px-4 py-3 border border-gray-200 font-bold">Support History</td>
                                        <td className="px-4 py-3 border border-gray-200">3 Years</td>
                                        <td className="px-4 py-3 border border-gray-200">Quality assurance & service improvement</td>
                                    </tr>
                                    <tr>
                                        <td className="px-4 py-3 border border-gray-200 font-bold">Database Backups</td>
                                        <td className="px-4 py-3 border border-gray-200">30 Days</td>
                                        <td className="px-4 py-3 border border-gray-200">Disaster recovery & resilience</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>

                        <h2>6. Security & NDPA 2023 Rights</h2>
                        <p>We implement technical and organizational measures to protect data. As a data subject under the NDPA, you have rights to:</p>
                        <ul>
                            <li><strong>Access:</strong> Confirm if we process your data and receive copies.</li>
                            <li><strong>Rectification:</strong> Correct inaccurate or incomplete information.</li>
                            <li><strong>Erasure:</strong> Request deletion, subject to legal retention obligations.</li>
                            <li><strong>Portability:</strong> Receive your data in a structured, machine-readable format.</li>
                            <li><strong>Objection:</strong> Object to processing based on legitimate interests.</li>
                        </ul>

                        <h2>7. Breach Notification</h2>
                        <p>In the event of a personal data breach likely to result in a high risk to your rights and freedoms, Vayva will notify the Nigeria Data Protection Commission (NDPC) and affected data subjects without undue delay, typically within 72 hours of becoming aware, as required by the NDPA.</p>

                        <h2>8. Cross-Border Transfers</h2>
                        <p>Vayva uses international cloud infrastructure. We ensure that such transfers comply with NDPA requirements by utilizing countries with adequate data protection levels or by implementing standard contractual clauses that ensure an equivalent level of protection.</p>

                        <h2>9. Cookies</h2>
                        <p>
                            We use cookies to improve your experience. For detailed information on the cookies we use and the purposes for which we use them, please see our <Link href="/legal/cookies">Cookie Policy</Link>.
                        </p>

                        <h2>10. Contact & Data Requests</h2>
                        <p>
                            To exercise your rights, please contact:
                        </p>
                        <p>
                            <strong>Data Protection Officer:</strong> dpo@vayva.shop<br />
                            Response Timeline: Within 30 days.
                        </p>
                    </main>
                </div>
            </div>
        </div>
    );
}
