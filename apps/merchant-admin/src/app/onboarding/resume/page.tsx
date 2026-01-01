"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useOnboarding } from "@/context/OnboardingContext";

export default function ResumePage() {
  const router = useRouter();
  const { state, loading } = useOnboarding();

  useEffect(() => {
    if (!loading) {
      if (state?.isComplete) {
        // Already done
        router.replace("/admin/dashboard");
      } else if (state?.currentStep) {
        // If the saved step is "optional" or "setup-path", redirect to a valid place
        const OPTIONAL_STEPS = [
          "whatsapp",
          "order-flow",
          "payments",
          "delivery",
          "team",
          "kyc",
        ];
        if (OPTIONAL_STEPS.includes(state.currentStep)) {
          // If they were in an optional step, they are effectively "done" with required part
          // but maybe not fully marked as REQUIRED_COMPLETE yet if they dropped off.
          // However, to be safe, let's send them to dashboard if they have the basics.
          // A safer bet is to send them to 'review' to finalize if they haven't "completed".
          // But if they are stuck in optional land, they might be "REQUIRED_COMPLETE" status but just didn't finish optional.
          // Let's check status if available in context, but context state might not have the raw status string.
          // We will assume if they are on an optional step, they can go to dashboard.
          router.replace("/admin/dashboard");
        } else if (state.currentStep === "setup-path") {
          // We removed this step, go to business
          router.replace("/onboarding/business");
        } else if (state.currentStep === "complete") {
          router.replace("/admin/dashboard");
        } else {
          // Resume last required step
          router.replace(`/onboarding/${state.currentStep}`);
        }
      } else {
        // Start fresh
        router.replace("/onboarding/welcome");
      }
    }
  }, [state, loading, router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#F5F5F7]">
      <div className="flex flex-col items-center gap-4">
        <div className="w-12 h-12 bg-black rounded-xl flex items-center justify-center animate-spin">
          <span className="text-white font-bold text-xl">V</span>
        </div>
        <p className="text-gray-500 font-medium">Resuming setup...</p>
      </div>
    </div>
  );
}
