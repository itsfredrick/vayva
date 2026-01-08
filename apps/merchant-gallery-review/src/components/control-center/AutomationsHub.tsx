import React, { useState } from "react";
import { Icon, cn } from "@vayva/ui";

interface Automation {
  id: string;
  name: string;
  description: string;
  enabled: boolean;
  type: "whatsapp" | "email" | "system";
}

export const AutomationsHub = () => {
  // Test state for now
  const [automations, setAutomations] = useState<Automation[]>([
    {
      id: "1",
      name: "Order Confirmation",
      description: "Send WhatsApp message when order is placed.",
      enabled: true,
      type: "whatsapp",
    },
    {
      id: "2",
      name: "Abandoned Checkout",
      description: "Remind customers after 1 hour of inactivity.",
      enabled: false,
      type: "whatsapp",
    },
    {
      id: "3",
      name: "Payment Receipt",
      description: "Email receipt after successful payment.",
      enabled: true,
      type: "email",
    },
    {
      id: "4",
      name: "Order Ready",
      description: "Notify customer when order is ready for pickup.",
      enabled: true,
      type: "whatsapp",
    },
  ]);

  const toggleAutomation = (id: string) => {
    setAutomations((prev) =>
      prev.map((a) => (a.id === id ? { ...a, enabled: !a.enabled } : a)),
    );
    // In real app, call API here
  };

  return (
    <section className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
          <Icon name="Zap" size={20} /> Automations
        </h3>
      </div>

      <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden">
        {automations.map((item, i) => (
          <div
            key={item.id}
            className={cn(
              "p-4 flex items-center justify-between hover:bg-gray-50 transition-colors",
              i !== automations.length - 1 && "border-b border-gray-100",
            )}
          >
            <div className="flex items-center gap-4">
              <div
                className={cn(
                  "w-10 h-10 rounded-full flex items-center justify-center",
                  item.type === "whatsapp"
                    ? "bg-green-50 text-green-600"
                    : "bg-blue-50 text-blue-600",
                )}
              >
                <Icon
                  name={item.type === "whatsapp" ? "MessageCircle" : "Mail"}
                  size={18}
                />
              </div>
              <div>
                <h4 className="font-bold text-gray-900 text-sm">{item.name}</h4>
                <p className="text-xs text-gray-500">{item.description}</p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <button className="text-xs font-bold text-gray-400 hover:text-black">
                Edit Logic
              </button>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  className="sr-only peer"
                  checked={item.enabled}
                  onChange={() => toggleAutomation(item.id)}
                />
                <div className="w-9 h-5 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-black"></div>
              </label>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};
