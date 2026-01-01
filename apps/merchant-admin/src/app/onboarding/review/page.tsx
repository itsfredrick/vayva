"use client";

import React, { useState } from "react";
import { Button, Icon, cn } from "@vayva/ui";
import { useOnboarding } from "@/context/OnboardingContext";
import { useRouter } from "next/navigation";

// Master Prompt Step 11: Review (Expanded)
// Change Impact: Warn if editing critical sections
// Confidence Check: "I confirm" checkbox
// No forced upgrades or spam

export default function ReviewPage() {
  const { state, completeOnboarding } = useOnboarding();
  const [confirmed, setConfirmed] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();

  if (!state)
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Icon name="Loader" className="animate-spin" size={24} />
      </div>
    );

  const handleFinish = async () => {
    setIsSubmitting(true);
    await completeOnboarding();
  };

  const sections = [
    {
      title: "Identity & Location",
      items: [
        { label: "Business Name", value: state.business?.name },
        { label: "Location", value: state.business?.location?.city },
      ],
    },
    {
      title: "Operations Model",
      items: [{ label: "Template", value: state.template?.name }],
    },
  ];

  return (
    <div className="max-w-4xl mx-auto pb-24">
      <div className="text-center mb-12">
        <div className="inline-flex items-center gap-2 bg-green-50 text-green-700 px-3 py-1 rounded-full text-xs font-bold mb-4 border border-green-100">
          <Icon name="Check" size={14} /> Setup Complete
        </div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Review your system
        </h1>
        <p className="text-gray-500">
          Confirm your configuration before launching.
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-6 mb-12">
        {sections.map((section, idx) => (
          <div
            key={idx}
            className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm relative overflow-hidden"
          >
            <div className="mb-4">
              <h3 className="font-bold text-gray-900">{section.title}</h3>
            </div>
            <div className="space-y-3 relative z-10">
              {section.items.map((item, i) => (
                <div key={i} className="flex justify-between text-sm">
                  <span className="text-gray-500">{item.label}</span>
                  <span className="font-medium text-gray-900 capitalize">
                    {item.value || "-"}
                  </span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Confidence Check & CTA */}
      <div className="bg-white border border-gray-200 p-8 rounded-3xl shadow-xl max-w-lg mx-auto">
        <div
          className="flex items-start gap-4 mb-6 cursor-pointer"
          onClick={() => setConfirmed(!confirmed)}
        >
          <div
            className={cn(
              "w-6 h-6 rounded border-2 flex items-center justify-center shrink-0 transition-colors mt-0.5",
              confirmed
                ? "bg-black border-black text-white"
                : "border-gray-300 bg-white",
            )}
          >
            {confirmed && <Icon name="Check" size={16} />}
          </div>
          <div className="text-sm select-none">
            <span className="font-bold text-gray-900 block mb-1">
              I confirm this setup matches my business.
            </span>
            <span className="text-gray-500">
              This helps Vayva personalize your dashboard defaults. You can
              change settings anytime.
            </span>
          </div>
        </div>

        <Button
          onClick={handleFinish}
          disabled={!confirmed || isSubmitting}
          className={cn(
            "!bg-black text-white h-14 w-full rounded-xl text-lg font-bold shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-3",
            (!confirmed || isSubmitting) && "opacity-50 cursor-not-allowed",
          )}
        >
          {isSubmitting ? (
            <>Preparing Dashboard...</>
          ) : (
            <>
              Finish & Go to Dashboard <Icon name="ArrowRight" size={20} />
            </>
          )}
        </Button>
      </div>
    </div>
  );
}
