import React from "react";
import Link from "next/link";
import { Button } from "@vayva/ui";
import {
  Briefcase,
  Code2,
  HeartHandshake,
  Lightbulb,
  ArrowRight,
  Users,
} from "lucide-react";

export const metadata = {
  title: "Careers at Vayva | Build the Future of Commerce",
  description:
    "Join Vayva and help build the infrastructure powering modern commerce for businesses across emerging markets.",
};

export default function CareersPage() {
  return (
    <div className="min-h-screen bg-white text-[#0F172A]">
      {/* Section 1: Hero */}
      <section className="pt-24 pb-16 px-4 text-center bg-[#0F172A] text-white">
        <div className="max-w-4xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-green-400 text-xs font-bold uppercase tracking-wider mb-6">
            We are hiring builders
          </div>
          <h1 className="text-4xl md:text-6xl font-bold mb-6 tracking-tight">
            Build Products That
            <br />
            Power <span className="text-[#22C55E]">Real Businesses</span>
          </h1>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto leading-relaxed">
            Join a team obsessed with solving hard problems for millions of
            merchants. No ego, no politics, just impact.
          </p>
        </div>
      </section>

      {/* Section 2: Culture */}
      <section className="py-24 px-4 bg-white">
        <div className="max-w-6xl mx-auto grid md:grid-cols-3 gap-12">
          <div className="space-y-4">
            <div className="w-12 h-12 bg-green-50 rounded-xl flex items-center justify-center text-[#22C55E] mb-2">
              <Lightbulb size={24} />
            </div>
            <h3 className="text-xl font-bold">Ownership Mindset</h3>
            <p className="text-[#64748B] leading-relaxed">
              We don't micromanage. We hire smart people and give them the
              autonomy to make decisions and drive results. Use your judgment.
            </p>
          </div>
          <div className="space-y-4">
            <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center text-blue-600 mb-2">
              <Users size={24} />
            </div>
            <h3 className="text-xl font-bold">Small, Focused Teams</h3>
            <p className="text-[#64748B] leading-relaxed">
              We believe small teams move faster. You won't be a cog in a
              machine. Your work will directly impact the product and the user.
            </p>
          </div>
          <div className="space-y-4">
            <div className="w-12 h-12 bg-purple-50 rounded-xl flex items-center justify-center text-purple-600 mb-2">
              <Code2 size={24} />
            </div>
            <h3 className="text-xl font-bold">Clarity Over Speed</h3>
            <p className="text-[#64748B] leading-relaxed">
              While we move fast, we don't break things that matter. We value
              clear thinking, clean code, and sustainable architecture.
            </p>
          </div>
        </div>
      </section>

      {/* Section 3: What It's Like */}
      <section className="py-24 px-4 bg-gray-50 border-y border-gray-100">
        <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-16 items-center">
          <div>
            <h2 className="text-3xl font-bold mb-6">
              Work that actually matters.
            </h2>
            <div className="space-y-6 text-lg text-[#64748B]">
              <p>
                At Vayva, you aren't optimizing ad click-through rates. You are
                building tools that help a mother in Lagos pay her children's
                school fees, or a young graduate start their first business.
              </p>
              <p>
                The problems we solve—payments, logistics, trust—are hard. But
                solving them unlocks massive economic potential. That's why we
                wake up every day.
              </p>
            </div>
            <div className="mt-8 grid grid-cols-2 gap-8">
              <div>
                <div className="text-3xl font-bold text-[#0F172A] mb-1">
                  100%
                </div>
                <div className="text-sm text-gray-500 uppercase tracking-widest">
                  Remote Friendly
                </div>
              </div>
              <div>
                <div className="text-3xl font-bold text-[#0F172A] mb-1">
                  Day 1
                </div>
                <div className="text-sm text-gray-500 uppercase tracking-widest">
                  Health Coverage
                </div>
              </div>
            </div>
          </div>
          <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-200">
            <div className="flex items-start gap-4 mb-6">
              <div className="w-10 h-10 rounded-full bg-gray-200 shrink-0" />
              <div>
                <div className="font-bold text-[#0F172A]">Chinedu O.</div>
                <div className="text-sm text-gray-500">Backend Engineer</div>
              </div>
            </div>
            <p className="text-gray-600 italic leading-relaxed">
              "The best part about Vayva is the trust. I deployed a major
              payment feature in my second week. If you want responsibility,
              this is the place."
            </p>
          </div>
        </div>
      </section>

      {/* Section 4: Open Roles (Empty State) */}
      <section className="py-24 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-12">Open Positions</h2>

          <div className="bg-white border-2 border-dashed border-gray-200 rounded-2xl p-16 flex flex-col items-center justify-center">
            <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center text-gray-400 mb-6">
              <Briefcase size={32} />
            </div>
            <h3 className="text-xl font-bold text-[#0F172A] mb-2">
              We don't have open roles right now.
            </h3>
            <p className="text-[#64748B] max-w-md mx-auto mb-8">
              However, we are always looking for exceptional engineers and
              product thinkers. If you believe you can help us, don't wait for a
              job post.
            </p>
            <a href="mailto:careers@vayva.io">
              <Button
                variant="outline"
                className="border-gray-200 text-[#0F172A]"
              >
                Send Speculative Application
              </Button>
            </a>
          </div>
        </div>
      </section>

      {/* Section 5: Hiring Process */}
      <section className="py-24 px-4 bg-gray-50">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl font-bold text-center mb-16">
            Our Hiring Process
          </h2>
          <div className="grid md:grid-cols-3 gap-8 relative">
            {/* Connecting Line */}
            <div className="hidden md:block absolute top-8 left-0 right-0 h-0.5 bg-gray-200 z-0 -translate-y-1/2" />

            <div className="relative z-10 text-center">
              <div className="w-16 h-16 mx-auto bg-white border-4 border-gray-50 rounded-full flex items-center justify-center font-bold text-xl text-[#0F172A] mb-6 shadow-sm">
                1
              </div>
              <h3 className="font-bold text-lg mb-2">The Chat</h3>
              <p className="text-sm text-[#64748B]">
                A casual 30-min call to see if our values align and if the role
                fits your goals.
              </p>
            </div>
            <div className="relative z-10 text-center">
              <div className="w-16 h-16 mx-auto bg-white border-4 border-gray-50 rounded-full flex items-center justify-center font-bold text-xl text-[#0F172A] mb-6 shadow-sm">
                2
              </div>
              <h3 className="font-bold text-lg mb-2">The Work</h3>
              <p className="text-sm text-[#64748B]">
                We discuss real problems. No whiteboard riddles. Sometimes a
                small paid project.
              </p>
            </div>
            <div className="relative z-10 text-center">
              <div className="w-16 h-16 mx-auto bg-white border-4 border-gray-50 rounded-full flex items-center justify-center font-bold text-xl text-[#0F172A] mb-6 shadow-sm">
                3
              </div>
              <h3 className="font-bold text-lg mb-2">The Decision</h3>
              <p className="text-sm text-[#64748B]">
                We move fast. You'll get a clear offer or helpful feedback
                within 48 hours.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Section 6: Equal Opportunity */}
      <section className="py-12 px-4 border-t border-gray-100">
        <div className="max-w-4xl mx-auto text-center text-sm text-gray-500 max-w-2xl">
          <p>
            Vayva is an equal opportunity employer. We celebrate diversity and
            are committed to creating an inclusive environment for all
            employees. All hiring is based on merit, competence, performance,
            and business needs.
          </p>
        </div>
      </section>
    </div>
  );
}
