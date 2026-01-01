"use client";

import React from "react";
import { useEducation } from "@/hooks/useEducation";

interface WorkflowNudgeProps {
  userId: string;
  guidanceId: string;
  message: string;
}

export function WorkflowNudge({
  userId,
  guidanceId,
  message,
}: WorkflowNudgeProps) {
  const { shouldShow, dismiss } = useEducation(userId, guidanceId);

  if (!shouldShow) {
    return null;
  }

  return (
    <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mb-4">
      <div className="flex justify-between items-start gap-4">
        <p className="text-sm text-amber-900">{message}</p>
        <button
          onClick={dismiss}
          className="text-amber-600 hover:text-amber-700 text-sm flex-shrink-0"
          aria-label="Dismiss"
        >
          ×
        </button>
      </div>
    </div>
  );
}
