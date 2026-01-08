"use client";

import React from "react";
import Link from "next/link";
import { Icon } from "@vayva/ui";

export const AuthShell = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="flex flex-col min-h-screen w-full bg-background bg-noise overflow-hidden relative">
      {/* Subtle gradient background */}
      <div className="absolute inset-0 z-0 bg-gradient-to-b from-background to-background-subtle pointer-events-none"></div>

      {/* Header */}
      <header className="h-16 w-full px-6 md:px-8 flex items-center justify-between border-b border-border-subtle bg-background/80 backdrop-blur-sm z-10 relative">
        <Link href="/" className="flex items-center gap-2 group">
          <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center transition-transform group-hover:scale-105">
            <Icon name="Store" className="text-text-inverse w-5 h-5" />
          </div>
          <span className="text-lg font-heading font-semibold text-text-primary">
            Vayva
          </span>
        </Link>

        <Link
          href="/help"
          className="text-sm text-accent hover:text-accent-hover transition-colors flex items-center gap-1"
        >
          Need help?
        </Link>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex flex-col items-center justify-center p-6 z-10 relative">
        <div className="w-full max-w-md">{children}</div>

        {/* Footer */}
        <footer className="mt-12 text-xs text-text-secondary text-center">
          By continuing you agree to our{" "}
          <Link href="/legal/terms" className="text-accent hover:underline">
            Terms of Service
          </Link>{" "}
          and{" "}
          <Link href="/legal/privacy" className="text-accent hover:underline">
            Privacy Policy
          </Link>
        </footer>
      </main>
    </div>
  );
};
