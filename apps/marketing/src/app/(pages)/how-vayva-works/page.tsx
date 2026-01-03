import React from "react";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@vayva/ui";
import { APP_URL } from "@/lib/constants";
import { ArrowRight } from "lucide-react";
import "./styles.css";

export const metadata = {
  title: "How Vayva Works | From Chat to Checkout",
  description:
    "Learn how Vayva turns your WhatsApp conversations into a structured business engine in 5 simple steps.",
};

export default function HowItWorksPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Section 1: Hero */}
      <section className="pt-20 pb-16 px-4 bg-gray-50 border-b border-gray-100">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl md:text-6xl font-bold text-[#0F172A] mb-6 tracking-tight">
            How Vayva Works
          </h1>
          <p className="text-xl text-[#64748B] mb-10 max-w-2xl mx-auto leading-relaxed">
            Vayva acts as the operating system for your WhatsApp business. We
            turn messy chat threads into structured, automated workflows so you
            can scale without the chaos.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href={`${APP_URL}/signup`}>
              <Button className="bg-[#22C55E] hover:bg-[#16A34A] text-white px-8 py-4 text-lg font-bold rounded-xl transition-all shadow-lg shadow-green-100">
                Get Started
              </Button>
            </Link>
            <Link href="/store-builder">
              <Button
                variant="outline"
                className="border-2 border-gray-200 text-[#0F172A] px-8 py-4 text-lg font-bold rounded-xl hover:bg-white transition-all"
              >
                View Templates
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Section 2: The End-to-End Flow */}
      <section className="py-24 px-4 overflow-hidden">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-[#0F172A] mb-4">
              From Conversation to Conversion
            </h2>
            <p className="text-[#64748B]">
              Five steps to professionalize your business.
            </p>
          </div>

          <div className="space-y-24 relative">
            {/* Connecting Line (Desktop) */}
            <div className="hidden md:block absolute left-1/2 top-0 bottom-0 w-0.5 bg-gray-100 -translate-x-1/2 z-0" />

            {/* Step 1 */}
            <div className="relative z-10 grid md:grid-cols-2 gap-12 items-center">
              <div className="md:text-right order-2 md:order-1">
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-green-100 text-[#22C55E] mb-4 font-bold text-xl">
                  1
                </div>
                <h3 className="text-2xl font-bold text-[#0F172A] mb-3">
                  Connect WhatsApp
                </h3>
                <p className="text-[#64748B] leading-relaxed">
                  Link your existing business number safely. Vayva's AI engine
                  immediately starts listening for customer intent, turning "how
                  much?" into structured product queries.
                </p>
              </div>
              <div className="flex justify-center order-1 md:order-2">
                <div className="relative group">
                  <Image
                    src="/images/step-1-whatsapp.png"
                    alt="African merchant holding smartphone showing WhatsApp Business with green checkmark in modern shop"
                    width={500}
                    height={375}
                    className="rounded-2xl shadow-lg transition-all duration-300 group-hover:shadow-2xl group-hover:-translate-y-2 pointer-events-none select-none float-animation"
                    priority
                  />
                </div>
              </div>
            </div>

            {/* Step 2 */}
            <div className="relative z-10 grid md:grid-cols-2 gap-12 items-center">
              <div className="flex justify-center md:justify-end">
                <div className="relative group">
                  <Image
                    src="/images/step-2-templates.png"
                    alt="Nigerian entrepreneur browsing store templates on MacBook showing template gallery"
                    width={500}
                    height={375}
                    className="rounded-2xl shadow-lg transition-all duration-300 group-hover:shadow-2xl group-hover:-translate-y-2 pointer-events-none select-none float-animation-delay-1"
                  />
                </div>
              </div>
              <div>
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-blue-100 text-blue-600 mb-4 font-bold text-xl">
                  2
                </div>
                <h3 className="text-2xl font-bold text-[#0F172A] mb-3">
                  Choose a Store Template
                </h3>
                <p className="text-[#64748B] leading-relaxed">
                  Select from our library of conversion-optimized blueprints.
                  Whether you sell food, fashion, or services, there's a design
                  ready for you. No coding required.
                </p>
              </div>
            </div>

            {/* Step 3 */}
            <div className="relative z-10 grid md:grid-cols-2 gap-12 items-center">
              <div className="md:text-right order-2 md:order-1">
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-purple-100 text-purple-600 mb-4 font-bold text-xl">
                  3
                </div>
                <h3 className="text-2xl font-bold text-[#0F172A] mb-3">
                  Customize with Store Builder
                </h3>
                <p className="text-[#64748B] leading-relaxed">
                  Use our visual editor to add your brand colors, logo, and
                  products. See changes live on a mobile preview. Made a
                  mistake? Reset securely in one click.
                </p>
              </div>
              <div className="flex justify-center order-1 md:order-2">
                <div className="relative group">
                  <Image
                    src="/images/step-3-builder.png"
                    alt="African female business owner customizing store on iPad Pro with Store Builder interface in boutique"
                    width={500}
                    height={375}
                    className="rounded-2xl shadow-lg transition-all duration-300 group-hover:shadow-2xl group-hover:-translate-y-2 pointer-events-none select-none float-animation-delay-2"
                  />
                </div>
              </div>
            </div>

            {/* Step 4 */}
            <div className="relative z-10 grid md:grid-cols-2 gap-12 items-center">
              <div className="flex justify-center md:justify-end">
                <div className="relative group">
                  <Image
                    src="/images/step-4-payments.png"
                    alt="Smartphone showing Paystack payment confirmation with Nigerian Naira amount in Lagos market"
                    width={500}
                    height={375}
                    className="rounded-2xl shadow-lg transition-all duration-300 group-hover:shadow-2xl group-hover:-translate-y-2 pointer-events-none select-none float-animation-delay-3"
                  />
                </div>
              </div>
              <div>
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-orange-100 text-orange-600 mb-4 font-bold text-xl">
                  4
                </div>
                <h3 className="text-2xl font-bold text-[#0F172A] mb-3">
                  Accept Payments
                </h3>
                <p className="text-[#64748B] leading-relaxed">
                  Customers can pay you immediately through secure links sent
                  in-chat. Verify payments automatically without sending
                  screenshots back and forth.
                </p>
              </div>
            </div>

            {/* Step 5 */}
            <div className="relative z-10 grid md:grid-cols-2 gap-12 items-center">
              <div className="md:text-right order-2 md:order-1">
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-teal-100 text-teal-600 mb-4 font-bold text-xl">
                  5
                </div>
                <h3 className="text-2xl font-bold text-[#0F172A] mb-3">
                  Fulfill Orders & Delivery
                </h3>
                <p className="text-[#64748B] leading-relaxed">
                  Track every order in your dashboard. Connect with logistics
                  partners for dispatch, and let Vayva send automated status
                  updates to your customer's WhatsApp.
                </p>
              </div>
              <div className="flex justify-center order-1 md:order-2">
                <div className="relative group">
                  <Image
                    src="/images/step-5-delivery.png"
                    alt="Vayva-branded delivery rider on motorcycle checking smartphone in Lagos traffic"
                    width={500}
                    height={375}
                    className="rounded-2xl shadow-lg transition-all duration-300 group-hover:shadow-2xl group-hover:-translate-y-2 pointer-events-none select-none float-animation-delay-4"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Section 3: Who Vayva Is For */}
      <section className="py-24 bg-gray-50 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-[#0F172A]">
              Built for Every Stage
            </h2>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
              <div className="h-10 w-10 bg-green-100 rounded-full flex items-center justify-center text-[#22C55E] mb-6 font-bold">
                1
              </div>
              <h3 className="text-xl font-bold mb-3">Solo Sellers</h3>
              <p className="text-gray-600 text-sm leading-relaxed">
                Perfect for Instagram vendors and side-hustlers. Get a
                professional link-in-bio store and stop manually replying to
                "how much" DMs.
              </p>
            </div>
            <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
              <div className="h-10 w-10 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 mb-6 font-bold">
                2
              </div>
              <h3 className="text-xl font-bold mb-3">Small Businesses</h3>
              <p className="text-gray-600 text-sm leading-relaxed">
                For shops with physical inventory and staff. Manage catalogue,
                track stock, and handle delivery logistics from one dashboard.
              </p>
            </div>
            <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
              <div className="h-10 w-10 bg-purple-100 rounded-full flex items-center justify-center text-purple-600 mb-6 font-bold">
                3
              </div>
              <h3 className="text-xl font-bold mb-3">Growing Brands</h3>
              <p className="text-gray-600 text-sm leading-relaxed">
                Scale your operations with automated workflows, team
                permissions, and deep analytics without breaking your personal
                WhatsApp.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Section 4: Why This Works Better */}
      <section className="py-24 px-4">
        <div className="max-w-4xl mx-auto bg-[#0F172A] rounded-3xl p-8 md:p-16 text-center text-white relative overflow-hidden">
          <div className="relative z-10">
            <h2 className="text-3xl font-bold mb-6">
              Why Vayva Beats Manual Chat
            </h2>
            <div className="grid sm:grid-cols-2 gap-8 text-left max-w-2xl mx-auto mb-10">
              <div className="space-y-4">
                <div className="flex gap-3">
                  <span className="text-[#22C55E]">✓</span>
                  <span className="text-gray-300">
                    WhatsApp is great for talk, bad for tracking.
                  </span>
                </div>
                <div className="flex gap-3">
                  <span className="text-[#22C55E]">✓</span>
                  <span className="text-gray-300">
                    Manual replies act as a bottleneck to sales.
                  </span>
                </div>
              </div>
              <div className="space-y-4">
                <div className="flex gap-3">
                  <span className="text-[#22C55E]">✓</span>
                  <span className="text-gray-300">
                    Screenshots of transfers are unreliable.
                  </span>
                </div>
                <div className="flex gap-3">
                  <span className="text-[#22C55E]">✓</span>
                  <span className="text-gray-300">
                    Vayva adds the missing "Structure" layer.
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Section 5: Final CTA */}
      <section className="py-20 px-4 text-center">
        <h2 className="text-4xl font-bold text-[#0F172A] mb-6">
          Ready to professionalize?
        </h2>
        <Link href={`${APP_URL}/signup`}>
          <Button className="bg-[#22C55E] hover:bg-[#16A34A] text-white px-10 py-5 text-lg font-bold rounded-xl shadow-xl shadow-green-100 transition-all hover:scale-105 inline-flex items-center gap-2">
            Start Building Your Store <ArrowRight size={20} />
          </Button>
        </Link>
      </section>
    </div>
  );
}
