"use client";

import { Sparkles } from "lucide-react";

interface RecommendedBadgeProps {
  className?: string;
  animated?: boolean;
}

export function RecommendedBadge({
  className = "",
  animated = true,
}: RecommendedBadgeProps) {
  return (
    <div className={`inline-flex items-center gap-2 ${className}`}>
      <div
        className={`
          relative overflow-hidden
          px-3 py-2 sm:px-4 sm:py-2
          min-h-[32px] sm:min-h-[36px]
          bg-gradient-to-r from-youtube-red via-youtube-red to-youtube-red-hover
          border-2 border-youtube-red-light/60
          ring-2 ring-white/20
          rounded-full
          shadow-lg shadow-youtube-red/30
          backdrop-blur-md
          transform transition-all duration-300
          hover:scale-105 hover:shadow-xl hover:shadow-youtube-red/50
          ${animated ? "animate-breathe" : ""}
          group
        `}
      >
        {/* Background shimmer effect */}
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 animate-shimmer"></div>

        {/* Badge content */}
        <div className="relative z-10 flex items-center gap-1.5">
          <Sparkles className="h-3 w-3 sm:h-3.5 sm:w-3.5 text-white animate-pulse" />
          <span className="text-xs sm:text-sm font-bold text-white tracking-wide drop-shadow-sm">
            Recommended
          </span>
        </div>

        {/* Glow border effect */}
        <div className="absolute inset-0 rounded-full border-2 border-white/30 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
      </div>
    </div>
  );
}
