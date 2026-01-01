"use client";

import React, { useEffect, useState } from "react";
import { Button, Icon } from "@vayva/ui";
import { useRouter, useSearchParams } from "next/navigation";
import { telemetry } from "@/lib/telemetry";

export function ActivationWelcome() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const isWelcome = searchParams.get("welcome") === "true";
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    // 1. Activate mode if query param present
    if (isWelcome) {
      localStorage.setItem("activation_mode", "true");
    }

    // 2. Check persistence and session state
    const isActive = localStorage.getItem("activation_mode") === "true";
    const persistentDismissed = localStorage.getItem(
      "activation_welcome_dismissed",
    );
    const sessionDismissed = sessionStorage.getItem(
      "activation_welcome_dismissed_session",
    );

    // 3. Determine visibility & Track
    // Show if active AND not dismissed (persistent or session)
    // OR override if explicitly welcome=true (unless persistent dismissed? prompt says 'welcome' triggers it)
    // We allow 'welcome=true' to show it even if previously dismissed, to allow recall.
    if (isWelcome || (isActive && !persistentDismissed && !sessionDismissed)) {
      setVisible(true);
      // Track only once per session view to avoid noise?
      // The prompt asks for 'activation_welcome_shown'.
      // unique-per-session tracking is handled by the useEffect generally running once on mount.
      telemetry.track("activation_welcome_shown");
    }
  }, [isWelcome]);

  if (!visible) return null;

  const handleDismiss = () => {
    setVisible(false);
    localStorage.setItem("activation_welcome_dismissed", "true");
  };

  const handleAction = async (action: string, path: string) => {
    telemetry.track("activation_quick_action_clicked", { actionKey: action });

    if (action === "create_order") {
      try {
        // Create test order via API
        await fetch("/api/orders", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            mode: "test",
            total: 5000,
            subtotal: 4500,
            shipping: 500,
          }),
        });
        // Navigate to orders list to see it
        router.push("/dashboard/orders");
      } catch (e) {
        console.error("Failed to create test order", e);
        // Navigate anyway
        router.push(path);
      }
    } else {
      router.push(path);
    }
  };

  return (
    <div className="bg-gradient-to-br from-gray-900 to-black rounded-2xl p-8 mb-8 text-white relative overflow-hidden shadow-2xl animate-in slide-in-from-top-4 fade-in duration-700">
      {/* Background decoration */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3" />

      {/* Dismissal Controls */}
      <div className="absolute top-4 right-4 flex items-center gap-4">
        <button
          onClick={() => {
            setVisible(false);
            localStorage.setItem("activation_welcome_dismissed", "true");
          }}
          className="text-white/40 hover:text-white/70 text-xs transition-colors"
        >
          Don't show again
        </button>
        <button
          onClick={() => {
            setVisible(false);
            sessionStorage.setItem(
              "activation_welcome_dismissed_session",
              "true",
            );
          }}
          className="text-white/40 hover:text-white transition-colors"
          aria-label="Dismiss for now"
        >
          <Icon name="X" size={20} />
        </button>
      </div>

      <div className="relative z-10">
        <div className="flex items-center gap-3 mb-4">
          <span className="bg-green-500/20 text-green-400 border border-green-500/30 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
            Live & Ready
          </span>
        </div>

        <h2 className="text-3xl font-bold mb-2">
          You're live. Here's what to do next.
        </h2>
        <p className="text-gray-400 max-w-xl mb-8 text-lg">
          Your store is configured. Take these quick actions to make your first
          sale in minutes.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <button
            onClick={() => handleAction("add_product", "/dashboard/products")}
            className="bg-white/10 hover:bg-white/20 border border-white/10 p-4 rounded-xl text-left transition-all hover:scale-[1.02] group"
          >
            <div className="w-10 h-10 rounded-full bg-blue-500/20 text-blue-400 flex items-center justify-center mb-3 group-hover:bg-blue-500 group-hover:text-white transition-colors">
              <Icon name="Plus" size={20} />
            </div>
            <h3 className="font-bold">Add First Product</h3>
            <p className="text-xs text-gray-400 mt-1">Start your catalog</p>
          </button>

          <button
            onClick={() => handleAction("create_order", "/dashboard/orders")}
            className="bg-white/10 hover:bg-white/20 border border-white/10 p-4 rounded-xl text-left transition-all hover:scale-[1.02] group"
          >
            <div className="w-10 h-10 rounded-full bg-purple-500/20 text-purple-400 flex items-center justify-center mb-3 group-hover:bg-purple-500 group-hover:text-white transition-colors">
              <Icon name="ShoppingBag" size={20} />
            </div>
            <h3 className="font-bold">Create Test Order</h3>
            <p className="text-xs text-gray-400 mt-1">See how it works</p>
          </button>

          <button
            onClick={() => handleAction("whatsapp", "/onboarding/whatsapp")}
            className="bg-white/10 hover:bg-white/20 border border-white/10 p-4 rounded-xl text-left transition-all hover:scale-[1.02] group"
          >
            <div className="w-10 h-10 rounded-full bg-green-500/20 text-green-400 flex items-center justify-center mb-3 group-hover:bg-green-500 group-hover:text-white transition-colors">
              <Icon name="MessageCircle" size={20} />
            </div>
            <h3 className="font-bold">Connect WhatsApp</h3>
            <p className="text-xs text-gray-400 mt-1">Automate chat orders</p>
          </button>

          <button
            onClick={() => handleAction("payments", "/onboarding/payments")}
            className="bg-white/10 hover:bg-white/20 border border-white/10 p-4 rounded-xl text-left transition-all hover:scale-[1.02] group"
          >
            <div className="w-10 h-10 rounded-full bg-orange-500/20 text-orange-400 flex items-center justify-center mb-3 group-hover:bg-orange-500 group-hover:text-white transition-colors">
              <Icon name="CreditCard" size={20} />
            </div>
            <h3 className="font-bold">Set Payments</h3>
            <p className="text-xs text-gray-400 mt-1">Get paid faster</p>
          </button>
        </div>
      </div>
    </div>
  );
}
