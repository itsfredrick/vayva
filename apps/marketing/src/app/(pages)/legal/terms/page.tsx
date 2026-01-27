import React from "react";
import Link from "next/link";

const legalDocuments = [
  { title: "Legal Hub", href: "/legal" },
  { title: "Terms of Service", href: "/legal/terms", active: true },
  { title: "Privacy Policy", href: "/legal/privacy" },
  { title: "Acceptable Use Policy", href: "/legal/acceptable-use" },
  { title: "Prohibited Items", href: "/legal/prohibited-items" },
  { title: "Refund Policy", href: "/legal/refund-policy" },
  { title: "KYC & Compliance", href: "/legal/kyc-safety" },
  { title: "Manage Cookies", href: "/legal/cookies" },
  { title: "EULA", href: "/legal/eula" },
];

export default function TermsOfServicePage(): React.JSX.Element {
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
            <h1>Terms of Service</h1>

            <div className="not-prose mb-8 text-sm text-gray-600">
              <p>
                <strong>Version:</strong> 1.0
              </p>
              <p>
                <strong>Effective Date:</strong> February 1, 2026
              </p>
              <p>
                <strong>Jurisdiction:</strong> Federal Republic of Nigeria
              </p>
              <p>
                <strong>Governing Entity:</strong> Vayva Tech (operating in
                Nigeria)
              </p>
            </div>

            <h2>1. Definitions</h2>
            <div className="bg-gray-50 p-6 rounded-xl space-y-4 text-sm">
              <p>
                <strong>"Platform"</strong> refers to the Vayva software,
                dashboard, and API infrastructure provided at vayva.ng and
                related subdomains.
              </p>
              <p>
                <strong>“Merchant”</strong> refers to the business entity or
                individual registered to use the Platform for business
                operations.
              </p>
              <p>
                <strong>“End Customer”</strong> refers to the individual or
                entity purchasing goods or services from the Merchant via
                WhatsApp or Vayva-integrated channels.
              </p>
              <p>
                <strong>“Services”</strong> refers to the software features,
                data management tools, and integration connectors provided by
                Vayva.
              </p>
              <p>
                <strong>"Subscription"</strong> refers to the recurring fee paid
                by the Merchant for access to the Platform (Free, Starter at
                ₦32,250/month, or Pro at ₦43,000/month, inclusive of VAT).
              </p>
              <p>
                <strong>“Withdrawal”</strong> refers to the process of
                transferring accumulated funds from the Vayva Wallet to the
                Merchant&apos;s verified bank account.
              </p>
              <p>
                <strong>“Third-Party Services”</strong> refers to external tools
                integrated into the Platform, including but not limited to
                WhatsApp (Meta), Paystack, and logistics providers.
              </p>
              <p>
                <strong>“Transaction Fee”</strong> refers to the 3% fee charged
                per withdrawal transaction.
              </p>
            </div>

            <h2>2. Nature of the Service</h2>
            <p>
              Vayva Tech provides software infrastructure to help Merchants
              organize and manage commercial activity conducted via WhatsApp.
              <strong>Vayva is a software platform provider only.</strong>
            </p>
            <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 my-6">
              <p className="font-bold text-yellow-900">
                Important Role Clarification:
              </p>
              <p className="text-sm text-yellow-800">
                Vayva is <strong>NOT</strong> a bank, a payment processor, an
                escrow service, or a logistics provider. Vayva is not a party to
                any transaction between a Merchant and an End Customer. All
                commercial contracts for goods or services are solely between
                the Merchant and their Customers.
              </p>
            </div>

            <h2>3. Fees, Billing & Withdrawals</h2>
            <p>
              Access to the Platform is subject to the payment of Subscription
              fees and Transaction fees as disclosed.
            </p>
            <ul>
              <li>
                <strong>Subscription Plans:</strong> Plans are billed in advance
                on a monthly basis. Current fees are: Free (₦0), Starter
                (₦32,250/month incl. VAT), and Pro (₦43,000/month incl. VAT).
              </li>
              <li>
                <strong>Withdrawal Fee:</strong> A{" "}
                <strong>3% Transaction Fee</strong> is applied to every
                withdrawal. This fee covers settlement processing and platform
                security.
              </li>
              <li>
                <strong>Fee Deduction:</strong> All Transaction Fees are
                deducted automatically from the gross withdrawal amount before
                the funds are settled to your bank account.
              </li>
              <li>
                <strong>Price Changes:</strong> Vayva may modify fees with 30
                days prior notice. Changes will not apply retroactively.
              </li>
            </ul>

            <h2>4. Third-Party Integrations</h2>
            <p>
              The Platform relies on Third-Party Services (e.g., WhatsApp,
              Paystack) to function.
            </p>
            <ul>
              <li>
                <strong>No Control:</strong> Vayva does not control the uptime,
                policies, or performance of these third parties.
              </li>
              <li>
                <strong>Meta Policies:</strong> Merchant must comply with
                WhatsApp Business Terms. Vayva is not liable if Meta suspends a
                Merchant&apos;s WhatsApp access.
              </li>
              <li>
                <strong>Payment Partners:</strong> While Vayva integrates with
                Paystack, the actual processing of funds is handled by licensed
                financial institutions.
              </li>
            </ul>

            <h2>5. Merchant Responsibilities</h2>
            <p>As a Merchant, you are solely responsible for:</p>
            <ul>
              <li>
                <strong>Fulfillment:</strong> Delivering products/services as
                promised to your customers.
              </li>
              <li>
                <strong>Support:</strong> Handling customer inquiries and refund
                requests.
              </li>
              <li>
                <strong>Taxes:</strong> Calculating and remitting all applicable
                Nigerian taxes.
              </li>
              <li>
                <strong>KYC:</strong> Providing accurate identity information
                for platform integrity.
              </li>
            </ul>

            <h2>6. Enforcement & Suspension</h2>
            <p>
              Vayva reserves the right to restrict or suspend access to the
              Platform if a Merchant violates these Terms or our Acceptable Use
              Policy.
            </p>
            <ul>
              <li>
                <strong>Suspension:</strong> Accounts may be suspended for
                suspected fraud, non-payment, or prohibited activity.
              </li>
              <li>
                <strong>Data Access:</strong> In the event of suspension,
                Merchants may request a one-time export of their business
                records within 14 days, unless prohibited by law.
              </li>
              <li>
                <strong>Appeals:</strong> Suspensions may be appealed via
                support@vayva.ng. Review takes 5-7 business days.
              </li>
            </ul>


            <h2>6a. Content Moderation & Safety</h2>
            <div className="bg-red-50 p-4 border-l-4 border-red-500 my-4 text-sm">
              <p className="font-bold text-red-900">Zero Tolerance Policy</p>
              <p>
                Vayva has zero tolerance for objectionable content. We reserve the right to
                <strong> immediately delete</strong> any content and <strong>block</strong> any user/merchant who posts:
                defamatory, pornographic, violent, hateful, or illegal material.
              </p>
            </div>
            <p>
              Users may report objectionable content via the "Report" function on any store or product page.
              Vayva commits to reviewing such reports within 24 hours.
            </p>

            <h2>7. Limitation of Liability</h2>
            <p>
              To the maximum extent permitted by Nigerian law, Vayva Tech is not
              liable for:
            </p>
            <ul>
              <li>Loss of profits, revenue, or business data.</li>
              <li>Failed deliveries or customer disputes.</li>
              <li>Downtime caused by WhatsApp or Third-Party Services.</li>
            </ul>
            <p>
              Vayva&apos;s total liability is limited to the subscription fees
              paid by the Merchant in the 6 months preceding the claim.
            </p>

            <h2>8. Governing Law & Dispute Resolution</h2>
            <p>
              These Terms shall be governed by and construed in accordance with
              the laws of the Federal Republic of Nigeria.
            </p>
            <ul>
              <li>
                <strong>Informal Resolution:</strong> Before initiating formal
                proceedings, parties agree to attempt resolution through direct
                communication for a period of 30 days.
              </li>
              <li>
                <strong>Arbitration:</strong> Disputes that cannot be resolved
                informally shall be submitted to binding arbitration under the
                Arbitration and Conciliation Act (Cap A18 LFN 2004) in Lagos,
                Nigeria.
              </li>
              <li>
                <strong>Jurisdiction:</strong> For matters not subject to
                arbitration, the Federal High Court of Nigeria shall have
                exclusive jurisdiction.
              </li>
            </ul>

            <h2>9. Modifications to Terms</h2>
            <p>
              Vayva reserves the right to modify these Terms at any time. We
              will provide notice of material changes by:
            </p>
            <ul>
              <li>Posting the updated Terms on the Platform</li>
              <li>Sending an email notification to your registered address</li>
              <li>Displaying a prominent notice in your dashboard</li>
            </ul>
            <p>
              Continued use of the Platform after changes become effective
              constitutes acceptance of the modified Terms. If you do not agree
              to the changes, you must discontinue use and may request account
              closure.
            </p>

            <h2>10. Severability</h2>
            <p>
              If any provision of these Terms is found to be unenforceable or
              invalid by a court of competent jurisdiction, that provision shall
              be limited or eliminated to the minimum extent necessary, and the
              remaining provisions shall remain in full force and effect.
            </p>

            <h2>11. Contact</h2>
            <p>
              <strong>General Support:</strong> support@vayva.ng
              <br />
              <strong>Billing Inquiries:</strong> billing@vayva.ng
            </p>

            <div className="not-prose mt-12 pt-8 border-t border-gray-200">
              <p className="text-sm text-gray-400 italic">
                By using Vayva, you acknowledge that you have read,
                understood, and agree to be bound by these Terms of Service.
              </p>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}
