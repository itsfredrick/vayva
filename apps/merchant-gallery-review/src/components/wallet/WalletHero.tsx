import React from "react";
import { WalletBalance } from "@vayva/shared";
import { Icon } from "@vayva/ui";

// ... (imports)

interface WalletHeroProps {
  balance: WalletBalance | null;
  isLoading: boolean;
  onWithdraw?: () => void;
}

export const WalletHero = ({
  balance,
  isLoading,
  onWithdraw,
}: WalletHeroProps) => {
  if (isLoading || !balance) {
    return (
      <div className="h-[240px] w-full bg-gray-100 animate-pulse rounded-2xl"></div>
    );
  }

  const formatCurrency = (amount: number, currency: string) => {
    return new Intl.NumberFormat("en-NG", {
      style: "currency",
      currency: currency,
    }).format(amount);
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
      {/* Primary Balance Card */}
      <div className="md:col-span-2 bg-[#0B0B0B] text-white rounded-2xl p-8 relative overflow-hidden shadow-lg flex flex-col justify-between min-h-[240px]">
        <div className="relative z-10">
          <div className="flex items-center gap-2 mb-2 text-gray-400">
            <span className="text-sm font-medium uppercase tracking-wider">
              Available Balance
            </span>
            <Icon
              name="Info"
              size={14}
              className="opacity-50 hover:opacity-100 cursor-help"
            />
          </div>
          <h1 className="font-heading font-bold text-5xl tracking-tight mb-1">
            {formatCurrency(balance.available, balance.currency)}
          </h1>
          <p className="text-sm text-gray-500">Funds ready for withdrawal</p>
        </div>

        <div className="relative z-10 flex gap-12 pt-6 border-t border-gray-800 mt-6">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <div className="w-2 h-2 rounded-full bg-yellow-500" />
              <p className="text-xs text-gray-400 font-bold uppercase">
                Pending
              </p>
            </div>
            <p className="font-medium text-xl">
              {formatCurrency(balance.pending, balance.currency)}
            </p>
            <p className="text-[10px] text-gray-500">Clears in 24-48h</p>
          </div>

          <div>
            <div className="flex items-center gap-2 mb-1">
              <div className="w-2 h-2 rounded-full bg-red-500" />
              <p className="text-xs text-gray-400 font-bold uppercase">
                On Hold
              </p>
            </div>
            <p className="font-medium text-xl text-red-200">
              {formatCurrency(balance.blocked, balance.currency)}
            </p>
            <p className="text-[10px] text-gray-500">Disputes / Refunds</p>
          </div>
        </div>

        {/* Decorative Background */}
        <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-gradient-to-bl from-gray-800/20 to-transparent rounded-full -mr-32 -mt-32 pointer-events-none blur-3xl" />
      </div>

      {/* Actions Card */}
      <div className="bg-white border border-gray-200 rounded-2xl p-8 flex flex-col justify-center space-y-4 shadow-sm h-[240px]">
        <button
          onClick={onWithdraw}
          className="w-full py-3 bg-black text-white rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-gray-800 transition-all active:scale-[0.98]"
        >
          <Icon name="ArrowDownLeft" size={20} /> Withdraw Funds
        </button>
        <button className="w-full py-3 bg-white border border-gray-200 text-gray-900 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-gray-50 transition-all">
          <Icon name="History" size={20} /> Payout History
        </button>
      </div>
    </div>
  );
};
