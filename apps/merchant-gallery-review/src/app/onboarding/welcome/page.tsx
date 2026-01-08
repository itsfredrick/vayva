"use client";

import React, { useState } from "react";
import { Button, Icon, cn } from "@vayva/ui";
import { useOnboarding } from "@/context/OnboardingContext";

// Master Prompt Segments:
// * Physical products
// * Food & catering
// * Services / bookings
// * Mixed business

type Segment = "retail" | "food" | "services" | "digital" | "wholesale" | "real-estate" | "events" | "education" | "non-profit" | "other";

type SetupPath = "guided" | "blank";

export default function WelcomePage() {
  const { state, updateState, goToStep } = useOnboarding();
  const [selected, setSelected] = useState<Segment | null>(
    (state?.intent?.segment as Segment) || null,
  );
  const [path, setPath] = useState<SetupPath | null>(
    state?.setupPath || null
  );

  const segments: { id: Segment; label: string; icon: any }[] = [
    { id: "retail", label: "Retail & Commerce", icon: "ShoppingBag" },
    { id: "food", label: "Food & Hospitality", icon: "Soup" },
    { id: "services", label: "Services & Booking", icon: "Calendar" },
    { id: "digital", label: "Digital Products", icon: "Download" },
    { id: "wholesale", label: "B2B Wholesale", icon: "Container" },
    { id: "real-estate", label: "Real Estate", icon: "Home" },
    { id: "events", label: "Events & Tickets", icon: "Ticket" },
    { id: "education", label: "Education", icon: "GraduationCap" },
    { id: "non-profit", label: "Non-Profit", icon: "Heart" },
    { id: "other", label: "Other", icon: "Layers" },
  ];

  const handleContinue = async () => {
    if (!selected || !path) return;

    // Delivery Logic: Skip for Service and Digital
    const hasDelivery = selected !== "services" && selected !== "digital";

    await updateState({
      intent: { segment: selected, hasDelivery },
      setupPath: path,
    });

    await goToStep("business");
  };

  return (
    <div className="flex flex-col h-full max-w-4xl mx-auto py-8">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-3">
          Let's build your Vayva Store
        </h1>
        <p className="text-gray-500">
          Tell us what you sell so we can tailor your experience.
        </p>
      </div>

      {/* 1. Industry Selection */}
      <div className="mb-8">
        <h3 className="text-sm font-bold text-gray-900 mb-4 uppercase tracking-wider">
          1. Select your industry
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
          {segments.map((seg) => (
            <button
              key={seg.id}
              onClick={() => setSelected(seg.id)}
              className={cn(
                "flex flex-col items-center justify-center p-4 rounded-xl border transition-all duration-200 h-28",
                selected === seg.id
                  ? "bg-black text-white border-black shadow-lg scale-[1.02]"
                  : "bg-white text-gray-600 border-gray-200 hover:border-gray-300 hover:bg-gray-50"
              )}
            >
              <div
                className={cn(
                  "w-10 h-10 rounded-full flex items-center justify-center mb-2 transition-colors",
                  selected === seg.id ? "bg-white/20" : "bg-gray-100"
                )}
              >
                <Icon
                  name={seg.icon}
                  className={selected === seg.id ? "text-white" : "text-gray-500"}
                  size={20}
                />
              </div>
              <span className="font-medium text-xs text-center leading-tight">
                {seg.label}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* 2. Path Selection (Only visible after industry selected) */}
      {selected && (
        <div className="mb-8 animate-in slide-in-from-bottom-4 fade-in duration-500">
          <h3 className="text-sm font-bold text-gray-900 mb-4 uppercase tracking-wider">
            2. Choose your setup path
          </h3>
          <div className="grid md:grid-cols-2 gap-4">
            <button
              onClick={() => setPath("guided")}
              className={cn(
                "flex items-start gap-4 p-6 rounded-2xl border-2 text-left transition-all relative overflow-hidden",
                path === "guided"
                  ? "border-black bg-gray-50 ring-1 ring-black/5"
                  : "border-gray-200 bg-white hover:border-gray-300"
              )}
            >
              <div className={cn(
                "w-12 h-12 rounded-full flex items-center justify-center shrink-0",
                path === "guided" ? "bg-black text-white" : "bg-gray-100 text-gray-500"
              )}>
                <Icon name="LayoutTemplate" size={24} />
              </div>
              <div>
                <h4 className="font-bold text-gray-900 text-lg mb-1">
                  Guided Templates
                </h4>
                <p className="text-sm text-gray-500">
                  We'll pre-fill your store with a layout designed for {segments.find(s => s.id === selected)?.label}.
                </p>
                {path === "guided" && (
                  <span className="absolute top-4 right-4 bg-black text-white text-[10px] font-bold px-2 py-1 rounded-full">
                    RECOMMENDED
                  </span>
                )}
              </div>
            </button>

            <button
              onClick={() => setPath("blank")}
              className={cn(
                "flex items-start gap-4 p-6 rounded-2xl border-2 text-left transition-all",
                path === "blank"
                  ? "border-black bg-gray-50 ring-1 ring-black/5"
                  : "border-gray-200 bg-white hover:border-gray-300"
              )}
            >
              <div className={cn(
                "w-12 h-12 rounded-full flex items-center justify-center shrink-0",
                path === "blank" ? "bg-black text-white" : "bg-gray-100 text-gray-500"
              )}>
                <Icon name="PenTool" size={24} />
              </div>
              <div>
                <h4 className="font-bold text-gray-900 text-lg mb-1">
                  Start from Scratch
                </h4>
                <p className="text-sm text-gray-500">
                  Build your own layout element by element. Best for custom needs.
                </p>
              </div>
            </button>
          </div>
        </div>
      )}

      <div className="mt-auto pt-4 border-t border-gray-100 flex justify-end">
        <Button
          onClick={handleContinue}
          disabled={!selected || !path}
          className="!bg-black text-white h-12 px-8 rounded-xl text-base shadow-lg hover:shadow-xl transition-all"
        >
          Continue
          <Icon name="ArrowRight" className="ml-2 w-4 h-4" />
        </Button>
      </div>
    </div>
  );
}
