"use client";

import React, { useState } from "react";
import { Button, Icon, cn } from "@vayva/ui";
import { Switch } from "@/components/ui/Switch";

// Master Prompt System 2: WhatsApp Templates
// State-bound templates (not time-based)
// Editable variables
// Preview Bubble

interface Template {
  id: string;
  stateName: string; // e.g., 'New Order', 'Shipped'
  defaultMessage: string;
  autoSend: boolean;
  variables: string[];
}

const DEFAULT_TEMPLATES: Template[] = [
  {
    id: "new",
    stateName: "Order Confirmed",
    defaultMessage:
      "Hi {{customer_name}}, thanks for your order #{{order_id}}. We've received it and will start processing shortly.",
    autoSend: true,
    variables: ["customer_name", "order_id", "total_amount"],
  },
  {
    id: "shipped",
    stateName: "Out for Delivery",
    defaultMessage:
      "Great news {{customer_name}}! Your order #{{order_id}} is on the way. Our rider will call you.",
    autoSend: false,
    variables: ["customer_name", "order_id", "rider_phone"],
  },
  {
    id: "delivered",
    stateName: "Delivered",
    defaultMessage:
      "Hi {{customer_name}}, your order has been delivered. Enjoy! Let us know if you need anything else.",
    autoSend: false,
    variables: ["customer_name"],
  },
];

export function WhatsAppTemplateSystem() {
  const [selectedId, setSelectedId] = useState(DEFAULT_TEMPLATES[0].id);
  const [templates, setTemplates] = useState(DEFAULT_TEMPLATES);

  const activeTemplate = templates.find((t) => t.id === selectedId)!;

  const updateTemplate = (updates: Partial<Template>) => {
    setTemplates(
      templates.map((t) => (t.id === selectedId ? { ...t, ...updates } : t)),
    );
  };

  const insertVariable = (variable: string) => {
    updateTemplate({
      defaultMessage: activeTemplate.defaultMessage + ` {{${variable}}}`,
    });
  };

  return (
    <div className="flex flex-col lg:flex-row gap-8 h-[600px]">
      {/* List Panel */}
      <div className="w-full lg:w-64 border-r border-gray-100 pr-4 space-y-2">
        <h3 className="text-xs font-bold text-gray-400 uppercase mb-4">
          Order States
        </h3>
        {templates.map((t) => (
          <button
            key={t.id}
            onClick={() => setSelectedId(t.id)}
            className={cn(
              "w-full text-left p-3 rounded-xl transition-all flex items-center justify-between text-sm group",
              selectedId === t.id
                ? "bg-black text-white"
                : "hover:bg-gray-50 text-gray-600",
            )}
          >
            <span className="font-medium">{t.stateName}</span>
            {t.autoSend && (
              <Icon
                name="Zap"
                size={12}
                className={
                  selectedId === t.id ? "text-yellow-400" : "text-gray-400"
                }
              />
            )}
          </button>
        ))}
      </div>

      {/* Editor Panel */}
      <div className="flex-1 flex flex-col">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h2 className="text-xl font-bold text-gray-900">
              {activeTemplate.stateName} Template
            </h2>
            <p className="text-xs text-gray-500">
              Sent when order moves to this status
            </p>
          </div>
          <div className="flex items-center gap-2 bg-gray-50 p-2 rounded-lg border border-gray-200">
            <span className="text-xs font-bold text-gray-600">Auto-send</span>
            <Switch
              checked={activeTemplate.autoSend}
              onCheckedChange={(c) => updateTemplate({ autoSend: c })}
              className="scale-90"
            />
          </div>
        </div>

        <div className="flex-1 bg-gray-50 rounded-2xl border border-gray-200 p-4 mb-4 relative">
          <textarea
            className="w-full h-full bg-transparent border-none outline-none resize-none text-sm leading-relaxed p-2"
            value={activeTemplate.defaultMessage}
            onChange={(e) => updateTemplate({ defaultMessage: e.target.value })}
          />
          <div className="absolute bottom-4 left-4 flex gap-2">
            {activeTemplate.variables.map((v) => (
              <button
                key={v}
                onClick={() => insertVariable(v)}
                className="text-[10px] bg-white border border-gray-200 px-2 py-1 rounded-full shadow-sm hover:border-black transition-colors"
              >
                {`{{${v}}}`}
              </button>
            ))}
          </div>
        </div>

        <div className="bg-green-50 text-green-800 p-4 rounded-xl text-xs flex gap-3 border border-green-100">
          <Icon name="Info" size={16} className="shrink-0" />
          <p>
            Vayva ensures messages are sent instantly. Customers can reply
            directly to your WhatsApp number.
          </p>
        </div>
      </div>

      {/* Phone Preview */}
      <div className="w-[300px] hidden lg:block relative">
        <div className="absolute inset-0 bg-gray-900 rounded-[3rem] border-8 border-gray-800 shadow-2xl overflow-hidden">
          {/* StatusBar */}
          <div className="h-6 bg-black w-full" />

          {/* Chat Header */}
          <div className="bg-[#075E54] text-white p-4 flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">
              V
            </div>
            <div>
              <h4 className="font-bold text-sm">Your Business</h4>
              <p className="text-[10px] opacity-80">Business Account</p>
            </div>
          </div>

          {/* Chat Body */}
          <div className="bg-[#E5DDD5] h-full p-4 relative">
            {/* Message Bubble */}
            <div className="bg-white p-3 rounded-lg rounded-tl-none shadow-sm max-w-[85%] text-xs leading-relaxed text-gray-800 relative">
              {activeTemplate.defaultMessage.replace(/{{.*?}}/g, (match) => {
                // Replace variables with fake data for preview
                const key = match.replace(/{{|}}/g, "");
                const tests: Record<string, string> = {
                  customer_name: "John",
                  order_id: "1024",
                  total_amount: "₦15,000",
                  rider_phone: "08012345678",
                };
                return tests[key] || match;
              })}

              <span className="text-[9px] text-gray-400 absolute bottom-1 right-2">
                10:42 AM
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
