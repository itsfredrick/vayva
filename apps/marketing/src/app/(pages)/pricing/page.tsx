"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Button, Icon } from "@vayva/ui";
import { PLANS, formatNGN, FEES } from "@/config/pricing";
import { APP_URL } from "@/lib/constants";
import { PlanComparisonTable } from "@/components/pricing/PlanComparisonTable";
import { PlanComparisonMobile } from "@/components/pricing/PlanComparisonMobile";
import { PremiumButton } from "@/components/marketing/PremiumButton";
import { useUserPlan } from "@/hooks/useUserPlan";

export default function PricingPage(): React.JSX.Element {
  const { tier, isAuthenticated, loading } = useUserPlan();

  return (
    <div className="min-h-screen bg-white relative overflow-hidden">
      {/* Background Orbs */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
        <div className="absolute top-[-5%] right-[-5%] w-[40%] h-[40%] bg-blue-50 rounded-full blur-[120px] opacity-60 animate-pulse" />
        <div className="absolute bottom-[20%] left-[-10%] w-[35%] h-[35%] bg-green-50 rounded-full blur-[100px] opacity-40 animate-pulse delay-1000" />
      </div>

      {/* Header */}
      <section className="pt-24 pb-20 px-4 relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 text-blue-600 text-[10px] font-black uppercase tracking-widest mb-6 border border-blue-100"
          >
            Transparent Pricing
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-5xl md:text-7xl font-bold text-[#0F172A] mb-8 leading-[1.1] tracking-tight"
          >
            Scale your business, <br />not your costs.
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-xl text-[#64748B] max-w-2xl mx-auto mb-6 leading-relaxed"
          >
            Choose a plan that matches your volume. Every plan includes
            our core WhatsApp capture engine and Paystack-powered payments.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25 }}
            className="flex flex-wrap items-center justify-center gap-3 mb-10"
          >
            <span className="inline-flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-full text-xs font-bold text-gray-600">
              <span className="w-2 h-2 bg-green-500 rounded-full"></span>
              Visa & Mastercard
            </span>
            <span className="inline-flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-full text-xs font-bold text-gray-600">
              <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
              Bank Transfer
            </span>
            <span className="inline-flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-full text-xs font-bold text-gray-600">
              <span className="w-2 h-2 bg-purple-500 rounded-full"></span>
              USSD
            </span>
            <span className="inline-flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-full text-xs font-bold text-gray-600">
              <span className="w-2 h-2 bg-orange-500 rounded-full"></span>
              Dollar Cards
            </span>
          </motion.div>


          {/* FEE DISCLOSURE - CLEAR & HONEST */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3 }}
            className="flex justify-center"
          >
            <div className="inline-flex items-center gap-3 px-6 py-3 bg-red-50/50 backdrop-blur-md border border-red-100 rounded-2xl">
              <div className="w-8 h-8 rounded-full bg-red-100 flex items-center justify-center text-red-600 shrink-0">
                <Icon name="Info" size={18} />
              </div>
              <p className="text-sm font-bold text-red-900">
                Honest Disclosure: A {FEES.WITHDRAWAL_PERCENTAGE}% transaction fee
                is charged on every withdrawal.
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Pricing Cards */}
      <section className="pb-32 px-4 relative z-10">
        <div className="max-w-7xl mx-auto">
          <div className="flex lg:grid lg:grid-cols-3 gap-6 lg:gap-8 overflow-visible overflow-x-auto pt-12 pb-12 lg:pb-0 px-4 -mx-4 lg:px-0 lg:mx-0 snap-x snap-mandatory scrollbar-hide">
            {PLANS.map((plan, idx) => {
              const isCurrentPlan = isAuthenticated && tier === plan.key;

              let href = plan.monthlyAmount === 0
                ? `${APP_URL}/signup`
                : `${APP_URL}/signup?plan=${plan.key}`;

              let label = plan.ctaLabel;

              if (loading) {
                // Loading state handled by parent or skeletal UI
              } else if (isAuthenticated) {
                if (isCurrentPlan) {
                  href = `${APP_URL}/settings/billing`;
                  label = "Current Plan";
                } else {
                  href = `${APP_URL}/settings/billing`;
                  label = tier === "free" ? "Switch Plan" : (plan.monthlyAmount > 0 ? "Switch Plan" : "Downgrade");
                }
              }

              return (
                <motion.div
                  key={plan.key}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.1 + 0.3 }}
                  className={`relative flex flex-col p-8 lg:p-10 rounded-[40px] border transition-all duration-500 snap-center shrink-0 w-[85vw] lg:w-full ${isCurrentPlan
                    ? "border-blue-500 shadow-[0_32px_64px_-16px_rgba(59,130,246,0.15)] ring-4 ring-blue-50 bg-blue-50/10"
                    : plan.featured
                      ? "border-[#22C55E] shadow-[0_32px_64px_-16px_rgba(34,197,94,0.15)] ring-4 ring-green-50"
                      : "border-gray-100 shadow-[0_20px_40px_-15px_rgba(0,0,0,0.05)]"
                    } bg-white hover:translate-y-[-4px]`}
                >
                  {plan.featured && !isCurrentPlan && (
                    <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-[#22C55E] text-white text-[10px] font-black uppercase tracking-widest px-6 py-2 rounded-full shadow-[0_10px_20px_-5px_rgba(34,197,94,0.4)]">
                      Most Popular
                    </div>
                  )}

                  {isCurrentPlan && (
                    <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-blue-500 text-white text-[10px] font-black uppercase tracking-widest px-6 py-2 rounded-full shadow-[0_10px_20px_-5px_rgba(59,130,246,0.4)]">
                      Your Plan
                    </div>
                  )}

                  <div className="mb-8">
                    <h3 className="text-2xl lg:text-3xl font-bold text-[#0F172A] mb-3 tracking-tight">
                      {plan.name}
                    </h3>
                    <p className="text-sm text-[#64748B] font-medium leading-relaxed">
                      {plan.tagline}
                    </p>
                  </div>

                  <div className="mb-8">
                    <div className="flex items-baseline gap-1">
                      <span className="text-5xl lg:text-6xl font-bold text-[#0F172A] tracking-tighter">
                        {formatNGN(plan.baseAmount)}
                      </span>
                      {plan.baseAmount > 0 && (
                        <span className="text-[#64748B] text-lg font-semibold">/mo</span>
                      )}
                    </div>
                    {plan.vatAmount > 0 && (
                      <p className="text-[10px] font-bold text-[#64748B] mt-2 uppercase tracking-widest">
                        + {formatNGN(plan.vatAmount)} VAT ({formatNGN(plan.monthlyAmount)} total)
                      </p>
                    )}
                    {plan.trialDays && !isAuthenticated && (
                      <p className="text-xs font-bold text-[#22C55E] mt-3 uppercase tracking-wider">
                        Includes {plan.trialDays} days free trial
                      </p>
                    )}
                  </div>

                  <ul className="space-y-5 mb-12 flex-grow">
                    {plan.bullets.map((bullet, i) => (
                      <li key={i} className="flex items-start gap-3 group/item">
                        <div className="mt-1 w-5 h-5 rounded-full bg-green-50 flex items-center justify-center shrink-0 group-hover/item:scale-110 transition-transform">
                          <svg
                            className="w-3 h-3 text-[#22C55E]"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={3}
                              d="M5 13l4 4L19 7"
                            />
                          </svg>
                        </div>
                        <span className="text-sm font-medium text-[#475569]">
                          {bullet}
                        </span>
                      </li>
                    ))}
                  </ul>

                  <Link
                    href={href}
                    className="block mt-auto"
                  >
                    {plan.featured || isCurrentPlan ? (
                      <PremiumButton disabled={isCurrentPlan} className={`w-full py-8 text-lg rounded-[24px] ${isCurrentPlan ? "opacity-90 grayscale-[0.5]" : "shadow-[0_20px_40px_-10px_rgba(34,197,94,0.3)]"}`}>
                        {label}
                      </PremiumButton>
                    ) : (
                      <Button
                        className={`w-full py-8 text-lg font-bold rounded-[24px] transition-all hover:scale-[1.02] bg-[#0F172A] hover:bg-black text-white`}
                      >
                        {label}
                      </Button>
                    )}
                  </Link>
                </motion.div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Feature Comparison */}
      <section className="py-32 px-4 bg-gray-50/50 relative overflow-hidden">
        <div className="max-w-6xl mx-auto relative z-10">
          <div className="text-center mb-20">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-100 text-slate-600 text-[10px] font-black uppercase tracking-widest mb-6 border border-slate-200">
              Detailed Breakdown
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-[#0F172A] mb-4 tracking-tight">
              Compare every detail.
            </h2>
            <p className="text-[#64748B] text-lg">
              No hidden limits. See exactly what you get on each tier.
            </p>
          </div>

          <div className="lg:hidden">
            <PlanComparisonMobile />
          </div>
          <div className="hidden lg:block">
            <PlanComparisonTable />
          </div>

          {/* REPEATED FEE DISCLOSURE IN COMPARISON */}
          <div className="mt-16 p-8 bg-white/80 backdrop-blur-md border border-gray-100 rounded-[32px] shadow-sm text-center">
            <p className="text-sm font-bold text-[#64748B] flex items-center justify-center gap-3">
              <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
              Note: All plans are subject to a {FEES.WITHDRAWAL_PERCENTAGE}%
              transaction fee on every withdrawal from your Vayva Wallet.
            </p>
          </div>
        </div>
      </section>

      {/* Simple FAQ */}
      <section className="py-32 px-4 relative z-10">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-[#0F172A] mb-4 tracking-tight">
              Frequently Asked Questions
            </h2>
            <p className="text-[#64748B]">Everything you need to know about Vayva pricing.</p>
          </div>
          <div className="grid md:grid-cols-2 gap-6">
            {[
              {
                q: "How does the 7-day trial work?",
                a: "You get full access to all features for 7 days. No credit card required. If you don't subscribe after the trial, your account will be paused.",
              },
              {
                q: "What payment methods can my customers use?",
                a: "Your customers can pay with Visa, Mastercard, Verve cards, bank transfers, USSD, and mobile money. International customers can pay with dollar cards. All powered by Paystack.",
              },
              {
                q: "When is the withdrawal fee charged?",
                a: "The 3% fee is deducted only when you move money from your Vayva Wallet to your external bank account. No fees for incoming payments.",
              },
              {
                q: "Can I accept international payments?",
                a: "Yes! Through Paystack, you can accept payments from international customers using Visa and Mastercard (including dollar cards). Funds settle in Naira.",
              },
              {
                q: "Can I cancel any time?",
                a: "Yes. Vayva is month-to-month. You can cancel, upgrade, or downgrade your plan instantly from your dashboard.",
              },
              {
                q: "Are there transaction fees?",
                a: "Vayva doesn't charge per-transaction fees. You only pay your monthly subscription and the withdrawal fee when moving cash out. Standard Paystack fees apply to card payments.",
              },
            ].map((faq, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="p-8 bg-gray-50/50 rounded-[32px] border border-gray-100 hover:bg-white hover:shadow-xl transition-all"
              >
                <h4 className="font-bold text-[#0F172A] mb-3 text-lg">{faq.q}</h4>
                <p className="text-sm text-[#64748B] leading-relaxed">{faq.a}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>

  );
}
