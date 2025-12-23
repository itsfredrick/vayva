import React from 'react';
import Link from 'next/link';

const legalDocuments = [
    { title: 'Legal Hub', href: '/legal' },
    { title: 'Terms of Service', href: '/legal/terms' },
    { title: 'Privacy Policy', href: '/legal/privacy' },
    { title: 'Acceptable Use Policy', href: '/legal/acceptable-use' },
    { title: 'Prohibited Items', href: '/legal/prohibited-items' },
    { title: 'Refund Policy', href: '/legal/refund-policy' },
    { title: 'KYC & Safety', href: '/legal/kyc-safety', active: true },
    { title: 'Manage Cookies', href: '/legal/cookies' },
];

export default function KYCSafetyPage() {
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
                        <h1>KYC & Safety Policy</h1>

                        <div className="not-prose mb-8 text-sm text-gray-600">
                            <p><strong>Last Updated:</strong> January 1, 2025</p>
                            <p><strong>Jurisdiction:</strong> Federal Republic of Nigeria</p>
                            <p><strong>Governing Entity:</strong> Vayva Inc.</p>
                        </div>

                        <h2>1. Purpose</h2>
                        <p>
                            This KYC (Know Your Customer) & Safety Policy explains Vayva's identity verification requirements,
                            risk mitigation procedures, and enforcement powers. This Policy applies to all merchants using the Vayva platform.
                        </p>
                        <p>
                            Vayva is committed to maintaining a safe, trustworthy platform and preventing misuse, fraud, and illegal activity.
                        </p>

                        <h2>2. Why KYC Is Required</h2>
                        <p>
                            Vayva collects and verifies identity information to:
                        </p>
                        <ul>
                            <li>Prevent fraud, money laundering, and terrorist financing</li>
                            <li>Comply with Nigerian anti-money laundering (AML) and counter-terrorism financing (CTF) regulations</li>
                            <li>Protect merchants and customers from scams and abuse</li>
                            <li>Maintain platform integrity and reputation</li>
                            <li>Respond to law enforcement requests and legal obligations</li>
                        </ul>

                        <h2>3. When KYC Is Triggered</h2>
                        <p>
                            Vayva may require identity verification in the following circumstances:
                        </p>

                        <h3>3.1 Account Registration</h3>
                        <p>
                            Basic identity information (name, email, phone number) is required to create an account.
                        </p>

                        <h3>3.2 High-Risk Indicators</h3>
                        <p>
                            Additional verification may be required if we detect:
                        </p>
                        <ul>
                            <li>Unusual transaction patterns or volumes</li>
                            <li>Rapid account growth or activity spikes</li>
                            <li>Multiple accounts from the same device or IP address</li>
                            <li>Reports of suspicious activity from customers or other merchants</li>
                            <li>Transactions involving high-value goods or services</li>
                        </ul>

                        <h3>3.3 Regulatory Requirements</h3>
                        <p>
                            We may require verification to comply with Nigerian law or regulatory requests.
                        </p>

                        <h3>3.4 Enforcement Actions</h3>
                        <p>
                            If your account has been flagged for policy violations, we may require identity verification before reinstating access.
                        </p>

                        <h2>4. Information Requested</h2>
                        <p>
                            Depending on the level of verification required, we may request:
                        </p>

                        <h3>4.1 Basic Verification</h3>
                        <ul>
                            <li>Full legal name</li>
                            <li>Date of birth</li>
                            <li>Residential address</li>
                            <li>Phone number (verified via SMS)</li>
                        </ul>

                        <h3>4.2 Enhanced Verification</h3>
                        <ul>
                            <li>Government-issued ID (National ID, Driver's License, International Passport, or Voter's Card)</li>
                            <li>Proof of address (utility bill, bank statement, or government correspondence dated within 3 months)</li>
                            <li>Business registration documents (CAC certificate, business license)</li>
                            <li>Bank account information (for payment verification)</li>
                        </ul>

                        <h3>4.3 Additional Documentation</h3>
                        <p>
                            In certain cases, we may request:
                        </p>
                        <ul>
                            <li>Tax Identification Number (TIN)</li>
                            <li>Selfie or video verification</li>
                            <li>Source of funds documentation</li>
                            <li>References or business history</li>
                        </ul>

                        <h2>5. Verification Process</h2>
                        <p>
                            When KYC verification is required:
                        </p>
                        <ol>
                            <li>You will receive a notification via email and in-app</li>
                            <li>You will be prompted to upload the requested documents through your account dashboard</li>
                            <li>Our compliance team will review your submission within 3-5 business days</li>
                            <li>You will be notified of the outcome (approved, additional information needed, or rejected)</li>
                        </ol>

                        <h2>6. Failure to Comply</h2>
                        <p>
                            If you fail to provide requested verification within the specified timeframe, Vayva may:
                        </p>

                        <h3>6.1 Account Restrictions</h3>
                        <ul>
                            <li>Limit access to certain features</li>
                            <li>Restrict transaction volumes or amounts</li>
                            <li>Prevent new orders or payments from being processed</li>
                        </ul>

                        <h3>6.2 Account Suspension</h3>
                        <p>
                            If verification is not completed within 14 days, your account may be suspended.
                            You will retain access to export your data but will not be able to use the Service.
                        </p>

                        <h3>6.3 Account Termination</h3>
                        <p>
                            If you refuse to provide verification or provide false information, your account will be terminated permanently.
                        </p>

                        <h2>7. Data Handling</h2>
                        <p>
                            Identity verification data is handled with the highest level of security:
                        </p>

                        <h3>7.1 Secure Storage</h3>
                        <ul>
                            <li>All documents are encrypted at rest and in transit</li>
                            <li>Access is restricted to authorized compliance personnel only</li>
                            <li>Documents are stored on secure servers with regular backups</li>
                        </ul>

                        <h3>7.2 Limited Access</h3>
                        <p>
                            Only Vayva's compliance and legal teams have access to KYC documents.
                            Customer support and other personnel cannot view sensitive identity information.
                        </p>

                        <h3>7.3 Retention Period</h3>
                        <p>
                            KYC documents are retained for 7 years after account closure, as required by Nigerian AML regulations.
                            After this period, documents are securely deleted.
                        </p>

                        <h3>7.4 Third-Party Verification</h3>
                        <p>
                            We may use third-party identity verification services to validate documents.
                            These services are bound by strict data processing agreements and may only use your data for verification purposes.
                        </p>

                        <h2>8. Privacy and Confidentiality</h2>
                        <p>
                            Your identity information is confidential and will not be shared except:
                        </p>
                        <ul>
                            <li>With law enforcement or regulatory authorities when required by law</li>
                            <li>With third-party verification services (as described above)</li>
                            <li>In response to valid legal requests (court orders, subpoenas)</li>
                        </ul>
                        <p>
                            We will not sell or share your identity information with marketers or unrelated third parties.
                        </p>

                        <h2>9. Enforcement Powers</h2>
                        <p>
                            Vayva reserves the right to:
                        </p>
                        <ul>
                            <li>Request additional verification at any time</li>
                            <li>Reject verification submissions that are incomplete, illegible, or fraudulent</li>
                            <li>Suspend or terminate accounts that fail to comply with KYC requirements</li>
                            <li>Report suspicious activity to Nigerian law enforcement authorities</li>
                            <li>Cooperate with investigations by EFCC, NDLEA, Nigeria Police, or other agencies</li>
                        </ul>

                        <h2>10. Appeals</h2>
                        <p>
                            If your verification is rejected or your account is restricted due to KYC issues,
                            you may appeal by contacting compliance@vayva.shop.
                        </p>
                        <p>
                            Include:
                        </p>
                        <ul>
                            <li>Your account email address</li>
                            <li>Explanation of the issue</li>
                            <li>Additional documentation (if applicable)</li>
                        </ul>
                        <p>
                            We will review appeals within 5-7 business days. Our decision on appeals is final.
                        </p>

                        <h2>11. Contact Information</h2>
                        <p>
                            For questions about KYC verification or this Policy, please contact:
                        </p>
                        <p>
                            <strong>Vayva Inc.</strong><br />
                            Compliance Team: compliance@vayva.shop<br />
                            Support: support@vayva.shop
                        </p>

                        <div className="not-prose mt-12 pt-8 border-t border-gray-200">
                            <p className="text-sm text-gray-600">
                                This KYC & Safety Policy is part of Vayva's Terms of Service and is governed by Nigerian law,
                                including the Money Laundering (Prevention and Prohibition) Act and EFCC regulations.
                            </p>
                        </div>
                    </main>
                </div>
            </div>
        </div>
    );
}
