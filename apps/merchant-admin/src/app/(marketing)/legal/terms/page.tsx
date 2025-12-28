import React from 'react';
import Link from 'next/link';

const legalDocuments = [
    { title: 'Legal Hub', href: '/legal' },
    { title: 'Terms of Service', href: '/legal/terms', active: true },
    { title: 'Privacy Policy', href: '/legal/privacy' },
    { title: 'Acceptable Use Policy', href: '/legal/acceptable-use' },
    { title: 'Prohibited Items', href: '/legal/prohibited-items' },
    { title: 'Refund Policy', href: '/legal/refund-policy' },
    { title: 'KYC & Compliance', href: '/legal/kyc-safety' },
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
                            <p><strong>Version:</strong> 2.1 (Authoritative)</p>
                            <p><strong>Last Updated:</strong> January 1, 2025</p>
                            <p><strong>Jurisdiction:</strong> Federal Republic of Nigeria</p>
                            <p><strong>Governing Entity:</strong> Vayva Inc. (operating in Nigeria)</p>
                        </div>

                        <h2>1. Definitions</h2>
                        <div className="bg-gray-50 p-6 rounded-xl space-y-4 text-sm">
                            <p><strong>“Platform”</strong> refers to the Vayva software, dashboard, and API infrastructure provided at vayva.shop and related subdomains.</p>
                            <p><strong>“Merchant”</strong> refers to the business entity or individual registered to use the Platform for business operations.</p>
                            <p><strong>“End Customer”</strong> refers to the individual or entity purchasing goods or services from the Merchant via WhatsApp or Vayva-integrated channels.</p>
                            <p><strong>“Services”</strong> refers to the software features, data management tools, and integration connectors provided by Vayva.</p>
                            <p><strong>“Subscription”</strong> refers to the recurring fee paid by the Merchant for access to the Platform (Free, ₦30,000, or ₦40,000 tiers).</p>
                            <p><strong>“Withdrawal”</strong> refers to the process of transferring accumulated funds from the Vayva Wallet to the Merchant&apos;s verified bank account.</p>
                            <p><strong>“Third-Party Services”</strong> refers to external tools integrated into the Platform, including but not limited to WhatsApp (Meta), Paystack, and logistics providers.</p>
                            <p><strong>“Transaction Fee”</strong> refers to the 5% fee charged per withdrawal transaction.</p>
                        </div>

                        <h2>2. Nature of the Service</h2>
                        <p>
                            Vayva Inc. provides software infrastructure to help Merchants organize and manage commercial activity conducted via WhatsApp.
                            <strong>Vayva is a software platform provider only.</strong>
                        </p>
                        <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 my-6">
                            <p className="font-bold text-yellow-900">Important Role Clarification:</p>
                            <p className="text-sm text-yellow-800">
                                Vayva is <strong>NOT</strong> a bank, a payment processor, an escrow service, or a logistics provider.
                                Vayva is not a party to any transaction between a Merchant and an End Customer.
                                All commercial contracts for goods or services are solely between the Merchant and their Customers.
                            </p>
                        </div>

                        <h2>3. Fees, Billing & Withdrawals</h2>
                        <p>
                            Access to the Platform is subject to the payment of Subscription fees and Transaction fees as disclosed.
                        </p>
                        <ul>
                            <li><strong>Subscription Plans:</strong> Plans are billed in advance on a monthly basis. Fees are currently ₦0 (Free), ₦30,000, and ₦40,000.</li>
                            <li><strong>Withdrawal Fee:</strong> A <strong>5% Transaction Fee</strong> is applied to every withdrawal. This fee covers settlement processing and platform security.</li>
                            <li><strong>Fee Deduction:</strong> All Transaction Fees are deducted automatically from the gross withdrawal amount before the funds are settled to your bank account.</li>
                            <li><strong>Price Changes:</strong> Vayva may modify fees with 30 days prior notice. Changes will not apply retroactively.</li>
                        </ul>

                        <h2>4. Third-Party Integrations</h2>
                        <p>
                            The Platform relies on Third-Party Services (e.g., WhatsApp, Paystack) to function.
                        </p>
                        <ul>
                            <li><strong>No Control:</strong> Vayva does not control the uptime, policies, or performance of these third parties.</li>
                            <li><strong>Meta Policies:</strong> Merchant must comply with WhatsApp Business Terms. Vayva is not liable if Meta suspends a Merchant&apos;s WhatsApp access.</li>
                            <li><strong>Payment Partners:</strong> While Vayva integrates with Paystack, the actual processing of funds is handled by licensed financial institutions.</li>
                        </ul>

                        <h2>5. Merchant Responsibilities</h2>
                        <p>As a Merchant, you are solely responsible for:</p>
                        <ul>
                            <li><strong>Fulfillment:</strong> Delivering products/services as promised to your customers.</li>
                            <li><strong>Support:</strong> Handling customer inquiries and refund requests.</li>
                            <li><strong>Taxes:</strong> Calculating and remitting all applicable Nigerian taxes.</li>
                            <li><strong>KYC:</strong> Providing accurate identity information for platform integrity.</li>
                        </ul>

                        <h2>6. Enforcement & Suspension</h2>
                        <p>
                            Vayva reserves the right to restrict or suspend access to the Platform if a Merchant violates these Terms or our Acceptable Use Policy.
                        </p>
                        <ul>
                            <li><strong>Suspension:</strong> Accounts may be suspended for suspected fraud, non-payment, or prohibited activity.</li>
                            <li><strong>Data Access:</strong> In the event of suspension, Merchants may request a one-time export of their business records within 14 days, unless prohibited by law.</li>
                            <li><strong>Appeals:</strong> Suspensions may be appealed via appeals@vayva.shop. Review takes 5-7 business days.</li>
                        </ul>

                        <h2>7. Limitation of Liability</h2>
                        <p>
                            To the maximum extent permitted by Nigerian law, Vayva Inc. is not liable for:
                        </p>
                        <ul>
                            <li>Loss of profits, revenue, or business data.</li>
                            <li>Failed deliveries or customer disputes.</li>
                            <li>Downtime caused by WhatsApp or Third-Party Services.</li>
                        </ul>
                        <p>
                            Vayva&apos;s total liability is limited to the subscription fees paid by the Merchant in the 6 months preceding the claim.
                        </p>

                        <h2>8. Contact</h2>
                        <p>
                            <strong>Legal Team:</strong> legal@vayva.shop<br />
                            <strong>Jurisdiction:</strong> Federal High Court of Nigeria.
                        </p>

                        <div className="not-prose mt-12 pt-8 border-t border-gray-200">
                            <p className="text-sm text-gray-400 italic">
                                By using the Vayva Platform, you acknowledge that you have read, understood, and agree to these authoritatively versioned Terms.
                            </p>
                        </div>
                    </main>
                </div>
            </div>
        </div>
    );
}
