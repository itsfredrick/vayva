"use client";

import React, { useState } from "react";

interface ActivationProgressProps {
  firstOrder: boolean;
  firstPayment: boolean;
  firstCompletion: boolean;
  onDismiss?: () => void;
}

export function ActivationProgress({
  firstOrder,
  firstPayment,
  firstCompletion,
  onDismiss,
}: ActivationProgressProps) {
  const [dismissed, setDismissed] = useState(false);

  // Don't show if all steps complete or dismissed
  if (dismissed || (firstOrder && firstPayment && firstCompletion)) {
    return null;
  }

  const handleDismiss = () => {
    setDismissed(true);
    onDismiss?.();
  };

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm">
      <div className="flex justify-between items-start mb-3">
        <h3 className="text-sm font-semibold text-[#0F172A]">Setup progress</h3>
        <button
          onClick={handleDismiss}
          className="text-[#64748B] hover:text-[#0F172A] text-sm"
          aria-label="Dismiss"
        >
          ×
        </button>
      </div>

      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <div
            className={`w-4 h-4 rounded-full flex items-center justify-center ${
              firstOrder ? "bg-[#22C55E]" : "bg-gray-200"
            }`}
          >
            {firstOrder && <span className="text-white text-xs">✓</span>}
          </div>
          <span
            className={`text-sm ${firstOrder ? "text-[#0F172A]" : "text-[#64748B]"}`}
          >
            Receive first order
          </span>
        </div>

        <div className="flex items-center gap-2">
          <div
            className={`w-4 h-4 rounded-full flex items-center justify-center ${
              firstPayment ? "bg-[#22C55E]" : "bg-gray-200"
            }`}
          >
            {firstPayment && <span className="text-white text-xs">✓</span>}
          </div>
          <span
            className={`text-sm ${firstPayment ? "text-[#0F172A]" : "text-[#64748B]"}`}
          >
            Record a payment
          </span>
        </div>

        <div className="flex items-center gap-2">
          <div
            className={`w-4 h-4 rounded-full flex items-center justify-center ${
              firstCompletion ? "bg-[#22C55E]" : "bg-gray-200"
            }`}
          >
            {firstCompletion && <span className="text-white text-xs">✓</span>}
          </div>
          <span
            className={`text-sm ${firstCompletion ? "text-[#0F172A]" : "text-[#64748B]"}`}
          >
            Complete an order
          </span>
        </div>
      </div>
    </div>
  );
}
