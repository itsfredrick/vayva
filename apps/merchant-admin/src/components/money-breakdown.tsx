import React from "react";
import { GlassPanel } from "@vayva/ui";

interface MoneyBreakdownProps {
  subtotal: string;
  fees?: string;
  net?: string;
  delivery?: string;
  total: string;
  showNet?: boolean;
}

export function MoneyBreakdown({
  subtotal,
  fees,
  net,
  delivery,
  total,
  showNet = false,
}: MoneyBreakdownProps) {
  return (
    <GlassPanel className="p-6">
      <h3 className="font-bold text-white mb-4">Payment Breakdown</h3>
      <div className="space-y-3 text-sm">
        <div className="flex justify-between text-text-secondary">
          <span>Subtotal</span>
          <span className="text-white">{subtotal}</span>
        </div>
        {delivery && (
          <div className="flex justify-between text-text-secondary">
            <span>Delivery</span>
            <span className="text-white">{delivery}</span>
          </div>
        )}
        <div className="flex justify-between font-bold text-white pt-2 border-t border-white/5">
          <span>Total Paid</span>
          <span>{total}</span>
        </div>
        {showNet && (
          <>
            <div className="flex justify-between text-text-secondary pt-2">
              <span>Processing Fees</span>
              <span className="text-state-danger">
                {fees ? `-${fees}` : "₦ 0.00"}
              </span>
            </div>
            <div className="flex justify-between font-bold text-primary pt-2 border-t border-white/5">
              <span>Net Information</span>
              <span>{net}</span>
            </div>
          </>
        )}
      </div>
    </GlassPanel>
  );
}
