import React from "react";
import { Icon } from "@vayva/ui";
import { SubscriptionPlan } from "@vayva/shared";

interface DataSafetyProps {
  plan: SubscriptionPlan;
}

export const DataSafety = ({ plan }: DataSafetyProps) => {
  const isLocked = plan === SubscriptionPlan.STARTER;

  return (
    <div className="space-y-4">
      {/* Export Data */}
      <div className="p-5 border border-gray-200 rounded-2xl bg-white flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center text-blue-600">
            <Icon name="Download" size={20} />
          </div>
          <div>
            <h3 className="font-bold text-gray-900">Export Your Data</h3>
            <p className="text-sm text-gray-500">
              Download orders, customers, and product lists.
            </p>
          </div>
        </div>
        {isLocked ? (
          <div className="flex items-center gap-2">
            <div className="bg-gray-100 p-1.5 rounded-lg text-gray-500">
              <Icon name="Lock" size={14} />
            </div>
            <span className="text-xs font-bold text-gray-400">Pro Feature</span>
          </div>
        ) : (
          <button className="px-4 py-2 border border-gray-200 rounded-xl text-sm font-bold hover:bg-gray-50">
            Export CSV
          </button>
        )}
      </div>

      {/* Activity Log */}
      <div className="p-5 border border-gray-200 rounded-2xl bg-white flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 rounded-full bg-orange-50 flex items-center justify-center text-orange-600">
            <Icon name="FileText" size={20} />
          </div>
          <div>
            <h3 className="font-bold text-gray-900">Activity Log</h3>
            <p className="text-sm text-gray-500">
              See who made changes to your store settings.
            </p>
          </div>
        </div>
        {isLocked ? (
          <div className="flex items-center gap-2">
            <div className="bg-gray-100 p-1.5 rounded-lg text-gray-500">
              <Icon name="Lock" size={14} />
            </div>
            <span className="text-xs font-bold text-gray-400">Pro Feature</span>
          </div>
        ) : (
          <button className="px-4 py-2 border border-gray-200 rounded-xl text-sm font-bold hover:bg-gray-50">
            View Log
          </button>
        )}
      </div>
    </div>
  );
};
