import React from "react";
import Link from "next/link";

const legalDocuments = [
  { title: "Legal Hub", href: "/legal" },
  { title: "Terms of Service", href: "/legal/terms" },
  { title: "Privacy Policy", href: "/legal/privacy" },
  {
    title: "Acceptable Use Policy",
    href: "/legal/acceptable-use",
    active: true,
  },
  { title: "Prohibited Items", href: "/legal/prohibited-items" },
  { title: "Refund Policy", href: "/legal/refund-policy" },
  { title: "KYC & Compliance", href: "/legal/kyc-safety" },
  { title: "Manage Cookies", href: "/legal/cookies" },
];

export default function AcceptableUsePolicyPage() {
  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-7xl mx-auto px-6 py-16">
        <div className="flex gap-12">
          {/* Sidebar Navigation */}
          <aside className="w-64 flex-shrink-0">
            <nav className="sticky top-24">
              <h3 className="text-sm font-semibold text-gray-900 mb-4">
                Legal Documents
              </h3>
              <ul className="space-y-2">
                {legalDocuments.map((doc) => (
                  <li key={doc.href}>
                    <Link
                      href={doc.href}
                      className={`block px-3 py-2 text-sm rounded ${
                        doc.active
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
            <h1>Acceptable Use Policy</h1>

            <div className="not-prose mb-8 text-sm text-gray-600">
              <p>
                <strong>Last Updated:</strong> January 1, 2025
              </p>
              <p>
                <strong>Status:</strong> Enforceable
              </p>
              <p>
                <strong>Governing Entity:</strong> Vayva Inc. (operating in
                Nigeria)
              </p>
            </div>

            <h2>1. Prohibited Businesses & Goods</h2>
            <p>
              You may not use the Vayva Platform to facilitate the sale or
              management of:
            </p>
            <ul>
              <li>
                <strong>Fraudulent Services:</strong> Schemes, "get rich quick"
                programs, or impersonation of brands.
              </li>
              <li>
                <strong>Illegal Substance:</strong> Drugs, regulated chemical
                products, or prescription medication without local license.
              </li>
              <li>
                <strong>Regulated Items:</strong> Firearms, ammunition, or
                restricted military-grade hardware.
              </li>
              <li>
                <strong>Counterfeit Goods:</strong> Products that infringe on
                trademarks or intellectual property.
              </li>
            </ul>

            <h2>2. Messaging & Outreach Standard</h2>
            <p>
              Vayva is designed for Merchant-Customer service, not for spam. You
              agree not to:
            </p>
            <ul>
              <li>
                <strong>Spam:</strong> Send unsolicited bulk messages or "cold"
                outreach via our WhatsApp integrations.
              </li>
              <li>
                <strong>Misleading Headers:</strong> Use deceptive subject lines
                or sender names.
              </li>
              <li>
                <strong>Harassment:</strong> Use the Platform to harass or stalk
                customers.
              </li>
            </ul>

            <h2>3. Circumvention Attempts</h2>
            <p>
              The following technical abuses are strictly prohibited and result
              in immediate account termination:
            </p>
            <ul>
              <li>
                <strong>Credential Sharing:</strong> Allowing multiple
                unauthorized entities to use a single merchant account.
              </li>
              <li>
                <strong>Fee Avoidance:</strong> Attempting to manipulate wallet
                records or withdrawal logic to avoid platform fees.
              </li>
              <li>
                <strong>Security Probing:</strong> Port scanning, vulnerability
                testing, or scraping of platform metadata.
              </li>
            </ul>

            <div className="bg-red-50 border-l-4 border-red-500 p-4 my-6 text-sm text-red-800">
              <p className="font-bold">Violation Outcome:</p>
              <p>
                Failure to adhere to this policy results in immediate account
                restriction. Funds stored in the Vayva Wallet may be held for up
                to 180 days if a fraudulent pattern is detected, to cover
                potential customer chargebacks or legal inquiries.
              </p>
            </div>

            <h2>4. Reporting</h2>
            <p>
              Report violations of this policy to{" "}
              <strong>abuse@vayva.shop</strong>.
            </p>
          </main>
        </div>
      </div>
    </div>
  );
}
