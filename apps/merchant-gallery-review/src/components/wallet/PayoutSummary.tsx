import React from "react";
import { Icon } from "@vayva/ui";

export const PayoutSummary = () => {
  // Hardcoded for test based on API spec
  const nextPayout = {
    date: "Tomorrow, Dec 24",
    amount: "₦250,000",
  };

  const lastPayout = {
    date: "Dec 21, 2025",
    amount: "₦500,000",
  };

  return (
    <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
      <h3 className="font-bold text-gray-900 mb-6 flex items-center gap-2">
        <Icon name="Banknote" size={18} /> Payout Schedule
      </h3>

      <div className="space-y-6 relative">
        {/* Timeline Line */}
        <div className="absolute left-[7px] top-2 bottom-2 w-0.5 bg-gray-100"></div>

        {/* Next Payout */}
        <div className="relative pl-6">
          <div className="absolute left-0 top-1.5 w-4 h-4 rounded-full bg-blue-100 border-2 border-blue-500 z-10"></div>
          <p className="text-xs font-bold text-blue-600 uppercase tracking-wide mb-1">
            Next Payout
          </p>
          <div className="flex justify-between items-baseline">
            <p className="font-bold text-gray-900">{nextPayout.date}</p>
            <p className="font-mono text-gray-600">{nextPayout.amount}</p>
          </div>
          <p className="text-xs text-gray-400 mt-1">
            Est. processing time: 24h
          </p>
        </div>

        {/* Last Payout */}
        <div className="relative pl-6">
          <div className="absolute left-0 top-1.5 w-4 h-4 rounded-full bg-gray-200 border-2 border-white z-10"></div>
          <p className="text-xs font-bold text-gray-400 uppercase tracking-wide mb-1">
            Last Payout
          </p>
          <div className="flex justify-between items-baseline">
            <p className="font-medium text-gray-500">{lastPayout.date}</p>
            <p className="font-mono text-gray-400">{lastPayout.amount}</p>
          </div>
          <div className="flex items-center gap-1 mt-1 text-green-600 text-[10px] font-bold">
            <Icon name="CheckCheck" size={12} /> SENT TO BANK
          </div>
        </div>
      </div>

      <button className="w-full mt-6 py-2 border border-gray-200 rounded-lg text-xs font-bold text-gray-700 hover:bg-gray-50 transition-colors">
        Manage Payout Settings
      </button>
    </div>
  );
};
