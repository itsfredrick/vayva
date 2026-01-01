"use client";

import React from "react";
import Link from "next/link";

interface AuthRightPanelProps {
  children: React.ReactNode;
  stepIndicator?: string;
  title: string;
  subtitle?: string;
}

export const AuthRightPanel = ({
  children,
  stepIndicator,
  title,
  subtitle,
}: AuthRightPanelProps) => {
  return (
    <div className="flex-1 lg:w-[55%] bg-white flex flex-col">
      {/* Top bar with help link only */}
      <div className="h-16 px-6 lg:px-12 flex items-center justify-end border-b border-gray-100">
        <Link
          href="/help"
          className="text-sm text-gray-600 hover:text-black font-medium transition-colors"
        >
          Having trouble? Get help
        </Link>
      </div>

      {/* Main content area */}
      <div className="flex-1 flex items-center justify-center p-6 lg:p-12">
        <div className="w-full max-w-[480px]">
          {/* Title */}
          <h1 className="text-3xl font-bold text-gray-900 mb-2 leading-tight">
            {title}
          </h1>

          {/* Subtitle */}
          {subtitle && (
            <p className="text-base text-gray-600 mb-8">{subtitle}</p>
          )}

          {/* Form content */}
          <div>{children}</div>

          {/* Simple Footer Links - Centered under the form */}
          <div className="mt-8 flex items-center justify-center gap-4 text-sm text-gray-500">
            <Link
              href="/legal/terms"
              className="hover:text-gray-900 transition-colors"
            >
              Terms of Service
            </Link>
            <span>•</span>
            <Link
              href="/legal/privacy"
              className="hover:text-gray-900 transition-colors"
            >
              Privacy Policy
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
