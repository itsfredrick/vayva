import React from 'react';
import Link from 'next/link';

const legalDocuments = [
    { title: 'Legal Hub', href: '/legal' },
    { title: 'Terms of Service', href: '/legal/terms' },
    { title: 'Privacy Policy', href: '/legal/privacy' },
    { title: 'Acceptable Use Policy', href: '/legal/acceptable-use', active: true },
    { title: 'Prohibited Items', href: '/legal/prohibited-items' },
    { title: 'Refund Policy', href: '/legal/refund-policy' },
    { title: 'KYC & Safety', href: '/legal/kyc-safety' },
    { title: 'Manage Cookies', href: '/legal/cookies' },
];

export default function AcceptableUsePolicyPage() {
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
                        <h1>Acceptable Use Policy</h1>

                        <div className="not-prose mb-8 text-sm text-gray-600">
                            <p><strong>Last Updated:</strong> January 1, 2025</p>
                            <p><strong>Jurisdiction:</strong> Federal Republic of Nigeria</p>
                            <p><strong>Governing Entity:</strong> Vayva Inc.</p>
                        </div>

                        <h2>1. Purpose</h2>
                        <p>
                            This Acceptable Use Policy ("Policy") defines the permitted and prohibited uses of the Vayva platform.
                            This Policy applies to all merchants, users, and visitors of the Service.
                        </p>
                        <p>
                            Violation of this Policy may result in warnings, restrictions, suspension, or termination of your account,
                            as determined by Vayva in its sole discretion.
                        </p>

                        <h2>2. Permitted Use</h2>
                        <p>You may use the Vayva platform to:</p>
                        <ul>
                            <li>Organize and manage legitimate business operations conducted via WhatsApp</li>
                            <li>Track orders, payments, and deliveries for lawful goods and services</li>
                            <li>Communicate with customers in a professional and lawful manner</li>
                            <li>Generate business records and analytics for your own use</li>
                            <li>Access support and educational resources provided by Vayva</li>
                        </ul>
                        <p>
                            All use must comply with Nigerian law, WhatsApp's Business Terms of Service, and Vayva's Terms of Service.
                        </p>

                        <h2>3. Prohibited Use</h2>
                        <p>The following activities are strictly prohibited:</p>

                        <h3>3.1 Illegal Activities</h3>
                        <ul>
                            <li>Using the Service to facilitate, promote, or engage in any activity that violates Nigerian law</li>
                            <li>Selling or distributing illegal goods or services</li>
                            <li>Money laundering, terrorist financing, or other financial crimes</li>
                            <li>Tax evasion or fraud</li>
                        </ul>

                        <h3>3.2 Deceptive Practices</h3>
                        <ul>
                            <li>Misrepresenting the nature, quality, or origin of goods or services</li>
                            <li>Making false or misleading claims to customers</li>
                            <li>Impersonating another person, business, or entity</li>
                            <li>Creating fake accounts or providing false information to Vayva</li>
                            <li>Engaging in bait-and-switch tactics or other fraudulent schemes</li>
                        </ul>

                        <h3>3.3 Harassment and Abuse</h3>
                        <ul>
                            <li>Harassing, threatening, or abusing customers, other merchants, or Vayva personnel</li>
                            <li>Sending unsolicited commercial messages (spam)</li>
                            <li>Engaging in hate speech, discrimination, or incitement to violence</li>
                            <li>Stalking or doxxing individuals</li>
                        </ul>

                        <h3>3.4 Data Misuse</h3>
                        <ul>
                            <li>Collecting, storing, or using customer data in violation of privacy laws</li>
                            <li>Selling or sharing customer data with third parties without consent</li>
                            <li>Scraping, harvesting, or extracting data from the Vayva platform</li>
                            <li>Using customer data for purposes unrelated to fulfilling orders</li>
                        </ul>

                        <h3>3.5 Platform Abuse</h3>
                        <ul>
                            <li>Attempting to gain unauthorized access to the Service or other users' accounts</li>
                            <li>Reverse-engineering, decompiling, or disassembling the Vayva platform</li>
                            <li>Introducing malware, viruses, or harmful code</li>
                            <li>Overloading or disrupting the Service through excessive requests or attacks</li>
                            <li>Circumventing security measures or access controls</li>
                        </ul>

                        <h3>3.6 Intellectual Property Violations</h3>
                        <ul>
                            <li>Selling counterfeit, pirated, or unauthorized goods</li>
                            <li>Infringing on trademarks, copyrights, or patents</li>
                            <li>Using Vayva's branding, logos, or materials without permission</li>
                        </ul>

                        <h3>3.7 Prohibited Items</h3>
                        <ul>
                            <li>Selling items listed in our <Link href="/legal/prohibited-items">Prohibited Items Policy</Link></li>
                            <li>Facilitating the sale of restricted or regulated goods without proper licensing</li>
                        </ul>

                        <h2>4. Enforcement</h2>
                        <p>
                            Vayva reserves the right to investigate suspected violations of this Policy.
                            We may take the following actions based on the severity and frequency of violations:
                        </p>

                        <h3>4.1 Warning</h3>
                        <p>
                            For minor or first-time violations, we may issue a written warning and require corrective action.
                        </p>

                        <h3>4.2 Restriction</h3>
                        <p>
                            We may restrict access to certain features or limit your account activity while we investigate a violation.
                        </p>

                        <h3>4.3 Suspension</h3>
                        <p>
                            For serious or repeated violations, we may suspend your account temporarily or indefinitely.
                            During suspension, you will not be able to access the Service, but your data will be preserved.
                        </p>

                        <h3>4.4 Termination</h3>
                        <p>
                            For severe violations (illegal activity, fraud, prohibited items), we may terminate your account immediately.
                            Termination is permanent and may result in deletion of your data after the legal retention period.
                        </p>

                        <h3>4.5 Legal Action</h3>
                        <p>
                            We may report illegal activity to law enforcement authorities and cooperate with investigations.
                            We reserve the right to pursue legal remedies for violations that cause harm to Vayva or third parties.
                        </p>

                        <h2>5. Reporting Violations</h2>
                        <p>
                            If you become aware of activity that violates this Policy, please report it to:
                        </p>
                        <p>
                            <strong>Abuse Reports:</strong> abuse@vayva.shop<br />
                            <strong>Security Issues:</strong> security@vayva.shop<br />
                            <strong>General Support:</strong> support@vayva.shop
                        </p>
                        <p>
                            We will investigate all reports and take appropriate action. We cannot disclose the outcome of investigations
                            due to privacy considerations.
                        </p>

                        <h2>6. Appeals</h2>
                        <p>
                            If your account has been restricted, suspended, or terminated, you may appeal the decision by contacting
                            appeals@vayva.shop. Include your account ID and a detailed explanation of why you believe the action was incorrect.
                        </p>
                        <p>
                            We will review appeals within 5-7 business days. Our decision on appeals is final.
                        </p>

                        <h2>7. Cooperation with Authorities</h2>
                        <p>
                            Vayva cooperates with law enforcement and regulatory authorities in Nigeria and internationally.
                            We may disclose information about your account and activity when required by law or in response to valid legal requests.
                        </p>

                        <h2>8. Changes to This Policy</h2>
                        <p>
                            We may update this Policy from time to time. We will notify you of material changes by email or through the Service.
                            Your continued use of the Service after such notice constitutes acceptance of the updated Policy.
                        </p>

                        <h2>9. Contact Information</h2>
                        <p>
                            For questions about this Policy, please contact:
                        </p>
                        <p>
                            <strong>Vayva Inc.</strong><br />
                            Email: legal@vayva.shop<br />
                            Support: support@vayva.shop
                        </p>

                        <div className="not-prose mt-12 pt-8 border-t border-gray-200">
                            <p className="text-sm text-gray-600">
                                This Acceptable Use Policy is part of Vayva's Terms of Service and is governed by Nigerian law.
                            </p>
                        </div>
                    </main>
                </div>
            </div>
        </div>
    );
}
