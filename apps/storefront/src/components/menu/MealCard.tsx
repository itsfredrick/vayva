"use client";

import { Meal } from "@/types/menu";
import { LocaleKey, LOCALES } from "@/data/locales";
import { Clock, Flame, Check } from "lucide-react";
import Image from "next/image";

interface MealCardProps {
  meal: Meal;
  isSelected: boolean;
  isLocked: boolean;
  lang: LocaleKey;
  onToggle: (id: string) => void;
  onViewDetails: (meal: Meal) => void;
}

export function MealCard({
  meal,
  isSelected,
  isLocked,
  lang,
  onToggle,
  onViewDetails,
}: MealCardProps) {
  const t = LOCALES[lang];

  return (
    <div
      className={`group relative bg-white rounded-2xl shadow-sm border overflow-hidden transition-all hover:shadow-md ${isSelected ? "ring-2 ring-[#22C55E] border-transparent" : "border-gray-100"}`}
    >
      {/* Image */}
      <button
        type="button"
        className="w-full aspect-[4/3] relative cursor-pointer block text-left"
        onClick={() => onViewDetails(meal)}
        aria-label={`View details for ${meal.title[lang]}`}
      >
        <Image
          src={meal.image}
          alt={meal.title[lang]}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-500"
        />
        {meal.isPro && (
          <div className="absolute top-3 left-3 bg-black/80 text-[#FFD700] text-xs font-bold px-2 py-1 rounded-md uppercase tracking-wide backdrop-blur-sm">
            Pro
          </div>
        )}
        {meal.tags.category && (
          <div className="absolute top-3 right-3 bg-white/90 text-gray-800 text-xs font-bold px-2 py-1 rounded-md shadow-sm backdrop-blur-sm">
            {meal.tags.category}
          </div>
        )}
      </button>

      {/* Content */}
      <div className="p-4">
        <div onClick={() => onViewDetails(meal)} className="cursor-pointer">
          <h3 className="font-bold text-gray-900 mb-1 line-clamp-1">
            {meal.title[lang]}
          </h3>
          <p className="text-sm text-gray-500 mb-3 line-clamp-1">
            {meal.subtitle?.[lang]}
          </p>

          {/* Tags */}
          <div className="flex items-center gap-3 text-xs text-gray-500 mb-4">
            <span className="flex items-center gap-1 bg-gray-50 px-2 py-1 rounded-md">
              <Clock className="w-3 h-3" /> {meal.tags.prepTime} min
            </span>
            <span className="flex items-center gap-1 bg-gray-50 px-2 py-1 rounded-md">
              <Flame className="w-3 h-3" /> {meal.tags.kcal} kcal
            </span>
          </div>
        </div>

        {/* Action */}
        <button
          onClick={() => !isLocked && onToggle(meal.id)}
          disabled={isLocked && !isSelected}
          className={`
                        w-full py-2.5 rounded-xl font-bold text-sm transition-all flex items-center justify-center gap-2
                        ${
                          isSelected
                            ? "bg-[#22C55E] text-white hover:bg-[#16A34A]"
                            : isLocked
                              ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                              : "bg-gray-50 text-gray-700 hover:bg-gray-100 hover:text-gray-900"
                        }
                    `}
        >
          {isSelected ? (
            <>
              <Check className="w-4 h-4" />
              {t.selected}
            </>
          ) : (
            t.add
          )}
        </button>
      </div>
    </div>
  );
}
