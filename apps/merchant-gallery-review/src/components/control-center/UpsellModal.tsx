"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { Icon } from "@vayva/ui";

interface UpsellModalProps {
  isOpen: boolean;
  onClose: () => void;
  onUpgrade: () => void;
  templateName: string;
  requiredTier: string;
}

export const UpsellModal = ({
  isOpen,
  onClose,
  onUpgrade,
  templateName,
  requiredTier,
}: UpsellModalProps) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl w-full max-w-lg shadow-2xl animate-in zoom-in-95 duration-200 relative p-8">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full hover:bg-gray-100 transition-colors"
        >
          <Icon name={"X" as any} size={20} />
        </button>

        <div className="text-center">
          <div className="w-16 h-16 bg-primary-100 text-primary-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
            <Icon name={"Lock" as any} size={32} />
          </div>

          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Unlock {templateName}
          </h2>
          <p className="text-gray-500 mb-8 leading-relaxed">
            This premium template is exclusive to our{" "}
            <strong>{requiredTier}</strong> plan. Upgrade today to unlock this
            and many other pro features.
          </p>

          <div className="space-y-3">
            <Button
              onClick={onUpgrade}
              className="w-full bg-black text-white py-6 rounded-2xl text-lg font-bold shadow-xl hover:scale-[1.02] active:scale-[0.98] transition-all"
            >
              Upgrade to {requiredTier}
            </Button>
            <Button
              variant="ghost"
              onClick={onClose}
              className="w-full text-gray-400 hover:text-gray-600"
            >
              Maybe Later
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
