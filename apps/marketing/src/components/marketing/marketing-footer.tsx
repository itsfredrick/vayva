"use client";

import React from "react";
import { Button, cn } from "@vayva/ui";
import Link from "next/link";

export function MarketingFooter() {
  return (
    <footer className="bg-white text-[#0F172A] border-t border-slate-100">
      {/* Main Navigation Grid - Compact */}
      <div className="max-w-7xl mx-auto px-6 py-16">
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-12">
          {/* Column 1 - Brand Summary */}
          <div className="col-span-2 md:col-span-1">
            <div className="mb-4">
              <Link href="/" className="inline-block hover:opacity-80 transition-opacity">
                <span className="text-xl font-bold text-[#0F172A] tracking-tighter">Vayva</span>
              </Link>
            </div>
            <p className="text-xs text-slate-500 leading-relaxed font-medium max-w-[200px]">
              The operating system for commerce on WhatsApp. Turning conversations into reliable business records.
            </p>
          </div>

          {/* Nav Column: Product */}
          <div className="space-y-6">
            <h4 className="text-[10px] font-black text-[#0F172A] uppercase tracking-[0.2em]">Product</h4>
            <ul className="space-y-3">
              {[
                { label: "How Vayva Works", href: "/how-it-works" },
                { label: "Pricing Plans", href: "/pricing" },
                { label: "Store Builder", href: "/store-builder" },
                { label: "Marketplace", href: "/marketplace" }
              ].map((link) => (
                <li key={link.label}>
                  <Link href={link.href} className="text-xs font-semibold text-slate-500 hover:text-[#22C55E] transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Nav Column: Company */}
          <div className="space-y-6">
            <h4 className="text-[10px] font-black text-[#0F172A] uppercase tracking-[0.2em]">Company</h4>
            <ul className="space-y-3">
              {[
                { label: "About Vayva", href: "/about" },
                { label: "Our Blog", href: "/blog" },
                { label: "Contact Us", href: "/contact" }
              ].map((link) => (
                <li key={link.label}>
                  <Link href={link.href} className="text-xs font-semibold text-slate-500 hover:text-[#22C55E] transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Nav Column: Resources */}
          <div className="space-y-6">
            <h4 className="text-[10px] font-black text-[#0F172A] uppercase tracking-[0.2em]">Resources</h4>
            <ul className="space-y-3">
              {[
                { label: "Help Center", href: "/help" },
                { label: "System Status", href: "/system-status" },
                { label: "Trust & Security", href: "/trust" }
              ].map((link) => (
                <li key={link.label}>
                  <Link href={link.href} className="text-xs font-semibold text-slate-500 hover:text-[#22C55E] transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Nav Column: Legal */}
          <div className="space-y-6">
            <h4 className="text-[10px] font-black text-[#0F172A] uppercase tracking-[0.2em]">Legal</h4>
            <ul className="space-y-3">
              {[
                { label: "Legal Hub", href: "/legal" },
                { label: "Privacy Policy", href: "/legal/privacy" },
                { label: "Terms of Service", href: "/legal/terms" }
              ].map((link) => (
                <li key={link.label}>
                  <Link href={link.href} className="text-xs font-semibold text-slate-500 hover:text-[#22C55E] transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom Bar - Ultra Tiny */}
      <div className="border-t border-slate-50 py-8">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">
              © 2025 Vayva Tech
            </p>
            <div className="h-4 w-[1px] bg-slate-100 hidden md:block" />
            <div className="flex items-center px-3 py-1 rounded-full bg-slate-50 border border-slate-100">
              <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse mr-2" />
              <span className="text-[9px] font-black uppercase tracking-widest text-[#64748B]">
                Vayva Merchant v1.0
              </span>
            </div>
          </div>

          <div className="flex items-center gap-8">
            <Link
              href="/legal"
              className="text-[10px] font-black text-slate-400 hover:text-[#22C55E] transition-all uppercase tracking-[0.2em]"
            >
              Legal Hub
            </Link>

            {/* Minimal Social Icons */}
            <div className="flex gap-4">
              {["Twitter", "LinkedIn", "Instagram"].map((social) => (
                <Button
                  key={social}
                  className="text-slate-300 hover:text-black transition-colors"
                  aria-label={social}
                >
                  <div
                    className={cn(
                      "w-4 h-4 bg-current",
                      `[mask-image:url(/icons/${social.toLowerCase()}.svg)]`,
                      "[mask-repeat:no-repeat]",
                      "[mask-position:center]"
                    )}
                  />
                </Button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
