"use client";

import React from "react";
import Link from "next/link";
import { Button, Icon } from "@vayva/ui";
import { PLANS, formatNGN, FEES } from "@/config/pricing";
import { APP_URL } from "@/lib/constants";
import { PlanComparisonTable } from "@/components/pricing/PlanComparisonTable";
import { PlanComparisonMobile } from "@/components/pricing/PlanComparisonMobile";
import { PremiumButton } from "@/components/marketing/PremiumButton";
import { useUserPlan } from "@/hooks/useUserPlan";

export default function PricingPage() {
  const { tier, isAuthenticated, loading } = useUserPlan();

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <section className="pt-12 pb-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-5xl md:text-6xl font-black text-[#0F172A] mb-6 tracking-tight">
            Predictable pricing.
            <br />
            <span className="text-[#22C55E]">No hidden surprises.</span>
          </h1>
          <p className="text-xl text-[#64748B] max-w-2xl mx-auto mb-8">
            Choose a plan that matches your business volume. Every plan includes
            our core WhatsApp capture engine.
          </p>

          {/* FEE DISCLOSURE - CLEAR & HONEST */}
          <div className="inline-flex items-center gap-3 px-6 py-3 bg-red-50 border border-red-100 rounded-2xl animate-in fade-in slide-in-from-top-4 duration-700">
            <div className="w-8 h-8 rounded-full bg-red-100 flex items-center justify-center text-red-600">
              <Icon name="Info" size={18} />
            </div>
            <p className="text-sm font-bold text-red-900">
              Honest Disclosure: A {FEES.WITHDRAWAL_PERCENTAGE}% transaction fee
              is charged on every withdrawal.
            </p>
          </div>
        </div>
      </section>

      {/* Pricing Cards */}
      <section className="pb-32 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-3 gap-8">
            {PLANS.map((plan) => {
              const isCurrentPlan = isAuthenticated && tier === plan.key;
              const isUpgrade = isAuthenticated && tier === "free" && plan.key !== "free";
              const isDowngrade = isAuthenticated && tier !== "free" && plan.key === "free";

              let href = plan.monthlyAmount === 0
                ? `${APP_URL}/signup`
                : `${APP_URL}/signup?plan=${plan.key}`;

              let label = plan.ctaLabel;

              if (loading) {
                // Keep defaults
              } else if (isAuthenticated) {
                if (isCurrentPlan) {
                  href = `${APP_URL}/settings/billing`;
                  label = "Current Plan";
                } else {
                  href = `${APP_URL}/settings/billing`;
                  label = isDowngrade ? "Downgrade" : "Switch Plan";
                }
              }

              return (
                <div
                  key={plan.key}
                  className={`relative flex flex-col p-8 rounded-[32px] border ${isCurrentPlan
                    ? "border-blue-500 shadow-2xl shadow-blue-100 ring-4 ring-blue-50 bg-blue-50/10"
                    : plan.featured
                      ? "border-[#22C55E] shadow-2xl shadow-green-100 ring-4 ring-green-50"
                      : "border-gray-100 shadow-xl"
                    } bg-white`}
                >
                  {plan.featured && !isCurrentPlan && (
                    <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-[#22C55E] text-white text-[10px] font-black uppercase tracking-widest px-4 py-1.5 rounded-full shadow-lg">
                      Most Popular
                    </div>
                  )}

                  {isCurrentPlan && (
                    <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-blue-500 text-white text-[10px] font-black uppercase tracking-widest px-4 py-1.5 rounded-full shadow-lg">
                      Your Plan
                    </div>
                  )}

                  <div className="mb-8">
                    <h3 className="text-2xl font-black text-[#0F172A] mb-2">
                      {plan.name}
                    </h3>
                    <p className="text-sm text-gray-400 font-medium">
                      {plan.tagline}
                    </p>
                  </div>

                  <div className="mb-8">
                    <div className="flex items-baseline gap-1">
                      <span className="text-5xl font-black text-[#0F172A]">
                        {formatNGN(plan.monthlyAmount)}
                      </span>
                      {plan.monthlyAmount > 0 && (
                        <span className="text-gray-400 font-bold">/mo</span>
                      )}
                    </div>
                    {plan.trialDays && !isAuthenticated && (
                      <p className="text-xs font-bold text-[#22C55E] mt-2 italic">
                        Includes {plan.trialDays} days full trial access
                      </p>
                    )}
                  </div>

                  <ul className="space-y-4 mb-10 flex-grow">
                    {plan.bullets.map((bullet, i) => (
                      <li key={i} className="flex items-start gap-3">
                        <div className="mt-1 w-5 h-5 rounded-full bg-green-50 flex items-center justify-center shrink-0">
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
                        <span className="text-sm font-medium text-gray-600">
                          {bullet}
                        </span>
                      </li>
                    ))}
                  </ul>

                  <Link
                    href={href}
                    className="block"
                  >
                    {plan.featured || isCurrentPlan ? (
                      <PremiumButton disabled={isCurrentPlan} className={`w-full py-6 rounded-2xl ${isCurrentPlan ? "opacity-90 grayscale-[0.5]" : ""}`}>
                        {label}
                      </PremiumButton>
                    ) : (
                      <Button
                        className={`w-full py-6 text-lg font-bold rounded-2xl transition-all hover:scale-[1.02] bg-gray-900 hover:bg-black text-white`}
                      >
                        {label}
                      </Button>
                    )}
                  </Link>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Feature Comparison */}
      <section className="py-24 px-4 bg-gray-50/50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-black text-[#0F172A] mb-4">
              Compare every detail
            </h2>
            <p className="text-gray-500 font-medium">
              No hidden limits. See exactly what you get on each plan.
            </p>
          </div>

          <div className="lg:hidden">
            <PlanComparisonMobile />
          </div>
          <div className="hidden lg:block">
            <PlanComparisonTable />
          </div>

          {/* REPEATED FEE DISCLOSURE IN COMPARISON */}
          <div className="mt-12 p-6 bg-white border border-gray-100 rounded-2xl shadow-sm text-center">
            <p className="text-sm font-bold text-gray-400">
              <span className="text-red-500 mr-2">●</span>
              Note: All plans are subject to a {FEES.WITHDRAWAL_PERCENTAGE}%
              transaction fee on every withdrawal from your Vayva Wallet.
            </p>
          </div>
        </div>
      </section>

      {/* Simple FAQ */}
      <section className="py-24 px-4">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl font-black text-[#0F172A] mb-12 text-center">
            Frequently Asked Questions
          </h2>
          <div className="space-y-6">
            {[
              {
                q: "How does the 7-day trial work?",
                a: "You get full access to the Pro features for 7 days. At the end of the trial, you can choose to subscribe or your account will be limited to the Free tier features.",
              },
              {
                q: "When is the withdrawal fee charged?",
                a: "The 5% fee is automatically calculated and deducted when you request a payout from your Vayva wallet to your local bank account.",
              },
              {
                q: "Can I cancel my subscription any time?",
                a: "Yes. There are no long-term contracts. You can cancel your paid plan at any time from your billing dashboard.",
              },
            ].map((faq, i) => (
              <div
                key={i}
                className="p-6 bg-gray-50 rounded-2xl border border-gray-100"
              >
                <h4 className="font-bold text-[#0F172A] mb-2">{faq.q}</h4>
                <p className="text-sm text-gray-600 leading-relaxed">{faq.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
