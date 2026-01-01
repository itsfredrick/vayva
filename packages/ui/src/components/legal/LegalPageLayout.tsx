"use client";

import React, { useState, useEffect } from "react";
import { cn } from "../../utils";
import { Icon } from "../Icon";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";

interface LegalPageLayoutProps {
  children: React.ReactNode;
  title: string;
  summary?: string;
  lastUpdated?: string;
  backLink?: {
    href: string;
    label: string;
  };
  toc?: { id: string; label: string }[];
}

export const LegalPageLayout: React.FC<LegalPageLayoutProps> = ({
  children,
  title,
  summary,
  lastUpdated,
  backLink,
  toc = [],
}) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState<string>("");

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id);
          }
        });
      },
      { rootMargin: "-10% 0% -80% 0%" },
    );

    toc.forEach((item) => {
      const el = document.getElementById(item.id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, [toc]);

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      const offset = 100; // Adjustment for sticky header
      const bodyRect = document.body.getBoundingClientRect().top;
      const elementRect = element.getBoundingClientRect().top;
      const elementPosition = elementRect - bodyRect;
      const offsetPosition = elementPosition - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth",
      });
      setIsMobileMenuOpen(false);
    }
  };

  return (
    <div className="bg-white min-h-screen">
      {/* Top Navigation / Back Link */}
      <div className="max-w-[1280px] mx-auto px-6 pt-12 print:hidden">
        {backLink && (
          // @ts-ignore
          <Link
            href={backLink.href}
            className="inline-flex items-center gap-2 text-sm text-gray-400 hover:text-black transition-colors group mb-8"
          >
            <Icon
              name="ArrowLeft"
              size={16}
              className="group-hover:-translate-x-1 transition-transform"
            />
            {backLink.label}
          </Link>
        )}
      </div>

      <div className="max-w-[1280px] mx-auto px-6 pb-24 lg:flex lg:gap-20 items-start">
        {/* Sidebar TOC - Desktop */}
        <aside className="hidden lg:block w-[280px] sticky top-24 shrink-0 overflow-y-auto max-h-[calc(100vh-120px)] print:hidden">
          <div className="border-l border-gray-100 pl-6 space-y-2">
            <h4 className="text-[10px] font-bold uppercase tracking-[0.2em] text-gray-400 mb-6">
              ON THIS PAGE
            </h4>
            {toc.map((item) => (
              <button
                key={item.id}
                onClick={() => scrollToSection(item.id)}
                className={cn(
                  "block w-full text-left text-sm py-2 transition-all duration-300",
                  activeSection === item.id
                    ? "text-black font-bold pl-1 translate-x-1"
                    : "text-gray-400 hover:text-gray-600 pl-0",
                )}
              >
                {item.label}
              </button>
            ))}
          </div>

          <div className="mt-12 pt-12 border-t border-gray-100 flex flex-col gap-4">
            <button
              onClick={() => window.print()}
              className="flex items-center gap-3 text-sm text-gray-500 hover:text-black transition-colors"
            >
              <Icon name="Printer" size={16} />
              Print this page
            </button>
            <div className="flex items-center gap-3 text-sm text-gray-300 cursor-not-allowed group relative">
              <Icon name="Download" size={16} />
              <span>Download PDF</span>
              <div className="absolute left-0 -top-8 bg-black text-white text-[10px] px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                Coming soon
              </div>
            </div>
          </div>
        </aside>

        {/* Main Content Area */}
        <main className="flex-1 max-w-[850px]">
          <header className="mb-20">
            {lastUpdated && (
              <div className="inline-block px-3 py-1 bg-gray-50 rounded-full text-[10px] font-bold text-gray-400 mb-6 uppercase tracking-wider">
                Last Updated: {lastUpdated}
              </div>
            )}
            <h1
              className="text-5xl md:text-6xl font-bold text-[#0B0B0B] mb-8 tracking-tight"
              style={{ fontFamily: "Space Grotesk, sans-serif" }}
            >
              {title}
            </h1>
            {summary && (
              <p className="text-xl text-gray-500 leading-relaxed font-medium">
                {summary}
              </p>
            )}
          </header>

          {/* Mobile TOC Accordion */}
          <div className="lg:hidden mb-12 print:hidden">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="w-full flex items-center justify-between p-4 bg-gray-50 rounded-xl border border-gray-100"
            >
              <span className="text-sm font-bold">Table of Contents</span>
              <Icon
                name={isMobileMenuOpen ? "ChevronUp" : "ChevronDown"}
                size={18}
              />
            </button>
            <AnimatePresence>
              {isMobileMenuOpen && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="overflow-hidden bg-gray-50 border-x border-b border-gray-100 rounded-b-xl"
                >
                  <div className="p-4 flex flex-col gap-3">
                    {toc.map((item) => (
                      <button
                        key={item.id}
                        onClick={() => scrollToSection(item.id)}
                        className={cn(
                          "text-left text-sm py-1 transition-colors",
                          activeSection === item.id
                            ? "text-black font-bold"
                            : "text-gray-500",
                        )}
                      >
                        {item.label}
                      </button>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <div className="legal-content-body print:text-black print:p-0">
            {children}
          </div>

          <footer className="mt-32 pt-12 border-t border-gray-100 print:hidden text-center md:text-left">
            <p className="text-sm text-gray-400">
              Looking for something else? Visit our
              {/* @ts-ignore */}
              <Link href="/legal" className="text-black font-bold underline">
                Legal Hub
              </Link>
              .
            </p>
          </footer>
        </main>
      </div>

      {/* Print Styles */}
      {/* @ts-ignore */}
      <style jsx global>{`
        @media print {
          .print\\:hidden {
            display: none !important;
          }
          body {
            background: white !important;
            font-size: 12pt !important;
          }
          main {
            max-width: 100% !important;
            border: none !important;
            margin: 0 !important;
            padding: 0 !important;
          }
          .legal-content-body h2 {
            page-break-after: avoid;
          }
          .legal-content-body p,
          .legal-content-body li {
            page-break-inside: avoid;
          }
        }
      `}</style>
    </div>
  );
};
