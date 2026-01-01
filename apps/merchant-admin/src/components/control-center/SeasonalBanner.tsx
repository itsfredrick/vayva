import React from "react";
import { Icon, cn } from "@vayva/ui";
import { SeasonalSuggestion } from "@/types/intelligence";

export const SeasonalBanner = ({
  suggestion,
  onApply,
  onDismiss,
}: {
  suggestion: SeasonalSuggestion;
  onApply: () => void;
  onDismiss: () => void;
}) => {
  return (
    <div className="bg-gradient-to-r from-emerald-900 to-emerald-800 rounded-2xl p-6 text-white relative overflow-hidden shadow-lg animate-in fade-in slide-in-from-top-4 duration-500 mb-8">
      {/* Background Pattern */}
      <div className="absolute top-0 right-0 p-8 opacity-10">
        <Icon name="Moon" size={120} />
      </div>

      <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <span className="bg-emerald-500/20 text-emerald-100 text-[10px] font-bold px-2 py-0.5 rounded-full uppercase border border-emerald-500/30">
              Seasonal Intelligence
            </span>
            <span className="text-emerald-200 text-xs flex items-center gap-1">
              <Icon name="TrendingUp" size={10} /> Expect{" "}
              {suggestion.expected_uplift} Uplift
            </span>
          </div>
          <h3 className="text-xl font-heading font-bold mb-2">
            Ramadan traffic is up 32%.
          </h3>
          <p className="text-emerald-100 text-sm mb-4">
            Switch to a Ramadan-optimized layout with Iftar countdowns and
            special menu highlighting.
          </p>

          <div className="flex flex-wrap gap-2 text-xs">
            {suggestion.changes.map((change, i) => (
              <span
                key={i}
                className="bg-black/20 px-2 py-1 rounded flex items-center gap-1"
              >
                <Icon name="Check" size={10} className="text-emerald-400" />{" "}
                {change}
              </span>
            ))}
          </div>
        </div>

        <div className="flex gap-3 shrink-0">
          <button
            onClick={onDismiss}
            className="px-4 py-2 rounded-xl text-sm font-bold text-emerald-100 hover:bg-white/10 transition-colors"
          >
            Dismiss
          </button>
          <button
            onClick={onApply}
            className="bg-white text-emerald-900 px-6 py-2 rounded-xl text-sm font-bold hover:bg-emerald-50 transition-colors shadow-md"
          >
            Apply Layout
          </button>
        </div>
      </div>

      {/* Close X */}
      <button
        onClick={onDismiss}
        className="absolute top-4 right-4 text-emerald-400 hover:text-white transition-colors"
      >
        <Icon name="X" size={16} />
      </button>
    </div>
  );
};
