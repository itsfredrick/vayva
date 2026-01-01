"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

export function GlobalHeader() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const pathname = usePathname();

  const productLinks = [
    { href: "/how-vayva-works", label: "How Vayva Works" },
    { href: "/features", label: "Features" },
    { href: "/templates", label: "Templates" },
    { href: "/pricing", label: "Pricing" },
  ];

  const companyLinks = [
    { href: "/about", label: "About Vayva" },
    { href: "/careers", label: "Careers" },
  ];

  const supportLinks = [
    { href: "/help", label: "Help Center" },
    { href: "/status", label: "System Status" },
  ];

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex items-center justify-between h-16">
          {/* Left - Logo */}
          <div className="flex-shrink-0">
            <Link href="/" className="flex items-center">
              <span className="text-2xl font-bold text-[#0F172A]">Vayva</span>
            </Link>
          </div>

          {/* Center - Primary Nav (Desktop) */}
          <nav className="hidden md:flex items-center space-x-8">
            {/* Product Dropdown */}
            <div
              className="relative"
              onMouseEnter={() => setActiveDropdown("product")}
              onMouseLeave={() => setActiveDropdown(null)}
            >
              <button className="text-sm font-medium text-[#0F172A] hover:text-[#22C55E] transition-colors">
                Product
              </button>
              {activeDropdown === "product" && (
                <div className="absolute top-full left-0 mt-2 w-56 bg-white border border-gray-200 rounded-lg shadow-lg py-2">
                  {productLinks.map((link) => (
                    <Link
                      key={link.href}
                      href={link.href}
                      className="block px-4 py-2 text-sm text-[#0F172A] hover:bg-gray-50 hover:text-[#22C55E] transition-colors"
                    >
                      {link.label}
                    </Link>
                  ))}
                </div>
              )}
            </div>

            {/* Company Dropdown */}
            <div
              className="relative"
              onMouseEnter={() => setActiveDropdown("company")}
              onMouseLeave={() => setActiveDropdown(null)}
            >
              <button className="text-sm font-medium text-[#0F172A] hover:text-[#22C55E] transition-colors">
                Company
              </button>
              {activeDropdown === "company" && (
                <div className="absolute top-full left-0 mt-2 w-48 bg-white border border-gray-200 rounded-lg shadow-lg py-2">
                  {companyLinks.map((link) => (
                    <Link
                      key={link.href}
                      href={link.href}
                      className="block px-4 py-2 text-sm text-[#0F172A] hover:bg-gray-50 hover:text-[#22C55E] transition-colors"
                    >
                      {link.label}
                    </Link>
                  ))}
                </div>
              )}
            </div>

            {/* Support Dropdown */}
            <div
              className="relative"
              onMouseEnter={() => setActiveDropdown("support")}
              onMouseLeave={() => setActiveDropdown(null)}
            >
              <button className="text-sm font-medium text-[#0F172A] hover:text-[#22C55E] transition-colors">
                Support
              </button>
              {activeDropdown === "support" && (
                <div className="absolute top-full left-0 mt-2 w-48 bg-white border border-gray-200 rounded-lg shadow-lg py-2">
                  {supportLinks.map((link) => (
                    <Link
                      key={link.href}
                      href={link.href}
                      className="block px-4 py-2 text-sm text-[#0F172A] hover:bg-gray-50 hover:text-[#22C55E] transition-colors"
                    >
                      {link.label}
                    </Link>
                  ))}
                </div>
              )}
            </div>
          </nav>

          {/* Right - Actions */}
          <div className="hidden md:flex items-center space-x-4">
            <Link
              href="/signin"
              className="text-sm font-medium text-[#0F172A] hover:text-[#22C55E] transition-colors"
            >
              Sign in
            </Link>
            <Link
              href="/signup"
              className="px-4 py-2 bg-[#22C55E] hover:bg-[#16A34A] text-white text-sm font-semibold rounded transition-colors"
            >
              Create account
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 text-[#0F172A]"
            aria-label="Toggle menu"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              {mobileMenuOpen ? (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              ) : (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              )}
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-gray-200 bg-white">
          <div className="px-6 py-4 space-y-4">
            {/* Product Section */}
            <div>
              <p className="text-xs font-semibold text-gray-500 uppercase mb-2">
                Product
              </p>
              <div className="space-y-2">
                {productLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className="block text-sm text-[#0F172A] hover:text-[#22C55E] transition-colors"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    {link.label}
                  </Link>
                ))}
              </div>
            </div>

            {/* Company Section */}
            <div>
              <p className="text-xs font-semibold text-gray-500 uppercase mb-2">
                Company
              </p>
              <div className="space-y-2">
                {companyLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className="block text-sm text-[#0F172A] hover:text-[#22C55E] transition-colors"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    {link.label}
                  </Link>
                ))}
              </div>
            </div>

            {/* Support Section */}
            <div>
              <p className="text-xs font-semibold text-gray-500 uppercase mb-2">
                Support
              </p>
              <div className="space-y-2">
                {supportLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className="block text-sm text-[#0F172A] hover:text-[#22C55E] transition-colors"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    {link.label}
                  </Link>
                ))}
              </div>
            </div>

            {/* Mobile Actions */}
            <div className="pt-4 border-t border-gray-200 space-y-2">
              <Link
                href="/signin"
                className="block text-center text-sm font-medium text-[#0F172A] hover:text-[#22C55E] transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                Sign in
              </Link>
              <Link
                href="/signup"
                className="block text-center px-4 py-2 bg-[#22C55E] hover:bg-[#16A34A] text-white text-sm font-semibold rounded transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                Create account
              </Link>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
