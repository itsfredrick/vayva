import React from "react";
import Link from "next/link";
import { Button } from "@vayva/ui";
import {
  Globe,
  ShieldCheck,
  Zap,
  Heart,
  Users,
  ArrowRight,
} from "lucide-react";

export const metadata = {
  title: "About Vayva | Building the Future of Commerce",
  description:
    "Vayva is building tools that help businesses turn conversations into scalable commerce across Africa and beyond.",
};

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-white text-[#0F172A]">
      {/* Section 1: Hero */}
      <section className="py-24 px-4 text-center bg-gray-50 border-b border-gray-100">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl md:text-6xl font-bold mb-8 tracking-tight">
            Building the Infrastructure for
            <br />
            <span className="text-[#22C55E]">Modern Commerce</span>
          </h1>
          <p className="text-xl text-[#64748B] max-w-2xl mx-auto leading-relaxed">
            We don't just build websites. We help businesses turn chaotic
            WhatsApp conversations into scalable, trusted commerce engines.
          </p>
        </div>
      </section>

      {/* Section 2: Why Vayva Exists */}
      <section className="py-24 px-4">
        <div className="max-w-3xl mx-auto space-y-8 leading-relaxed text-lg text-gray-700">
          <h2 className="text-3xl font-bold text-[#0F172A] mb-8">
            The Shift to Messaging
          </h2>
          <p>
            Commerce in emerging markets doesn't happen on static catalogs. It
            happens in conversations. It's dynamic, human, and messy. Millions
            of businesses rely on WhatsApp to trade, but the platform wasn't
            built for operations.
          </p>
          <p>
            Orders get lost in chat history. Payments are manual and risky.
            Delivery logistics are a nightmare of phone calls. This ceiling
            prevents hardworking merchants from scaling.
          </p>
          <p className="font-medium text-[#0F172A]">
            Vayva exists to remove this ceiling. We add the missing layer of
            structure, automation, and trust so businesses can operate
            professionally where their customers already are.
          </p>
        </div>
      </section>

      {/* Section 3: Mission */}
      <section className="py-20 px-4 bg-[#0F172A] text-white text-center">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-sm font-bold uppercase tracking-widest text-[#22C55E] mb-6">
            Our Mission
          </h2>
          <blockquote className="text-3xl md:text-5xl font-bold leading-tight">
            "Empower businesses to operate professionally where their customers
            already are."
          </blockquote>
        </div>
      </section>

      {/* Section 4: Vision */}
      <section className="py-24 px-4 bg-gray-50 border-b border-gray-100">
        <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-16 items-center">
          <div>
            <h2 className="text-3xl font-bold mb-6 text-[#0F172A]">Vision</h2>
            <div className="space-y-6 text-[#64748B] text-lg">
              <p>
                We are playing a long game. We believe that the future of
                commerce is conversational, and the winners will be those who
                bridge the gap between human connection and digital efficiency.
              </p>
              <p>
                Our focus is on emerging markets—starting with Nigeria—where the
                entrepreneurial energy is boundless but the infrastructure is
                fragmented. We are building the durable rails that the next
                generation of giants will run on.
              </p>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-200 flex flex-col items-center text-center">
              <Globe className="text-[#22C55E] mb-4" size={40} />
              <div className="font-bold text-lg text-[#0F172A]">
                Pan-African
              </div>
            </div>
            <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-200 flex flex-col items-center text-center translate-y-8">
              <Zap className="text-blue-600 mb-4" size={40} />
              <div className="font-bold text-lg text-[#0F172A]">Real-Time</div>
            </div>
            <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-200 flex flex-col items-center text-center">
              <ShieldCheck className="text-purple-600 mb-4" size={40} />
              <div className="font-bold text-lg text-[#0F172A]">Trusted</div>
            </div>
            <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-200 flex flex-col items-center text-center translate-y-8">
              <Heart className="text-red-500 mb-4" size={40} />
              <div className="font-bold text-lg text-[#0F172A]">Human</div>
            </div>
          </div>
        </div>
      </section>

      {/* Section 5: Values */}
      <section className="py-24 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-[#0F172A]">Our Values</h2>
            <p className="text-[#64748B] mt-4">
              The principles that guide how we build.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Simplicity */}
            <div className="p-8 rounded-2xl bg-white border border-gray-100 hover:border-gray-200 transition-colors">
              <h3 className="text-xl font-bold mb-3 text-[#0F172A]">
                Simplicity
              </h3>
              <p className="text-[#64748B] leading-relaxed">
                We fight complexity. If a tool requires a manual to use, we've
                failed. We build for speed and clarity.
              </p>
            </div>

            {/* Trust */}
            <div className="p-8 rounded-2xl bg-white border border-gray-100 hover:border-gray-200 transition-colors">
              <h3 className="text-xl font-bold mb-3 text-[#0F172A]">Trust</h3>
              <p className="text-[#64748B] leading-relaxed">
                We handle people's livelihoods. We take security, uptime, and
                data privacy more seriously than anything else.
              </p>
            </div>

            {/* Ownership */}
            <div className="p-8 rounded-2xl bg-white border border-gray-100 hover:border-gray-200 transition-colors">
              <h3 className="text-xl font-bold mb-3 text-[#0F172A]">
                Ownership
              </h3>
              <p className="text-[#64748B] leading-relaxed">
                We don't say "that's not my job." We see problems, we own them,
                and we ship solutions.
              </p>
            </div>

            {/* Reliability */}
            <div className="p-8 rounded-2xl bg-white border border-gray-100 hover:border-gray-200 transition-colors md:col-start-1 md:translate-x-1/2">
              <h3 className="text-xl font-bold mb-3 text-[#0F172A]">
                Reliability
              </h3>
              <p className="text-[#64748B] leading-relaxed">
                Our code powers commerce. It must be robust, tested, and
                reliable. Downtime is not an option.
              </p>
            </div>

            {/* Customer Empathy */}
            <div className="p-8 rounded-2xl bg-white border border-gray-100 hover:border-gray-200 transition-colors md:col-start-2 md:translate-x-1/2">
              <h3 className="text-xl font-bold mb-3 text-[#0F172A]">
                Customer Empathy
              </h3>
              <p className="text-[#64748B] leading-relaxed">
                We are obsessed with our merchants. We listen to them, learn
                from theme, and build what they actually need.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Section 6: CTA */}
      <section className="py-20 px-4 text-center bg-green-50">
        <div className="max-w-2xl mx-auto">
          <h2 className="text-3xl font-bold text-[#0F172A] mb-6">
            Join the Journey
          </h2>
          <p className="text-[#64748B] mb-8 text-lg">
            We are just getting started. If you want to help build the future of
            commerce, we want to hear from you.
          </p>
          <Link href="/careers">
            <Button className="bg-[#22C55E] hover:bg-[#16A34A] text-white px-8 py-4 text-lg font-bold rounded-xl shadow-lg transition-all">
              View Open Roles
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
}
