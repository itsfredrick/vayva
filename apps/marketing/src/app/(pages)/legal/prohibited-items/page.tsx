import React from "react";
import Link from "next/link";

const legalDocuments = [
  { title: "Legal Hub", href: "/legal" },
  { title: "Terms of Service", href: "/legal/terms" },
  { title: "Privacy Policy", href: "/legal/privacy" },
  { title: "Acceptable Use Policy", href: "/legal/acceptable-use" },
  { title: "Prohibited Items", href: "/legal/prohibited-items", active: true },
  { title: "Refund Policy", href: "/legal/refund-policy" },
  { title: "KYC & Compliance", href: "/legal/kyc-safety" },
  { title: "Manage Cookies", href: "/legal/cookies" },
];

export default function ProhibitedItemsPage() {
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
            <h1>Prohibited Items Policy</h1>

            <div className="not-prose mb-8 text-sm text-gray-600">
              <p>
                <strong>Last Updated:</strong> January 1, 2025
              </p>
              <p>
                <strong>Jurisdiction:</strong> Federal Republic of Nigeria
              </p>
              <p>
                <strong>Governing Entity:</strong> Vayva Inc. (operating in
                Nigeria)
              </p>
            </div>

            <h2>1. Purpose</h2>
            <p>
              This Prohibited Items Policy defines goods and services that may
              not be sold, promoted, or facilitated using the Vayva platform.
              This Policy protects Vayva from regulatory and reputational risk
              and ensures compliance with Nigerian law. This Policy reflects
              applicable Nigerian laws and regulations, including NDLEA and
              NAFDAC restrictions where applicable.
            </p>
            <p>
              This Policy should be read in conjunction with the Acceptable Use
              Policy and Terms of Service.
            </p>
            <p>
              <strong>
                Violation of this Policy may result in immediate account
                suspension or termination, at Vayva’s sole discretion.
              </strong>
            </p>

            <h2>2. Prohibited Categories</h2>
            <p>The following items and services are strictly prohibited:</p>

            <h3>2.1 Illegal Substances</h3>
            <ul>
              <li>Narcotics, controlled substances, and illegal drugs</li>
              <li>Prescription medications without proper licensing</li>
              <li>Psychoactive substances and synthetic drugs</li>
              <li>Drug paraphernalia</li>
              <li>Unregulated supplements or performance-enhancing drugs</li>
            </ul>

            <h3>2.2 Weapons and Explosives</h3>
            <ul>
              <li>Firearms, ammunition, and firearm parts</li>
              <li>Explosives, fireworks, and incendiary devices</li>
              <li>Knives and bladed weapons (except kitchen utensils)</li>
              <li>Tasers, stun guns, and other electroshock weapons</li>
              <li>Weapon accessories and tactical gear intended for combat</li>
            </ul>

            <h3>2.3 Counterfeit and Pirated Goods</h3>
            <ul>
              <li>Counterfeit designer goods, clothing, or accessories</li>
              <li>Pirated software, movies, music, or digital content</li>
              <li>Fake documents, IDs, or certificates</li>
              <li>Unauthorized replicas of branded products</li>
              <li>Items that infringe on intellectual property rights</li>
            </ul>

            <h3>2.4 Financial Fraud and Scams</h3>
            <ul>
              <li>
                Ponzi schemes, pyramid schemes, or multi-level marketing scams
              </li>
              <li>Fake investment opportunities or get-rich-quick schemes</li>
              <li>
                Stolen credit cards, bank accounts, or financial instruments
              </li>
              <li>Money laundering services or structuring transactions</li>
              <li>Cryptocurrency scams or unregistered securities</li>
              <li>Sale of stolen financial data or credentials</li>
            </ul>

            <h3>2.5 Adult Content and Services</h3>
            <ul>
              <li>Pornography or sexually explicit materials</li>
              <li>Escort services or prostitution</li>
              <li>Sex toys and adult novelties (unless properly licensed)</li>
              <li>Content depicting minors in sexual or suggestive contexts</li>
            </ul>

            <h3>2.6 Hazardous and Regulated Materials</h3>
            <ul>
              <li>Toxic chemicals, poisons, or hazardous waste</li>
              <li>Radioactive materials</li>
              <li>Biological agents or infectious substances</li>
              <li>Asbestos or lead-based products</li>
              <li>Pesticides or herbicides without proper licensing</li>
            </ul>

            <h3>2.7 Regulated Goods and Services</h3>
            <ul>
              <li>Tobacco products (unless properly licensed)</li>
              <li>Alcohol (unless properly licensed)</li>
              <li>Gambling services or lottery tickets</li>
              <li>Medical devices or services without proper licensing</li>
              <li>Legal services without proper accreditation</li>
              <li>Financial services without CBN or SEC licensing</li>
            </ul>

            <h3>2.8 Items Illegal Under Nigerian Law</h3>
            <ul>
              <li>
                Any item prohibited by Nigerian federal, state, or local law
              </li>
              <li>Items that violate Nigerian customs or import regulations</li>
              <li>Items subject to sanctions or trade restrictions</li>
              <li>Stolen goods or items obtained through illegal means</li>
            </ul>

            <h3>2.9 Digital Abuse and Circumvention Tools</h3>
            <ul>
              <li>SIM cards, bulk OTP services, or SMS spamming tools</li>
              <li>
                Tools designed to bypass platform safeguards or verification
              </li>
              <li>Fake verification documents or "identity packs"</li>
              <li>Account selling or trading services</li>
            </ul>

            <h2>3. Non-Exhaustive List</h2>
            <p>
              This list is not exhaustive. Vayva reserves the right to prohibit
              any item or service that:
            </p>
            <ul>
              <li>Violates Nigerian law or regulation</li>
              <li>Poses a risk to public health or safety</li>
              <li>Violates the rights of third parties</li>
              <li>Damages Vayva's reputation or business interests</li>
              <li>
                Is otherwise deemed inappropriate by Vayva in its sole
                discretion
              </li>
            </ul>

            <h2>4. Enforcement</h2>
            <p>
              If we detect or receive a report of prohibited items on your
              account, we will take the following actions:
            </p>

            <h3>4.1 Immediate Removal</h3>
            <p>
              We will remove listings or records of prohibited items from your
              account.
            </p>

            <h3>4.2 Account Suspension</h3>
            <p>
              Your account will be suspended pending investigation. You will not
              be able to access the Service during this time.
            </p>

            <h3>4.3 Account Termination</h3>
            <p>
              For serious violations (illegal drugs, weapons, fraud), we will
              terminate your account permanently.
            </p>

            <h3>4.4 Reporting to Authorities</h3>
            <p>
              We will report illegal activity to Nigerian law enforcement
              authorities, including the Nigeria Police Force, NDLEA (National
              Drug Law Enforcement Agency), EFCC (Economic and Financial Crimes
              Commission), or other relevant agencies.
            </p>

            <h3>4.5 Legal Action</h3>
            <p>
              We reserve the right to pursue legal remedies for violations that
              cause harm to Vayva or third parties.
            </p>

            <h2>5. Reporting Prohibited Items</h2>
            <p>
              If you become aware of prohibited items being sold using Vayva,
              please report them immediately:
            </p>
            <p>
              <strong>Report Prohibited Items:</strong> abuse@vayva.shop
              <br />
              <strong>Security Issues:</strong> security@vayva.shop
            </p>
            <p>Include as much detail as possible, including:</p>
            <ul>
              <li>Description of the prohibited item</li>
              <li>Merchant account information (if known)</li>
              <li>Screenshots or evidence (if available)</li>
            </ul>
            <p>
              We will investigate all reports confidentially and take
              appropriate action.
            </p>

            <h2>6. Uncertain Items</h2>
            <p>
              If you are unsure whether an item is prohibited, contact us before
              listing it:
            </p>
            <p>
              <strong>Compliance Questions:</strong> compliance@vayva.shop
            </p>
            <p>
              We will review your inquiry and provide guidance. However, the
              final determination of whether an item is prohibited rests with
              Vayva.
            </p>

            <h2>7. Changes to This Policy</h2>
            <p>
              We may update this Policy from time to time to reflect changes in
              law or business practices. We will notify you of material changes
              by email or through the Service.
            </p>
            <p>
              It is your responsibility to review this Policy regularly and
              ensure compliance.
            </p>

            <h2>8. Contact Information</h2>
            <p>For questions about this Policy, please contact:</p>
            <p>
              <strong>Vayva Inc. (operating in Nigeria)</strong>
              <br />
              Email: legal@vayva.shop
              <br />
              Compliance: compliance@vayva.shop
              <br />
              Support: support@vayva.shop
            </p>

            <div className="not-prose mt-12 pt-8 border-t border-gray-200">
              <p className="text-sm text-gray-600">
                This Prohibited Items Policy is part of Vayva's Terms of Service
                and is governed by Nigerian law. Violations may result in
                criminal prosecution under Nigerian law.
              </p>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}
