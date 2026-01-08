"use client";

import React from "react";
import { Icon } from "@vayva/ui";
import { PLAN_PRICING } from "@/lib/billing/plans";
import Link from "next/link";

interface PaywallModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  message: string;
  requiredPlan?: "pro";
}

export function PaywallModal({
  isOpen,
  onClose,
  title,
  message,
  requiredPlan = "pro",
}: PaywallModalProps) {
  if (!isOpen) return null;

  const price = requiredPlan === "pro" ? PLAN_PRICING.PRO : PLAN_PRICING.GROWTH;
  const formattedPrice = new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "NGN",
    minimumFractionDigits: 0,
  }).format(price);

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full overflow-hidden scale-100">
        <div className="bg-gradient-to-r from-gray-900 to-gray-800 p-6 text-white relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-white/50 hover:text-white"
          >
            <Icon name="X" size={20} />
          </button>
          <div className="w-12 h-12 bg-white/10 rounded-xl flex items-center justify-center mb-4">
            <Icon name="Lock" size={24} className="text-yellow-400" />
          </div>
          <h2 className="text-xl font-bold mb-2">{title}</h2>
          <p className="text-gray-300 text-sm">{message}</p>
        </div>

        <div className="p-8">
          <div className="flex justify-between items-center mb-6 pb-6 border-b border-dashed border-gray-200">
            <div>
              <div className="text-xs font-bold uppercase text-gray-500 mb-1">
                Unlock with {requiredPlan}
              </div>
              <div className="text-3xl font-bold relative">
                {formattedPrice}
                <span className="text-sm font-normal text-gray-400 ml-1">
                  / mo
                </span>
              </div>
            </div>
            <div className="text-right">
              <div className="text-xs text-gray-400 mb-1">Includes</div>
              <div className="font-bold flex items-center gap-1 justify-end">
                <Icon name="Users" size={14} className="text-green-500" /> 5
                Staff Seats
              </div>
              <div className="font-bold flex items-center gap-1 justify-end">
                <Icon name="Zap" size={14} className="text-green-500" /> Pro
                Templates
              </div>
              <div className="font-bold flex items-center gap-1 justify-end">
                <Icon
                  name={"BarChart" as any}
                  className="text-primary w-6 h-6"
                />{" "}
                Analytics
              </div>
            </div>
          </div>

          <div className="flex gap-3">
            <Link
              href={`/dashboard/billing?upgrade=${requiredPlan}`}
              className="flex-1 bg-black text-white text-center py-3 rounded-lg font-bold hover:bg-gray-800 transition-colors"
            >
              Upgrade to {requiredPlan}
            </Link>
            <button
              onClick={onClose}
              className="px-4 py-3 rounded-lg font-bold text-gray-500 hover:bg-gray-50"
            >
              Maybe Later
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
