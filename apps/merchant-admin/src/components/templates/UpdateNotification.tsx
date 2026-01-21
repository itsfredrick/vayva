"use client";

import React from "react";
import { Button } from "@vayva/ui";

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
          <Button
            variant="link"
            onClick={onReview}
            className="text-sm text-blue-600 hover:text-blue-700 underline font-semibold h-auto p-0"
          >
            Review update
          </Button>
        </div>
        {onDismiss && (
          <Button
            variant="ghost"
            size="icon"
            onClick={onDismiss}
            className="text-blue-600 hover:text-blue-700 h-6 w-6"
            aria-label="Dismiss"
          >
            ×
          </Button>
        )}
      </div>
    </div>
  );
}
