"use client";

import React from "react";

interface UpdateNotificationProps {
  templateName: string;
  currentVersion: string;
  latestVersion: string;
  onReview: () => void;
  onDismiss?: () => void;
}

export function UpdateNotification({
  templateName,
  currentVersion,
  latestVersion,
  onReview,
  onDismiss,
}: UpdateNotificationProps) {
  return (
    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
      <div className="flex justify-between items-start gap-4">
        <div className="flex-1">
          <p className="text-sm font-semibold text-blue-900 mb-1">
            Update available for {templateName}
          </p>
          <p className="text-sm text-blue-700 mb-3">
            A newer version ({latestVersion}) of your template is available.
            You're currently on {currentVersion}.
          </p>
          <button
            onClick={onReview}
            className="text-sm text-blue-600 hover:text-blue-700 underline font-semibold"
          >
            Review update
          </button>
        </div>
        {onDismiss && (
          <button
            onClick={onDismiss}
            className="text-blue-600 hover:text-blue-700 text-sm flex-shrink-0"
            aria-label="Dismiss"
          >
            ×
          </button>
        )}
      </div>
    </div>
  );
}
