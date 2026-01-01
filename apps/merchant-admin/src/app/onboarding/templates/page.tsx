"use client";

import React, { useMemo } from "react";
import { useOnboarding } from "@/context/OnboardingContext";
import { TemplateGallery } from "@/components/control-center/TemplateGallery";
import { recommendTemplate } from "@/lib/templates/recommendation-engine";
import { Template } from "@/types/templates";

export default function TemplatesPage() {
  const { state, updateState, goToStep } = useOnboarding();

  // Determine the recommended template based on onboarding data
  const recommendation = useMemo(() => {
    if (!state) return null;
    return recommendTemplate(state);
  }, [state]);

  const handleUseTemplate = async (template: Template) => {
    await updateState({
      templateSelected: true,
      template: {
        id: template.id,
        name: template.name,
      },
    });
    await goToStep("review");
  };

  // Default to 'growth' plan for onboarding preview context or use state if available
  const userPlan = (state?.plan as "free" | "growth" | "pro") || "growth";

  return (
    <div className="flex flex-col h-full max-w-7xl mx-auto pb-20">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Choose your store template
        </h1>
        <p className="text-gray-500 text-lg">
          We've selected templates that match your business needs.
          {recommendation && (
            <span className="font-medium text-purple-600 block mt-1">
              Based on your profile, we recommend:{" "}
              {recommendation.recommendedTemplate}
            </span>
          )}
        </p>
      </div>

      <TemplateGallery
        currentPlan={userPlan}
        onUseTemplate={handleUseTemplate}
        recommendedTemplateId={recommendation?.recommendedTemplate}
        recommendationReason={recommendation?.reason}
      />
    </div>
  );
}
