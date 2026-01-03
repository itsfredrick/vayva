"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
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
import { HeroDownloadButton } from "@/components/marketing/HeroDownloadButton";
import { SchemaOrg } from "@/components/seo/SchemaOrg";
import { PremiumButton } from "@/components/marketing/PremiumButton";
import { APP_URL } from "@/lib/constants";
import * as motion from "framer-motion/client";
import dynamic from "next/dynamic";

const TrustVisualSection = dynamic(() => import("@/components/marketing/sections/TrustVisualSection"), { ssr: false });
const TemplatesDiscoverySection = dynamic(() => import("@/components/marketing/sections/TemplatesDiscoverySection"), { ssr: false });

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white" style={{ backgroundColor: "#ffffff", color: "#0f172a" }}>
      <SchemaOrg type="SoftwareApplication" />

      {/* Hero Section */}
      <section className="pt-4 pb-20 px-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="max-w-4xl mx-auto text-center"
        >
          {/* Status Pill */}
          <div className="inline-flex items-center gap-2 bg-gray-50 border border-gray-200 rounded-full px-4 py-2 mb-8">
            <span className="w-2 h-2 rounded-full bg-[#22C55E]"></span>
            <span className="text-sm text-gray-600 font-medium">
              Vayva Platform v1.0
            </span>
          </div>

          <h1 className="text-5xl md:text-7xl font-bold text-[#0F172A] mb-8 leading-[1.1] tracking-tight">
            WhatsApp is for chat.
            <br />
            <span className="text-[#22C55E]">Vayva</span> is for business.
          </h1>

          <p className="text-xl text-[#64748B] mb-10 max-w-3xl mx-auto leading-relaxed">
            Stop fighting with chat bubbles. Let Vayva's AI auto-capture orders,
            track payments, and organize your business so you can finally relax.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-6 items-center">
            <a href={`${APP_URL}/signup`}>
              <PremiumButton data-testid="landing-get-started">
                Start selling for free
              </PremiumButton>
            </a>
            <HeroDownloadButton />
          </div>

          <p className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-6">
            Trusted by modern businesses
          </p>

          <div className="flex flex-wrap justify-center items-center gap-8 md:gap-12 opacity-80 grayscale hover:grayscale-0 transition-all duration-500">
            <Image
              src="/logos/partner-paystack.png"
              alt="Paystack"
              width={120}
              height={40}
              className="h-8 w-auto object-contain"
            />
            <Image
              src="/logos/youverify_logo.png"
              alt="YouVerify"
              width={120}
              height={40}
              className="h-8 w-auto object-contain"
            />
            <Image
              src="/logos/123design_logo.jpg"
              alt="123Design"
              width={120}
              height={40}
              className="h-10 w-auto object-contain mix-blend-multiply"
            />
            <Image
              src="/logos/oral4_logo.png"
              alt="Oral4"
              width={120}
              height={40}
              className="h-10 w-auto object-contain mix-blend-multiply"
            />
          </div>

          {/* Trust Indicators */}
          <div className="flex flex-wrap justify-center items-center gap-6 sm:gap-8 text-sm text-[#64748B] font-medium mt-12">
            <span className="flex items-center gap-2"> Secured Payments </span>
            <span className="w-1 h-1 rounded-full bg-gray-300 hidden sm:block"></span>
            <span className="flex items-center gap-2"> Identity Verified </span>
            <span className="w-1 h-1 rounded-full bg-gray-300 hidden sm:block"></span>
            <span className="flex items-center gap-2 text-green-500 font-bold"> No card required </span>
          </div>
        </motion.div>
      </section>

      {/* Trust Visual Hero Section */}
      <TrustVisualSection />

      {/* Problem Statement */}
      <section className="py-24 px-4 bg-gray-50/50">
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          className="max-w-6xl mx-auto grid md:grid-cols-2 gap-16 items-center"
        >
          <div className="relative rounded-[32px] overflow-hidden shadow-2xl border border-gray-200 rotate-2 hover:rotate-0 transition-all duration-500 group-hover:scale-[1.02]">
            <Image
              src="/images/chaos-problem.jpg"
              alt="Chaos without Vayva"
              width={800}
              height={600}
              className="w-full h-auto object-cover"
            />
          </div>
          <div>
            <h2 className="text-4xl font-bold text-[#0F172A] mb-8 leading-tight">
              WhatsApp is chaotic.
              <br />
              <span className="text-red-500">Business shouldn't be.</span>
            </h2>
            <div className="space-y-6">
              {[
                "Orders get lost in chat threads",
                "Prices change mid-conversation",
                "No records of what was sold",
                "No accountability or audit trail",
              ].map((item) => (
                <div key={item} className="flex items-center gap-4 text-[#64748B] text-lg font-medium">
                  <div className="w-6 h-6 rounded-full bg-red-50 flex items-center justify-center text-red-500">×</div>
                  {item}
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      </section>

      {/* Core Capabilities */}
      <section id="features" className="py-24 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-20"
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 text-blue-600 text-xs font-bold uppercase mb-6">
              Capabilities
            </div>
            <h2 className="text-5xl font-bold text-[#0F172A] mb-6">
              Put your business on Autopilot.
            </h2>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              { title: "Orders from chat", Icon: MessageSquareText, color: "text-blue-500", bg: "bg-blue-50" },
              { title: "Payments & reconciliation", Icon: CreditCard, color: "text-green-500", bg: "bg-green-50" },
              { title: "Inventory tracking", Icon: Package, color: "text-orange-500", bg: "bg-orange-50" },
              { title: "Delivery coordination", Icon: Truck, color: "text-purple-500", bg: "bg-purple-50" },
              { title: "Business records", Icon: BarChart3, color: "text-indigo-500", bg: "bg-indigo-50" },
              { title: "Multi-staff access", Icon: Users, color: "text-pink-500", bg: "bg-pink-50" },
            ].map((feature, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="group bg-white border border-gray-100 rounded-2xl p-8 hover:shadow-2xl hover:shadow-green-100/50 hover:border-[#22C55E]/30 transition-all text-center md:text-left"
              >
                <div className={`w-14 h-14 rounded-xl ${feature.bg} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform mx-auto md:mx-0`}>
                  <feature.Icon className={`w-7 h-7 ${feature.color}`} />
                </div>
                <h3 className="text-xl font-bold text-[#0F172A] mb-3">{feature.title}</h3>
                <p className="text-[#64748B] text-sm leading-relaxed">Integrated features designed for speed.</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Templates Discovery Section */}
      <TemplatesDiscoverySection />

      {/* Built for Nigerian Businesses */}
      <section className="py-24 px-4 bg-white">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="max-w-4xl mx-auto"
        >
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-50 text-orange-600 text-xs font-bold uppercase mb-6">
              Engineered for Nigeria
            </div>
            <h2 className="text-4xl font-bold text-[#0F172A] mb-4">Infrastructure for the local reality.</h2>
          </div>
          <div className="grid md:grid-cols-2 gap-8">
            {[
              { title: "Local payment realities", Icon: Smartphone, color: "text-green-600", bg: "bg-green-100" },
              { title: "Informal selling norms", Icon: Users, color: "text-orange-600", bg: "bg-orange-100" },
              { title: "Network constraints", Icon: Wifi, color: "text-blue-600", bg: "bg-blue-100" },
              { title: "Regulatory awareness", Icon: ShieldCheck, color: "text-purple-600", bg: "bg-purple-100" },
            ].map((item) => (
              <div key={item.title} className="bg-gray-50 rounded-2xl p-8 border border-gray-100 hover:bg-white hover:shadow-xl transition-all group">
                <div className={`w-12 h-12 rounded-xl ${item.bg} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                  <item.Icon className={`w-6 h-6 ${item.color}`} />
                </div>
                <h3 className="font-bold text-[#0F172A] mb-3 text-lg">{item.title}</h3>
                <p className="text-[#64748B] text-sm leading-relaxed">Built for Nigeria.</p>
              </div>
            ))}
          </div>
        </motion.div>
      </section>

      {/* Final CTA */}
      <section className="py-32 px-4 bg-white relative overflow-hidden">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="max-w-4xl mx-auto text-center relative"
        >
          <h2 className="text-5xl md:text-6xl font-bold text-[#0F172A] mb-8 leading-tight">
            Stop running your business in chat bubbles.
          </h2>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href={`${APP_URL}/signup`}>
              <PremiumButton className="px-12 py-6 text-xl rounded-2xl">
                Create your account
              </PremiumButton>
            </Link>
          </div>
        </motion.div>
      </section>
    </div>
  );
}
