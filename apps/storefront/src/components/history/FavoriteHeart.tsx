"use client";

import { Heart } from "lucide-react";

interface FavoriteHeartProps {
  isFavorite: boolean;
  onToggle: () => void;
  size?: number;
}

export function FavoriteHeart({
  isFavorite,
  onToggle,
  size = 20,
}: FavoriteHeartProps) {
  return (
    <button
      onClick={onToggle}
      className="p-2 rounded-full hover:bg-white/50 transition-colors focus:outline-none group"
      aria-label={isFavorite ? "Remove from favorites" : "Add to favorites"}
    >
      <Heart
        size={size}
        className={`
                    transition-all duration-300
                    ${
                      isFavorite
                        ? "fill-red-500 text-red-500 scale-110"
                        : "text-gray-400 group-hover:text-red-400"
                    }
                `}
      />
    </button>
  );
}
