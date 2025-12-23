import React from 'react';
import Link from 'next/link';

const legalDocuments = [
    { title: 'Legal Hub', href: '/legal' },
    { title: 'Terms of Service', href: '/legal/terms', active: true },
    { title: 'Privacy Policy', href: '/legal/privacy' },
    { title: 'Acceptable Use Policy', href: '/legal/acceptable-use' },
    { title: 'Prohibited Items', href: '/legal/prohibited-items' },
    { title: 'Refund Policy', href: '/legal/refund-policy' },
    { title: 'KYC & Safety', href: '/legal/kyc-safety' },
    { title: 'Manage Cookies', href: '/legal/cookies' },
];

export default function TermsOfServicePage() {
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
                        <h1>Terms of Service</h1>

                        <div className="not-prose mb-8 text-sm text-gray-600">
                            <p><strong>Last Updated:</strong> January 1, 2025</p>
                            <p><strong>Jurisdiction:</strong> Federal Republic of Nigeria</p>
                            <p><strong>Governing Entity:</strong> Vayva Inc.</p>
                        </div>

                        <h2>1. Introduction</h2>
                        <p>
                            These Terms of Service ("Terms") constitute a binding legal agreement between you ("Merchant," "you," or "your")
                            and Vayva Inc. ("Vayva," "we," "us," or "our"), governing your access to and use of the Vayva platform,
                            including all software, services, and related materials (collectively, the "Service").
                        </p>
                        <p>
                            Vayva is a software platform that helps businesses organize and manage commercial activity conducted via WhatsApp.
                            By accessing or using the Service, you acknowledge that you have read, understood, and agree to be bound by these Terms.
                        </p>
                        <p>
                            <strong>If you do not agree to these Terms, you may not access or use the Service.</strong>
                        </p>

                        <h2>2. Eligibility</h2>
                        <p>To use the Service, you must:</p>
                        <ul>
                            <li>Be at least 18 years of age</li>
                            <li>Have the legal capacity to enter into binding contracts under Nigerian law</li>
                            <li>Operate a legitimate business in compliance with all applicable Nigerian laws and regulations</li>
                            <li>Comply with WhatsApp's Business Terms of Service and Commercial Policy</li>
                            <li>Not be prohibited from using the Service under any applicable law or regulation</li>
                        </ul>
                        <p>
                            By registering for an account, you represent and warrant that you meet all eligibility requirements.
                        </p>

                        <h2>3. Nature of the Service</h2>
                        <p>
                            Vayva provides software tools to help merchants organize business records, track orders, manage payments,
                            and coordinate deliveries. <strong>Vayva is a software infrastructure provider only.</strong>
                        </p>
                        <p><strong>Vayva does NOT:</strong></p>
                        <ul>
                            <li>Act as a payment processor or handle funds on your behalf</li>
                            <li>Provide escrow services or hold money in trust</li>
                            <li>Operate as a marketplace or facilitate transactions between merchants and customers</li>
                            <li>Act as your agent, partner, or joint venture</li>
                            <li>Own, control, or participate in merchant-customer transactions</li>
                        </ul>
                        <p>
                            All transactions occur directly between you and your customers. You are solely responsible for fulfillment,
                            customer service, refunds, and all other aspects of your business operations.
                        </p>

                        <h2>4. Merchant Responsibilities</h2>
                        <p>As a merchant using the Service, you are responsible for:</p>
                        <ul>
                            <li><strong>Accuracy:</strong> Ensuring all business records, order information, and payment data entered into the Service are accurate and complete</li>
                            <li><strong>Fulfillment:</strong> Delivering goods or services to your customers as promised</li>
                            <li><strong>Customer Communication:</strong> Responding to customer inquiries and resolving disputes in good faith</li>
                            <li><strong>Legal Compliance:</strong> Operating your business in compliance with all applicable Nigerian laws, including tax, consumer protection, and commercial regulations</li>
                            <li><strong>Data Security:</strong> Maintaining the confidentiality of your account credentials and notifying Vayva immediately of any unauthorized access</li>
                            <li><strong>Prohibited Items:</strong> Not using the Service to sell or promote items listed in our Prohibited Items Policy</li>
                        </ul>

                        <h2>5. Prohibited Activities</h2>
                        <p>You may not use the Service to:</p>
                        <ul>
                            <li>Engage in illegal activities or violate any Nigerian law</li>
                            <li>Commit fraud, misrepresentation, or deceptive practices</li>
                            <li>Sell prohibited items as defined in our Prohibited Items Policy</li>
                            <li>Misuse, scrape, or reverse-engineer the Service</li>
                            <li>Interfere with the operation of the Service or other users' access</li>
                            <li>Violate the intellectual property rights of Vayva or third parties</li>
                            <li>Transmit malware, viruses, or harmful code</li>
                            <li>Harass, threaten, or abuse other users or Vayva personnel</li>
                        </ul>

                        <h2>6. Fees & Billing</h2>
                        <p>
                            Vayva offers both free and paid subscription plans. Fees for paid plans are billed in advance on a monthly or annual basis,
                            as selected by you during registration.
                        </p>
                        <p><strong>Payment Terms:</strong></p>
                        <ul>
                            <li>All fees are stated in Nigerian Naira (₦) unless otherwise specified</li>
                            <li>Fees are non-refundable except as required by Nigerian consumer protection law</li>
                            <li>You are responsible for all applicable taxes, including VAT</li>
                            <li>Vayva may change fees upon 30 days' notice</li>
                            <li>Failure to pay fees may result in suspension or termination of your account</li>
                        </ul>

                        <h2>7. Data Ownership</h2>
                        <p>
                            <strong>You own your data.</strong> All business records, customer information, and transaction data you enter into the Service
                            remain your property.
                        </p>
                        <p>
                            By using the Service, you grant Vayva a limited, non-exclusive license to process your data solely for the purpose of
                            providing the Service to you. This license terminates when you delete your data or close your account.
                        </p>
                        <p>
                            Vayva will not sell your data to third parties or use it for purposes unrelated to providing the Service.
                        </p>

                        <h2>8. Suspension & Termination</h2>
                        <p><strong>Vayva may suspend or terminate your account if:</strong></p>
                        <ul>
                            <li>You violate these Terms or any Vayva policy</li>
                            <li>You engage in prohibited activities</li>
                            <li>You fail to pay fees when due</li>
                            <li>We are required to do so by law or court order</li>
                            <li>We reasonably believe your account poses a risk to Vayva, other users, or the public</li>
                        </ul>
                        <p>
                            In cases of serious violations (fraud, illegal activity, prohibited items), Vayva may terminate your account immediately
                            without prior notice. In other cases, we will provide reasonable notice when possible.
                        </p>
                        <p>
                            <strong>You may terminate your account at any time</strong> by contacting support@vayva.shop. Upon termination,
                            you will lose access to the Service, but you may export your data within 30 days.
                        </p>

                        <h2>9. Limitation of Liability</h2>
                        <p>
                            <strong>To the maximum extent permitted by Nigerian law:</strong>
                        </p>
                        <ul>
                            <li>Vayva provides the Service "as is" without warranties of any kind</li>
                            <li>Vayva is not liable for indirect, incidental, consequential, or punitive damages</li>
                            <li>Vayva's total liability to you shall not exceed the fees you paid to Vayva in the 12 months preceding the claim</li>
                            <li>Vayva is not responsible for losses caused by your failure to fulfill orders, customer disputes, or third-party actions</li>
                        </ul>
                        <p>
                            Nothing in these Terms excludes liability for death, personal injury, or fraud.
                        </p>

                        <h2>10. Indemnification</h2>
                        <p>
                            You agree to indemnify, defend, and hold harmless Vayva, its officers, directors, employees, and agents from any claims,
                            liabilities, damages, or expenses (including legal fees) arising from:
                        </p>
                        <ul>
                            <li>Your use of the Service</li>
                            <li>Your violation of these Terms</li>
                            <li>Your violation of any law or regulation</li>
                            <li>Your business operations or transactions with customers</li>
                            <li>Any claim that your use of the Service infringes third-party rights</li>
                        </ul>

                        <h2>11. Governing Law</h2>
                        <p>
                            These Terms are governed by the laws of the <strong>Federal Republic of Nigeria</strong>.
                            Any disputes arising from these Terms or your use of the Service shall be resolved in the courts of Nigeria.
                        </p>
                        <p>
                            If any provision of these Terms is found to be unenforceable, the remaining provisions shall remain in full force and effect.
                        </p>

                        <h2>12. Modifications</h2>
                        <p>
                            Vayva may modify these Terms at any time. We will notify you of material changes by email or through the Service.
                            Your continued use of the Service after such notice constitutes acceptance of the modified Terms.
                        </p>
                        <p>
                            If you do not agree to the modified Terms, you must stop using the Service and close your account.
                        </p>

                        <h2>13. Miscellaneous</h2>
                        <p><strong>Entire Agreement:</strong> These Terms, together with our Privacy Policy and other referenced policies, constitute the entire agreement between you and Vayva.</p>
                        <p><strong>Assignment:</strong> You may not assign these Terms without Vayva's prior written consent. Vayva may assign these Terms without restriction.</p>
                        <p><strong>Waiver:</strong> Vayva's failure to enforce any provision of these Terms does not constitute a waiver of that provision.</p>
                        <p><strong>Force Majeure:</strong> Vayva is not liable for delays or failures caused by events beyond its reasonable control.</p>

                        <h2>14. Contact Information</h2>
                        <p>
                            For questions about these Terms, please contact:
                        </p>
                        <p>
                            <strong>Vayva Inc.</strong><br />
                            Email: legal@vayva.shop<br />
                            Support: support@vayva.shop
                        </p>

                        <div className="not-prose mt-12 pt-8 border-t border-gray-200">
                            <p className="text-sm text-gray-600">
                                By using the Vayva platform, you acknowledge that you have read, understood, and agree to be bound by these Terms of Service.
                            </p>
                        </div>
                    </main>
                </div>
            </div>
        </div>
    );
}
