import React from "react";
import { cn } from "../utils";

type StatusType = "success" | "warning" | "error" | "neutral" | "info";

interface StatusChipProps {
  status: string;
  type?: StatusType;
  className?: string;
}

export function StatusChip({
  status,
  type = "neutral",
  className,
}: StatusChipProps) {
  const styles = {
    success: "bg-green-100 text-green-700 border-green-200",
    warning: "bg-yellow-100 text-yellow-700 border-yellow-200",
    error: "bg-red-100 text-red-700 border-red-200",
    neutral: "bg-gray-100 text-gray-700 border-gray-200",
    info: "bg-blue-100 text-blue-700 border-blue-200",
  };

  // Simple auto-detection if type is not explicit
  const detectType = (s: string): StatusType => {
    const sl = s.toLowerCase();
    if (["paid", "active", "delivered", "completed", "verified"].includes(sl))
      return "success";
    if (["pending", "processing", "draft"].includes(sl)) return "warning";
    if (["failed", "cancelled", "rejected", "error"].includes(sl))
      return "error";
    return "neutral";
  };

  const finalType = type === "neutral" ? detectType(status) : type;

  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
        styles[finalType],
        className,
      )}
    >
      {status}
    </span>
  );
}
