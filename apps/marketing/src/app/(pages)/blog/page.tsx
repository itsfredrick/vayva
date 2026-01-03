import React from "react";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@vayva/ui";
import { ArrowRight, Calendar, User, Tag } from "lucide-react";
import { APP_URL } from "@/lib/constants";

export const metadata = {
  title: "Blog | Vayva - Business Growth & WhatsApp Tips",
  description: "Expert advice, success stories, and updates for Nigerian businesses running on WhatsApp.",
};

const POSTS = [
  {
    id: 1,
    title: "How to Automate WhatsApp Sales Without Losing the Personal Touch",
    excerpt: "Learn the balance between AI automation and human connection to maximize your conversion rates.",
    category: "Guides",
    author: "Tola Adesina",
    date: "Dec 28, 2025",
    image: "/images/step-1-whatsapp.png",
    slug: "automate-whatsapp-sales",
  },
  {
    id: 2,
    title: "5 Nigerian Brands That Scaled to ₦10M/Month on WhatsApp",
    excerpt: "Case studies of local fashion and food businesses that transformed their operations with Vayva.",
    category: "Success Stories",
    author: "Chidi Nwafor",
    date: "Dec 20, 2025",
    image: "/images/calm-solution.jpg",
    slug: "nigerian-brands-scale",
  },
  {
    id: 3,
    title: "Understanding the New CBN KYC Requirements for Online Sellers",
    excerpt: "What the recent regulations mean for your social commerce business and how to stay compliant.",
    category: "Regulation",
    author: "Vayva Legal",
    date: "Dec 15, 2025",
    image: "/images/chaos-problem.jpg",
    slug: "cbn-kyc-requirements",
  },
];

export default function BlogPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <section className="bg-gray-50 py-20 px-4 border-b border-gray-100">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            The Vayva Blog
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Insights, updates, and strategies to help you build a better business on WhatsApp.
          </p>
        </div>
      </section>

      {/* Featured Post (Simulator) */}
      <section className="py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12 items-center mb-24">
            <div className="relative aspect-video bg-gray-200 rounded-3xl overflow-hidden shadow-lg border border-gray-100">
              {/* Placeholder for featured image since we might not have it yet */}
              <div className="absolute inset-0 flex items-center justify-center bg-gray-100 text-gray-400">
                <span className="font-bold">Featured Image</span>
              </div>
            </div>
            <div>
              <div className="flex items-center gap-4 text-sm mb-4">
                <span className="bg-[#22C55E]/10 text-[#22C55E] px-3 py-1 rounded-full font-bold uppercase tracking-wide">
                  Product Update
                </span>
                <span className="text-gray-500 flex items-center gap-1">
                  <Calendar size={14} /> Jan 2, 2026
                </span>
              </div>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6 leading-tight">
                Introducing Vayva AI: Your 24/7 Sales Assistant
              </h2>
              <p className="text-gray-600 text-lg mb-8 leading-relaxed">
                We've rebuilt our core engine to understand Nigerian slang, handle complex orders, and automatically reconcile payments. See what's new in v2.0.
              </p>
              <Link href={`${APP_URL}/signup`}>
                <Button className="bg-gray-900 text-white px-6 py-3 rounded-xl hover:bg-black transition-all">
                  Read the Announcement
                </Button>
              </Link>
            </div>
          </div>

          {/* Post Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {POSTS.map((post) => (
              <article
                key={post.id}
                className="group flex flex-col bg-white border border-gray-100 rounded-2xl overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
              >
                <div className="aspect-[1.6] bg-gray-100 relative overflow-hidden">
                  {/* Placeholder */}
                  <div className="absolute inset-0 bg-gray-100 flex items-center justify-center text-gray-400 text-sm font-medium group-hover:bg-gray-200 transition-colors">
                    {post.category} Image
                  </div>
                </div>
                <div className="p-6 flex flex-col flex-1">
                  <div className="flex items-center justify-between text-xs text-gray-500 mb-4 font-medium uppercase tracking-wide">
                    <div className="flex items-center gap-1.5 text-[#22C55E]">
                      <Tag size={12} />
                      {post.category}
                    </div>
                    <span>{post.date}</span>
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-[#22C55E] transition-colors leading-tight">
                    {post.title}
                  </h3>
                  <p className="text-gray-600 text-sm leading-relaxed mb-6 flex-1">
                    {post.excerpt}
                  </p>
                  <div className="flex items-center justify-between mt-auto pt-6 border-t border-gray-50">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center text-gray-400">
                        <User size={14} />
                      </div>
                      <span className="text-xs font-bold text-gray-900">{post.author}</span>
                    </div>
                    <span className="text-[#22C55E] text-sm font-bold flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                      Read
                      <ArrowRight size={16} />
                    </span>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Newsletter */}
      <section className="py-24 px-4 bg-[#0F172A] text-white">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-6">
            Get business tips delivered to your WhatsApp
          </h2>
          <p className="text-gray-400 mb-8 text-lg">
            Join 5,000+ merchants receiving weekly growth strategies.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center max-w-md mx-auto">
            <input type="email" placeholder="Enter your email address" className="bg-white/10 border border-white/20 rounded-xl px-5 py-3 text-white placeholder:text-gray-500 focus:outline-none focus:border-[#22C55E] flex-1" />
            <Button className="bg-[#22C55E] hover:bg-[#16A34A] text-white rounded-xl px-8">
              Subscribe
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
