"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useOnboarding } from "@/context/OnboardingContext";

export default function OnboardingIndex() {
  const router = useRouter();
  const { state, loading } = useOnboarding();

  useEffect(() => {
    if (!loading && state) {
      router.replace(`/onboarding/${state.currentStep}`);
    }
  }, [loading, state, router]);

  return null; // Or a loading spinner
}
