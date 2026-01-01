"use client";

import React, { useState } from "react";
import { Button, Icon, cn } from "@vayva/ui";
import { useOnboarding } from "@/context/OnboardingContext";

type SetupPath = "guided" | "blank";

export default function SetupPathPage() {
  const { updateState, goToStep } = useOnboarding();
  const [selected, setSelected] = useState<SetupPath>("guided");

  const handleContinue = async () => {
    await updateState({
      setupPath: selected,
    });
    await goToStep("business");
  };

  return (
    <div className="flex flex-col h-full max-w-4xl mx-auto justify-center">
      <div className="mb-8 text-center md:text-left">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">
          How would you like to start?
        </h1>
        <p className="text-gray-500">
          Choose the path that fits your comfort level.
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-6 mb-8">
        {/* Option A: Guided Templates */}
        <button
          onClick={() => setSelected("guided")}
          className={cn(
            "text-left p-1 rounded-2xl border-2 transition-all duration-200 relative group overflow-hidden flex flex-col h-full",
            selected === "guided"
              ? "border-black bg-gray-50 ring-1 ring-black/5"
              : "border-gray-200 bg-white hover:border-gray-300",
          )}
        >
          <div className="p-6 relative z-10 flex-grow">
            <div className="flex items-center justify-between mb-4">
              <div
                className={cn(
                  "w-10 h-10 rounded-full flex items-center justify-center transition-colors",
                  selected === "guided"
                    ? "bg-black text-white"
                    : "bg-gray-100 text-gray-500",
                )}
              >
                <Icon name="LayoutTemplate" size={20} />
              </div>
              {selected === "guided" && (
                <span className="bg-black text-white text-[10px] font-bold px-2 py-1 rounded-full uppercase tracking-wide">
                  Recommended
                </span>
              )}
            </div>
            <h3 className="font-bold text-gray-900 mb-1 text-lg">
              Guided templates
            </h3>
            <p className="text-sm text-gray-500 mb-4">
              Fastest setup. Proven workflows pre-configured for your industry.
            </p>
          </div>

          {/* Mini Preview Panel - Live Switcher */}
          <div className="mt-auto px-6 pb-0 opacity-80 group-hover:opacity-100 transition-opacity">
            <div className="bg-white border-t border-x border-gray-200 rounded-t-lg shadow-sm p-3 h-28 relative overflow-hidden">
              {/* Test Dashboard UI for Template */}
              <div className="absolute top-3 left-3 right-3 bottom-0 space-y-2">
                <div className="flex gap-2">
                  <div className="w-1/3 h-2 bg-gray-200 rounded-full" />
                  <div className="w-1/3 h-2 bg-gray-100 rounded-full" />
                </div>
                <div className="grid grid-cols-2 gap-2 mt-2">
                  <div className="h-16 bg-blue-50/50 rounded border border-blue-100 flex flex-col items-center justify-center gap-1">
                    <div className="w-8 h-8 rounded-full bg-blue-100" />
                    <div className="w-12 h-1.5 bg-blue-200 rounded-full" />
                  </div>
                  <div className="h-16 bg-green-50/50 rounded border border-green-100 flex flex-col items-center justify-center gap-1">
                    <div className="w-8 h-8 rounded-full bg-green-100" />
                    <div className="w-12 h-1.5 bg-green-200 rounded-full" />
                  </div>
                </div>
              </div>
              {/* Overlay when not selected */}
              {selected !== "guided" && (
                <div className="absolute inset-0 bg-white/50 backdrop-blur-[1px]" />
              )}
            </div>
          </div>
        </button>

        {/* Option B: Start from Scratch */}
        <button
          onClick={() => setSelected("blank")}
          className={cn(
            "text-left p-1 rounded-2xl border-2 transition-all duration-200 relative group overflow-hidden flex flex-col h-full",
            selected === "blank"
              ? "border-black bg-gray-50 ring-1 ring-black/5"
              : "border-gray-200 bg-white hover:border-gray-300",
          )}
        >
          <div className="p-6 relative z-10 flex-grow">
            <div className="flex items-center justify-between mb-4">
              <div
                className={cn(
                  "w-10 h-10 rounded-full flex items-center justify-center transition-colors",
                  selected === "blank"
                    ? "bg-black text-white"
                    : "bg-gray-100 text-gray-500",
                )}
              >
                <Icon name="PenTool" size={20} />
              </div>
            </div>
            <h3 className="font-bold text-gray-900 mb-1 text-lg">
              Start from scratch
            </h3>
            <p className="text-sm text-gray-500 mb-4">
              Full control. Build your own workflows field by field.
            </p>
          </div>
          {/* Mini Preview Panel - Live Switcher */}
          <div className="mt-auto px-6 pb-0 opacity-80 group-hover:opacity-100 transition-opacity">
            <div className="bg-white border-t border-x border-gray-200 rounded-t-lg shadow-sm p-3 h-28 relative overflow-hidden flex items-center justify-center">
              {/* Test Dashboard UI for Blank */}
              <div className="text-xs text-gray-400 border border-dashed border-gray-300 px-4 py-2 rounded flex items-center gap-2">
                <Icon name="Plus" size={14} />
                Add Widget
              </div>
              {/* Overlay when not selected */}
              {selected !== "blank" && (
                <div className="absolute inset-0 bg-white/50 backdrop-blur-[1px]" />
              )}
            </div>
          </div>
        </button>
      </div>

      <div className="flex justify-end">
        <Button
          onClick={handleContinue}
          className="!bg-black text-white h-12 px-8 rounded-xl text-base shadow-lg hover:shadow-xl hover:translate-y-[-1px] transition-all"
        >
          Continue
          <Icon name="ArrowRight" className="ml-2 w-4 h-4" />
        </Button>
      </div>
    </div>
  );
}
