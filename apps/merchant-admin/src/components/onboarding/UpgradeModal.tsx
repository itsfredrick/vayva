"use client";

import React from "react";
import Link from "next/link";
import { Button } from "@vayva/ui";

interface UpgradeModalProps {
  requiredTier: "growth" | "pro";
  templateName: string;
  features: string[];
  onClose: () => void;
}

export function UpgradeModal({
  requiredTier,
  templateName,
  features,
  onClose,
}: UpgradeModalProps) {
  const tierName = requiredTier === "growth" ? "Growth" : "Pro";
  const tierPrice = requiredTier === "growth" ? "₦25,000" : "₦40,000";

  return (
    <div
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-lg max-w-lg w-full p-8"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-[#0F172A] mb-2">
            This template is available on the {tierName} plan.
          </h2>
          <p className="text-[#64748B]">
            <strong>{templateName}</strong> includes features not available in
            your current plan.
          </p>
        </div>

        {/* Features */}
        <div className="mb-6 bg-gray-50 rounded-lg p-4">
          <h3 className="text-sm font-semibold text-[#0F172A] mb-3">
            Includes:
          </h3>
          <ul className="space-y-2">
            {features.map((feature, i) => (
              <li
                key={i}
                className="flex items-start gap-2 text-sm text-[#64748B]"
              >
                <span className="text-[#22C55E]">✓</span>
                {feature}
              </li>
            ))}
          </ul>
        </div>

        {/* Pricing */}
        <div className="mb-6 text-center">
          <p className="text-sm text-[#64748B] mb-1">{tierName} plan</p>
          <p className="text-3xl font-bold text-[#0F172A]">
            {tierPrice}
            <span className="text-lg text-[#64748B]">/month</span>
          </p>
        </div>

        {/* Actions */}
        <div className="flex gap-4">
          <Link href="/pricing" className="flex-1">
            <Button className="w-full bg-[#22C55E] hover:bg-[#16A34A] text-white py-3 font-semibold">
              View {tierName} plan details
            </Button>
          </Link>
          <Button
            onClick={onClose}
            variant="outline"
            className="flex-1 border-2 border-gray-300 py-3 font-semibold"
          >
            Choose a Free template
          </Button>
        </div>
      </div>
    </div>
  );
}
