"use client";

import React from "react";
import Link from "next/link";
import { Button } from "@vayva/ui";

interface DeprecationNoticeProps {
  templateName: string;
  message: string;
  hasReplacement: boolean;
  replacementTemplateName?: string;
  replacementTemplateId?: string;
  hasMigration: boolean;
  onDismiss?: () => void;
}

export function DeprecationNotice({
  templateName,
  message,
  hasReplacement,
  replacementTemplateName,
  replacementTemplateId,
  hasMigration,
  onDismiss,
}: DeprecationNoticeProps) {
  return (
    <div className="bg-amber-50 border border-amber-200 rounded-lg p-6">
      <div className="flex justify-between items-start gap-4">
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-amber-900 mb-2">
            Template No Longer Recommended
          </h3>
          <p className="text-sm text-amber-800 mb-4">{message}</p>

          {hasReplacement && replacementTemplateName && (
            <div className="bg-white border border-amber-200 rounded p-4 mb-4">
              <p className="text-sm font-semibold text-[#0F172A] mb-2">
                Suggested alternative:
              </p>
              <p className="text-sm text-[#64748B] mb-3">
                {replacementTemplateName}
              </p>
              {replacementTemplateId && (
                <Link href={`/templates/${replacementTemplateId}`}>
                  <Button
                    variant="outline"
                    className="border-2 border-amber-300"
                  >
                    View template
                  </Button>
                </Link>
              )}
            </div>
          )}

          {hasMigration && (
            <div className="flex gap-3">
              <Link href="/templates/migration">
                <Button variant="outline" className="border-2 border-amber-300">
                  Migration assistance
                </Button>
              </Link>
            </div>
          )}
        </div>

        {onDismiss && (
          <button
            onClick={onDismiss}
            className="text-amber-600 hover:text-amber-700 text-sm flex-shrink-0"
            aria-label="Dismiss"
          >
            ×
          </button>
        )}
      </div>
    </div>
  );
}
