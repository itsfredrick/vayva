"use client";

import React, { useEffect } from "react";
import { useEducation } from "@/hooks/useEducation";

interface FirstTimeHintProps {
  userId: string;
  guidanceId: string;
  message: string;
  onComplete?: () => void;
}

export function FirstTimeHint({
  userId,
  guidanceId,
  message,
  onComplete,
}: FirstTimeHintProps) {
  const { shouldShow, markShown, markCompleted } = useEducation(
    userId,
    guidanceId,
  );

  useEffect(() => {
    if (shouldShow) {
      markShown();
    }
  }, [shouldShow]);

  useEffect(() => {
    // Auto-dismiss after action completion
    if (onComplete) {
      const handleComplete = () => {
        markCompleted();
      };
      // Listen for completion event
      window.addEventListener(
        `education:${guidanceId}:complete`,
        handleComplete,
      );
      return () => {
        window.removeEventListener(
          `education:${guidanceId}:complete`,
          handleComplete,
        );
      };
    }
  }, [guidanceId, onComplete]);

  if (!shouldShow) {
    return null;
  }

  return (
    <div className="inline-flex items-start gap-2 bg-blue-50 border border-blue-200 rounded px-3 py-2 text-sm text-blue-900 mb-4">
      <span className="text-blue-500">💡</span>
      <p>{message}</p>
    </div>
  );
}
