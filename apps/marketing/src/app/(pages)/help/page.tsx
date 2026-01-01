"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Sparkles } from "lucide-react";
import { HELP_ARTICLES, HelpArticle } from "@/lib/help";

import { HelpAIChat } from "@/components/marketing/HelpAIChat";

export default function HelpCenterPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [isAiOpen, setIsAiOpen] = useState(false);

  const filteredArticles = HELP_ARTICLES.filter(
    (a: HelpArticle) =>
      a.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      a.summary.toLowerCase().includes(searchQuery.toLowerCase()) ||
      a.category.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  const categories = Array.from(new Set(HELP_ARTICLES.map((a: HelpArticle) => a.category)));

  return (
    <div className="min-h-screen bg-white pt-32 pb-24 px-4 overflow-hidden">
      <div className="max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-[1fr_400px] gap-12 items-start">
          {/* Left Column: Existing Help Content */}
          <div className="space-y-16">
            {/* Search Header */}
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-green-50 border border-green-100 mb-6 animate-pulse-green">
                <span className="w-2 h-2 bg-[#22C55E] rounded-full" />
                <span className="text-xs font-bold text-[#16A34A] uppercase tracking-wider">
                  NEW: Ask Vayva AI
                </span>
              </div>
              <h1 className="text-5xl font-bold text-[#0F172A] mb-8 tracking-tight">
                Help Center
              </h1>
              <div className="relative max-w-2xl">
                <input
                  type="text"
                  placeholder="Search for articles, features, or guides..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full px-6 py-5 rounded-2xl border border-gray-200 shadow-sm focus:ring-2 focus:ring-[#22C55E] focus:border-transparent outline-none text-lg transition-all bg-gray-50/50"
                />
                <div className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400">
                  <svg
                    className="w-6 h-6"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                    />
                  </svg>
                </div>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
              {categories.map((cat: any) => (
                <div key={cat as string} className="space-y-4">
                  <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest px-2">
                    {cat as string}
                  </h3>
                  <div className="space-y-3">
                    {HELP_ARTICLES.filter((a: HelpArticle) => a.category === cat).map(
                      (article: HelpArticle) => (
                        <Link
                          key={article.id}
                          href={`/help/${article.slug}`}
                          className="block p-5 bg-white rounded-2xl border border-gray-200 hover:border-[#22C55E] hover:shadow-lg transition-all group relative overflow-hidden"
                        >
                          <div className="absolute top-0 right-0 w-16 h-16 bg-green-50 group-hover:bg-green-100 transition-colors -mr-8 -mt-8 rounded-full blur-2xl" />
                          <h4 className="font-bold text-[#0F172A] group-hover:text-[#22C55E] transition-colors relative z-10">
                            {article.title}
                          </h4>
                          <p className="text-sm text-gray-500 mt-2 line-clamp-2 relative z-10">
                            {article.summary}
                          </p>
                        </Link>
                      ),
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* Delivery Option UX Callout */}
            <div className="p-8 bg-green-50 rounded-3xl border border-green-100">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-[#22C55E] rounded-2xl flex items-center justify-center shrink-0">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-xl font-bold text-[#0F172A]">Flexible Delivery Options</h3>
                  <p className="text-gray-600 mt-2 mb-4">
                    Vayva gives you the freedom to choose your logistics partner.
                    Use our integrated **Kwik Delivery** partner for automatic dispatch,
                    or manage your own **Local Riders** easily.
                  </p>
                  <Link
                    href="/help/delivery-options"
                    className="text-[#22C55E] font-bold hover:underline inline-flex items-center gap-1"
                  >
                    Compare options &rarr;
                  </Link>
                </div>
              </div>
            </div>

            {/* Contact Routing */}
            <div className="p-12 bg-[#0F172A] rounded-3xl text-center relative overflow-hidden">
              <div className="absolute top-0 right-0 w-64 h-64 bg-green-500/10 blur-[80px] rounded-full" />
              <h2 className="text-3xl font-bold text-white mb-4 relative z-10">
                Can't find what you need?
              </h2>
              <p className="text-gray-400 mb-8 max-w-lg mx-auto relative z-10">
                Our support team is available 9am - 8pm WAT for live chat and
                technical assistance.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center relative z-10">
                <a
                  href="mailto:support@vayva.ng"
                  className="px-8 py-4 bg-[#22C55E] hover:bg-[#16A34A] text-white font-bold rounded-xl shadow-lg transition-all"
                >
                  Email Support
                </a>
                <Link
                  href="/contact"
                  className="px-8 py-4 bg-white/10 hover:bg-white/20 text-white font-bold rounded-xl backdrop-blur-sm transition-all"
                >
                  Open a Ticket
                </Link>
              </div>
            </div>
          </div>

          {/* Right Column: AI Chat Panel */}
          <div className="hidden lg:block">
            <HelpAIChat />
          </div>

          {/* Mobile AI Toggle */}
          <div className="lg:hidden fixed bottom-6 right-6 z-50">
            <button
              onClick={() => setIsAiOpen(!isAiOpen)}
              className="w-16 h-16 bg-[#22C55E] text-white rounded-full shadow-2xl flex items-center justify-center hover:scale-110 transition-transform"
            >
              {isAiOpen ? (
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                <Sparkles className="w-8 h-8" />
              )}
            </button>
          </div>

          {/* Mobile AI Modal Overlay */}
          {isAiOpen && (
            <div className="lg:hidden fixed inset-0 z-[60] pt-20 px-4 bg-white/90 backdrop-blur-sm">
              <div className="max-w-md mx-auto h-[80vh]">
                <HelpAIChat />
                <button
                  onClick={() => setIsAiOpen(false)}
                  className="w-full mt-4 py-3 text-gray-500 font-medium"
                >
                  Close Assistant
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
