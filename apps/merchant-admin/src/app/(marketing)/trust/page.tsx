import React from 'react';
import Link from 'next/link';
import { Button } from '@vayva/ui';
import {
    Shield,
    Lock,
    Database,
    CreditCard,
    Activity,
    FileText,
    CheckCircle2,
    ExternalLink
} from 'lucide-react';

export const metadata = {
    title: 'Trust & Security | Vayva',
    description: 'Learn how Vayva protects your business data, ensures platform security, and maintains compliance with Nigerian regulations.',
};

export default function TrustPage() {
    return (
        <div className="min-h-screen bg-white text-[#0F172A]">

            {/* Section 1: Hero */}
            <section className="pt-24 pb-16 px-4 text-center bg-gray-50 border-b border-gray-100">
                <div className="max-w-4xl mx-auto">
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-white rounded-2xl shadow-sm text-[#22C55E] mb-6">
                        <Shield size={32} />
                    </div>
                    <h1 className="text-4xl md:text-6xl font-bold mb-6 tracking-tight">
                        Trust & Security at Vayva
                    </h1>
                    <p className="text-xl text-[#64748B] max-w-2xl mx-auto leading-relaxed">
                        We are committed to providing a secure, reliable, and compliant platform for your business operations.
                    </p>
                </div>
            </section>

            {/* Section 2: Platform Security */}
            <section className="py-24 px-4">
                <div className="max-w-6xl mx-auto">
                    <div className="grid md:grid-cols-2 gap-16 items-center">
                        <div>
                            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 text-blue-600 text-xs font-bold uppercase tracking-wider mb-6">
                                Platform Security
                            </div>
                            <h2 className="text-3xl font-bold mb-6">Built with security at the core.</h2>
                            <p className="text-[#64748B] text-lg leading-relaxed mb-8">
                                Your business data is protected through multiple layers of security controls, from authentication to audit logging.
                            </p>
                        </div>
                        <div className="space-y-4">
                            <div className="flex gap-4 items-start p-4 bg-white border border-gray-100 rounded-xl">
                                <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center shrink-0">
                                    <Lock size={20} className="text-blue-600" />
                                </div>
                                <div>
                                    <h3 className="font-bold mb-1">Secure Authentication</h3>
                                    <p className="text-sm text-[#64748B]">Industry-standard authentication with optional two-factor verification for account protection.</p>
                                </div>
                            </div>
                            <div className="flex gap-4 items-start p-4 bg-white border border-gray-100 rounded-xl">
                                <div className="w-10 h-10 bg-purple-50 rounded-lg flex items-center justify-center shrink-0">
                                    <Shield size={20} className="text-purple-600" />
                                </div>
                                <div>
                                    <h3 className="font-bold mb-1">Role-Based Access</h3>
                                    <p className="text-sm text-[#64748B]">Control who can access what within your organization through granular permission settings.</p>
                                </div>
                            </div>
                            <div className="flex gap-4 items-start p-4 bg-white border border-gray-100 rounded-xl">
                                <div className="w-10 h-10 bg-green-50 rounded-lg flex items-center justify-center shrink-0">
                                    <FileText size={20} className="text-green-600" />
                                </div>
                                <div>
                                    <h3 className="font-bold mb-1">Comprehensive Audit Logs</h3>
                                    <p className="text-sm text-[#64748B]">Track all critical actions within your account for transparency and accountability.</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Section 3: Data Privacy & Compliance */}
            <section className="py-24 px-4 bg-gray-50">
                <div className="max-w-6xl mx-auto">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl font-bold mb-4">Data Privacy & Compliance</h2>
                        <p className="text-[#64748B] max-w-2xl mx-auto">
                            We handle your data responsibly and in accordance with applicable Nigerian regulations.
                        </p>
                    </div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                        <div className="bg-white p-6 rounded-xl border border-gray-100">
                            <Database className="text-[#22C55E] mb-4" size={32} />
                            <h3 className="font-bold mb-2">Data Isolation</h3>
                            <p className="text-sm text-[#64748B]">Your merchant data is logically separated and never shared with other businesses.</p>
                        </div>
                        <div className="bg-white p-6 rounded-xl border border-gray-100">
                            <CheckCircle2 className="text-blue-600 mb-4" size={32} />
                            <h3 className="font-bold mb-2">Regulatory Compliance</h3>
                            <p className="text-sm text-[#64748B]">We comply with Nigerian data protection and commerce regulations.</p>
                        </div>
                        <div className="bg-white p-6 rounded-xl border border-gray-100">
                            <Shield className="text-purple-600 mb-4" size={32} />
                            <h3 className="font-bold mb-2">User Control</h3>
                            <p className="text-sm text-[#64748B]">You maintain control over your data with export and deletion capabilities.</p>
                        </div>
                        <div className="bg-white p-6 rounded-xl border border-gray-100">
                            <Lock className="text-orange-600 mb-4" size={32} />
                            <h3 className="font-bold mb-2">Privacy Policy</h3>
                            <p className="text-sm text-[#64748B]">All data handling is governed by our comprehensive Privacy Policy.</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Section 4: Payments & Transactions */}
            <section className="py-24 px-4">
                <div className="max-w-5xl mx-auto">
                    <div className="bg-gradient-to-br from-[#0F172A] to-gray-900 rounded-3xl p-8 md:p-12 text-white">
                        <div className="flex items-start gap-6 mb-8">
                            <div className="w-12 h-12 bg-white/10 rounded-xl flex items-center justify-center shrink-0">
                                <CreditCard size={24} className="text-[#22C55E]" />
                            </div>
                            <div>
                                <h2 className="text-3xl font-bold mb-4">Secure Payment Handling</h2>
                                <p className="text-gray-300 text-lg leading-relaxed">
                                    We take payment security seriously. Your customers' financial information is protected through industry-standard practices.
                                </p>
                            </div>
                        </div>

                        <div className="grid md:grid-cols-3 gap-6">
                            <div className="bg-white/5 backdrop-blur p-6 rounded-xl border border-white/10">
                                <h3 className="font-bold mb-2 text-white">No Card Storage</h3>
                                <p className="text-sm text-gray-400">We do not store sensitive card data on our servers. All payment processing is handled by certified partners.</p>
                            </div>
                            <div className="bg-white/5 backdrop-blur p-6 rounded-xl border border-white/10">
                                <h3 className="font-bold mb-2 text-white">Trusted Partners</h3>
                                <p className="text-sm text-gray-400">We work with regulated payment providers to ensure secure transaction processing.</p>
                            </div>
                            <div className="bg-white/5 backdrop-blur p-6 rounded-xl border border-white/10">
                                <h3 className="font-bold mb-2 text-white">Transaction Monitoring</h3>
                                <p className="text-sm text-gray-400">All transactions are monitored for suspicious activity to protect both merchants and customers.</p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Section 5: Platform Reliability */}
            <section className="py-24 px-4 bg-gray-50">
                <div className="max-w-6xl mx-auto">
                    <div className="text-center mb-16">
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-green-50 text-green-600 text-xs font-bold uppercase tracking-wider mb-6">
                            Platform Reliability
                        </div>
                        <h2 className="text-3xl font-bold mb-4">Built to stay online.</h2>
                        <p className="text-[#64748B] max-w-2xl mx-auto">
                            We understand that downtime means lost revenue. Our infrastructure is designed for reliability.
                        </p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-8">
                        <div className="text-center">
                            <div className="w-16 h-16 bg-white rounded-2xl shadow-sm flex items-center justify-center mx-auto mb-4">
                                <Activity size={32} className="text-[#22C55E]" />
                            </div>
                            <h3 className="font-bold text-lg mb-2">System Monitoring</h3>
                            <p className="text-sm text-[#64748B]">24/7 automated monitoring of all critical systems and services.</p>
                        </div>
                        <div className="text-center">
                            <div className="w-16 h-16 bg-white rounded-2xl shadow-sm flex items-center justify-center mx-auto mb-4">
                                <Shield size={32} className="text-blue-600" />
                            </div>
                            <h3 className="font-bold text-lg mb-2">Incident Response</h3>
                            <p className="text-sm text-[#64748B]">Dedicated team ready to respond to and resolve any platform issues.</p>
                        </div>
                        <div className="text-center">
                            <div className="w-16 h-16 bg-white rounded-2xl shadow-sm flex items-center justify-center mx-auto mb-4">
                                <ExternalLink size={32} className="text-purple-600" />
                            </div>
                            <h3 className="font-bold text-lg mb-2">Status Transparency</h3>
                            <p className="text-sm text-[#64748B]">Real-time system status available to all merchants at any time.</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Section 6: CTA */}
            <section className="py-20 px-4 text-center">
                <div className="max-w-2xl mx-auto">
                    <h2 className="text-3xl font-bold text-[#0F172A] mb-6">Questions about security?</h2>
                    <p className="text-[#64748B] mb-8 text-lg">
                        We are transparent about how we protect your business. Review our policies or check our system status.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <Link href="/system-status">
                            <Button className="bg-[#22C55E] hover:bg-[#16A34A] text-white px-8 py-4 text-lg font-bold rounded-xl shadow-lg transition-all">
                                View System Status
                            </Button>
                        </Link>
                        <Link href="/legal">
                            <Button variant="outline" className="border-2 border-gray-200 text-[#0F172A] px-8 py-4 text-lg font-bold rounded-xl hover:bg-gray-50 transition-all">
                                Legal & Compliance
                            </Button>
                        </Link>
                    </div>
                </div>
            </section>

        </div>
    );
}
