import React from "react";
import { Dispute, DisputeStatus } from "@vayva/shared";
import { Icon, cn } from "@vayva/ui";

interface DisputeListProps {
  disputes: Dispute[];
  isLoading: boolean;
}

export const DisputeList = ({ disputes, isLoading }: DisputeListProps) => {
  if (isLoading)
    return (
      <div className="py-10 text-center text-gray-400">Loading disputes...</div>
    );

  if (disputes.length === 0) {
    return (
      <div className="text-center py-16 text-gray-400 border border-dashed border-gray-200 rounded-xl bg-gray-50/50">
        <Icon
          name="ShieldCheck"
          size={48}
          className="mx-auto mb-4 opacity-20"
        />
        <p>No active disputes. Your store is healthy!</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center bg-red-50 p-4 rounded-xl border border-red-100">
        <div className="flex gap-3">
          <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center text-red-600 shrink-0">
            <Icon name="Scale" size={20} />
          </div>
          <div>
            <h3 className="font-bold text-red-900">Action Required</h3>
            <p className="text-xs text-red-700">
              Funds for these orders are on hold until resolved.
            </p>
          </div>
        </div>
      </div>

      <div className="space-y-3">
        {disputes.map((disp) => (
          <div
            key={disp.id}
            className="bg-white border border-red-100 rounded-xl p-4 flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-sm hover:shadow-md transition-shadow"
          >
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center text-gray-500 shrink-0">
                <Icon name={"AlertTriangle" as any} size={20} />
              </div>
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-bold text-gray-900 text-sm">
                    Order #{disp.orderId.split("_")[1] || disp.orderId}
                  </span>
                  <span className="text-xs text-gray-500">
                    • {disp.customerName}
                  </span>
                </div>
                <p className="text-sm font-medium text-red-600">
                  {disp.reason}
                </p>
                <p className="text-xs text-gray-400 mt-1">
                  Deadline: {new Date(disp.deadline!).toLocaleDateString()}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-6">
              <div className="text-right">
                <p className="text-xs text-gray-400 uppercase font-bold">
                  Held Amount
                </p>
                <p className="font-bold font-mono text-lg text-gray-900">
                  {new Intl.NumberFormat("en-NG", {
                    style: "currency",
                    currency: disp.currency,
                  }).format(disp.amount)}
                </p>
              </div>

              <div className="flex gap-2">
                <button className="px-4 py-2 bg-black text-white rounded-lg text-xs font-bold hover:bg-gray-800 transition-colors">
                  Submit Evidence
                </button>
                <button className="px-4 py-2 border border-gray-200 rounded-lg text-xs font-bold text-gray-700 hover:bg-gray-50 transition-colors">
                  View Details
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
