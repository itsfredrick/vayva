'use client';

import React from 'react';
import Link from 'next/link';
import { Button } from '@vayva/ui';
import {
    MessageSquareText,
    CreditCard,
    Package,
    Truck,
    BarChart3,
    Users,
    Smartphone,
    Zap,
    ShieldCheck,
    Wifi,
    ArrowRight
} from 'lucide-react';
import { SchemaOrg } from '@/components/seo/SchemaOrg';
import { PremiumButton } from '@/components/marketing/PremiumButton';

export default function LandingPage() {
    return (
        <div className="min-h-screen bg-white">
            <SchemaOrg type="SoftwareApplication" />
            {/* Hero Section */}
            <section className="pt-4 pb-20 px-4">
                <div className="max-w-4xl mx-auto text-center">
                    {/* Status Pill */}
                    <div className="inline-flex items-center gap-2 bg-gray-50 border border-gray-200 rounded-full px-4 py-2 mb-8">
                        <span className="w-2 h-2 rounded-full bg-[#22C55E]"></span>
                        <span className="text-sm text-gray-600 font-medium">Vayva Platform v1.0</span>
                    </div>

                    {/* Hero Headline */}
                    <h1 className="text-5xl md:text-7xl font-bold text-[#0F172A] mb-8 leading-[1.1] tracking-tight">
                        WhatsApp is for chat.<br />
                        <span className="text-[#22C55E]">Vayva</span> is for business.
                    </h1>

                    {/* Subheadline */}
                    <p className="text-xl text-[#64748B] mb-10 max-w-3xl mx-auto leading-relaxed">
                        Stop fighting with chat bubbles. Let Vayva's AI auto-capture orders, track payments, and organize your business so you can finally relax.
                    </p>

                    {/* CTAs */}
                    <div className="flex flex-col sm:flex-row gap-4 justify-center mb-6">
                        <Link href="/signup">
                            <PremiumButton data-testid="landing-get-started">
                                Start selling for free
                            </PremiumButton>
                        </Link>
                        <Link href="/templates">
                            <Button variant="outline" className="border-2 border-gray-200 text-[#0F172A] px-10 py-5 text-lg font-bold rounded-xl hover:bg-gray-50 transition-all">
                                View Blueprint Library
                            </Button>
                        </Link>
                    </div>

                    {/* Trust Indicators */}
                    <div className="flex flex-wrap justify-center items-center gap-6 sm:gap-8 text-sm text-[#64748B] font-medium mt-8">
                        <a href="https://paystack.com" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 group">
                            <img src="/partner-paystack.png" alt="Paystack" className="h-5 w-auto opacity-80 grayscale group-hover:grayscale-0 transition-all" />
                            <span className="font-semibold text-gray-900 group-hover:text-black">Secured Payments</span>
                        </a>
                        <span className="w-1 h-1 rounded-full bg-gray-300 hidden sm:block"></span>
                        <a href="https://youverify.co" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 group">
                            <img src="/youverify_logo.png" alt="Youverify" className="h-5 w-auto opacity-80 grayscale group-hover:grayscale-0 transition-all" />
                            <span className="font-semibold text-gray-900 group-hover:text-black">Identity Verified</span>
                        </a>
                        <span className="w-1 h-1 rounded-full bg-gray-300 hidden sm:block"></span>
                        <a href="https://123.design" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 group">
                            <img src="/123design_logo.jpg" alt="123design" className="h-5 w-auto opacity-80 grayscale group-hover:grayscale-0 transition-all mix-blend-multiply" />
                            <span className="font-semibold text-gray-900 group-hover:text-black">123design</span>
                        </a>
                        <span className="w-1 h-1 rounded-full bg-gray-300 hidden sm:block"></span>
                        <a href="https://mysparks.shop" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 group">
                            <img src="/oral4_logo.png" alt="Oral4" className="h-5 w-auto opacity-80 grayscale group-hover:grayscale-0 transition-all object-contain bg-black/10 rounded-sm px-1" />
                            <span className="font-semibold text-gray-900 group-hover:text-black">Oral4</span>
                        </a>
                        <span className="w-1 h-1 rounded-full bg-gray-300 hidden sm:block"></span>
                        <span className="flex items-center gap-2"><svg className="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg> No card required</span>
                    </div>
                </div>
            </section>

            {/* Trust Visual Hero Section */}
            <section className="pb-24 px-4">
                <div className="max-w-6xl mx-auto">
                    <div className="relative group">
                        <div className="absolute -inset-1 bg-gradient-to-r from-green-400 to-blue-500 rounded-[32px] blur opacity-20 group-hover:opacity-30 transition duration-1000"></div>
                        <div className="relative bg-white border border-gray-200 rounded-[32px] shadow-2xl overflow-hidden">
                            <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-[#22C55E] to-blue-500" />
                            <div className="p-4 bg-gray-50 border-b border-gray-100 flex items-center gap-2">
                                <div className="flex gap-1.5 ml-2">
                                    <div className="w-3 h-3 rounded-full bg-red-400" />
                                    <div className="w-3 h-3 rounded-full bg-yellow-400" />
                                    <div className="w-3 h-3 rounded-full bg-green-400" />
                                </div>
                                <div className="mx-auto bg-white px-4 py-1 rounded-full text-[10px] font-bold text-gray-400 uppercase tracking-widest border border-gray-200">
                                    cloud.vayva.io/dashboard
                                </div>
                            </div>
                            <div className="p-8 lg:p-12">
                                <div className="grid lg:grid-cols-2 gap-12 items-center">
                                    <div>
                                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-green-50 text-[#22C55E] text-xs font-bold uppercase mb-6">
                                            The Vayva Engine
                                        </div>
                                        <h2 className="text-4xl font-bold text-[#0F172A] mb-8 leading-tight">
                                            How your business<br />stays in sync.
                                        </h2>
                                        <div className="space-y-10">
                                            {[
                                                { num: 1, title: 'Chat natively', text: 'Customers message you on WhatsApp. No new apps for them.' },
                                                { num: 2, title: 'Process with AI', text: 'Vayva assists by parsing conversations and extracting order details.' },
                                                { num: 3, title: 'Record eternally', text: 'Orders, payments, and delivery statuses are logged in clean records.' },
                                            ].map((step) => (
                                                <div key={step.num} className="flex items-start gap-6 group">
                                                    <div className="flex-shrink-0 w-10 h-10 bg-white border-2 border-green-100 text-[#22C55E] rounded-full flex items-center justify-center text-sm font-bold group-hover:bg-[#22C55E] group-hover:text-white transition-all shadow-sm">
                                                        {step.num}
                                                    </div>
                                                    <div className="pt-1">
                                                        <p className="text-lg font-bold text-[#0F172A] mb-1">{step.title}</p>
                                                        <p className="text-[#64748B] text-sm leading-relaxed">{step.text}</p>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                    <div className="relative">
                                        <div className="relative rounded-[32px] overflow-hidden shadow-2xl border border-gray-100 group-hover:scale-[1.02] transition-transform duration-700">
                                            <img
                                                src="/calm-solution.jpg"
                                                alt="Relaxed merchant managing business on tablet"
                                                className="w-full h-auto object-cover"
                                            />
                                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end p-8">
                                                <div className="bg-white/90 backdrop-blur-md p-4 rounded-xl border border-white/20 shadow-lg">
                                                    <div className="flex items-center gap-3">
                                                        <div className="w-10 h-10 rounded-full bg-green-500 flex items-center justify-center">
                                                            <Zap className="w-6 h-6 text-white" />
                                                        </div>
                                                        <div>
                                                            <p className="text-[10px] uppercase font-black text-gray-500">System Status</p>
                                                            <p className="text-sm font-bold text-gray-900">All Systems Running</p>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        {/* Floating Badge */}
                                        <div className="absolute -bottom-6 -right-6 bg-white p-4 rounded-2xl shadow-2xl border border-gray-100 animate-in slide-in-from-bottom-5 duration-700 delay-200">
                                            <div className="flex items-center gap-4">
                                                <div className="w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center">
                                                    <ShieldCheck className="w-6 h-6 text-white" />
                                                </div>
                                                <div>
                                                    <p className="text-[10px] uppercase font-black text-gray-400">Peace of Mind</p>
                                                    <p className="text-sm font-bold text-gray-900">100% Audit Ready</p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Problem Statement - The Chaos */}
            <section className="py-24 px-4 bg-gray-50/50">
                <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-16 items-center">
                    <div className="relative rounded-3xl overflow-hidden shadow-2xl border border-gray-200 rotate-2 hover:rotate-0 transition-all duration-500">
                        <img
                            src="/chaos-problem.jpg"
                            alt="Stressed business owner managing orders manually"
                            className="w-full h-auto object-cover grayscale hover:grayscale-0 transition-all duration-700"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent flex items-end p-8">
                            <p className="text-white font-bold text-lg">"Did I send that invoice? Is stock finished?"</p>
                        </div>
                    </div>
                    <div>
                        <h2 className="text-4xl font-bold text-[#0F172A] mb-8 leading-tight">
                            WhatsApp is chaotic.<br />
                            <span className="text-red-500">Business shouldn't be.</span>
                        </h2>
                        <div className="space-y-6">
                            {[
                                'Orders get lost in chat threads',
                                'Prices change mid-conversation',
                                'No records of what was sold',
                                'No accountability or audit trail'
                            ].map(item => (
                                <div key={item} className="flex items-center gap-4 text-[#64748B] text-lg font-medium">
                                    <div className="w-6 h-6 rounded-full bg-red-50 flex items-center justify-center text-red-500">×</div>
                                    {item}
                                </div>
                            ))}
                        </div>
                        <div className="mt-12 p-8 bg-white rounded-2xl border border-gray-100 shadow-xl">
                            <p className="text-2xl font-bold text-[#0F172A] leading-relaxed">
                                Vayva sits <span className="text-[#22C55E]">underneath WhatsApp</span> and quietly fixes this.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Core Capabilities */}
            <section id="features" className="py-24 px-4 bg-white">
                <div className="max-w-6xl mx-auto">
                    <div className="text-center mb-20">
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 text-blue-600 text-xs font-bold uppercase mb-6">
                            Capabilities
                        </div>
                        <h2 className="text-5xl font-bold text-[#0F172A] mb-6">
                            Put your business on Autopilot.
                        </h2>
                        <p className="text-xl text-[#64748B] max-w-2xl mx-auto">
                            Powerful tools that replace stress with systems. Built for the modern Nigerian entrepreneur.
                        </p>
                    </div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {[
                            {
                                title: 'Orders from chat',
                                desc: 'Guided order capture from WhatsApp conversations. Reduce manual entry and avoid missed sales.',
                                Icon: MessageSquareText,
                                color: 'text-blue-500',
                                bg: 'bg-blue-50'
                            },
                            {
                                title: 'Payments & reconciliation',
                                desc: 'Track every payment, match to orders, reconcile daily. Know exactly what you\'re owed.',
                                Icon: CreditCard,
                                color: 'text-green-500',
                                bg: 'bg-green-50'
                            },
                            {
                                title: 'Inventory tracking',
                                desc: 'Real-time stock levels. Get alerts before you run out. Never oversell again.',
                                Icon: Package,
                                color: 'text-orange-500',
                                bg: 'bg-orange-50'
                            },
                            {
                                title: 'Delivery coordination',
                                desc: 'Schedule pickups, track deliveries, confirm receipt. Full logistics visibility.',
                                Icon: Truck,
                                color: 'text-purple-500',
                                bg: 'bg-purple-50'
                            },
                            {
                                title: 'Business records',
                                desc: 'Clean data for banks, taxes, or investors. Export anytime, in any format.',
                                Icon: BarChart3,
                                color: 'text-indigo-500',
                                bg: 'bg-indigo-50'
                            },
                            {
                                title: 'Multi-staff access',
                                desc: 'Add team members with specific roles. Everyone sees what they need, nothing more.',
                                Icon: Users,
                                color: 'text-pink-500',
                                bg: 'bg-pink-50'
                            },
                        ].map((feature, i) => (
                            <div key={i} className="group bg-white border border-gray-100 rounded-2xl p-8 hover:shadow-2xl hover:shadow-green-100/50 hover:border-[#22C55E]/30 transition-all">
                                <div className={`w-14 h-14 rounded-xl ${feature.bg} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}>
                                    <feature.Icon className={`w-7 h-7 ${feature.color}`} />
                                </div>
                                <h3 className="text-xl font-bold text-[#0F172A] mb-3">{feature.title}</h3>
                                <p className="text-[#64748B] leading-relaxed text-sm">{feature.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Dashboard Preview */}
            <section className="py-24 px-4 bg-gray-900 border-y border-white/10 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-1/3 h-full bg-green-500/10 blur-[100px] pointer-events-none" />
                <div className="max-w-6xl mx-auto">
                    <div className="text-center mb-16">
                        <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
                            Your command center
                        </h2>
                        <p className="text-xl text-gray-400 max-w-2xl mx-auto">
                            Clean dashboard. Real-time data. Complete control over every transaction.
                        </p>
                    </div>

                    <div className="bg-white/5 border border-white/10 rounded-[32px] p-8 md:p-12 backdrop-blur-sm">
                        <div className="grid md:grid-cols-4 gap-8 mb-12">
                            {[
                                { label: 'Active Orders', value: '127', change: '+12%', color: 'text-green-400' },
                                { label: 'Total Revenue', value: '₦2.4M', change: '+18%', color: 'text-blue-400' },
                                { label: 'Customers', value: '89', change: '+5%', color: 'text-purple-400' },
                                { label: 'Delivery Rate', value: '98%', change: '+2%', color: 'text-orange-400' },
                            ].map((stat, i) => (
                                <div key={i} className="bg-white/[0.03] border border-white/5 rounded-2xl p-6">
                                    <p className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">{stat.label}</p>
                                    <div className="flex items-end gap-3">
                                        <p className={`text-4xl font-bold ${stat.color}`}>{stat.value}</p>
                                        <p className="text-xs text-green-500 font-bold mb-2">{stat.change}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                        <div className="bg-white shadow-2xl rounded-2xl overflow-hidden border border-gray-100">
                            <div className="p-4 bg-gray-50 border-b border-gray-100 flex items-center justify-between">
                                <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">Live Activity Feed</span>
                                <div className="flex items-center gap-2">
                                    <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                                    <span className="text-[10px] font-bold text-green-600 uppercase">Live</span>
                                </div>
                            </div>
                            <div className="divide-y divide-gray-50">
                                {[
                                    { text: 'New order from Chioma (Lagos)', price: '₦45,000', time: '2m ago' },
                                    { text: 'Bank Transfer verified - Order #1234', price: '₦12,500', time: '15m ago' },
                                    { text: 'Logistics pickup scheduled - GIGL', price: 'Pick up at 4pm', time: '1h ago' },
                                    { text: 'Inventory Alert: "Silk Scarf" low stock', price: '4 remaining', time: '3h ago' },
                                ].map((activity, i) => (
                                    <div key={i} className="p-5 flex items-center justify-between hover:bg-gray-50 transition-colors">
                                        <div className="flex flex-col gap-0.5">
                                            <p className="text-sm font-bold text-gray-900">{activity.text}</p>
                                            <p className="text-[10px] text-gray-400">{activity.time}</p>
                                        </div>
                                        <span className="text-sm font-black text-[#22C55E]">{activity.price}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Templates Discovery Section (Replaces Showcase) */}
            <section className="py-24 px-4 bg-gray-900 border-t border-white/10 relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-green-500/5 to-transparent pointer-events-none" />
                <div className="max-w-7xl mx-auto">
                    <div className="max-w-3xl mb-16">
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-green-500/10 text-green-400 text-xs font-bold uppercase mb-6 border border-green-500/20">
                            The Result
                        </div>
                        <h2 className="text-4xl md:text-5xl font-bold text-white mb-6 leading-tight">
                            Your products,<br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-blue-500">beautifully organized.</span>
                        </h2>
                        <p className="text-lg text-gray-400 mb-8 leading-relaxed">
                            Choose from industry-standard templates.
                            Vayva automatically builds a stunning, mobile-optimized store for you.
                        </p>
                    </div>

                    {/* Curated Templates Grid */}
                    <div className="grid md:grid-cols-2 gap-6">
                        {[
                            { name: 'Fashion Boutique', headline: 'Bold, visual-first retail layout for clothing brands.', slug: 'Retail' },
                            { name: 'Restaurant & Grill', headline: 'Fast, mobile-first ordering menu for huge appetites.', slug: 'Food' },
                            { name: 'Digital Downloads', headline: 'Secure delivery for ebooks, courses, and software.', slug: 'Digital' },
                            { name: 'Consultancy', headline: 'Professional booking and scheduling for experts.', slug: 'Service' },
                        ].map((cat) => (
                            <Link key={cat.name} href={`/templates?category=${cat.slug}&utm_source=homepage_discovery`} className="group">
                                <div className="bg-white/5 border border-white/10 rounded-2xl p-8 h-full hover:bg-white/10 hover:border-green-500/30 transition-all flex flex-col justify-between">
                                    <div>
                                        <div className="flex justify-between items-start mb-4">
                                            <h3 className="text-2xl font-bold text-white tracking-tight">{cat.name}</h3>
                                            <ArrowRight className="w-6 h-6 text-gray-500 group-hover:text-green-400 transition-colors" />
                                        </div>
                                        <p className="text-gray-400 text-lg mb-6 leading-relaxed">
                                            {cat.headline}
                                        </p>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <span className="w-2 h-2 rounded-full bg-green-500"></span>
                                        <span className="text-xs font-bold text-green-500 uppercase tracking-widest group-hover:underline decoration-green-500/50 underline-offset-4">
                                            Preview Template
                                        </span>
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>

                    <div className="mt-12 text-center">
                        <Link href="/templates">
                            <Button className="bg-white text-gray-900 hover:bg-gray-100 px-8 py-4 rounded-xl font-bold transition-all">
                                See all 14 templates
                            </Button>
                        </Link>
                    </div>
                </div>
            </section>

            {/* Built for Nigerian Businesses */}
            <section className="py-24 px-4 bg-white">
                <div className="max-w-4xl mx-auto">
                    <div className="text-center mb-16">
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-50 text-orange-600 text-xs font-bold uppercase mb-6">
                            Engineered for Nigeria
                        </div>
                        <h2 className="text-4xl font-bold text-[#0F172A] mb-4">
                            Infrastructure for the local reality.
                        </h2>
                    </div>
                    <div className="grid md:grid-cols-2 gap-8">
                        {[
                            {
                                title: 'Local payment realities',
                                text: 'Works with bank transfers, USSD, cards, and cash. Tracks everything, regardless of method.',
                                Icon: Smartphone,
                                color: 'text-green-600',
                                bg: 'bg-green-100'
                            },
                            {
                                title: 'Informal selling norms',
                                text: 'Designed for how Nigerians actually sell: flexible, conversational, relationship-first.',
                                Icon: Users,
                                color: 'text-orange-600',
                                bg: 'bg-orange-100'
                            },
                            {
                                title: 'Network constraints',
                                text: 'Lightweight, fast, works on slow connections. Your business doesn\'t stop when network is weak.',
                                Icon: Wifi,
                                color: 'text-blue-600',
                                bg: 'bg-blue-100'
                            },
                            {
                                title: 'Regulatory awareness',
                                text: 'Clean records for CAC, FIRS, banks. Everything you need for compliance, nothing you don\'t.',
                                Icon: ShieldCheck,
                                color: 'text-purple-600',
                                bg: 'bg-purple-100'
                            }
                        ].map(item => (
                            <div key={item.title} className="bg-gray-50 rounded-2xl p-8 border border-gray-100 hover:bg-white hover:shadow-xl transition-all group">
                                <div className={`w-12 h-12 rounded-xl ${item.bg} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                                    <item.Icon className={`w-6 h-6 ${item.color}`} />
                                </div>
                                <h3 className="font-bold text-[#0F172A] mb-3 text-lg">{item.title}</h3>
                                <p className="text-[#64748B] text-sm leading-relaxed">
                                    {item.text}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Final CTA */}
            <section className="py-32 px-4 bg-white relative overflow-hidden">
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-4xl h-full bg-green-50 opacity-30 rounded-[100px] blur-[120px] pointer-events-none" />
                <div className="max-w-4xl mx-auto text-center relative">
                    <h2 className="text-5xl md:text-6xl font-bold text-[#0F172A] mb-8 leading-tight">
                        Stop running your business<br />in chat bubbles.
                    </h2>
                    <p className="text-xl text-[#64748B] mb-12 max-w-2xl mx-auto">
                        Join 2,000+ Nigerian merchants who upgraded from "chatting" to "operating".
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <Link href="/signup">
                            <PremiumButton className="px-12 py-6 text-xl rounded-2xl">
                                Create your account
                            </PremiumButton>
                        </Link>
                        <Link href="/pricing">
                            <Button variant="outline" className="border-2 border-gray-200 text-[#0F172A] px-12 py-6 text-xl font-bold rounded-2xl hover:bg-gray-50 transition-all">
                                Simple Pricing
                            </Button>
                        </Link>
                    </div>
                </div>
            </section>
        </div>
    );
}
