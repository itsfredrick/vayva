import React from "react";
import { Integration } from "@vayva/shared";
import { Icon, cn } from "@vayva/ui";

interface IntegrationsPanelProps {
  integrations: Integration[];
  onToggle: (id: string, enabled: boolean) => void;
}

export const IntegrationsPanel = ({
  integrations,
  onToggle,
}: IntegrationsPanelProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {integrations.map((integration) => {
        const isConnected = integration.status === "connected";
        return (
          <div
            key={integration.id}
            className="p-5 border border-gray-200 rounded-2xl bg-white flex flex-col justify-between hover:border-gray-300 transition-colors"
          >
            <div>
              <div className="flex justify-between items-start mb-3">
                <div
                  className={cn(
                    "w-10 h-10 rounded-xl flex items-center justify-center text-lg",
                    integration.category === "payment"
                      ? "bg-green-50 text-green-600"
                      : integration.category === "marketing"
                        ? "bg-blue-50 text-blue-600"
                        : "bg-orange-50 text-orange-600",
                  )}
                >
                  {/* Simple Icon mapping based on ID or fallback */}
                  <Icon
                    name={
                      integration.id.includes("pay")
                        ? "CreditCard"
                        : integration.id.includes("ship")
                          ? "Truck"
                          : "Megaphone"
                    }
                    size={20}
                  />
                </div>
                <div
                  className={cn(
                    "w-10 h-6 rounded-full p-1 cursor-pointer transition-colors relative",
                    isConnected ? "bg-green-500" : "bg-gray-200",
                  )}
                  onClick={() => onToggle(integration.id, !isConnected)}
                >
                  <div
                    className={cn(
                      "w-4 h-4 bg-white rounded-full shadow-sm transition-transform",
                      isConnected ? "translate-x-4" : "translate-x-0",
                    )}
                  />
                </div>
              </div>
              <h3 className="font-bold text-gray-900">{integration.name}</h3>
              <p className="text-xs text-gray-500 mt-1 leading-normal">
                {integration.description}
              </p>
            </div>

            <div className="mt-4 pt-4 border-t border-gray-50 flex justify-between items-center">
              <span className="text-[10px] uppercase font-bold text-gray-400 tracking-wider disabled">
                {integration.category}
              </span>
              {isConnected && (
                <button className="text-xs font-bold text-gray-900 flex items-center gap-1 hover:underline">
                  <Icon name="Settings" size={12} /> Configure
                </button>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};
