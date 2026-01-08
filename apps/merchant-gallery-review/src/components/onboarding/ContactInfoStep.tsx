"use client";

import React from "react";
import { Input, Button } from "@vayva/ui";
import { StepShell } from "./StepShell";

interface ContactInfoStepProps {
  value: { phone: string; address: string; city: string };
  onChange: (field: string, value: string) => void;
  onNext: () => void;
  onBack: () => void;
}

export function ContactInfoStep({
  value,
  onChange,
  onNext,
  onBack,
}: ContactInfoStepProps) {
  const isValid = value.phone && value.address && value.city;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isValid) onNext();
  };

  return (
    <StepShell
      title="How can customers reach you?"
      description="Add your business contact details."
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <Input
            placeholder="Phone Number (WhatsApp)"
            value={value.phone}
            onChange={(e) => onChange("phone", e.target.value)}
            className="h-12 bg-gray-50 border-transparent focus:bg-white"
          />
        </div>
        <div>
          <Input
            placeholder="Store Address"
            value={value.address}
            onChange={(e) => onChange("address", e.target.value)}
            className="h-12 bg-gray-50 border-transparent focus:bg-white"
          />
        </div>
        <div>
          <Input
            placeholder="City / State"
            value={value.city}
            onChange={(e) => onChange("city", e.target.value)}
            className="h-12 bg-gray-50 border-transparent focus:bg-white"
          />
        </div>

        <div className="flex gap-3 pt-4">
          <Button
            variant="outline"
            onClick={onBack}
            className="flex-1 h-12 rounded-xl"
            type="button"
          >
            Back
          </Button>
          <Button
            type="submit"
            disabled={!isValid}
            className="flex-[2] h-12 bg-[#1d1d1f] hover:bg-[#1d1d1f]/90 text-white font-bold rounded-xl"
          >
            Continue
          </Button>
        </div>
      </form>
    </StepShell>
  );
}
