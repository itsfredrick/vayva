"use client";

import React from "react";
import { Button } from "@vayva/ui";

interface SetupModeSelectorProps {
  onSelectMode: (mode: "guided" | "quick") => void;
}

export function SetupModeSelector({ onSelectMode }: SetupModeSelectorProps) {
  const [selectedMode, setSelectedMode] = React.useState<"guided" | "quick">(
    "guided",
  );

  const handleContinue = () => {
    onSelectMode(selectedMode);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4 py-12">
      <div className="max-w-3xl w-full bg-white rounded-lg border border-gray-200 p-8">
        {/* Header */}
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-[#0F172A] mb-4">
            How would you like to set this up?
          </h1>
        </div>

        {/* Mode Options */}
        <div className="grid md:grid-cols-2 gap-6 mb-8">
          {/* Guided Setup */}
          <button
            onClick={() => setSelectedMode("guided")}
            className={`p-6 rounded-lg border-2 transition-all text-left ${
              selectedMode === "guided"
                ? "border-[#22C55E] bg-[#22C55E]/5"
                : "border-gray-200 hover:border-gray-300"
            }`}
          >
            <div className="flex items-start justify-between mb-3">
              <h3 className="text-xl font-bold text-[#0F172A]">Guided setup</h3>
              <div
                className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                  selectedMode === "guided"
                    ? "border-[#22C55E]"
                    : "border-gray-300"
                }`}
              >
                {selectedMode === "guided" && (
                  <div className="w-3 h-3 bg-[#22C55E] rounded-full"></div>
                )}
              </div>
            </div>
            <p className="text-[#64748B] mb-3">
              Step-by-step, minimal decisions.
            </p>
            <span className="inline-block text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded">
              Recommended
            </span>
          </button>

          {/* Quick Setup */}
          <button
            onClick={() => setSelectedMode("quick")}
            className={`p-6 rounded-lg border-2 transition-all text-left ${
              selectedMode === "quick"
                ? "border-[#22C55E] bg-[#22C55E]/5"
                : "border-gray-200 hover:border-gray-300"
            }`}
          >
            <div className="flex items-start justify-between mb-3">
              <h3 className="text-xl font-bold text-[#0F172A]">Quick setup</h3>
              <div
                className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                  selectedMode === "quick"
                    ? "border-[#22C55E]"
                    : "border-gray-300"
                }`}
              >
                {selectedMode === "quick" && (
                  <div className="w-3 h-3 bg-[#22C55E] rounded-full"></div>
                )}
              </div>
            </div>
            <p className="text-[#64748B]">
              Apply defaults immediately and enter dashboard.
            </p>
          </button>
        </div>

        {/* Continue Button */}
        <Button
          onClick={handleContinue}
          className="w-full bg-[#22C55E] hover:bg-[#16A34A] text-white py-4 text-lg font-semibold"
        >
          Continue
        </Button>
      </div>
    </div>
  );
}
