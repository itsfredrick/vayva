"use client";

import React, { useState } from "react";
import { Button, Icon, cn } from "@vayva/ui";
import { useOnboarding } from "@/context/OnboardingContext";

// Master Prompt Segments:
// * Physical products
// * Food & catering
// * Services / bookings
// * Mixed business

type Segment = "retail" | "food" | "services" | "mixed";

export default function WelcomePage() {
  const { state, updateState, goToStep } = useOnboarding();
  // Initialize from saved state if exists
  const [selected, setSelected] = useState<Segment | null>(
    (state?.intent?.segment as Segment) || null,
  );

  const segments: { id: Segment; label: string; icon: any }[] = [
    { id: "retail", label: "Physical products", icon: "ShoppingBag" },
    { id: "food", label: "Food & catering", icon: "Soup" },
    { id: "services", label: "Services / bookings", icon: "Calendar" },
    { id: "mixed", label: "Mixed business", icon: "Layers" },
  ];

  const handleContinue = async () => {
    if (!selected) return;
    await updateState({
      intent: { segment: selected },
    });
    await goToStep("business");
  };

  return (
    <div className="flex flex-col h-full justify-center max-w-2xl mx-auto">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-3">
          Welcome to Vayva
        </h1>
        <p className="text-lg text-gray-500 max-w-md mx-auto">
          Let’s set up the system that will run your business on WhatsApp.
        </p>
      </div>

      {/* Interactive Element: Segment Selection */}
      <div className="grid grid-cols-2 gap-4 mb-8">
        {segments.map((seg) => (
          <button
            key={seg.id}
            data-testid={`segment-${seg.id}`}
            onClick={() => setSelected(seg.id)}
            className={cn(
              "flex flex-col items-center justify-center p-6 rounded-2xl border transition-all duration-200",
              selected === seg.id
                ? "bg-black text-white border-black shadow-lg scale-[1.02]"
                : "bg-white text-gray-600 border-gray-100 hover:border-gray-200 hover:bg-gray-50",
            )}
          >
            <div
              className={cn(
                "w-12 h-12 rounded-full flex items-center justify-center mb-3 transition-colors",
                selected === seg.id ? "bg-white/20" : "bg-gray-100",
              )}
            >
              <Icon
                name={seg.icon}
                className={selected === seg.id ? "text-white" : "text-gray-500"}
              />
            </div>
            <span className="font-medium text-sm md:text-base">
              {seg.label}
            </span>
          </button>
        ))}
      </div>

      {/* Preview Text */}
      <div className="h-12 flex items-center justify-center mb-8">
        {selected ? (
          <p className="text-gray-600 font-medium animate-fade-in text-center px-4 py-2 bg-gray-50 rounded-full text-sm">
            We’ll tailor your setup for this type of business.
          </p>
        ) : (
          <p className="text-gray-300 text-sm">Select a type to continue</p>
        )}
      </div>

      <Button
        data-testid="onboarding-welcome-continue"
        onClick={handleContinue}
        disabled={!selected}
        className="w-full md:w-2/3 !bg-black text-white h-12 rounded-xl text-base shadow-lg hover:shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed"
      >
        Continue
      </Button>

      {/* Referral Code Entry */}
      <div className="mt-8 w-full md:w-2/3 border-t border-gray-100 pt-6">
        <p className="text-xs text-center text-gray-400 mb-3">
          Optional: Have a referral code?
        </p>
        <div className="flex gap-2">
          <input
            type="text"
            placeholder="CODE123"
            className="flex-1 bg-gray-50 border border-gray-100 rounded-xl px-4 py-2 text-sm focus:outline-none focus:border-black transition-colors"
            value={state?.referralCode || ""}
            onChange={(e) =>
              updateState({ referralCode: e.target.value.toUpperCase() })
            }
          />
        </div>
      </div>

      <p className="text-xs text-center text-gray-400 mt-4">
        You can finish setup later from your dashboard.
      </p>
    </div>
  );
}
