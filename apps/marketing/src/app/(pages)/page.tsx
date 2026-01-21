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
  ArrowRight
} from "lucide-react";
import { Button } from "@vayva/ui";
import { LandingHero } from "@/components/marketing/LandingHero";
import { PremiumButton } from "@/components/marketing/PremiumButton";
import { APP_URL } from "@/lib/constants";
import * as motion from "framer-motion/client";
import dynamic from "next/dynamic";

const TrustVisualSection = dynamic(() => import("@/components/marketing/sections/TrustVisualSection"));


const INDUSTRY_VARIANTS: Record<string, { headline: string; sub: string }> = {
  food: {
    headline: "Turn your Menu into a 24/7 Ordering Machine.",
    sub: "Let Vayva's AI handle the back-and-forth orders on WhatsApp while you focus on the kitchen."
  },
  fashion: {
    headline: "Sell Out your Collections on WhatsApp.",
    sub: "Manage orders, sizes, and payments automatically. Your store stays open while you design."
  },
  realestate: {
    headline: "Your WhatsApp is now a Property Showroom.",
    sub: "Let AI filter leads and book viewings while you close the deals."
  },
  default: {
    headline: "WhatsApp is for chat. Vayva is for business.",
    sub: "Stop fighting with chat bubbles. Let Vayva's AI auto-capture orders, track payments, and organize your business."
  }
};

export default async function LandingPage(props: {
  searchParams: Promise<{ industry?: string }>;
}) {
  const searchParams = await props.searchParams;
  const industry = searchParams.industry || "default";
  const content = INDUSTRY_VARIANTS[industry] || INDUSTRY_VARIANTS.default;

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
          headline={industry === "default" ? (
            <>
              WhatsApp is for chat.
              <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#22C55E] to-[#16A34A]">Vayva</span> is for business.
            </>
          ) : content.headline}
          sub={content.sub}
        />
      </div>

      {/* Trust Visual Hero Section */}
      <div className="relative z-10">
        <TrustVisualSection />
      </div>

      {/* Problem Statement */}
      <section className="py-32 px-4 relative z-10">
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          className="max-w-6xl mx-auto grid md:grid-cols-[0.65fr_1fr] gap-16 items-center"
        >
          <div className="relative group">
            <div className="absolute -inset-4 bg-red-100 rounded-[40px] blur-2xl opacity-20 group-hover:opacity-30 transition-all" />
            <div className="relative rounded-[40px] overflow-hidden shadow-[0_32px_64px_-16px_rgba(0,0,0,0.1)] border border-gray-100/50 rotate-1 group-hover:rotate-0 transition-all duration-700">
              <Image
                src="/images/chaos-problem.jpg"
                alt="Chaos without Vayva"
                width={800}
                height={600}
                className="w-full h-auto object-cover scale-105 group-hover:scale-100 transition-transform duration-700"
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
      <section id="features" className="py-32 px-4 bg-slate-900 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none opacity-20">
          <div className="absolute top-[20%] right-[-10%] w-[50%] h-[50%] bg-[#22C55E] rounded-full blur-[150px]" />
          <div className="absolute bottom-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-500 rounded-full blur-[120px]" />
        </div>

        <div className="max-w-6xl mx-auto relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-20"
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
              { title: "Financial Ledger", desc: "Real-time tracking of every kobo. See your profit, debt, and cashflow in one dashboard.", Icon: CreditCard, accent: "from-green-500/20 to-transparent" },
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

      {/* Infrastructure Section */}
      <section className="py-32 px-4 bg-white">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="max-w-4xl mx-auto"
        >
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-orange-50 text-orange-600 text-[10px] font-black uppercase tracking-widest mb-6 border border-orange-100">
              Engineered for Nigeria
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-[#0F172A] mb-4 tracking-tight">Built for the local reality.</h2>
            <p className="text-[#64748B]">Infrastructure that understands how we sell.</p>
          </div>
          <div className="grid md:grid-cols-2 gap-6">
            {[
              { title: "Local Payment Realities", desc: "Optimized for bank transfers and USSD verification.", Icon: Smartphone, color: "text-green-600", bg: "bg-green-50" },
              { title: "Trust-Based Selling", desc: "Escrow-style wallets to bridge the gap between buyer and seller.", Icon: ShieldCheck, color: "text-purple-600", bg: "bg-purple-50" },
              { title: "Network Resilience", desc: "Works flawlessly on Edge/3G connections common in local markets.", Icon: Wifi, color: "text-blue-600", bg: "bg-blue-50" },
              { title: "Scale Efficiency", desc: "One-to-many selling without the manual-reply fatigue.", Icon: Zap, color: "text-orange-600", bg: "bg-orange-50" },
            ].map((item) => (
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

      {/* Final CTA */}
      <section className="py-40 px-4 bg-white relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-green-50/50 via-transparent to-transparent opacity-50" />
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="max-w-4xl mx-auto text-center relative"
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
