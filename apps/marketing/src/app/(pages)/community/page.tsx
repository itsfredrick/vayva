import React from "react";
import Link from "next/link";
import { Button } from "@vayva/ui";
import {
  Users,
  MessageCircle,
  BookOpen,
  Calendar,
  ShieldAlert,
  ArrowRight,
} from "lucide-react";

export const metadata = {
  title: "Vayva Community | Learn, Build, Grow Together",
  description:
    "Join the Vayva community to connect with sellers, builders, and partners shaping the future of commerce.",
};

export default function CommunityPage() {
  return (
    <div className="min-h-screen bg-white text-[#0F172A]">
      {/* Section 1: Hero */}
      <section className="pt-24 pb-20 px-4 text-center bg-gradient-to-b from-green-50 to-white">
        <div className="max-w-4xl mx-auto">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-white rounded-2xl shadow-sm text-[#22C55E] mb-6">
            <Users size={32} />
          </div>
          <h1 className="text-4xl md:text-6xl font-bold mb-6 tracking-tight">
            Learn, Build, and Grow
            <br />
            <span className="text-[#22C55E]">Together</span>
          </h1>
          <p className="text-xl text-[#64748B] max-w-2xl mx-auto mb-10 leading-relaxed">
            Commerce is a team sport. Join thousands of merchants, developers,
            and partners who are building their businesses on Vayva.
          </p>
          <div className="flex justify-center gap-4">
            <Button className="bg-[#22C55E] hover:bg-[#16A34A] text-white px-8 py-4 text-lg font-bold rounded-xl shadow-lg transition-all">
              Join Community
            </Button>
          </div>
        </div>
      </section>

      {/* Section 2: Why Join */}
      <section className="py-24 px-4">
        <div className="max-w-6xl mx-auto text-center mb-16">
          <h2 className="text-3xl font-bold mb-4">
            Why fit in when we can grow together?
          </h2>
          <p className="text-[#64748B]">
            Here is what makes our community special.
          </p>
        </div>

        <div className="max-w-6xl mx-auto grid md:grid-cols-3 gap-8">
          <div className="p-8 rounded-2xl bg-white border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
            <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center mb-6">
              <BookOpen size={24} />
            </div>
            <h3 className="text-xl font-bold mb-3">Shared Learning</h3>
            <p className="text-[#64748B] leading-relaxed">
              Get access to playbooks, guides, and case studies from merchants
              who have scaled from 0 to 1,000 orders.
            </p>
          </div>

          <div className="p-8 rounded-2xl bg-white border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
            <div className="w-12 h-12 bg-purple-50 text-purple-600 rounded-xl flex items-center justify-center mb-6">
              <MessageCircle size={24} />
            </div>
            <h3 className="text-xl font-bold mb-3">Direct Support</h3>
            <p className="text-[#64748B] leading-relaxed">
              Don't get stuck. Ask questions and get answers from the community
              and the Vayva product team directly.
            </p>
          </div>

          <div className="p-8 rounded-2xl bg-white border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
            <div className="w-12 h-12 bg-orange-50 text-orange-600 rounded-xl flex items-center justify-center mb-6">
              <Calendar size={24} />
            </div>
            <h3 className="text-xl font-bold mb-3">Exclusive Events</h3>
            <p className="text-[#64748B] leading-relaxed">
              Get early invites to webinars, masterclasses, and local meetups in
              your city.
            </p>
          </div>
        </div>
      </section>

      {/* Section 3: Channels */}
      <section className="py-24 px-4 bg-gray-50">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">
            Ways to Connect
          </h2>
          <div className="grid gap-4">
            <div className="bg-white p-6 rounded-xl border border-gray-200 flex flex-col md:flex-row items-center gap-6">
              <div className="w-16 h-16 bg-[#25D366]/10 text-[#25D366] rounded-full flex items-center justify-center shrink-0">
                <MessageCircle size={32} />
              </div>
              <div className="flex-1 text-center md:text-left">
                <h3 className="text-lg font-bold">The Vayva Merchant Group</h3>
                <p className="text-gray-600 text-sm">
                  Official WhatsApp community for verified merchants. Signal, no
                  noise.
                </p>
              </div>
              <Button variant="outline" className="shrink-0">
                Request Access
              </Button>
            </div>

            <div className="bg-white p-6 rounded-xl border border-gray-200 flex flex-col md:flex-row items-center gap-6">
              <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center shrink-0">
                <Users size={32} />
              </div>
              <div className="flex-1 text-center md:text-left">
                <h3 className="text-lg font-bold">Vayva Developer Hub</h3>
                <p className="text-gray-600 text-sm">
                  For partners and developers building on our APIs.
                </p>
              </div>
              <Button variant="outline" className="shrink-0">
                Join Discord
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Section 4: Code of Conduct */}
      <section className="py-20 px-4">
        <div className="max-w-3xl mx-auto bg-amber-50 border-l-4 border-amber-400 p-8 rounded-r-xl">
          <div className="flex items-start gap-4">
            <ShieldAlert className="text-amber-600 shrink-0 mt-1" />
            <div>
              <h3 className="text-xl font-bold text-amber-900 mb-2">
                Community Guidelines
              </h3>
              <div className="space-y-4 text-amber-800/80">
                <p>
                  We are building a professional ecosystem. To keep this space
                  valuable for everyone:
                </p>
                <ul className="list-disc pl-5 space-y-2">
                  <li>
                    <strong>Respect:</strong> Treat everyone with dignity. Zero
                    tolerance for harassment.
                  </li>
                  <li>
                    <strong>No Spam:</strong> Do not use these channels endless
                    self-promotion.
                  </li>
                  <li>
                    <strong>Professionalism:</strong> Keep conversations
                    constructive and focused on growth.
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Section 5: CTA */}
      <section className="py-20 px-4 text-center">
        <h2 className="text-3xl font-bold text-[#0F172A] mb-8">
          Ready to grow?
        </h2>
        <Button className="bg-[#22C55E] hover:bg-[#16A34A] text-white px-10 py-5 text-lg font-bold rounded-xl shadow-xl shadow-green-100 transition-all inline-flex items-center gap-2">
          Join the Community <ArrowRight size={20} />
        </Button>
      </section>
    </div>
  );
}
