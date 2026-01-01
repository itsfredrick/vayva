"use client";

import React from "react";
import Link from "next/link";
import { MarketShell } from "@/components/market/market-shell";
import { Button, Icon } from "@vayva/ui";

export default function MarketConfirmationPage() {
  return (
    <MarketShell>
      <div className="max-w-3xl mx-auto px-4 py-16 text-center">
        <div className="w-20 h-20 bg-state-success rounded-full flex items-center justify-center text-black mx-auto mb-6 shadow-lg shadow-green-500/20">
          <Icon name="Check" size={40} />
        </div>

        <h1 className="text-3xl font-bold text-white mb-2">Order Confirmed!</h1>
        <p className="text-text-secondary mb-8">
          Ref: <span className="text-white font-mono">#VM-8821X</span> • Paid:{" "}
          <span className="text-white font-bold">₦ 3,501,500</span>
        </p>

        <div className="bg-white/5 rounded-2xl border border-white/5 p-6 mb-8 text-left grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <h4 className="font-bold text-text-secondary text-xs uppercase tracking-wider mb-4">
              Sold & Fulfilled By
            </h4>
            <div className="flex items-center gap-3 p-3 bg-white/5 rounded-lg border border-white/5">
              <div className="w-10 h-10 rounded-full bg-indigo-500 flex items-center justify-center text-white font-bold">
                T
              </div>
              <div>
                <div className="font-bold text-white">TechDepot</div>
                <div className="text-xs text-text-secondary">
                  Expected delivery: 2-3 Days
                </div>
              </div>
            </div>
            <div className="mt-2 text-sm text-state-success font-medium flex items-center gap-1">
              <Icon name="Shield" size={14} /> Vayva Buyer Protection Active
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex justify-between py-2 border-b border-white/5">
              <span className="text-text-secondary">Delivery to</span>
              <span className="text-white font-medium text-right">
                Amaka Okafor
              </span>
            </div>
            <div className="flex justify-between py-2 border-b border-white/5">
              <span className="text-text-secondary">Address</span>
              <span className="text-white font-medium text-right">
                Lekki Phase 1, Lagos
              </span>
            </div>
          </div>
        </div>

        <div className="flex gap-4 justify-center">
          <Link href="/market">
            <Button className="bg-primary text-black hover:bg-primary/90 font-bold px-8">
              Continue Shopping
            </Button>
          </Link>
        </div>
      </div>
    </MarketShell>
  );
}
