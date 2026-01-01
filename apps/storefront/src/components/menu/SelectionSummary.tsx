"use client";

import { LocaleKey, LOCALES } from "@/data/locales";
import { ShoppingBag, Star, Info } from "lucide-react";
import { Meal } from "@/types/menu";

interface SelectionSummaryProps {
  selectedMeals: Meal[];
  mealsPerWeek: number;
  totalCost: number;
  lang: LocaleKey;
  isLocked: boolean;
  onSave: () => void;
}

export function SelectionSummary({
  selectedMeals,
  mealsPerWeek,
  totalCost,
  lang,
  isLocked,
  onSave,
}: SelectionSummaryProps) {
  const t = LOCALES[lang];
  const remaining = mealsPerWeek - selectedMeals.length;
  const progress = (selectedMeals.length / mealsPerWeek) * 100;

  return (
    <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 sticky top-24">
      <h2 className="font-bold text-lg mb-4 flex items-center gap-2">
        <ShoppingBag className="w-5 h-5 text-[#22C55E]" />
        {t.summary.title}
      </h2>

      {/* Progress Bar */}
      <div className="mb-6">
        <div className="flex justify-between text-sm font-medium mb-2">
          <span
            className={remaining === 0 ? "text-[#22C55E]" : "text-gray-600"}
          >
            {selectedMeals.length} / {mealsPerWeek} {t.selected}
          </span>
          {remaining > 0 && (
            <span className="text-orange-500 text-xs">
              {remaining} more needed
            </span>
          )}
        </div>
        <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
          <div
            className={`h-full transition-all duration-500 ease-out ${remaining === 0 ? "bg-[#22C55E]" : "bg-orange-400"}`}
            style={{ width: `${Math.min(progress, 100)}%` }}
          />
        </div>
      </div>

      {/* Selected List Preview */}
      <div className="space-y-3 mb-6 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
        {selectedMeals.map((meal) => (
          <div key={meal.id} className="flex gap-3 items-start">
            <img
              src={meal.image}
              alt=""
              className="w-12 h-12 rounded-lg object-cover bg-gray-100 flex-shrink-0"
            />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900 line-clamp-1">
                {meal.title[lang]}
              </p>
              <p className="text-xs text-gray-500">{meal.tags.kcal} kcal</p>
            </div>
          </div>
        ))}
        {selectedMeals.length === 0 && (
          <div className="text-center py-8 text-gray-400 text-sm italic bg-gray-50 rounded-xl border border-dashed border-gray-200">
            No meals selected yet
          </div>
        )}
      </div>

      {/* Summary Footer */}
      <div className="border-t border-gray-100 pt-4 space-y-4">
        <div className="flex justify-between items-center text-sm">
          <span className="text-gray-600">
            {t.summary.total} {t.summary.servings}
          </span>
          <span className="font-medium">{(selectedMeals.length || 0) * 2}</span>
        </div>
        <div className="flex justify-between items-center text-base font-bold">
          <span className="text-gray-900">{t.summary.cost}</span>
          <span className="text-gray-900">₺{totalCost}</span>
        </div>

        <div className="bg-blue-50 text-blue-700 p-3 rounded-xl text-xs flex gap-2">
          <Info className="w-4 h-4 flex-shrink-0" />
          {t.planSummary}
        </div>

        <button
          onClick={onSave}
          disabled={isLocked || selectedMeals.length !== mealsPerWeek}
          className={`
                        w-full py-3.5 rounded-xl font-bold text-sm transition-all shadow-lg shadow-[#22C55E]/10
                        ${
                          isLocked || selectedMeals.length !== mealsPerWeek
                            ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                            : "bg-[#0B1220] text-white hover:bg-black hover:shadow-xl"
                        }
                    `}
        >
          {isLocked ? "Locked" : t.saveSelection}
        </button>
      </div>
    </div>
  );
}
