"use client";

import React, { useEffect, useState } from "react";
import { Button, Icon } from "@vayva/ui";
import { useRouter, useSearchParams } from "next/navigation";
import { telemetry } from "@/lib/telemetry";

export function ActivationWelcome() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const isWelcome = searchParams.get("welcome") === "true";

  // 1. All Hooks at the top
  const [firstName, setFirstName] = useState("Merchant");
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    fetch("/api/auth/merchant/me")
      .then(res => res.json())
      .then(data => {
        if (data.user?.name) setFirstName(data.user.name.split(" ")[0]);
      })
      .catch(() => { });
  }, []);

  useEffect(() => {
    if (isWelcome) {
      localStorage.setItem("activation_mode", "true");
    }

    const isActive = localStorage.getItem("activation_mode") === "true";
    const persistentDismissed = localStorage.getItem("activation_welcome_dismissed");
    const sessionDismissed = sessionStorage.getItem("activation_welcome_dismissed_session");

    if (isWelcome || (isActive && !persistentDismissed && !sessionDismissed)) {
      setVisible(true);
      telemetry.track("activation_welcome_shown", {});
    }
  }, [isWelcome]);

  // 2. Handlers
  const handleAction = async (action: string, path: string) => {
    telemetry.track("activation_quick_action_clicked", { actionKey: action });

    if (action === "test_order") {
      try {
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
        router.push("/dashboard/orders");
      } catch (e: any) {
        console.error("Failed to create test order", e);
        router.push(path);
      }
    } else {
      router.push(path);
    }
  };

  // 3. Early return after hooks
  if (!visible) return null;

  return (
    <div className="bg-gradient-to-br from-gray-900 to-black rounded-2xl p-6 md:p-8 mb-8 text-white relative overflow-hidden shadow-2xl animate-in slide-in-from-top-4 fade-in duration-700">
      <div className="absolute top-0 right-0 w-96 h-96 bg-white/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3" />

      <div className="absolute top-4 right-4 flex items-center gap-4 z-20">
        <Button
          onClick={() => {
            setVisible(false);
            localStorage.setItem("activation_welcome_dismissed", "true");
          }}
          className="text-white/40 hover:text-white/70 text-xs transition-colors"
        >
          Dismiss
        </Button>
      </div>

      <div className="relative z-10 grid md:grid-cols-2 gap-8 items-center">
        <div>
          <div className="flex items-center gap-3 mb-4">
            <span className="bg-green-500/20 text-green-400 border border-green-500/30 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider animate-pulse">
              Live & Ready
            </span>
          </div>

          <h2 className="text-2xl md:text-3xl font-bold mb-3">
            Welcome to Vayva, {firstName}!
          </h2>
          <p className="text-gray-400 text-lg mb-6 leading-relaxed">
            Your store is live. Complete these 3 steps in your first 24 hours to launch successfully.
          </p>

          <div className="flex flex-wrap gap-3">
            <Button onClick={() => handleAction("add_product", "/dashboard/products")} size="lg" className="bg-white text-black hover:bg-gray-100 shadow-lg shadow-white/10">
              Add First Product →
            </Button>
          </div>
        </div>

        <div className="bg-white/10 border border-white/10 rounded-xl p-6 backdrop-blur-sm">
          <h3 className="font-bold text-gray-200 mb-4 flex items-center gap-2">
            <Icon name="ListChecks" size={18} />
            Go-Live Checklist
          </h3>
          <div className="space-y-3">
            <div
              onClick={() => handleAction("whatsapp", "/onboarding/communication")}
              className="flex items-center gap-3 p-3 rounded-lg hover:bg-white/5 transition-colors cursor-pointer group"
            >
              <div className="w-5 h-5 rounded-full border-2 border-white/20 group-hover:border-green-400 transition-colors" />
              <span className="text-gray-300 group-hover:text-white transition-colors">Share your store on WhatsApp</span>
              <Icon name="ArrowRight" size={14} className="ml-auto opacity-0 group-hover:opacity-100 text-white/50" />
            </div>
            <div
              onClick={() => handleAction("test_order", "/dashboard/orders")}
              className="flex items-center gap-3 p-3 rounded-lg hover:bg-white/5 transition-colors cursor-pointer group"
            >
              <div className="w-5 h-5 rounded-full border-2 border-white/20 group-hover:border-purple-400 transition-colors" />
              <span className="text-gray-300 group-hover:text-white transition-colors">Place a test order</span>
              <Icon name="ArrowRight" size={14} className="ml-auto opacity-0 group-hover:opacity-100 text-white/50" />
            </div>
            <div
              className="flex items-center gap-3 p-3 rounded-lg opacity-60 cursor-default"
            >
              <div className="w-5 h-5 rounded-full border-2 border-dashed border-white/20" />
              <span className="text-gray-400">Complete your first sale</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
