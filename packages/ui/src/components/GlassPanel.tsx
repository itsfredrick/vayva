import * as React from "react";

import { cn } from "../utils";

interface GlassPanelProps extends React.HTMLAttributes<HTMLDivElement> {
  intensity?: "low" | "medium" | "high";
}

export function GlassPanel({
  className,
  intensity = "medium",
  ...props
}: GlassPanelProps) {
  const intensityMap = {
    low: "bg-white/40 backdrop-blur-md border-white/20",
    medium: "bg-white/60 backdrop-blur-xl border-white/30",
    high: "bg-white/80 backdrop-blur-2xl border-white/40",
  };

  return (
    <div
      className={cn(
        "rounded-2xl border shadow-sm",
        intensityMap[intensity],
        className,
      )}
      {...props}
    />
  );
}
