import React from "react";
import {
  LedgerEntry,
  WalletTransactionType,
  WalletTransactionStatus,
} from "@vayva/shared";
import { Icon, cn } from "@vayva/ui";

interface TransactionListProps {
  transactions: LedgerEntry[];
  isLoading: boolean;
}

export const TransactionList = ({
  transactions,
  isLoading,
}: TransactionListProps) => {
  if (isLoading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-20 bg-gray-50 rounded-xl animate-pulse" />
        ))}
      </div>
    );
  }

  if (transactions.length === 0) {
    return (
      <div className="text-center py-12 bg-gray-50 rounded-xl border border-dashed border-gray-200">
        <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center mx-auto mb-3 shadow-sm text-gray-400">
          <Icon name="Receipt" size={20} />
        </div>
        <h3 className="font-bold text-gray-900">No transactions yet</h3>
        <p className="text-sm text-gray-500 mt-1">
          Your wallet will reflect payments once customers place orders.
        </p>
      </div>
    );
  }

  const getIcon = (type: WalletTransactionType) => {
    switch (type) {
      case WalletTransactionType.PAYMENT:
        return "ArrowDownLeft";
      case WalletTransactionType.PAYOUT:
        return "ArrowUpRight";
      case WalletTransactionType.REFUND:
        return "RotateCcw";
      case WalletTransactionType.DISPUTE_HOLD:
        return "Lock";
      default:
        return "Circle";
    }
  };

  const getStatusColor = (status: WalletTransactionStatus) => {
    switch (status) {
      case WalletTransactionStatus.COMPLETED:
        return "bg-green-50 text-green-700";
      case WalletTransactionStatus.PENDING:
        return "bg-yellow-50 text-yellow-700";
      case WalletTransactionStatus.FAILED:
        return "bg-red-50 text-red-700";
      case WalletTransactionStatus.ON_HOLD:
        return "bg-orange-50 text-orange-700";
      default:
        return "bg-gray-100 text-gray-600";
    }
  };

  const formatCurrency = (amount: number, currency: string) => {
    return new Intl.NumberFormat("en-NG", {
      style: "currency",
      currency,
    }).format(amount);
  };

  return (
    <div className="space-y-4">
      {/* Simple Filter Tabs (Visual Only for now) */}
      <div className="flex gap-2 overflow-x-auto pb-2">
        {["All", "Payments", "Payouts", "Refunds"].map((tab, i) => (
          <button
            key={tab}
            className={cn(
              "px-4 py-2 rounded-full text-sm font-medium transition-colors whitespace-nowrap",
              i === 0
                ? "bg-black text-white"
                : "bg-white border border-gray-200 text-gray-600 hover:bg-gray-50",
            )}
          >
            {tab}
          </button>
        ))}
      </div>

      <div className="space-y-3">
        {transactions.map((txn) => {
          const isPositive = txn.amount > 0;

          return (
            <div
              key={txn.id}
              className="bg-white border border-gray-100 rounded-xl p-4 flex items-center justify-between hover:shadow-md transition-shadow group"
            >
              <div className="flex items-center gap-4">
                <div
                  className={cn(
                    "w-10 h-10 rounded-full flex items-center justify-center shrink-0",
                    txn.type === WalletTransactionType.PAYOUT
                      ? "bg-gray-100 text-gray-600"
                      : txn.type === WalletTransactionType.DISPUTE_HOLD
                        ? "bg-red-50 text-red-600"
                        : "bg-blue-50 text-blue-600",
                  )}
                >
                  {/* @ts-ignore */}
                  <Icon name={getIcon(txn.type)} size={18} />
                </div>
                <div>
                  <p className="font-bold text-gray-900 text-sm">
                    {txn.description}
                  </p>
                  <p className="text-xs text-gray-500 mt-0.5">
                    {new Date(txn.createdAt).toLocaleDateString()} •{" "}
                    {new Date(txn.createdAt).toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </p>
                </div>
              </div>

              <div className="text-right">
                <p
                  className={cn(
                    "font-mono font-bold text-sm",
                    isPositive ? "text-green-600" : "text-gray-900",
                  )}
                >
                  {isPositive ? "+" : ""}
                  {formatCurrency(txn.amount, txn.currency)}
                </p>
                <span
                  className={cn(
                    "inline-block px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider mt-1",
                    getStatusColor(txn.status),
                  )}
                >
                  {txn.status.replace("_", " ")}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
