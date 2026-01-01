import React from "react";
import { Icon } from "@vayva/ui";

export const DisputeSection = () => {
  // Test Dispute Data
  const disputes = [
    {
      id: "disp_001",
      orderId: "#1024",
      amount: "₦15,000",
      reason: "Item not received",
      status: "OPEN",
      dueDate: "Dec 26",
    },
  ];

  if (disputes.length === 0) return null;

  return (
    <div className="bg-red-50 border border-red-100 rounded-2xl p-6 mb-8">
      <div className="flex justify-between items-center mb-4">
        <h3 className="font-bold text-red-900 flex items-center gap-2">
          <Icon name="Info" size={18} /> Action Required: 1 Open Dispute
        </h3>
        <button className="text-xs font-bold text-red-700 hover:underline">
          View All Disputes
        </button>
      </div>

      <div className="space-y-3">
        {disputes.map((disp) => (
          <div
            key={disp.id}
            className="bg-white border border-red-100 rounded-xl p-4 flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-sm"
          >
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center text-red-600 shrink-0">
                <Icon name="Scale" size={18} />
              </div>
              <div>
                <p className="font-bold text-gray-900 text-sm">
                  Order {disp.orderId} - {disp.reason}
                </p>
                <p className="text-xs text-red-600 mt-1">
                  Amount held: {disp.amount} • Respond by {disp.dueDate}
                </p>
              </div>
            </div>

            <div className="flex gap-2">
              <button className="px-3 py-2 bg-red-600 text-white rounded-lg text-xs font-bold hover:bg-red-700">
                Submit Evidence
              </button>
              <button className="px-3 py-2 border border-gray-200 rounded-lg text-xs font-bold text-gray-700 hover:bg-gray-50">
                View Details
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
