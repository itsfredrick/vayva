"use client";

import React from "react";

interface EmptyStateGuidanceProps {
  primary: string;
  secondary?: string;
  icon?: React.ReactNode;
}

export function EmptyStateGuidance({
  primary,
  secondary,
  icon,
}: EmptyStateGuidanceProps) {
  return (
    <div className="flex flex-col items-center justify-center py-12 px-4">
      {icon && <div className="mb-4 text-4xl text-gray-400">{icon}</div>}

      <p className="text-center text-[#64748B] mb-2 max-w-md">{primary}</p>

      {secondary && (
        <p className="text-center text-sm text-[#94A3B8] max-w-md">
          {secondary}
        </p>
      )}
    </div>
  );
}
