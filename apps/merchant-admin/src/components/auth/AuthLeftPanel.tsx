"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";

interface AuthLeftPanelProps {
  showSignInLink?: boolean;
  showSignUpLink?: boolean;
}

export const AuthLeftPanel = ({
  showSignInLink,
  showSignUpLink,
}: AuthLeftPanelProps) => {
  return (
    <div className="hidden lg:flex lg:w-[45%] bg-gray-50 flex-col justify-between p-12 relative">
      {/* Top: Logo at 2x size (100% increase) */}
      <div>
        <Link href="/" className="inline-flex items-center gap-3 group">
          <Image
            src="/brand-logo.png"
            alt="Vayva Logo"
            width={64}
            height={64}
            className="object-contain"
            priority
          />
          <span className="text-3xl font-bold text-black">Vayva</span>
        </Link>
      </div>

      {/* Center: Context & Reassurance */}
      <div className="flex flex-col items-start justify-center flex-1 py-12 max-w-md">
        {/* Subtle abstract illustration */}
        <div className="w-full mb-12">
          <div className="aspect-[4/3] bg-gradient-to-br from-gray-200 to-gray-100 rounded-2xl flex items-center justify-center relative overflow-hidden">
            {/* Abstract WhatsApp-adjacent visual */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-32 h-32 border-4 border-gray-300 rounded-3xl rotate-12 opacity-40"></div>
              <div className="absolute w-24 h-24 border-4 border-gray-400 rounded-2xl -rotate-6 opacity-30"></div>
            </div>
          </div>
        </div>

        {/* Headline */}
        <h2 className="text-3xl font-bold text-gray-900 mb-4 leading-tight">
          Run your business on WhatsApp — with structure behind it.
        </h2>

        {/* Supporting copy */}
        <p className="text-lg text-gray-700 mb-3 leading-relaxed">
          Vayva turns conversations into orders, payments, deliveries, and
          reliable business records.
        </p>

        {/* Optional secondary line */}
        <p className="text-sm text-gray-600 leading-relaxed">
          Built for African merchants.
        </p>
      </div>

      {/* Bottom: Navigation links */}
      <div className="flex items-center justify-between text-sm">
        <Link
          href="/"
          className="text-gray-700 hover:text-black font-medium transition-colors"
        >
          ← Back to home
        </Link>

        {showSignInLink && (
          <Link
            href="/signin"
            className="text-gray-700 hover:text-black font-medium transition-colors"
          >
            Sign in
          </Link>
        )}

        {showSignUpLink && (
          <Link
            href="/signup"
            className="text-gray-700 hover:text-black font-medium transition-colors"
          >
            Create account
          </Link>
        )}
      </div>
    </div>
  );
};
