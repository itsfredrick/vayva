import React from "react";
import { Settlement, SettlementStatus } from "@vayva/shared";
import { Icon, cn } from "@vayva/ui";

interface SettlementListProps {
  settlements: Settlement[];
  isLoading: boolean;
}

export const SettlementList = ({
  settlements,
  isLoading,
}: SettlementListProps) => {
  if (isLoading)
    return (
      <div className="py-10 text-center text-gray-400">
        Loading settlements...
      </div>
    );

  if (settlements.length === 0) {
    return (
      <div className="text-center py-16 text-gray-400 border border-dashed border-gray-200 rounded-xl bg-gray-50/50">
        <Icon
          name={"CheckCircle2" as any}
          size={48}
          className="mx-auto mb-4 opacity-20"
        />
        <p>No pending settlements. You're all caught up!</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center bg-yellow-50 p-4 rounded-xl border border-yellow-100">
        <div className="flex gap-3">
          <div className="w-10 h-10 bg-yellow-100 rounded-full flex items-center justify-center text-yellow-700 shrink-0">
            <Icon name="Clock" size={20} />
          </div>
          <div>
            <h3 className="font-bold text-gray-900">Pending Settlements</h3>
            <p className="text-xs text-gray-600">
              Funds from recent orders clearing via banking partners.
            </p>
          </div>
        </div>
      </div>

      <div className="border border-gray-200 rounded-xl overflow-hidden">
        <table className="w-full text-sm text-left">
          <thead className="bg-gray-50 text-gray-500 font-medium border-b border-gray-200">
            <tr>
              <th className="px-4 py-3">Reference</th>
              <th className="px-4 py-3">Expected Date</th>
              <th className="px-4 py-3">Amount</th>
              <th className="px-4 py-3">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {settlements.map((item) => (
              <tr key={item.id} className="hover:bg-gray-50/50">
                <td className="px-4 py-3">
                  <div className="font-bold text-gray-900">
                    {item.description}
                  </div>
                  <div className="text-xs text-gray-400 font-mono">
                    {item.referenceId}
                  </div>
                </td>
                <td className="px-4 py-3 text-gray-600">
                  {new Date(item.payoutDate).toLocaleDateString(undefined, {
                    weekday: "short",
                    month: "short",
                    day: "numeric",
                  })}
                </td>
                <td className="px-4 py-3 font-bold font-mono">
                  {new Intl.NumberFormat("en-NG", {
                    style: "currency",
                    currency: item.currency,
                  }).format(item.amount)}
                </td>
                <td className="px-4 py-3">
                  <span
                    className={cn(
                      "px-2 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider",
                      item.status === SettlementStatus.DELAYED
                        ? "bg-red-50 text-red-600"
                        : item.status === SettlementStatus.PENDING
                          ? "bg-yellow-50 text-yellow-600"
                          : "bg-green-50 text-green-600",
                    )}
                  >
                    {item.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
