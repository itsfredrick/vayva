import React from "react";
import Link from "next/link";
import Image from "next/image";
import { SchemaOrg } from "@/components/seo/SchemaOrg";
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
  TrendingUp,
  LayoutDashboard,
  Bell,
  PieChart,
} from "lucide-react";
import { LandingHero } from "@/components/marketing/LandingHero";
import { PremiumButton } from "@/components/marketing/PremiumButton";
import IndustriesInteractiveSection from "@/components/marketing/sections/IndustriesInteractiveSection";
import { APP_URL } from "@/lib/constants";
import * as motion from "framer-motion/client";
import dynamic from "next/dynamic";

const TrustVisualSection = dynamic(() => import("@/components/marketing/sections/TrustVisualSection"));


export default async function LandingPage(props: {
  searchParams: Promise<{ industry?: string }>;
}): Promise<React.JSX.Element> {
  const searchParams = await props.searchParams;
  const industry = searchParams.industry || "default";

  return (
    <div className="min-h-screen bg-white relative overflow-hidden">
      {/* Background Orbs */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-green-50 rounded-full blur-[120px] opacity-60 animate-pulse" />
        <div className="absolute bottom-[10%] right-[-5%] w-[30%] h-[30%] bg-blue-50 rounded-full blur-[100px] opacity-40 animate-pulse delay-700" />
      </div>

      <SchemaOrg type="SoftwareApplication" />

      {/* Hero Section */}
      <div className="relative z-10">
        <LandingHero
          headline={
            <>
              WhatsApp is for chat.
              <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#22C55E] to-[#16A34A]">Vayva</span> is your business control center.
            </>
          }
          sub="Vayva turns messages into tracked orders, payments, delivery, and clean records — so you can sell without living on your phone all day."
        />
      </div>

      {/* Trust Visual Hero Section */}
      <div className="relative z-10">
        <TrustVisualSection />
      </div>

      <IndustriesInteractiveSection initialIndustry={industry} />

      {/* Who We Are Section */}
      <section className="hidden md:block py-32 px-4 bg-[#0A2818] relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-[#22C55E]/10 via-transparent to-transparent" />
        <div className="max-w-[1760px] mx-auto relative z-10">
          <div className="grid lg:grid-cols-[1fr_0.7fr] gap-12 items-center">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#22C55E]/20 text-[#22C55E] text-[10px] font-black uppercase tracking-widest mb-8 border border-[#22C55E]/30">
                <span className="w-1.5 h-1.5 bg-[#22C55E] rounded-full" />
                Who We Are
              </div>
              <h2 className="text-4xl md:text-5xl font-bold text-white mb-8 leading-[1.1] tracking-tight">
                The bridge between{" "}
                <span className="text-[#22C55E] italic">conversations</span>{" "}
                and commerce.
              </h2>
              <p className="text-white/70 text-lg leading-relaxed">
                Vayva started with a simple observation in Lagos markets: commerce happens on WhatsApp, but growth hits a ceiling. We're building the infrastructure that turns chat logs into storefronts and casual sellers into data-driven merchants.
              </p>
            </div>
            <div className="relative lg:flex lg:justify-end">
              <div className="relative rounded-3xl overflow-hidden shadow-2xl border border-white/10 w-full max-w-[390px]">
                <Image
                  src="/images/calm-solution.jpg"
                  alt="Nigerian entrepreneurs collaborating on mobile commerce"
                  width={390}
                  height={293}
                  className="w-full h-auto object-cover"
                />
                <div className="absolute bottom-6 left-6 right-6">
                  <div className="bg-white/95 backdrop-blur-md p-4 rounded-xl shadow-lg border border-white/20">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-[#22C55E] flex items-center justify-center">
                        <Smartphone className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <p className="text-[10px] uppercase font-black text-gray-500 tracking-wider">
                          Nigeria-First Design
                        </p>
                        <p className="text-sm font-bold text-gray-900">
                          Built for low-bandwidth environments
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Problem Statement */}
      <section className="hidden md:block py-32 px-4 relative z-10">
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          className="max-w-[1760px] mx-auto grid md:grid-cols-[0.65fr_1fr] gap-16 items-center"
        >
          <div className="relative group md:flex md:justify-start">
            <div className="absolute -inset-4 bg-red-100 rounded-[40px] blur-2xl opacity-20 group-hover:opacity-30 transition-all" />
            <div className="relative rounded-[40px] overflow-hidden shadow-[0_32px_64px_-16px_rgba(0,0,0,0.1)] border border-gray-100/50 rotate-1 group-hover:rotate-0 transition-all duration-700 w-full max-w-[390px]">
              <Image
                src="/images/chaos-problem.jpg"
                alt="Chaos without Vayva"
                width={390}
                height={293}
                className="w-full h-auto object-cover group-hover:scale-100 transition-transform duration-700"
              />
            </div>
          </div>
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-50 text-red-600 text-xs font-bold uppercase mb-8">
              The Reality
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-[#0F172A] mb-8 leading-tight tracking-tight">
              WhatsApp is chaotic.
              <br />
              <span className="text-red-500">Business shouldn't be.</span>
            </h2>
            <div className="text-lg text-[#64748B] leading-relaxed space-y-6">
              <p>
                You know the feeling. Your phone is buzzing with customers asking "How much?" or "Is this available?" while you're trying to focus.
              </p>
              <p>
                Replying late means losing sales. Selling without recording means losing profits. Eventually, you're just stressing yourself out for nothing.
              </p>
              <p className="text-[#0F172A] font-bold text-xl">
                It's exhausting. We fixed it.
              </p>
            </div>
          </div>
        </motion.div>
      </section>

      {/* Core Capabilities */}
      <section id="features" className="py-16 md:py-32 px-4 bg-slate-900 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none opacity-20">
          <div className="absolute top-[20%] right-[-10%] w-[50%] h-[50%] bg-[#22C55E] rounded-full blur-[150px]" />
          <div className="absolute bottom-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-500 rounded-full blur-[120px]" />
        </div>

        <div className="max-w-[1760px] mx-auto relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12 md:mb-20"
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white/80 text-xs font-bold uppercase mb-6">
              Platform Features
            </div>
            <h2 className="text-5xl md:text-6xl font-bold text-white mb-6 tracking-tight">
              Your business on Autopilot.
            </h2>
            <p className="text-white/60 text-lg max-w-2xl mx-auto">
              Everything you need to move from manual chatting to professional commerce.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { title: "AI Order Capture", desc: "Vayva's AI identifies intent and handles product queries instantly. No more missed DMs.", Icon: MessageSquareText, accent: "from-blue-500/20 to-transparent" },
              { title: "Accept Any Payment", desc: "Cards (Visa, Mastercard), bank transfers, USSD — powered by Paystack. Get paid instantly, even from international customers.", Icon: CreditCard, accent: "from-green-500/20 to-transparent" },
              { title: "Inventory Sync", desc: "Auto-updates across chat and web. Never apologize for 'out of stock' again.", Icon: Package, accent: "from-orange-500/20 to-transparent" },
              { title: "Logistics Hub", desc: "One-click waybill generation and local rider coordination. Fulfill orders in seconds.", Icon: Truck, accent: "from-purple-500/20 to-transparent" },
              { title: "Insight Engine", desc: "Data history that actually helps you scale or get funded. Clean records, always.", Icon: BarChart3, accent: "from-indigo-500/20 to-transparent" },
              { title: "Team Control", desc: "Add managers or riders with restricted access. Scale your operations safely.", Icon: Users, accent: "from-pink-500/20 to-transparent" },
            ].map((feature, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="group relative bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-8 hover:bg-white/10 hover:border-white/20 transition-all"
              >
                <div className={`absolute inset-0 bg-gradient-to-br ${feature.accent} opacity-0 group-hover:opacity-100 transition-opacity rounded-3xl`} />
                <div className="relative">
                  <div className="w-12 h-12 rounded-2xl bg-white/10 flex items-center justify-center mb-6 border border-white/10 group-hover:scale-110 transition-transform">
                    <feature.Icon className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-white mb-3 tracking-tight">{feature.title}</h3>
                  <p className="text-white/60 text-sm leading-relaxed">{feature.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Merchant Dashboard Section */}
      <section className="hidden md:block py-32 px-4 bg-white">
        <div className="max-w-[1760px] mx-auto">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 text-blue-600 text-[10px] font-black uppercase tracking-widest mb-8 border border-blue-100">
                <LayoutDashboard className="w-3 h-3" />
                Merchant Dashboard
              </div>
              <h2 className="text-4xl md:text-5xl font-bold text-[#0F172A] mb-6 leading-[1.1] tracking-tight">
                Run your entire business from one screen.
              </h2>
              <p className="text-lg text-[#64748B] mb-8 leading-relaxed">
                No more switching between apps. Your orders, inventory, payments, and customer messages — all in one place. Check your sales while having breakfast. Approve orders from your bed. Your business fits in your pocket now.
              </p>
              <div className="space-y-4">
                {[
                  { icon: Bell, text: "Real-time notifications when orders come in" },
                  { icon: PieChart, text: "See exactly how much you made today, this week, this month" },
                  { icon: Package, text: "Track every product — know what's selling and what's not" },
                  { icon: Users, text: "Add staff with limited access — they see only what you allow" },
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center">
                      <item.icon className="w-5 h-5 text-blue-600" />
                    </div>
                    <p className="text-[#0F172A] font-medium">{item.text}</p>
                  </div>
                ))}
              </div>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="relative"
            >
              <div className="bg-slate-900 rounded-3xl p-6 shadow-2xl">
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-3 h-3 rounded-full bg-red-400" />
                  <div className="w-3 h-3 rounded-full bg-yellow-400" />
                  <div className="w-3 h-3 rounded-full bg-green-400" />
                </div>
                <div className="bg-white rounded-2xl p-6">
                  <div className="flex items-center justify-between mb-6">
                    <div>
                      <p className="text-xs text-gray-400 font-bold uppercase">Today's Revenue</p>
                      <p className="text-3xl font-bold text-[#0F172A]">₦847,500</p>
                    </div>
                    <div className="flex items-center gap-1 text-green-600 text-sm font-bold">
                      <TrendingUp className="w-4 h-4" />
                      +23%
                    </div>
                  </div>
                  <div className="grid grid-cols-3 gap-4">
                    <div className="bg-gray-50 rounded-xl p-4 text-center">
                      <p className="text-2xl font-bold text-[#0F172A]">47</p>
                      <p className="text-xs text-gray-500">Orders</p>
                    </div>
                    <div className="bg-gray-50 rounded-xl p-4 text-center">
                      <p className="text-2xl font-bold text-[#0F172A]">156</p>
                      <p className="text-xs text-gray-500">Products</p>
                    </div>
                    <div className="bg-gray-50 rounded-xl p-4 text-center">
                      <p className="text-2xl font-bold text-[#0F172A]">89%</p>
                      <p className="text-xs text-gray-500">Fulfilled</p>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>


      {/* Infrastructure Section */}
      <section className="hidden md:block py-32 px-4 bg-white">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="max-w-[1760px] mx-auto"
        >
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-orange-50 text-orange-600 text-[10px] font-black uppercase tracking-widest mb-6 border border-orange-100">
              Engineered for Nigeria
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-[#0F172A] mb-4 tracking-tight">Built for how we actually do business.</h2>
            <p className="text-[#64748B]">Not some Silicon Valley copy-paste. This is infrastructure that gets Nigeria.</p>
          </div>
          <div className="grid md:grid-cols-2 gap-6">
            {[
              { title: "Every Payment Method", desc: "Cards, bank transfer, USSD — your customers pay however they want. You get your money same day.", Icon: Smartphone, color: "text-green-600", bg: "bg-green-50" },
              { title: "Buyer Protection", desc: "Customers trust you more when their money is protected. Our escrow system handles that.", Icon: ShieldCheck, color: "text-purple-600", bg: "bg-purple-50" },
              { title: "Works on Bad Network", desc: "2G, 3G, that annoying network in your area — Vayva still works. We built it for real Nigerian conditions.", Icon: Wifi, color: "text-blue-600", bg: "bg-blue-50" },
              { title: "Handle More Customers", desc: "Reply to 100 people at once without losing your mind. AI handles the repetitive questions.", Icon: Zap, color: "text-orange-600", bg: "bg-orange-50" },
            ].map((item: any) => (
              <div key={item.title} className="bg-gray-50/50 rounded-3xl p-8 border border-gray-100 hover:bg-white hover:shadow-[0_20px_40px_-15px_rgba(0,0,0,0.05)] transition-all group">
                <div className={`w-12 h-12 rounded-2xl ${item.bg} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}>
                  <item.Icon className={`w-6 h-6 ${item.color}`} />
                </div>
                <h3 className="font-bold text-[#0F172A] mb-3 text-lg tracking-tight">{item.title}</h3>
                <p className="text-[#64748B] text-sm leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </motion.div>
      </section>

      {/* Partners Section */}
      <section className="hidden md:block py-20 px-4 bg-gray-50">
        <div className="max-w-[1760px] mx-auto">
          <p className="text-center text-sm font-bold text-gray-400 uppercase tracking-widest mb-12">
            Powered by Industry Leaders
          </p>
          <div className="flex flex-wrap justify-center items-center gap-12 md:gap-20">
            <Image
              src="/logos/partner-paystack.png"
              alt="Paystack"
              width={140}
              height={50}
              className="h-10 w-auto object-contain opacity-80 hover:opacity-100 transition-opacity"
            />
            <Image
              src="/logos/youverify_logo.png"
              alt="YouVerify"
              width={140}
              height={50}
              className="h-10 w-auto object-contain opacity-80 hover:opacity-100 transition-opacity"
            />
            <Image
              src="/logos/123design_logo.jpg"
              alt="123Design"
              width={140}
              height={50}
              className="h-12 w-auto object-contain mix-blend-multiply opacity-80 hover:opacity-100 transition-opacity"
            />
            <Image
              src="/logos/kwikdelivery_logo.jpeg"
              alt="Kwik Delivery"
              width={140}
              height={50}
              className="h-12 w-auto object-contain opacity-80 hover:opacity-100 transition-opacity"
            />
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-20 md:py-32 px-4 bg-white relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-green-50/50 via-transparent to-transparent opacity-50" />
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="max-w-[1760px] mx-auto text-center relative"
        >
          <h2 className="text-5xl md:text-7xl font-bold text-[#0F172A] mb-10 leading-[1.1] tracking-tight">
            Stop running your business in chat bubbles.
          </h2>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href={`${APP_URL}/signup`}>
              <PremiumButton className="px-16 py-8 text-xl rounded-[24px] shadow-[0_20px_40px_-10px_rgba(34,197,94,0.3)] hover:shadow-[0_25px_50px_-12px_rgba(34,197,94,0.4)] transition-all">
                Create your account free
              </PremiumButton>
            </Link>
          </div>
          <p className="mt-8 text-[#64748B] font-medium">No credit card. No maintenance fees. 5-minute setup.</p>
        </motion.div>
      </section>
    </div>
  );
}
