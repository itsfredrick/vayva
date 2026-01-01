import React from "react";
import Link from "next/link";
import { Button } from "@vayva/ui";
import { APP_URL } from "@/lib/constants";
import {
  Layout,
  Smartphone,
  MousePointerClick,
  RefreshCcw,
  Zap,
  Layers,
  ArrowRight,
} from "lucide-react";

export const metadata = {
  title: "Store Builder | Design Your Vayva Store",
  description:
    "Build a professional mobile-first online store without writing a single line of code. Choose a template, customize, and launch.",
};

export default function StoreBuilderPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Section 1: Hero */}
      <section className="pt-20 pb-16 px-4 bg-gray-50 border-b border-gray-100">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl md:text-6xl font-bold text-[#0F172A] mb-6 tracking-tight">
            Build a Professional Store
            <br />
            <span className="text-[#22C55E]">Without Code</span>
          </h1>
          <p className="text-xl text-[#64748B] mb-10 max-w-2xl mx-auto leading-relaxed">
            Design, edit, and publish a stunning mobile storefront in minutes.
            No hosting fees, no plugins, just pure commerce.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/templates">
              <Button className="bg-[#22C55E] hover:bg-[#16A34A] text-white px-8 py-4 text-lg font-bold rounded-xl transition-all shadow-lg shadow-green-100">
                View Templates
              </Button>
            </Link>
            <Link href={`${APP_URL}/signup`}>
              <Button
                variant="outline"
                className="border-2 border-gray-200 text-[#0F172A] px-8 py-4 text-lg font-bold rounded-xl hover:bg-white transition-all"
              >
                Start Free Trial
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Section 2: What the Store Builder Is */}
      <section className="py-24 px-4">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-[#0F172A] mb-6">
            Your brand, your rules.
          </h2>
          <p className="text-lg text-[#64748B] leading-relaxed">
            The Vayva Store Builder is a template-based visual editor designed
            specifically for WhatsApp commerce. Unlike generic website builders,
            every pixel is optimized for mobile customers who shop on their
            phones. No technical setup required.
          </p>
        </div>
      </section>

      {/* Section 3: Core Capabilities */}
      <section className="py-12 px-4 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Capability 1 */}
            <div className="bg-white p-8 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
              <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center mb-6">
                <MousePointerClick size={24} />
              </div>
              <h3 className="text-xl font-bold mb-3 text-[#0F172A]">
                Visual Editing
              </h3>
              <p className="text-sm text-gray-600">
                Click, type, and swap. Change colors, text, and images using a
                simple control panel. No HTML or CSS needed.
              </p>
            </div>

            {/* Capability 2 */}
            <div className="bg-white p-8 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
              <div className="w-12 h-12 bg-purple-50 text-purple-600 rounded-xl flex items-center justify-center mb-6">
                <Layout size={24} />
              </div>
              <h3 className="text-xl font-bold mb-3 text-[#0F172A]">
                Live Preview
              </h3>
              <p className="text-sm text-gray-600">
                See your changes instantly as you make them. Switch between
                desktop and mobile views to ensure perfection.
              </p>
            </div>

            {/* Capability 3 */}
            <div className="bg-white p-8 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
              <div className="w-12 h-12 bg-green-50 text-green-600 rounded-xl flex items-center justify-center mb-6">
                <Smartphone size={24} />
              </div>
              <h3 className="text-xl font-bold mb-3 text-[#0F172A]">
                Mobile Optimization
              </h3>
              <p className="text-sm text-gray-600">
                Every template is built mobile-first. Fast load times,
                thumb-friendly buttons, and seamless checkout flows.
              </p>
            </div>

            {/* Capability 4 */}
            <div className="bg-white p-8 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
              <div className="w-12 h-12 bg-orange-50 text-orange-600 rounded-xl flex items-center justify-center mb-6">
                <Layers size={24} />
              </div>
              <h3 className="text-xl font-bold mb-3 text-[#0F172A]">
                Section-Based Layout
              </h3>
              <p className="text-sm text-gray-600">
                Stack your content blocks like LEGOs. Enable, disable, or
                reorder sections like Heroes, Products, and Testimonials.
              </p>
            </div>

            {/* Capability 5 */}
            <div className="bg-white p-8 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
              <div className="w-12 h-12 bg-red-50 text-red-600 rounded-xl flex items-center justify-center mb-6">
                <RefreshCcw size={24} />
              </div>
              <h3 className="text-xl font-bold mb-3 text-[#0F172A]">
                Safe Reset & Recovery
              </h3>
              <p className="text-sm text-gray-600">
                Made a mess? Reset a single section, just the theme colors, or
                the entire template back to defaults safely.
              </p>
            </div>

            {/* Capability 6 */}
            <div className="bg-white p-8 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
              <div className="w-12 h-12 bg-teal-50 text-teal-600 rounded-xl flex items-center justify-center mb-6">
                <Zap size={24} />
              </div>
              <h3 className="text-xl font-bold mb-3 text-[#0F172A]">
                Fast Publishing
              </h3>
              <p className="text-sm text-gray-600">
                Go live in one click. Changes propagate to your public store URL
                instantly without downtime.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Section 4: How Editing Works */}
      <section className="py-24 px-4 overflow-hidden">
        <div className="max-w-6xl mx-auto grid lg:grid-cols-2 gap-16 items-center">
          <div>
            <h2 className="text-3xl font-bold text-[#0F172A] mb-6">
              Central Command for Creativity
            </h2>
            <div className="space-y-8">
              <div className="flex gap-4">
                <div className="h-8 w-8 rounded-full bg-black text-white flex items-center justify-center font-bold shrink-0">
                  1
                </div>
                <div>
                  <h3 className="font-bold text-lg mb-1">Select Once</h3>
                  <p className="text-gray-600">
                    Choose your foundation from the Template Gallery. This sets
                    your structure.
                  </p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="h-8 w-8 rounded-full bg-black text-white flex items-center justify-center font-bold shrink-0">
                  2
                </div>
                <div>
                  <h3 className="font-bold text-lg mb-1">Draft & Edit</h3>
                  <p className="text-gray-600">
                    Enter the Control Center. Tweak your design in Draft mode
                    privately without affecting your live site.
                  </p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="h-8 w-8 rounded-full bg-black text-white flex items-center justify-center font-bold shrink-0">
                  3
                </div>
                <div>
                  <h3 className="font-bold text-lg mb-1">Publish to World</h3>
                  <p className="text-gray-600">
                    Happy with the preview? Hit Publish. Your new look is live
                    for all customers instantly.
                  </p>
                </div>
              </div>
            </div>
          </div>
          <div className="bg-gray-100 rounded-2xl p-8 aspect-video flex items-center justify-center border border-gray-200">
            {/* Visual representation of the builder */}
            <div className="bg-white w-full h-full rounded-xl shadow-lg flex overflow-hidden opacity-90">
              <div className="w-1/4 bg-gray-50 border-r border-gray-200 p-2 space-y-2">
                <div className="w-full h-2 bg-gray-200 rounded"></div>
                <div className="w-3/4 h-2 bg-gray-200 rounded"></div>
              </div>
              <div className="w-1/2 p-4 flex items-center justify-center bg-gray-100">
                <div className="w-32 h-48 bg-white border-2 border-gray-800 rounded-lg shadow-sm"></div>
              </div>
              <div className="w-1/4 bg-white border-l border-gray-200 p-2">
                <div className="w-full h-2 bg-green-100 rounded mb-2"></div>
                <div className="w-full h-16 bg-gray-50 border border-gray-100 rounded"></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Section 5: Built for Growth */}
      <section className="py-24 px-4 bg-[#0F172A] text-white">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-6">
            More than just a pretty face.
          </h2>
          <p className="text-gray-300 text-lg mb-12 max-w-2xl mx-auto">
            This isn't a hobby site builder. It’s an engine connected to real
            inventory, real payments, and real logistics.
          </p>
          <div className="grid md:grid-cols-3 gap-8 text-center">
            <div>
              <h4 className="font-bold text-xl mb-2 text-[#22C55E]">
                Inventory Sync
              </h4>
              <p className="text-sm text-gray-400">
                Products update automatically when stock changes.
              </p>
            </div>
            <div>
              <h4 className="font-bold text-xl mb-2 text-[#22C55E]">
                Payment Native
              </h4>
              <p className="text-sm text-gray-400">
                Checkout is built-in, not pasted on.
              </p>
            </div>
            <div>
              <h4 className="font-bold text-xl mb-2 text-[#22C55E]">
                Delivery Ready
              </h4>
              <p className="text-sm text-gray-400">
                Logistics partners plugged in from day one.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Section 6: Final CTA */}
      <section className="py-20 px-4 text-center">
        <h2 className="text-4xl font-bold text-[#0F172A] mb-6">
          Stop coding. Start selling.
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
