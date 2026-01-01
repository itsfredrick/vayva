import React from "react";
import Link from "next/link";
import { Button } from "@vayva/ui";
import { Calendar, User, ArrowRight, Search } from "lucide-react";

export const metadata = {
  title: "Vayva Blog | Commerce, WhatsApp & Growth",
  description:
    "Insights on WhatsApp commerce, product development, and business growth from the Vayva team.",
};

export default function BlogPage() {
  return (
    <div className="min-h-screen bg-white text-[#0F172A]">
      {/* Section 1: Hero */}
      <section className="py-20 px-4 bg-gray-50 border-b border-gray-100">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-6 tracking-tight">
            Insights on Commerce,
            <br />
            <span className="text-[#22C55E]">WhatsApp & Growth</span>
          </h1>
          <p className="text-xl text-[#64748B] mb-8 max-w-2xl mx-auto">
            Stories from the frontlines of African commerce. Engineering deep
            dives, product updates, and merchant success stories.
          </p>

          {/* Search Bar Placeholder */}
          <div className="max-w-md mx-auto relative">
            <input
              type="text"
              placeholder="Search articles..."
              className="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-500 transition-all"
              disabled
            />
            <Search
              className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
              size={20}
            />
          </div>
        </div>
      </section>

      {/* Section 2: Categories */}
      <section className="py-8 px-4 border-b border-gray-100 flex justify-center sticky top-0 bg-white/80 backdrop-blur z-10">
        <div className="flex gap-2 overflow-x-auto pb-2 md:pb-0 hide-scrollbar justify-start md:justify-center w-full max-w-4xl">
          {[
            "All",
            "Product",
            "Engineering",
            "Business",
            "Customer Stories",
            "Announcements",
          ].map((cat, i) => (
            <button
              key={cat}
              className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${i === 0 ? "bg-[#0F172A] text-white" : "bg-gray-50 text-gray-600 hover:bg-gray-100"}`}
            >
              {cat}
            </button>
          ))}
        </div>
      </section>

      {/* Section 3: Empty State */}
      <section className="py-32 px-4 text-center">
        <div className="max-w-md mx-auto">
          <div className="w-24 h-24 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-6">
            <Calendar className="text-gray-300" size={40} />
          </div>
          <h2 className="text-2xl font-bold text-[#0F172A] mb-2">
            No articles yet.
          </h2>
          <p className="text-[#64748B] mb-8">
            We are busy building the product. Check back soon for deep dives
            into our architecture and market insights.
          </p>
        </div>
      </section>

      {/* Section 4: Article Skeleton (Visual Only - For Layout Validation) */}
      <section
        className="py-20 px-4 bg-gray-50 opacity-50 grayscale pointer-events-none select-none"
        aria-hidden="true"
      >
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <span className="text-xs uppercase tracking-widest font-bold text-gray-400">
              Coming Soon Layout Preview
            </span>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100"
              >
                <div className="aspect-video bg-gray-200"></div>
                <div className="p-6">
                  <div className="flex items-center gap-2 text-xs text-gray-500 mb-3">
                    <span className="font-bold text-[#22C55E]">
                      ENGINEERING
                    </span>
                    <span>•</span>
                    <span>Feb 28, 2025</span>
                  </div>
                  <h3 className="font-bold text-lg mb-3 leading-tight">
                    Scaling WebSocket Connections for 1M+ Concurrent Users
                  </h3>
                  <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                    How we rewrote our real-time engine to handle massive spikes
                    in WhatsApp traffic during Black Friday.
                  </p>
                  <div className="flex items-center gap-2 text-sm font-medium text-[#0F172A]">
                    Read Article <ArrowRight size={16} />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
