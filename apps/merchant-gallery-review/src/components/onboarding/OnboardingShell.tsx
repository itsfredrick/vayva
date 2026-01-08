"use client";

import { ReactNode } from "react";
import Link from "next/link";

interface Step {
  key: string;
  label: string;
  completed: boolean;
}

interface OnboardingShellProps {
  currentStep: string;
  steps: Step[];
  children: ReactNode;
}

export function OnboardingShell({
  currentStep,
  steps,
  children,
}: OnboardingShellProps) {
  const currentIndex = steps.findIndex((s) => s.key === currentStep);
  const progress = ((currentIndex + 1) / steps.length) * 100;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      {/* Header */}
      <header className="bg-white/70 backdrop-blur-xl border-b border-white/20 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/" className="text-xl font-bold text-slate-900">
            Vayva
          </Link>
          <Link
            href="/dashboard"
            className="text-sm text-slate-600 hover:text-slate-900 transition-colors"
          >
            Exit setup
          </Link>
        </div>
      </header>

      {/* Mobile Progress Bar */}
      <div className="lg:hidden bg-white/70 backdrop-blur-xl border-b border-white/20 px-6 py-3">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-slate-700">
            Step {currentIndex + 1} of {steps.length}
          </span>
          <span className="text-xs text-slate-500">
            {steps[currentIndex]?.label}
          </span>
        </div>
        <div className="h-2 bg-slate-200 rounded-full overflow-hidden">
          <div
            className="h-full bg-[#22C55E] transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8 lg:py-12">
        <div className="grid lg:grid-cols-[280px_1fr] gap-8">
          {/* Desktop Progress Rail */}
          <aside className="hidden lg:block">
            <div className="sticky top-24 space-y-2">
              {steps.map((step, index) => {
                const isCurrent = step.key === currentStep;
                const isPast = index < currentIndex;

                return (
                  <div
                    key={step.key}
                    className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                      isCurrent
                        ? "bg-[#22C55E]/10 text-[#22C55E]"
                        : isPast
                          ? "text-slate-600"
                          : "text-slate-400"
                    }`}
                  >
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                        isPast
                          ? "bg-[#22C55E] text-white"
                          : isCurrent
                            ? "bg-[#22C55E]/20 text-[#22C55E]"
                            : "bg-slate-200 text-slate-400"
                      }`}
                    >
                      {isPast ? (
                        <svg
                          className="w-5 h-5"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path
                            fillRule="evenodd"
                            d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                            clipRule="evenodd"
                          />
                        </svg>
                      ) : (
                        index + 1
                      )}
                    </div>
                    <span className="text-sm font-medium">{step.label}</span>
                  </div>
                );
              })}
            </div>
          </aside>

          {/* Main Content */}
          <main className="flex-1">{children}</main>
        </div>
      </div>
    </div>
  );
}
