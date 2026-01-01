"use client";

import React from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { getArticleBySlug } from "@/lib/help";
import { Button } from "@vayva/ui";

export default function HelpArticlePage() {
  const params = useParams();
  const router = useRouter();
  const slug = params?.slug as string;
  const article = getArticleBySlug(slug);

  if (!article) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            Article not found
          </h1>
          <Link href="/help">
            <Button>Back to Help Center</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white pt-32 pb-24 px-4">
      <div className="max-w-3xl mx-auto">
        <nav className="mb-8 flex items-center gap-2 text-sm text-gray-400 font-medium">
          <Link href="/help" className="hover:text-gray-900 transition-colors">
            Help Center
          </Link>
          <span>/</span>
          <span className="text-gray-900">{article.category}</span>
        </nav>

        <article className="prose prose-slate prose-lg max-w-none">
          <span className="inline-block px-3 py-1 rounded-full bg-green-50 text-[#22C55E] text-[10px] font-black uppercase mb-4 tracking-widest">
            {article.category}
          </span>
          <h1 className="text-4xl md:text-5xl font-black text-[#0F172A] mb-4 leading-tight">
            {article.title}
          </h1>
          <p className="text-xl text-gray-500 mb-12 font-medium leading-relaxed">
            {article.summary}
          </p>

          <div className="p-8 bg-gray-50 rounded-3xl border border-gray-100 text-gray-700 leading-relaxed space-y-6">
            {/* 
                          In a real app, this would use a markdown renderer like react-markdown.
                          For now, we'll split by double newline to simulate paragraphs/headers.
                        */}
            {article.content.split("\n").map((line, i) => {
              if (line.trim().startsWith("###")) {
                return (
                  <h3
                    key={i}
                    className="text-2xl font-bold text-gray-900 mt-8 mb-4"
                  >
                    {line.replace("###", "").trim()}
                  </h3>
                );
              }
              if (line.trim().startsWith("1.") || line.trim().startsWith("-")) {
                return (
                  <li key={i} className="ml-4 mb-2">
                    {line
                      .trim()
                      .replace(/^[0-9\.-]+/, "")
                      .trim()}
                  </li>
                );
              }
              if (line.trim() === "") return null;
              return <p key={i}>{line.trim()}</p>;
            })}
          </div>
        </article>

        <div className="mt-16 pt-12 border-t border-gray-100 flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="text-sm text-gray-400">
            Last updated: <strong>{article.lastUpdated}</strong>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-sm font-bold text-gray-900">
              Was this helpful?
            </span>
            <div className="flex gap-2">
              <button className="px-4 py-2 rounded-lg border border-gray-200 hover:bg-green-50 hover:border-green-200 hover:text-green-600 transition-all text-sm font-bold">
                Yes
              </button>
              <button className="px-4 py-2 rounded-lg border border-gray-200 hover:bg-red-50 hover:border-red-200 hover:text-red-600 transition-all text-sm font-bold">
                No
              </button>
            </div>
          </div>
        </div>

        {/* Sticky Contact Bar */}
        <div className="mt-24 p-8 bg-green-50 rounded-3xl border border-green-100 flex flex-col md:flex-row items-center justify-between gap-6">
          <div>
            <h4 className="font-bold text-green-900">Still Stuck?</h4>
            <p className="text-sm text-green-700">
              Get in touch with an expert who can walk you through it.
            </p>
          </div>
          <a
            href="mailto:support@vayva.io"
            className="px-6 py-3 bg-[#22C55E] text-white font-bold rounded-xl shadow-lg transition-all hover:scale-105"
          >
            Talk to Support
          </a>
        </div>
      </div>
    </div>
  );
}
