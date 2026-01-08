"use client";

import React, { useState } from "react";
import { Button, Icon, cn } from "@vayva/ui";
import { useOnboarding } from "@/context/OnboardingContext";

export default function ReviewPage() {
  const { state, completeOnboarding, startEditing } = useOnboarding();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [confirmed, setConfirmed] = useState(false);

  const handleEdit = (stepPath: string) => {
    // Extract step id from path (e.g. /onboarding/business -> business)
    const stepId = stepPath.split("/").pop() as any;
    startEditing(stepId);
  };

  const handleFinish = async () => {
    setIsSubmitting(true);
    // Simulate API delay
    setTimeout(async () => {
      await completeOnboarding();
    }, 2000);
  };

  const sections = [
    {
      title: "Business Profile",
      editLink: "/onboarding/business",
      items: [
        { label: "Business Name", value: state?.business?.name },
        { label: "Store Name", value: state?.business?.storeName },
        { label: "Store URL", value: state?.business?.slug ? `${state.business.slug}.vayva.shop` : null },
        { label: "Type", value: state?.business?.type, capitalize: true },
      ],
    },
    {
      title: "Communication",
      editLink: "/onboarding/communication",
      items: [
        { label: "WhatsApp", value: state?.whatsappConnected ? state?.whatsapp?.number : "Not Connected" },
        { label: "Team Size", value: state?.team?.type, capitalize: true },
        { label: "Invites", value: state?.team?.invites?.length ? `${state.team.invites.length} Pending` : "None" },
      ],
    },
    {
      title: "Visuals",
      editLink: "/onboarding/visuals",
      items: [
        { label: "Template", value: state?.template?.name || "None" },
        { label: "Brand Color", value: state?.branding?.brandColor || state?.branding?.colors?.primary },
      ],
    },
    {
      title: "Finance",
      editLink: "/onboarding/finance",
      items: [
        { label: "Bank", value: state?.finance?.bankName },
        { label: "Account", value: state?.finance?.accountNumber },
        { label: "Methods", value: Object.entries(state?.finance?.methods || {}).filter(([_, v]) => v).map(([k]) => k).join(", "), capitalize: true },
      ],
    },
    {
      title: "Logistics",
      editLink: "/onboarding/logistics",
      items: [
        { label: "Policy", value: state?.logistics?.policy, capitalize: true }
      ]
    },
    {
      title: "KYC Status",
      editLink: "/onboarding/kyc",
      items: [
        { label: "Identity", value: state?.kyc?.fullName },
        { label: "Status", value: state?.kyc?.status, capitalize: true },
        // Conditional CAC
        ...(state?.business?.type === "registered" ? [{
          label: "CAC Number",
          value: state?.kyc?.cacNumber || "Pending"
        }] : [])
      ]
    }
  ];

  return (
    <div className="max-w-4xl mx-auto py-8 pb-24">
      <div className="mb-8">
        <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm mb-8">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                Launch Readiness
                <span className="bg-green-100 text-green-700 text-xs px-2 py-0.5 rounded-full">100%</span>
              </h2>
              <p className="text-sm text-gray-500">You are 100% ready to go live! 🏁</p>
            </div>
            <div className="hidden md:block">
              <Button size="sm" variant="outline" disabled className="opacity-50 cursor-not-allowed">
                Auto-Configured
              </Button>
            </div>
          </div>
          {/* Progress Bar */}
          <div className="h-2 w-full bg-gray-100 rounded-full overflow-hidden">
            <div className="h-full bg-green-500 w-full animate-in slide-in-from-left duration-1000" />
          </div>
        </div>

        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Review your Store
          </h1>
          <p className="text-gray-500">
            Double check everything before we build your dashboard.
          </p>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-6 mb-12">
        {sections.map((section, idx) => (
          <div
            key={idx}
            className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm relative overflow-hidden group hover:border-black/20 transition-all"
          >
            <div className="flex justify-between items-start mb-4">
              <h3 className="font-bold text-gray-900">{section.title}</h3>
              <button
                onClick={() => handleEdit(section.editLink)}
                className="text-xs font-bold text-gray-400 hover:text-black hover:underline opacity-0 group-hover:opacity-100 transition-opacity"
              >
                Edit
              </button>
            </div>
            <div className="space-y-3 relative z-10">
              {section.items.map((item, i) => (
                <div key={i} className="flex justify-between text-sm py-1 border-b border-gray-50 last:border-0">
                  <span className="text-gray-500">{item.label}</span>
                  <span className={cn("font-medium text-gray-900 text-right", item.capitalize && "capitalize")}>
                    {item.value || "-"}
                  </span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Confirmation & Launch */}
      <div className="fixed bottom-0 left-0 w-full bg-white border-t border-gray-100 p-4 lg:p-6 z-50">
        <div className="max-w-4xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div
            className="flex items-center gap-3 cursor-pointer group"
            onClick={() => setConfirmed(!confirmed)}
          >
            <div
              className={cn(
                "w-5 h-5 rounded border-2 flex items-center justify-center shrink-0 transition-colors",
                confirmed
                  ? "bg-black border-black text-white"
                  : "border-gray-300 bg-white group-hover:border-gray-400",
              )}
            >
              {confirmed && <Icon name="Check" size={14} />}
            </div>
            <span className="text-sm text-gray-600 select-none">
              I confirm that the details provided are accurate.
            </span>
          </div>

          <Button
            onClick={handleFinish}
            disabled={!confirmed || isSubmitting}
            className={cn(
              "!bg-black text-white px-8 rounded-xl h-12 shadow-lg hover:shadow-xl transition-all min-w-[200px]",
              (!confirmed || isSubmitting) && "opacity-70"
            )}
          >
            {isSubmitting ? (
              <>
                <Icon name="Loader" className="animate-spin mr-2" size={18} />
                Building Dashboard...
              </>
            ) : (
              <>
                Launch Store
                <Icon name="Rocket" className="ml-2" size={18} />
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}
