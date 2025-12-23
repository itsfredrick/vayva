import React from 'react';
import Link from 'next/link';

const legalDocuments = [
    { title: 'Legal Hub', href: '/legal' },
    { title: 'Terms of Service', href: '/legal/terms' },
    { title: 'Privacy Policy', href: '/legal/privacy', active: true },
    { title: 'Acceptable Use Policy', href: '/legal/acceptable-use' },
    { title: 'Prohibited Items', href: '/legal/prohibited-items' },
    { title: 'Refund Policy', href: '/legal/refund-policy' },
    { title: 'KYC & Safety', href: '/legal/kyc-safety' },
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
                            <p><strong>Governing Entity:</strong> Vayva Inc.</p>
                            <p><strong>Regulatory Framework:</strong> Nigeria Data Protection Regulation (NDPR)</p>
                        </div>

                        <h2>1. Data Controller Identification</h2>
                        <p>
                            Vayva Inc. ("Vayva," "we," "us," or "our") is the data controller responsible for the collection, processing,
                            and protection of personal data obtained through the Vayva platform.
                        </p>
                        <p><strong>Contact Information:</strong></p>
                        <p>
                            Vayva Inc.<br />
                            Email: privacy@vayva.shop<br />
                            Data Protection Officer: dpo@vayva.shop
                        </p>

                        <h2>2. Types of Data Collected</h2>
                        <p>We collect the following categories of personal data:</p>

                        <h3>2.1 Account Information</h3>
                        <ul>
                            <li>Full name</li>
                            <li>Email address</li>
                            <li>Phone number</li>
                            <li>Business name and registration details</li>
                            <li>Password (encrypted)</li>
                        </ul>

                        <h3>2.2 Business Transaction Data</h3>
                        <ul>
                            <li>Customer names and contact information (as entered by you)</li>
                            <li>Order details (products, quantities, prices)</li>
                            <li>Payment information (amounts, dates, methods — we do not store payment card details)</li>
                            <li>Delivery addresses and tracking information</li>
                        </ul>

                        <h3>2.3 Usage and Device Data</h3>
                        <ul>
                            <li>IP address</li>
                            <li>Browser type and version</li>
                            <li>Device information</li>
                            <li>Pages visited and features used</li>
                            <li>Time and date of access</li>
                            <li>Referring website</li>
                        </ul>

                        <h2>3. Lawful Basis for Processing</h2>
                        <p>We process personal data based on the following lawful grounds under the NDPR:</p>

                        <h3>3.1 Contractual Necessity</h3>
                        <p>
                            Processing is necessary to provide the Vayva service to you under our Terms of Service.
                            This includes account management, order tracking, and platform functionality.
                        </p>

                        <h3>3.2 Legal Obligations</h3>
                        <p>
                            We process data to comply with Nigerian law, including tax regulations, anti-money laundering requirements,
                            and law enforcement requests.
                        </p>

                        <h3>3.3 Legitimate Interests</h3>
                        <p>
                            We process data for legitimate business purposes, including fraud prevention, security, service improvement,
                            and customer support. We balance these interests against your privacy rights.
                        </p>

                        <h3>3.4 Consent</h3>
                        <p>
                            For certain processing activities (e.g., marketing communications, non-essential cookies), we obtain your explicit consent.
                        </p>

                        <h2>4. How Data Is Used</h2>
                        <p>We use your personal data to:</p>
                        <ul>
                            <li>Provide and maintain the Vayva service</li>
                            <li>Process and track your business transactions</li>
                            <li>Communicate with you about your account and service updates</li>
                            <li>Provide customer support</li>
                            <li>Detect and prevent fraud, abuse, and security incidents</li>
                            <li>Comply with legal obligations</li>
                            <li>Improve and develop new features</li>
                            <li>Send marketing communications (with your consent)</li>
                        </ul>

                        <h2>5. Data Sharing</h2>
                        <p><strong>We do not sell your personal data to third parties.</strong></p>
                        <p>We may share your data with:</p>

                        <h3>5.1 Service Providers</h3>
                        <p>
                            We share data with vendors who provide infrastructure, analytics, and support services.
                            These vendors are bound by data processing agreements and may only use your data to provide services to Vayva.
                        </p>

                        <h3>5.2 Legal Authorities</h3>
                        <p>
                            We may disclose data when required by Nigerian law, court order, or government request.
                            We will notify you of such requests unless prohibited by law.
                        </p>

                        <h3>5.3 Business Transfers</h3>
                        <p>
                            In the event of a merger, acquisition, or sale of assets, your data may be transferred to the acquiring entity.
                            We will notify you of any such transfer.
                        </p>

                        <h2>6. Data Retention</h2>
                        <p>We retain personal data for the following periods:</p>
                        <ul>
                            <li><strong>Account Data:</strong> For the duration of your account plus 2 years after closure</li>
                            <li><strong>Transaction Records:</strong> 7 years from the date of transaction (for tax and legal compliance)</li>
                            <li><strong>Usage Data:</strong> 12 months</li>
                            <li><strong>Marketing Data:</strong> Until you withdraw consent or 3 years of inactivity</li>
                        </ul>
                        <p>
                            After the retention period, we securely delete or anonymize your data.
                        </p>

                        <h2>7. Security Measures</h2>
                        <p>We implement industry-standard security measures to protect your data, including:</p>
                        <ul>
                            <li>Encryption of data in transit (TLS/SSL) and at rest</li>
                            <li>Access controls and authentication requirements</li>
                            <li>Regular security audits and vulnerability assessments</li>
                            <li>Employee training on data protection</li>
                            <li>Incident response procedures</li>
                        </ul>
                        <p>
                            While we take reasonable precautions, no system is completely secure.
                            You are responsible for maintaining the confidentiality of your account credentials.
                        </p>

                        <h2>8. Your Rights Under NDPR</h2>
                        <p>As a data subject in Nigeria, you have the following rights:</p>

                        <h3>8.1 Right of Access</h3>
                        <p>You may request a copy of the personal data we hold about you.</p>

                        <h3>8.2 Right to Correction</h3>
                        <p>You may request correction of inaccurate or incomplete data.</p>

                        <h3>8.3 Right to Deletion</h3>
                        <p>
                            You may request deletion of your data, subject to our legal retention obligations.
                            Deleting your account will result in loss of access to the Service.
                        </p>

                        <h3>8.4 Right to Data Portability</h3>
                        <p>You may request your data in a machine-readable format for transfer to another service.</p>

                        <h3>8.5 Right to Object</h3>
                        <p>You may object to processing based on legitimate interests or for marketing purposes.</p>

                        <h3>8.6 Right to Withdraw Consent</h3>
                        <p>Where processing is based on consent, you may withdraw consent at any time.</p>

                        <p><strong>To exercise your rights, contact:</strong> privacy@vayva.shop</p>
                        <p>We will respond to requests within 30 days.</p>

                        <h2>9. Cross-Border Data Transfers</h2>
                        <p>
                            Your data may be processed on servers located outside Nigeria. When we transfer data internationally,
                            we ensure adequate safeguards are in place, including:
                        </p>
                        <ul>
                            <li>Data processing agreements with standard contractual clauses</li>
                            <li>Vendor compliance with international data protection standards</li>
                            <li>Encryption and security measures during transfer</li>
                        </ul>

                        <h2>10. Cookies and Tracking</h2>
                        <p>
                            We use cookies and similar technologies to provide and improve the Service.
                            For detailed information about our use of cookies, please see our <Link href="/legal/cookies">Cookie Management</Link> page.
                        </p>
                        <p>
                            You can control cookie preferences through your browser settings or our cookie consent tool.
                        </p>

                        <h2>11. Children's Privacy</h2>
                        <p>
                            The Vayva service is not intended for individuals under 18 years of age.
                            We do not knowingly collect personal data from children. If we become aware that we have collected data from a child,
                            we will delete it promptly.
                        </p>

                        <h2>12. Changes to This Privacy Policy</h2>
                        <p>
                            We may update this Privacy Policy from time to time. We will notify you of material changes by email or through the Service.
                            Your continued use of the Service after such notice constitutes acceptance of the updated policy.
                        </p>

                        <h2>13. Complaints and Regulatory Contact</h2>
                        <p>
                            If you have concerns about how we handle your personal data, please contact us at privacy@vayva.shop.
                            We will investigate and respond to your complaint.
                        </p>
                        <p>
                            You also have the right to lodge a complaint with the Nigeria Data Protection Commission (NDPC):
                        </p>
                        <p>
                            <strong>Nigeria Data Protection Commission (NDPC)</strong><br />
                            Website: ndpc.gov.ng<br />
                            Email: info@ndpc.gov.ng
                        </p>

                        <h2>14. Contact Information</h2>
                        <p>
                            For questions about this Privacy Policy or to exercise your data rights, please contact:
                        </p>
                        <p>
                            <strong>Vayva Inc.</strong><br />
                            Privacy Team: privacy@vayva.shop<br />
                            Data Protection Officer: dpo@vayva.shop<br />
                            General Support: support@vayva.shop
                        </p>

                        <div className="not-prose mt-12 pt-8 border-t border-gray-200">
                            <p className="text-sm text-gray-600">
                                This Privacy Policy is compliant with the Nigeria Data Protection Regulation (NDPR) and applicable Nigerian law.
                            </p>
                        </div>
                    </main>
                </div>
            </div>
        </div>
    );
}
