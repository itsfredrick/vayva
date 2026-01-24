import React from "react";
import { Icon, Button } from "@vayva/ui";

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
        <Button variant="link" className="text-xs font-bold text-red-700 hover:underline h-auto p-0">
          View All Disputes
        </Button>
      </div>

      <div className="space-y-3">
        {disputes.map((disp: any) => (
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
              <Button className="px-3 py-2 bg-red-600 text-white rounded-lg text-xs font-bold hover:bg-red-700 h-auto">
                Submit Evidence
              </Button>
              <Button
                variant="outline"
                className="px-3 py-2 border border-gray-200 rounded-lg text-xs font-bold text-gray-700 hover:bg-gray-50 h-auto"
              >
                View Details
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
