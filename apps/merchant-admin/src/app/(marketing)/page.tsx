import Link from 'next/link';
import { Button } from '@vayva/ui';

export default function LandingPage() {
    return (
        <div className="min-h-screen bg-white">
            {/* Hero Section */}
            <section className="pt-32 pb-20 px-4">
                <div className="max-w-4xl mx-auto text-center">
                    {/* Status Pill */}
                    <div className="inline-flex items-center gap-2 bg-gray-50 border border-gray-200 rounded-full px-4 py-2 mb-8">
                        <span className="w-2 h-2 rounded-full bg-[#22C55E]"></span>
                        <span className="text-sm text-gray-600 font-medium">Vayva Platform v1.0</span>
                    </div>

                    {/* Hero Headline */}
                    <h1 className="text-5xl md:text-6xl font-bold text-[#0F172A] mb-6 leading-tight">
                        Run your business on WhatsApp<br />
                        — with a real operating system behind it.
                    </h1>

                    {/* Subheadline */}
                    <p className="text-xl text-[#64748B] mb-8 max-w-3xl mx-auto leading-relaxed">
                        Vayva turns scattered conversations into orders, payments, deliveries, and clean records.
                        Built specifically for Nigerian merchants who need to sell with confidence.
                    </p>

                    {/* CTAs */}
                    <div className="flex flex-col sm:flex-row gap-4 justify-center mb-6">
                        <Link href="/signup">
                            <Button className="bg-[#22C55E] hover:bg-[#16A34A] text-white px-8 py-4 text-lg font-semibold">
                                Create account
                            </Button>
                        </Link>
                        <Link href="#features">
                            <Button variant="outline" className="border-2 border-gray-300 text-[#0F172A] px-8 py-4 text-lg font-semibold">
                                Explore features
                            </Button>
                        </Link>
                    </div>

                    {/* Trust Indicators */}
                    <div className="flex flex-wrap justify-center gap-6 text-sm text-[#64748B]">
                        <span>✔ No credit card required</span>
                        <span>✔ Set up in 5 minutes</span>
                    </div>
                </div>
            </section>

            {/* Problem Statement */}
            <section className="py-20 px-4 bg-gray-50">
                <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-12 items-center">
                    <div>
                        <h2 className="text-3xl font-bold text-[#0F172A] mb-6">
                            WhatsApp is chaotic.<br />Business shouldn't be.
                        </h2>
                        <div className="space-y-4 text-[#64748B] text-lg">
                            <p>• Orders get lost in chat threads</p>
                            <p>• Prices change mid-conversation</p>
                            <p>• No records of what was sold</p>
                            <p>• No accountability or audit trail</p>
                        </div>
                        <p className="mt-8 text-xl font-semibold text-[#0F172A]">
                            Vayva sits underneath WhatsApp and quietly fixes this.
                        </p>
                    </div>
                    <div className="bg-white rounded-lg border border-gray-200 p-8">
                        <div className="space-y-4">
                            <div className="bg-gray-50 rounded p-4 text-sm text-gray-600">
                                <strong>Customer:</strong> "How much for 2 bags?"
                            </div>
                            <div className="bg-gray-50 rounded p-4 text-sm text-gray-600">
                                <strong>You:</strong> "₦15,000"
                            </div>
                            <div className="bg-[#22C55E]/10 rounded p-4 text-sm">
                                <strong className="text-[#22C55E]">Vayva:</strong> Order created • Payment tracked • Delivery scheduled
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Core Capabilities */}
            <section id="features" className="py-20 px-4">
                <div className="max-w-6xl mx-auto">
                    <div className="text-center mb-16">
                        <h2 className="text-4xl font-bold text-[#0F172A] mb-4">
                            Core capabilities
                        </h2>
                        <p className="text-xl text-[#64748B] max-w-2xl mx-auto">
                            Everything you need to run a real business through WhatsApp
                        </p>
                    </div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {[
                            {
                                title: 'Orders from chat',
                                desc: 'Automatically capture orders from WhatsApp conversations. No manual entry, no missed sales.'
                            },
                            {
                                title: 'Payments & reconciliation',
                                desc: 'Track every payment, match to orders, reconcile daily. Know exactly what you\'re owed.'
                            },
                            {
                                title: 'Inventory tracking',
                                desc: 'Real-time stock levels. Get alerts before you run out. Never oversell again.'
                            },
                            {
                                title: 'Delivery coordination',
                                desc: 'Schedule pickups, track deliveries, confirm receipt. Full logistics visibility.'
                            },
                            {
                                title: 'Customer history',
                                desc: 'See every order, payment, and conversation. Build relationships, not just transactions.'
                            },
                            {
                                title: 'Business records & exports',
                                desc: 'Clean data for banks, taxes, or investors. Export anytime, in any format.'
                            },
                            {
                                title: 'Multi-staff access',
                                desc: 'Add team members with specific roles. Everyone sees what they need, nothing more.'
                            },
                            {
                                title: 'Audit trails',
                                desc: 'Complete history of every action. Know who did what, when, and why.'
                            },
                        ].map((feature, i) => (
                            <div key={i} className="bg-white border border-gray-200 rounded-lg p-6 hover:border-[#22C55E] transition-colors">
                                <h3 className="text-lg font-semibold text-[#0F172A] mb-2">{feature.title}</h3>
                                <p className="text-[#64748B]">{feature.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* How It Works */}
            <section className="py-20 px-4 bg-gray-50">
                <div className="max-w-4xl mx-auto">
                    <div className="text-center mb-16">
                        <h2 className="text-4xl font-bold text-[#0F172A] mb-4">
                            How it works
                        </h2>
                        <p className="text-xl text-[#64748B]">
                            The complete flow, from chat to clean records
                        </p>
                    </div>

                    <div className="space-y-8">
                        {[
                            { num: 1, text: 'Customer messages you on WhatsApp' },
                            { num: 2, text: 'Vayva structures the conversation' },
                            { num: 3, text: 'Order is created automatically' },
                            { num: 4, text: 'Payment is tracked' },
                            { num: 5, text: 'Delivery is logged' },
                            { num: 6, text: 'Records are stored and exportable' },
                        ].map((step) => (
                            <div key={step.num} className="flex items-start gap-6">
                                <div className="flex-shrink-0 w-12 h-12 bg-[#22C55E] text-white rounded-full flex items-center justify-center text-xl font-bold">
                                    {step.num}
                                </div>
                                <div className="pt-2">
                                    <p className="text-lg font-semibold text-[#0F172A]">{step.text}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Dashboard Preview */}
            <section className="py-20 px-4">
                <div className="max-w-6xl mx-auto">
                    <div className="text-center mb-12">
                        <h2 className="text-4xl font-bold text-[#0F172A] mb-4">
                            Your command center
                        </h2>
                        <p className="text-xl text-[#64748B]">
                            Clean dashboard. Real-time data. Complete control.
                        </p>
                    </div>

                    <div className="bg-white border-2 border-gray-200 rounded-lg p-8">
                        <div className="grid md:grid-cols-4 gap-6 mb-8">
                            {[
                                { label: 'Orders', value: '127', change: '+12%' },
                                { label: 'Revenue', value: '₦2.4M', change: '+18%' },
                                { label: 'Customers', value: '89', change: '+5%' },
                                { label: 'Deliveries', value: '103', change: '+8%' },
                            ].map((stat, i) => (
                                <div key={i} className="bg-gray-50 rounded-lg p-4">
                                    <p className="text-sm text-[#64748B] mb-1">{stat.label}</p>
                                    <p className="text-2xl font-bold text-[#0F172A]">{stat.value}</p>
                                    <p className="text-sm text-[#22C55E] mt-1">{stat.change}</p>
                                </div>
                            ))}
                        </div>
                        <div className="bg-gray-50 rounded-lg p-6">
                            <p className="text-sm font-semibold text-[#64748B] mb-4">RECENT ACTIVITY</p>
                            <div className="space-y-3">
                                {[
                                    'New order from Chioma - ₦45,000',
                                    'Payment received - Order #1234',
                                    'Delivery completed - Order #1230',
                                ].map((activity, i) => (
                                    <div key={i} className="text-[#0F172A] text-sm py-2 border-b border-gray-200 last:border-0">
                                        {activity}
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Built for Nigerian Businesses */}
            <section className="py-20 px-4 bg-gray-50">
                <div className="max-w-4xl mx-auto">
                    <h2 className="text-4xl font-bold text-[#0F172A] mb-8 text-center">
                        Built for Nigerian businesses
                    </h2>
                    <div className="grid md:grid-cols-2 gap-8">
                        <div className="bg-white border border-gray-200 rounded-lg p-6">
                            <h3 className="font-semibold text-[#0F172A] mb-3">Local payment realities</h3>
                            <p className="text-[#64748B]">
                                Works with bank transfers, USSD, cards, and cash. Tracks everything, regardless of method.
                            </p>
                        </div>
                        <div className="bg-white border border-gray-200 rounded-lg p-6">
                            <h3 className="font-semibold text-[#0F172A] mb-3">Informal selling norms</h3>
                            <p className="text-[#64748B]">
                                Designed for how Nigerians actually sell: flexible, conversational, relationship-first.
                            </p>
                        </div>
                        <div className="bg-white border border-gray-200 rounded-lg p-6">
                            <h3 className="font-semibold text-[#0F172A] mb-3">Network constraints</h3>
                            <p className="text-[#64748B]">
                                Lightweight, fast, works on slow connections. Your business doesn't stop when network is weak.
                            </p>
                        </div>
                        <div className="bg-white border border-gray-200 rounded-lg p-6">
                            <h3 className="font-semibold text-[#0F172A] mb-3">Regulatory awareness</h3>
                            <p className="text-[#64748B]">
                                Clean records for CAC, FIRS, banks. Everything you need for compliance, nothing you don't.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* FAQ */}
            <section className="py-20 px-4">
                <div className="max-w-3xl mx-auto">
                    <h2 className="text-4xl font-bold text-[#0F172A] mb-12 text-center">
                        Common questions
                    </h2>
                    <div className="space-y-6">
                        {[
                            {
                                q: 'Do my customers need to install anything?',
                                a: 'No. They use WhatsApp exactly as they always have. Vayva works in the background.'
                            },
                            {
                                q: 'What happens if WhatsApp goes down?',
                                a: 'All your data is safe in Vayva. You can still access orders, payments, and records through the dashboard.'
                            },
                            {
                                q: 'Can multiple staff use one business?',
                                a: 'Yes. Add team members with specific roles and permissions. Everyone sees what they need.'
                            },
                            {
                                q: 'How do records help me with banks or taxes?',
                                a: 'Clean, exportable records show real business activity. Banks trust it. FIRS accepts it. Investors understand it.'
                            },
                        ].map((faq, i) => (
                            <div key={i} className="bg-white border border-gray-200 rounded-lg p-6">
                                <h3 className="font-semibold text-[#0F172A] mb-2">{faq.q}</h3>
                                <p className="text-[#64748B]">{faq.a}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Final CTA */}
            <section className="py-20 px-4 bg-gray-50">
                <div className="max-w-3xl mx-auto text-center">
                    <h2 className="text-4xl font-bold text-[#0F172A] mb-6">
                        Stop running your business<br />in chat bubbles.
                    </h2>
                    <p className="text-xl text-[#64748B] mb-8">
                        Join Nigerian merchants who run real businesses with real systems.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center mb-6">
                        <Link href="/signup">
                            <Button className="bg-[#22C55E] hover:bg-[#16A34A] text-white px-8 py-4 text-lg font-semibold">
                                Create account
                            </Button>
                        </Link>
                        <Link href="#features">
                            <Button variant="outline" className="border-2 border-gray-300 text-[#0F172A] px-8 py-4 text-lg font-semibold">
                                Explore features
                            </Button>
                        </Link>
                    </div>
                    <div className="flex flex-wrap justify-center gap-6 text-sm text-[#64748B]">
                        <span>✔ No credit card required</span>
                        <span>✔ Set up in 5 minutes</span>
                    </div>
                </div>
            </section>
        </div>
    );
}
