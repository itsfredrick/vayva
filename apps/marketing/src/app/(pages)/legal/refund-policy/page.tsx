import React from "react";
import Link from "next/link";

const legalDocuments = [
  { title: "Legal Hub", href: "/legal" },
  { title: "Terms of Service", href: "/legal/terms" },
  { title: "Privacy Policy", href: "/legal/privacy" },
  { title: "Acceptable Use Policy", href: "/legal/acceptable-use" },
  { title: "Prohibited Items", href: "/legal/prohibited-items" },
  { title: "Refund Policy", href: "/legal/refund-policy", active: true },
  { title: "KYC & Compliance", href: "/legal/kyc-safety" },
  { title: "Manage Cookies", href: "/legal/cookies" },
  { title: "EULA", href: "/legal/eula" },
];

export default function RefundPolicyPage(): React.JSX.Element {
  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-7xl mx-auto px-6 py-16">
        <div className="flex flex-col lg:flex-row gap-8 lg:gap-12">
          {/* Sidebar Navigation */}
          <aside className="w-full lg:w-64 flex-shrink-0 hidden lg:block">
            <nav className="sticky top-24">
              <h3 className="text-sm font-semibold text-gray-900 mb-4">
                Legal Documents
              </h3>
              <ul className="space-y-2">
                {legalDocuments.map((doc: any) => (
                  <li key={doc.href}>
                    <Link
                      href={doc.href}
                      className={`block px-3 py-2 text-sm rounded ${doc.active
                          ? "bg-gray-100 text-gray-900 font-medium"
                          : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
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
              <p>
                <strong>Effective Date:</strong> February 1, 2026
              </p>
              <p>
                <strong>Governing Entity:</strong> Vayva Tech (operating in
                Nigeria)
              </p>
            </div>

            <h2>1. Subscription Refunds</h2>
            <p>
              Vayva provides software-as-a-service (SaaS) and follows a
              no-refund policy for subscription fees. Since we offer a 7-day
              free trial for new users to evaluate the Service, we do not
              provide refunds once a paid subscription has been initiated or
              renewed.
            </p>
            <p>
              You may cancel your subscription at any time. Upon cancellation,
              you will continue to have access to the Service until the end of
              your current billing period. No partial refunds will be issued for
              unused time.
            </p>

            <h2>2. Transaction & Withdrawal Fees</h2>
            <p>
              <strong>Withdrawal fees (3%) are non-refundable.</strong> Once a
              withdrawal request is processed and the fee is deducted, the fee
              cannot be refunded or reversed, as it covers the costs associated
              with the fund settlement and transaction processing.
            </p>

            <h2>3. Merchant-Customer Disputes</h2>
            <p>
              Vayva is a software provider and does not handle payments between
              you and your customers directly. Any refunds for goods or services
              sold by you to your customers must be handled directly between you
              and the customer. Vayva is not responsible for, and will not
              facilitate, refunds for merchant-customer transactions.
            </p>

            <h2>4. Exceptions</h2>
            <p>
              We may, at our sole discretion, issue refunds in exceptional
              circumstances, such as:
            </p>
            <ul>
              <li>
                Technical errors where you were charged multiple times for the
                same subscription
              </li>
              <li>
                Where required by mandatory Nigerian consumer protection laws
              </li>
            </ul>

            <h2>5. Refund Request Process</h2>
            <p>
              To request a refund under the exceptions above, please follow
              these steps:
            </p>
            <ul>
              <li>
                <strong>Step 1:</strong> Email billing@vayva.ng with subject
                line "Refund Request - [Your Account Email]"
              </li>
              <li>
                <strong>Step 2:</strong> Include your account email, date of
                charge, amount, and reason for the refund request
              </li>
              <li>
                <strong>Step 3:</strong> Our team will review your request
                within 5-7 business days
              </li>
              <li>
                <strong>Step 4:</strong> If approved, refunds will be processed
                to your original payment method within 10 business days
              </li>
            </ul>

            <h2>6. Cancellation</h2>
            <p>
              You may cancel your subscription at any time through your
              dashboard under Settings → Billing → Cancel Subscription. Upon
              cancellation:
            </p>
            <ul>
              <li>
                Your subscription will remain active until the end of the
                current billing period
              </li>
              <li>
                You will retain access to your data and can export it before
                the period ends
              </li>
              <li>
                After the billing period ends, your account will be downgraded
                to the Free tier
              </li>
            </ul>

            <h2>7. Contact Us</h2>
            <p>
              If you believe you are entitled to an exception or have questions
              about your billing, please contact us at:
            </p>
            <p>
              <strong>Vayva Billing Support</strong>
              <br />
              Email: billing@vayva.ng
              <br />
              Response Time: 1-2 business days
            </p>
          </main>
        </div>
      </div>
    </div>
  );
}
