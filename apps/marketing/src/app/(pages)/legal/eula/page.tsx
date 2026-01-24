import React from "react";
import Link from "next/link";

const legalDocuments = [
    { title: "Legal Hub", href: "/legal" },
    { title: "Terms of Service", href: "/legal/terms" },
    { title: "Privacy Policy", href: "/legal/privacy" },
    { title: "Acceptable Use Policy", href: "/legal/acceptable-use" },
    { title: "Prohibited Items", href: "/legal/prohibited-items" },
    { title: "Refund Policy", href: "/legal/refund-policy" },
    { title: "KYC & Compliance", href: "/legal/kyc-safety" },
    { title: "Manage Cookies", href: "/legal/cookies" },
    { title: "End User License Agreement (EULA)", href: "/legal/eula", active: true },
];

export default function EULAPage(): React.JSX.Element {
    return (
        <div className="min-h-screen bg-white">
            <div className="max-w-7xl mx-auto px-6 py-16">
                <div className="flex gap-12">
                    {/* Sidebar Navigation */}
                    <aside className="w-64 flex-shrink-0 hidden lg:block">
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
                        <h1>End User License Agreement (EULA)</h1>

                        <div className="not-prose mb-8 text-sm text-gray-600">
                            <p>
                                <strong>Version:</strong> 1.0 (Apple App Store Compliant)
                            </p>
                            <p>
                                <strong>Effective Date:</strong> January 1, 2026
                            </p>
                        </div>

                        <div className="bg-red-50 border-l-4 border-red-500 p-4 my-6 not-prose">
                            <h3 className="text-red-800 font-bold text-lg mb-2">Zero Tolerance for Objectionable Content</h3>
                            <p className="text-red-700 text-sm">
                                Vayva maintains a strict zero-tolerance policy regarding objectionable content.
                                Users found posting, sharing, or promoting hate speech, violence, nudity, harassment, or illegal content will have their content removed
                                immediately and their accounts permanently blocked.
                            </p>
                        </div>

                        <h2>1. Agreement to Terms</h2>
                        <p>
                            This End User License Agreement ("EULA") is a legal agreement between you ("User") and Vayva Tech ("Company") regarding your use of the Vayva Mobile Application ("App").
                            By installing or using the App, you agree to be bound by the terms of this EULA.
                        </p>

                        <h2>2. Grant of License</h2>
                        <p>
                            Vayva grants you a revocable, non-exclusive, non-transferable, limited license to download, install, and use the App strictly in accordance with the terms of this Agreement.
                        </p>

                        <h2>3. Content Moderation & User Conduct</h2>
                        <p>
                            The App allows users to create, post, and share content ("User Generated Content" or "UGC"). You agree strictly to the following:
                        </p>
                        <ul>
                            <li><strong>No Abusive Content:</strong> You must not post content that is defamatory, abusive, harassing, threatening, or harmful.</li>
                            <li><strong>No Offensive Material:</strong> You must not post content that contains nudity, pornography, or sexually explicit material.</li>
                            <li><strong>No Hate Speech:</strong> You must not post content that promotes violence or discrimination based on race, ethnicity, religion, gender, or sexual orientation.</li>
                        </ul>

                        <h3>3.1 Reporting & Blocking</h3>
                        <p>
                            Vayva provides mechanisms for users to:
                        </p>
                        <ul>
                            <li><strong>Report Content:</strong> Users can flag objectable content for review. Vayva commits to reviewing reports within 24 hours.</li>
                            <li><strong>Block Users:</strong> Users can block abusive merchants or other users to prevent further interaction.</li>
                        </ul>
                        <p>
                            <strong>Enforcement:</strong> Any user found violating these content standards will be ejections from the platform. Vayva reserves the right to ban any user without prior notice.
                        </p>

                        <h2>4. Disclaimer of Warranties</h2>
                        <p>
                            The App is provided "AS IS" without warranty of any kind. Vayva disclaims all warranties, whether express or implied.
                        </p>

                        <h2>5. Contact Information</h2>
                        <p>
                            For legal inquiries or to report violations manually:
                            <br />
                            <strong>Email:</strong> legal@vayva.shop
                        </p>

                        <div className="not-prose mt-12 pt-8 border-t border-gray-200">
                            <p className="text-sm text-gray-400 italic">
                                Acknowledgement: You acknowledge that you have read this EULA and understand the rights and obligations contained herein.
                            </p>
                        </div>
                    </main>
                </div>
            </div>
        </div>
    );
}
