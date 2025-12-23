import Link from 'next/link';
import { Button } from '@vayva/ui';

export default function LandingPage() {
    return (
        <div className="min-h-screen">
            {/* Hero Section */}
            <section className="bg-[#F7FAF7] py-20 px-4">
                <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-12 items-center">
                    {/* Left Column */}
                    <div>
                        <h1 className="text-5xl font-semibold text-[#0F172A] mb-6">
                            Sell on WhatsApp.<br />Grow your business.
                        </h1>
                        <p className="text-lg text-[#64748B] mb-8 leading-relaxed">
                            The complete platform for Nigerian merchants to build stores, manage inventory,
                            accept payments, and sell directly through WhatsApp.
                        </p>
                        <div className="flex gap-4">
                            <Link href="/signup">
                                <Button className="bg-[#22C55E] hover:bg-[#16A34A] text-white px-8 py-3 rounded-lg">
                                    Get Started
                                </Button>
                            </Link>
                            <Link href="#features">
                                <Button variant="outline" className="border-[#E5E7EB] text-[#0F172A] px-8 py-3 rounded-lg">
                                    View Features
                                </Button>
                            </Link>
                        </div>
                    </div>

                    {/* Right Column */}
                    <div className="bg-white rounded-lg border border-[#E5E7EB] p-8">
                        <div className="aspect-video bg-[#F7FAF7] rounded flex items-center justify-center text-[#64748B]">
                            Dashboard Preview
                        </div>
                    </div>
                </div>
            </section>

            {/* Trust Signals */}
            <section className="py-12 px-4 bg-white">
                <div className="max-w-6xl mx-auto flex flex-wrap justify-center gap-12 text-[#64748B]">
                    <div className="text-center">
                        <p className="font-medium">Built for Nigerian businesses</p>
                    </div>
                    <div className="text-center">
                        <p className="font-medium">Secure by design</p>
                    </div>
                    <div className="text-center">
                        <p className="font-medium">Scales with your growth</p>
                    </div>
                </div>
            </section>

            {/* Features Overview */}
            <section id="features" className="py-20 px-4 bg-[#F7FAF7]">
                <div className="max-w-6xl mx-auto">
                    <h2 className="text-3xl font-semibold text-[#0F172A] mb-4 text-center">
                        Everything you need to sell
                    </h2>
                    <p className="text-[#64748B] text-center mb-12 max-w-2xl mx-auto">
                        A complete commerce platform designed for WhatsApp-first selling in Nigeria.
                    </p>

                    <div className="grid md:grid-cols-3 gap-8">
                        {/* Feature 1 */}
                        <div className="bg-white rounded-lg border border-[#E5E7EB] p-6">
                            <div className="w-12 h-12 bg-[#F7FAF7] rounded-lg flex items-center justify-center mb-4">
                                <svg className="w-6 h-6 text-[#22C55E]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                                </svg>
                            </div>
                            <h3 className="text-xl font-semibold text-[#0F172A] mb-2">Store Builder</h3>
                            <p className="text-[#64748B]">
                                Create your online store in minutes. No coding required.
                            </p>
                        </div>

                        {/* Feature 2 */}
                        <div className="bg-white rounded-lg border border-[#E5E7EB] p-6">
                            <div className="w-12 h-12 bg-[#F7FAF7] rounded-lg flex items-center justify-center mb-4">
                                <svg className="w-6 h-6 text-[#22C55E]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                                </svg>
                            </div>
                            <h3 className="text-xl font-semibold text-[#0F172A] mb-2">Payments</h3>
                            <p className="text-[#64748B]">
                                Accept cards, bank transfers, and USSD payments instantly.
                            </p>
                        </div>

                        {/* Feature 3 */}
                        <div className="bg-white rounded-lg border border-[#E5E7EB] p-6">
                            <div className="w-12 h-12 bg-[#F7FAF7] rounded-lg flex items-center justify-center mb-4">
                                <svg className="w-6 h-6 text-[#22C55E]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                                </svg>
                            </div>
                            <h3 className="text-xl font-semibold text-[#0F172A] mb-2">WhatsApp Integration</h3>
                            <p className="text-[#64748B]">
                                Sell directly through WhatsApp with automated order management.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* How It Works */}
            <section className="py-20 px-4 bg-white">
                <div className="max-w-6xl mx-auto">
                    <h2 className="text-3xl font-semibold text-[#0F172A] mb-4 text-center">
                        How it works
                    </h2>
                    <p className="text-[#64748B] text-center mb-12 max-w-2xl mx-auto">
                        Start selling in three simple steps.
                    </p>

                    <div className="grid md:grid-cols-3 gap-12">
                        <div className="text-center">
                            <div className="w-12 h-12 bg-[#22C55E] text-white rounded-full flex items-center justify-center text-xl font-semibold mx-auto mb-4">
                                1
                            </div>
                            <h3 className="text-xl font-semibold text-[#0F172A] mb-2">Create your store</h3>
                            <p className="text-[#64748B]">
                                Sign up and set up your store with your business information and branding.
                            </p>
                        </div>

                        <div className="text-center">
                            <div className="w-12 h-12 bg-[#22C55E] text-white rounded-full flex items-center justify-center text-xl font-semibold mx-auto mb-4">
                                2
                            </div>
                            <h3 className="text-xl font-semibold text-[#0F172A] mb-2">Add your products</h3>
                            <p className="text-[#64748B]">
                                Upload your inventory, set prices, and organize your catalog.
                            </p>
                        </div>

                        <div className="text-center">
                            <div className="w-12 h-12 bg-[#22C55E] text-white rounded-full flex items-center justify-center text-xl font-semibold mx-auto mb-4">
                                3
                            </div>
                            <h3 className="text-xl font-semibold text-[#0F172A] mb-2">Start selling</h3>
                            <p className="text-[#64748B]">
                                Share your store link and start accepting orders through WhatsApp.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Templates Preview */}
            <section className="py-20 px-4 bg-[#F7FAF7]">
                <div className="max-w-6xl mx-auto">
                    <h2 className="text-3xl font-semibold text-[#0F172A] mb-4 text-center">
                        Professional templates
                    </h2>
                    <p className="text-[#64748B] text-center mb-12 max-w-2xl mx-auto">
                        Choose from beautifully designed templates for your industry.
                    </p>

                    <div className="grid md:grid-cols-3 gap-8 mb-8">
                        {[1, 2, 3].map((i) => (
                            <div key={i} className="bg-white rounded-lg border border-[#E5E7EB] overflow-hidden">
                                <div className="aspect-video bg-[#F7FAF7]"></div>
                                <div className="p-4">
                                    <h4 className="font-semibold text-[#0F172A]">Template {i}</h4>
                                    <p className="text-sm text-[#64748B]">Professional design</p>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="text-center">
                        <Link href="/templates">
                            <Button variant="outline" className="border-[#E5E7EB] text-[#0F172A] px-8 py-3 rounded-lg">
                                Explore Templates
                            </Button>
                        </Link>
                    </div>
                </div>
            </section>

            {/* Pricing Preview */}
            <section className="py-20 px-4 bg-white">
                <div className="max-w-6xl mx-auto">
                    <h2 className="text-3xl font-semibold text-[#0F172A] mb-4 text-center">
                        Simple, transparent pricing
                    </h2>
                    <p className="text-[#64748B] text-center mb-12 max-w-2xl mx-auto">
                        Choose the plan that fits your business.
                    </p>

                    <div className="grid md:grid-cols-3 gap-8 mb-8">
                        <div className="bg-white rounded-lg border border-[#E5E7EB] p-6">
                            <h3 className="text-xl font-semibold text-[#0F172A] mb-2">Starter</h3>
                            <p className="text-3xl font-semibold text-[#0F172A] mb-4">Free</p>
                            <p className="text-[#64748B] mb-6">Perfect for getting started</p>
                            <ul className="space-y-2 text-[#64748B]">
                                <li>✓ Basic store</li>
                                <li>✓ Up to 50 products</li>
                                <li>✓ WhatsApp integration</li>
                            </ul>
                        </div>

                        <div className="bg-white rounded-lg border-2 border-[#22C55E] p-6">
                            <h3 className="text-xl font-semibold text-[#0F172A] mb-2">Growth</h3>
                            <p className="text-3xl font-semibold text-[#0F172A] mb-4">₦15,000<span className="text-base text-[#64748B]">/mo</span></p>
                            <p className="text-[#64748B] mb-6">For growing businesses</p>
                            <ul className="space-y-2 text-[#64748B]">
                                <li>✓ Everything in Starter</li>
                                <li>✓ Unlimited products</li>
                                <li>✓ Custom domain</li>
                                <li>✓ Analytics</li>
                            </ul>
                        </div>

                        <div className="bg-white rounded-lg border border-[#E5E7EB] p-6">
                            <h3 className="text-xl font-semibold text-[#0F172A] mb-2">Pro</h3>
                            <p className="text-3xl font-semibold text-[#0F172A] mb-4">₦35,000<span className="text-base text-[#64748B]">/mo</span></p>
                            <p className="text-[#64748B] mb-6">For established stores</p>
                            <ul className="space-y-2 text-[#64748B]">
                                <li>✓ Everything in Growth</li>
                                <li>✓ Priority support</li>
                                <li>✓ Advanced features</li>
                                <li>✓ API access</li>
                            </ul>
                        </div>
                    </div>

                    <div className="text-center">
                        <Link href="/pricing">
                            <Button variant="outline" className="border-[#E5E7EB] text-[#0F172A] px-8 py-3 rounded-lg">
                                View Full Pricing
                            </Button>
                        </Link>
                    </div>
                </div>
            </section>

            {/* Final CTA */}
            <section className="py-20 px-4 bg-[#F7FAF7]">
                <div className="max-w-3xl mx-auto text-center">
                    <h2 className="text-3xl font-semibold text-[#0F172A] mb-4">
                        Start selling on WhatsApp in minutes
                    </h2>
                    <p className="text-[#64748B] mb-8">
                        Join thousands of Nigerian merchants growing their business with Vayva.
                    </p>
                    <Link href="/signup">
                        <Button className="bg-[#22C55E] hover:bg-[#16A34A] text-white px-8 py-3 rounded-lg">
                            Get Started
                        </Button>
                    </Link>
                </div>
            </section>
        </div>
    );
}
