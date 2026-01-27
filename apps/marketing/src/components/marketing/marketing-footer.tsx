"use client";

import React from "react";
import Link from "next/link";
import { Button, Input, Label } from "@vayva/ui";
import { Twitter, Linkedin, Instagram, X } from "lucide-react";

export function MarketingFooter(): React.JSX.Element {
  const [isMarketplaceWaitlistOpen, setIsMarketplaceWaitlistOpen] = React.useState(false);
  const [email, setEmail] = React.useState("");
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [isSuccess, setIsSuccess] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  const closeMarketplaceWaitlist = (): void => {
    setIsMarketplaceWaitlistOpen(false);
    setIsSubmitting(false);
    setIsSuccess(false);
    setError(null);
    setEmail("");
  };

  const submitMarketplaceWaitlist = async (e: React.FormEvent): Promise<void> => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      const response = await fetch("/api/waitlist/marketplace", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      if (!response.ok) throw new Error("Failed to join waitlist");

      setIsSuccess(true);
      setEmail("");

      window.setTimeout(() => {
        closeMarketplaceWaitlist();
      }, 1800);
    } catch {
      setError("Failed to join waitlist. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <footer className="bg-white text-[#0F172A] border-t border-slate-100">
      {/* Main Navigation Grid - Compact */}
      <div className="max-w-[1760px] mx-auto px-6 py-16">
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
              <li>
                <Link href="/how-vayva-works" className="text-xs font-semibold text-slate-500 hover:text-[#22C55E] transition-colors">
                  How Vayva Works
                </Link>
              </li>
              <li>
                <Link href="/pricing" className="text-xs font-semibold text-slate-500 hover:text-[#22C55E] transition-colors">
                  Pricing Plans
                </Link>
              </li>
              <li>
                <Link href="/store-builder" className="text-xs font-semibold text-slate-500 hover:text-[#22C55E] transition-colors">
                  Store Builder
                </Link>
              </li>
              <li>
                <Button
                  type="button"
                  onClick={() => setIsMarketplaceWaitlistOpen(true)}
                  variant="link"
                  className="text-xs font-semibold text-slate-500 hover:text-[#22C55E] transition-colors p-0 h-auto"
                >
                  Marketplace
                </Button>
              </li>
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
              ].map((link: any) => (
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
              ].map((link: any) => (
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
              ].map((link: any) => (
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
        <div className="max-w-[1760px] mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">
              © {new Date().getFullYear()} Vayva Tech
            </p>
            </div>

          <div className="flex items-center gap-8">
            {/* Social Icons */}
            <div className="flex gap-4">
              <a
                href="https://twitter.com/vayvang"
                target="_blank"
                rel="noopener noreferrer"
                className="w-8 h-8 rounded-full bg-slate-50 flex items-center justify-center text-slate-400 hover:text-[#22C55E] hover:bg-slate-100 transition-all"
                aria-label="Twitter"
              >
                <Twitter size={14} />
              </a>
              <a
                href="https://linkedin.com/company/vayva"
                target="_blank"
                rel="noopener noreferrer"
                className="w-8 h-8 rounded-full bg-slate-50 flex items-center justify-center text-slate-400 hover:text-[#22C55E] hover:bg-slate-100 transition-all"
                aria-label="LinkedIn"
              >
                <Linkedin size={14} />
              </a>
              <a
                href="https://instagram.com/vayva.ng"
                target="_blank"
                rel="noopener noreferrer"
                className="w-8 h-8 rounded-full bg-slate-50 flex items-center justify-center text-slate-400 hover:text-[#22C55E] hover:bg-slate-100 transition-all"
                aria-label="Instagram"
              >
                <Instagram size={14} />
              </a>
            </div>
          </div>
        </div>
      </div>

      {isMarketplaceWaitlistOpen ? (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full shadow-2xl relative animate-in slide-in-from-bottom-4 duration-300">
            <Button
              variant="ghost"
              size="icon"
              onClick={closeMarketplaceWaitlist}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
              aria-label="Close"
            >
              <X size={20} />
            </Button>

            {!isSuccess ? (
              <>
                <div className="w-16 h-16 bg-gradient-to-br from-vayva-green to-emerald-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 8c-1.657 0-3 .895-3 2v2c0 1.105 1.343 2 3 2s3-.895 3-2v-2c0-1.105-1.343-2-3-2zm0 0V6m0 14a9 9 0 110-18 9 9 0 010 18z"
                    />
                  </svg>
                </div>

                <h3 className="text-2xl font-bold text-center text-gray-900 mb-2">Vayva Marketplace</h3>
                <p className="text-center text-gray-600 mb-6">
                  The marketplace is launching soon. Join the waitlist to get notified when it’s ready.
                </p>

                <form onSubmit={submitMarketplaceWaitlist} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="marketplace-waitlist-email">Email address</Label>
                    <Input
                      id="marketplace-waitlist-email"
                      type="email"
                      placeholder="you@example.com"
                      value={email}
                      onChange={(e: any) => setEmail(e.target.value)}
                      required
                      disabled={isSubmitting}
                    />
                  </div>

                  {error ? <p className="text-sm text-red-600">{error}</p> : null}

                  <Button
                    type="submit"
                    className="w-full bg-vayva-green hover:bg-vayva-green/90"
                    isLoading={isSubmitting}
                  >
                    Join Waitlist
                  </Button>
                </form>

                <p className="text-xs text-center text-gray-500 mt-4">
                  We’ll email you when the marketplace is ready.
                </p>
              </>
            ) : (
              <div className="text-center py-4">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">You’re on the list!</h3>
                <p className="text-gray-600">We’ll email you when the marketplace is ready.</p>
              </div>
            )}
          </div>
        </div>
      ) : null}
    </footer>
  );
}
