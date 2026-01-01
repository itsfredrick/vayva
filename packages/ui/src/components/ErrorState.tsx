import React from "react";
import { AlertCircle } from "lucide-react";

interface ErrorStateProps {
  title?: string;
  message: string;
  onRetry?: () => void;
}

export function ErrorState({
  title = "Something went wrong",
  message,
  onRetry,
}: ErrorStateProps) {
  return (
    <div className="p-4 bg-red-50 border border-red-100 rounded-lg flex items-start gap-3">
      <AlertCircle className="text-red-500 shrink-0 mt-0.5" size={20} />
      <div className="flex-1">
        <h4 className="font-bold text-red-900 text-sm mb-1">{title}</h4>
        <p className="text-sm text-red-700">{message}</p>
        {onRetry && (
          <button
            onClick={onRetry}
            className="mt-3 text-xs font-bold text-red-600 hover:text-red-800 underline"
          >
            Try Again
          </button>
        )}
      </div>
    </div>
  );
}
