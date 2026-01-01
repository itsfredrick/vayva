"use client";

import React, { useState, useEffect } from "react";
import { Button, Input, Icon } from "@vayva/ui";
import { useOnboarding } from "@/context/OnboardingContext";

const PRESET_COLORS = [
  "#000000",
  "#FFFFFF",
  "#FF3B30",
  "#FF9500",
  "#FFCC00",
  "#4CD964",
  "#5AC8FA",
  "#007AFF",
  "#5856D6",
  "#FF2D55",
];

export default function BrandPage() {
  const { state, updateState, goToStep } = useOnboarding();

  const [brandColor, setBrandColor] = useState("#000000");
  const [logoUrl, setLogoUrl] = useState<string | undefined>(undefined);
  const [coverUrl, setCoverUrl] = useState<string | undefined>(undefined);

  useEffect(() => {
    if (state?.branding) {
      if (state.branding.brandColor) setBrandColor(state.branding.brandColor);
      if (state.branding.logoUrl) setLogoUrl(state.branding.logoUrl);
      if (state.branding.coverUrl) setCoverUrl(state.branding.coverUrl);
    }
  }, [state]);

  const handleColorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setBrandColor(e.target.value);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    await updateState({
      branding: {
        brandColor,
        logoUrl,
        coverUrl,
      },
    });

    await goToStep("delivery");
  };

  const handleBack = () => {
    goToStep("business");
  };

  return (
    <div className="max-w-xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-black mb-2">Brand Identity</h1>
        <p className="text-gray-600">
          Choose how your store looks to your customers.
        </p>
      </div>

      <form
        onSubmit={handleSubmit}
        className="space-y-8 bg-white p-8 rounded-2xl border border-gray-200 shadow-sm"
      >
        {/* Brand Color */}
        <div className="space-y-4">
          <label className="text-sm font-medium text-black">Brand Color</label>
          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-4">
              <div
                className="w-16 h-16 rounded-xl border-2 border-gray-100 flex items-center justify-center shadow-sm"
                style={{ backgroundColor: brandColor }}
              >
                <span className="text-xs font-bold text-white bg-black/20 px-1 rounded backdrop-blur-sm self-end mb-1">
                  Preview
                </span>
              </div>
              <div className="flex-1">
                <label className="block text-xs text-gray-400 mb-1">
                  Hex Code
                </label>
                <div className="flex items-center gap-2 border border-gray-200 rounded-lg px-3 py-2 bg-gray-50 focus-within:bg-white focus-within:ring-2 focus-within:ring-black/5">
                  <span className="text-gray-400">#</span>
                  <input
                    type="text"
                    value={brandColor.replace("#", "")}
                    onChange={(e) => setBrandColor(`#${e.target.value}`)}
                    className="flex-1 bg-transparent text-sm outline-none font-mono uppercase"
                    maxLength={6}
                  />
                  <input
                    type="color"
                    value={brandColor}
                    onChange={handleColorChange}
                    className="w-8 h-8 rounded cursor-pointer border-none p-0 bg-transparent"
                  />
                </div>
              </div>
            </div>

            {/* Presets */}
            <div className="flex flex-wrap gap-2">
              {PRESET_COLORS.map((color) => (
                <button
                  key={color}
                  type="button"
                  onClick={() => setBrandColor(color)}
                  className={`w-8 h-8 rounded-full border border-gray-200 shadow-sm transition-transform hover:scale-110 ${brandColor === color ? "ring-2 ring-black ring-offset-2" : ""}`}
                  style={{ backgroundColor: color }}
                />
              ))}
            </div>
          </div>
        </div>

        <div className="w-full h-px bg-gray-100" />

        {/* Logo Upload Placeholder */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-black">
            Store Logo{" "}
            <span className="text-gray-400 font-normal">(Optional)</span>
          </label>
          <div className="p-8 border-2 border-dashed border-gray-200 rounded-xl text-center hover:bg-gray-50 transition-colors cursor-pointer group">
            <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3 group-hover:bg-white group-hover:shadow-md transition-all">
              <Icon
                name="Image"
                className="text-gray-400 group-hover:text-black"
              />
            </div>
            <p className="text-sm font-medium text-black mb-1">
              Click to upload logo
            </p>
            <p className="text-xs text-gray-400">SVG, PNG, JPG (Max. 2MB)</p>
          </div>
        </div>

        <div className="flex items-center gap-4 pt-4">
          <Button
            type="button"
            variant="ghost"
            onClick={handleBack}
            className="flex-1 text-gray-500 hover:text-black"
          >
            Back
          </Button>
          <Button
            type="submit"
            variant="primary"
            className="flex-[2] !bg-black !text-white h-12 rounded-xl"
          >
            Continue
            <Icon name="ArrowRight" className="ml-2 w-4 h-4" />
          </Button>
        </div>
      </form>
    </div>
  );
}
