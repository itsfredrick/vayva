"use client";

import React from "react";
import { Input, Button } from "@vayva/ui";
import { StepShell } from "./StepShell";

interface StoreNameStepProps {
  value: string;
  onChange: (value: string) => void;
  onNext: () => void;
}

export function StoreNameStep({ value, onChange, onNext }: StoreNameStepProps) {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (value.trim()) onNext();
  };

  return (
    <StepShell
      title="What's your store name?"
      description="This will be used to create your store URL."
    >
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <Input
            placeholder="e.g. My Awesome Brand"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            className="h-14 text-lg bg-gray-50 border-transparent focus:bg-white transition-all"
            autoFocus
          />
          {value && (
            <p className="mt-3 text-sm text-[#1d1d1f]/50 flex items-center gap-2">
              <span className="bg-green-100 text-green-700 px-2 py-0.5 rounded-full text-xs font-bold">
                Available
              </span>
              vayva.store/{value.toLowerCase().replace(/\s+/g, "-")}
            </p>
          )}
        </div>

        <Button
          type="submit"
          disabled={!value.trim()}
          className="w-full h-12 bg-[#1d1d1f] hover:bg-[#1d1d1f]/90 text-white font-bold rounded-xl"
        >
          Continue
        </Button>
      </form>
    </StepShell>
  );
}
