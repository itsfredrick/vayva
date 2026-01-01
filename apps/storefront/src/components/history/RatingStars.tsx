"use client";

import { Star } from "lucide-react";
import { useState } from "react";

interface RatingStarsProps {
  rating: number; // 0 if not rated
  onRate: (rating: number) => void;
  size?: number;
}

export function RatingStars({ rating, onRate, size = 18 }: RatingStarsProps) {
  const [hover, setHover] = useState(0);

  return (
    <div className="flex gap-1" onMouseLeave={() => setHover(0)}>
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          onClick={() => onRate(star)}
          onMouseEnter={() => setHover(star)}
          className="focus:outline-none transition-transform hover:scale-110"
          aria-label={`Rate ${star} stars`}
        >
          <Star
            size={size}
            className={`
                            transition-colors
                            ${
                              (hover || rating) >= star
                                ? "fill-[#FFD700] text-[#FFD700]"
                                : "text-gray-300"
                            }
                        `}
          />
        </button>
      ))}
    </div>
  );
}
