import React from 'react';
import Link from 'next/link';

const legalDocuments = [
    { title: 'Legal Hub', href: '/legal' },
    { title: 'Terms of Service', href: '/legal/terms' },
    { title: 'Privacy Policy', href: '/legal/privacy' },
    { title: 'Acceptable Use Policy', href: '/legal/acceptable-use' },
    { title: 'Prohibited Items', href: '/legal/prohibited-items' },
    { title: 'Refund Policy', href: '/legal/refund-policy', active: true },
    { title: 'KYC & Safety', href: '/legal/kyc-safety' },
    { title: 'Manage Cookies', href: '/legal/cookies' },
];

export default function RefundPolicyPage() {
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
                        <h1>Refund Policy</h1>

                        <div className="not-prose mb-8 text-sm text-gray-600">
                            <p><strong>Last Updated:</strong> January 1, 2025</p>
                            <p><strong>Jurisdiction:</strong> Federal Republic of Nigeria</p>
                            <p><strong>Governing Entity:</strong> Vayva Inc.</p>
                        </div>

                        <h2>1. Purpose</h2>
                        <p>
                            This Refund Policy explains the billing practices and refund eligibility for Vayva subscription services.
                            This Policy applies to all merchants using paid plans on the Vayva platform.
                        </p>
                        <p>
                            <strong>Important:</strong> This Policy governs refunds for Vayva subscription fees only.
                            It does not govern refunds between you and your customers for goods or services you sell.
                            You are solely responsible for your own refund policies with your customers.
                        </p>

                        <h2>2. Free Plans</h2>
                        <p>
                            Vayva offers a free plan with limited features. No charges are applied to free plan users.
                            There are no refunds to process for free plans.
                        </p>

                        <h2>3. Paid Subscriptions</h2>
                        <p>
                            Vayva offers paid subscription plans billed on a monthly or annual basis.
                            Subscription fees are charged in advance at the beginning of each billing cycle.
                        </p>

                        <h3>3.1 Billing Cycle</h3>
                        <ul>
                            <li><strong>Monthly Plans:</strong> Billed on the same day each month</li>
                            <li><strong>Annual Plans:</strong> Billed once per year on the anniversary of your subscription start date</li>
                        </ul>

                        <h3>3.2 Payment Methods</h3>
                        <p>
                            We accept payment via credit card, debit card, bank transfer, and other methods as displayed during checkout.
                            All fees are stated in Nigerian Naira (₦) unless otherwise specified.
                        </p>

                        <h3>3.3 Taxes</h3>
                        <p>
                            You are responsible for all applicable taxes, including Value Added Tax (VAT).
                            Taxes will be added to your subscription fee where required by Nigerian law.
                        </p>

                        <h2>4. Refund Eligibility</h2>
                        <p>
                            <strong>Vayva subscription fees are generally non-refundable.</strong>
                            By subscribing to a paid plan, you agree to pay the full subscription fee for the selected billing cycle.
                        </p>

                        <h3>4.1 No Refunds for Partial Use</h3>
                        <p>
                            If you cancel your subscription or stop using the Service during a billing cycle,
                            you will not receive a refund for the unused portion of that cycle.
                            You will retain access to the Service until the end of the paid period.
                        </p>

                        <h3>4.2 No Refunds for Downgrading</h3>
                        <p>
                            If you downgrade from a higher-tier plan to a lower-tier plan or to the free plan,
                            you will not receive a refund for the difference in price.
                            The downgrade will take effect at the start of your next billing cycle.
                        </p>

                        <h3>4.3 Exceptions Required by Law</h3>
                        <p>
                            Refunds may be provided where required by Nigerian consumer protection law.
                            This includes cases where:
                        </p>
                        <ul>
                            <li>The Service was not provided as described</li>
                            <li>You were charged in error</li>
                            <li>The Service was unavailable for an extended period due to Vayva's fault</li>
                        </ul>
                        <p>
                            To request a refund under these circumstances, contact support@vayva.shop within 14 days of the charge.
                        </p>

                        <h2>5. Service Interruptions</h2>
                        <p>
                            Vayva strives to provide reliable service, but interruptions may occur due to maintenance,
                            technical issues, or events beyond our control.
                        </p>

                        <h3>5.1 Planned Maintenance</h3>
                        <p>
                            We will notify you in advance of planned maintenance whenever possible.
                            No refunds are provided for brief, scheduled downtime.
                        </p>

                        <h3>5.2 Unplanned Outages</h3>
                        <p>
                            In the event of an unplanned service outage lasting more than 24 consecutive hours,
                            you may request a pro-rated credit for the affected period.
                            Credits will be applied to your next billing cycle.
                        </p>
                        <p>
                            <strong>No automatic refunds are provided for service interruptions.</strong>
                            You must contact support@vayva.shop to request a credit.
                        </p>

                        <h2>6. Cancellation</h2>
                        <p>
                            You may cancel your subscription at any time by contacting support@vayva.shop or through your account settings.
                        </p>

                        <h3>6.1 Effect of Cancellation</h3>
                        <ul>
                            <li>Your subscription will remain active until the end of the current billing cycle</li>
                            <li>You will not be charged for subsequent billing cycles</li>
                            <li>You will not receive a refund for the current billing cycle</li>
                            <li>Your account will be downgraded to the free plan at the end of the paid period</li>
                        </ul>

                        <h3>6.2 Data Retention After Cancellation</h3>
                        <p>
                            After cancellation, your data will be retained for 30 days.
                            You may export your data during this period.
                            After 30 days, your data may be deleted in accordance with our data retention policies.
                        </p>

                        <h2>7. Billing Errors</h2>
                        <p>
                            If you believe you have been charged in error, contact support@vayva.shop within 30 days of the charge.
                            Provide the following information:
                        </p>
                        <ul>
                            <li>Your account email address</li>
                            <li>Date and amount of the charge</li>
                            <li>Explanation of why you believe the charge is incorrect</li>
                        </ul>
                        <p>
                            We will investigate and respond within 5-7 business days.
                            If we determine the charge was in error, we will issue a full refund.
                        </p>

                        <h2>8. Failed Payments</h2>
                        <p>
                            If a payment fails due to insufficient funds, expired card, or other reasons,
                            we will attempt to retry the payment. If payment continues to fail:
                        </p>
                        <ul>
                            <li>Your account may be suspended after 7 days</li>
                            <li>Your account may be downgraded to the free plan after 14 days</li>
                            <li>You will be responsible for any outstanding fees</li>
                        </ul>

                        <h2>9. Price Changes</h2>
                        <p>
                            Vayva may change subscription prices from time to time.
                            We will notify you at least 30 days in advance of any price increase.
                        </p>
                        <p>
                            If you do not agree to the new price, you may cancel your subscription before the price change takes effect.
                            If you do not cancel, your continued use of the Service constitutes acceptance of the new price.
                        </p>

                        <h2>10. Contact Information</h2>
                        <p>
                            For questions about billing, refunds, or cancellations, please contact:
                        </p>
                        <p>
                            <strong>Vayva Inc.</strong><br />
                            Email: billing@vayva.shop<br />
                            Support: support@vayva.shop
                        </p>

                        <div className="not-prose mt-12 pt-8 border-t border-gray-200">
                            <p className="text-sm text-gray-600">
                                This Refund Policy is part of Vayva's Terms of Service and is governed by Nigerian law,
                                including the Federal Competition and Consumer Protection Act.
                            </p>
                        </div>
                    </main>
                </div>
            </div>
        </div>
    );
}
