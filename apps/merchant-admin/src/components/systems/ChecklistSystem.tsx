"use client";

import React, { useState, useEffect } from "react";
import { Button, Drawer, Icon, cn } from "@vayva/ui";
import { useToast } from "@/components/ui/use-toast";
import styles from "./ChecklistSystem.module.css";

// Master Prompt System 3: Checklist Engine
// Dynamic, Contextual, Dismissible, Self-healing/Updating

interface ChecklistItem {
  id: string;
  title: string;
  description: string;
  status: "pending" | "completed";
  priority: number; // Higher is top
  actionLabel: string;
  onClick: () => void;
}

export function ChecklistEngine({
  startProductFlow,
  startWhatsAppFlow,
}: {
  startProductFlow: () => void;
  startWhatsAppFlow: () => void;
}) {
  const { toast } = useToast();
  const [collapsed, setCollapsed] = useState(false);
  const [dismissed, setDismissed] = useState(false);
  const [items, setItems] = useState<ChecklistItem[]>([
    {
      id: "setup",
      title: "Complete Business Setup",
      description: "Your basic onboarding is done.",
      status: "completed",
      priority: 10,
      actionLabel: "Review",
      onClick: () => { },
    },
    {
      id: "product",
      title: "Add your first product",
      description: "Create a product to start selling.",
      status: "pending",
      priority: 9,
      actionLabel: "Create Product",
      onClick: startProductFlow,
    },
    {
      id: "whatsapp",
      title: "Set up WhatsApp Messages",
      description: "Automate order updates.",
      status: "pending", // Would be dynamic based on connected state
      priority: 8,
      actionLabel: "Configure",
      onClick: startWhatsAppFlow,
    },
    {
      id: "order",
      title: "Create your first order",
      description: "Test the end-to-end flow manually.",
      status: "pending",
      priority: 7,
      actionLabel: "Create Order",
      onClick: () => {
        toast({
          title: "Create Order",
          description: "Use the Point of Sale or Storefront to create your first order.",
        });
      },
    },
  ]);

  const pendingCount = items.filter((i) => i.status === "pending").length;
  const progress = Math.round(
    ((items.length - pendingCount) / items.length) * 100,
  );
  const progressBucket = Math.max(0, Math.min(100, Math.round(progress / 5) * 5));
  const progressClass = styles[`w${progressBucket}`] || styles.w0;

  if (dismissed && pendingCount === 0) return null; // Fully hidden if done and dismissed

  if (collapsed || dismissed) {
    return (
      <div className="fixed bottom-6 right-6 z-40">
        <Button
          onClick={() => {
            setCollapsed(false);
            setDismissed(false);
          }}
          aria-label="Toggle Checklist"
          className="bg-black text-white h-12 w-12 rounded-full shadow-xl flex items-center justify-center hover:scale-110 transition-transform relative p-0"
        >
          <Icon name="ListChecks" size={20} />
          {pendingCount > 0 && (
            <div className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full text-[10px] font-bold flex items-center justify-center border-2 border-white">
              {pendingCount}
            </div>
          )}
        </Button>
      </div>
    );
  }

  return (
    <div className="fixed bottom-6 right-6 z-40 w-full max-w-sm animate-in slide-in-from-bottom-4 duration-300">
      <div className="bg-white rounded-2xl shadow-2xl border border-gray-200 overflow-hidden">
        {/* Header */}
        <div className="bg-black text-white p-4 flex justify-between items-center">
          <div>
            <h3 className="font-bold text-sm">Setup Guide</h3>
            <p className="text-[10px] text-gray-400">{progress}% Complete</p>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setCollapsed(true)}
              aria-label="Minimize"
              className="hover:bg-white/20 p-1 rounded transition-colors text-white hover:text-white"
            >
              <Icon name="Minimize2" size={14} />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setDismissed(true)}
              aria-label="Close"
              className="hover:bg-white/20 p-1 rounded transition-colors text-white hover:text-white"
            >
              <Icon name="X" size={14} />
            </Button>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="h-1 w-full bg-gray-100">
          <div className={cn("h-full", styles.progressBar, progressClass)} />
        </div>

        {/* Items */}
        <div className="max-h-[300px] overflow-y-auto">
          {items
            .sort((a, b) => b.priority - a.priority)
            .map((item: any) => (
              <div
                key={item.id}
                className={cn(
                  "p-4 border-b border-gray-100 last:border-0 flex gap-3 transition-colors",
                  item.status === "completed"
                    ? "bg-gray-50 opacity-60"
                    : "bg-white hover:bg-gray-50",
                )}
              >
                <div
                  className={cn(
                    "w-5 h-5 rounded-full border flex items-center justify-center shrink-0 mt-0.5",
                    item.status === "completed"
                      ? "bg-green-500 border-green-500 text-white"
                      : "border-gray-300 text-transparent",
                  )}
                >
                  <Icon name="Check" size={10} />
                </div>

                <div className="flex-1">
                  <h4
                    className={cn(
                      "text-sm font-bold text-gray-900",
                      item.status === "completed" &&
                      "line-through text-gray-500",
                    )}
                  >
                    {item.title}
                  </h4>
                  <p className="text-xs text-gray-500 mb-2">
                    {item.description}
                  </p>

                  {item.status === "pending" && (
                    <Button
                      size="sm"
                      variant="outline"
                      className="h-7 text-xs px-3"
                      onClick={item.onClick}
                    >
                      {item.actionLabel}
                    </Button>
                  )}
                </div>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
}
