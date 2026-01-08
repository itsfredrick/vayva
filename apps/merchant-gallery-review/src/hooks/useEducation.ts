"use client";

import { useState, useEffect } from "react";
// TODO: Module @vayva/education/state not yet implemented
// import { EducationStateManager, GuidanceEligibility } from '@vayva/education/state';

type GuidanceEligibility = {
  shouldShow: boolean;
  reason?: string;
};

const EducationStateManager = {
  checkEligibility: async (
    userId: string,
    guidanceId: string,
  ): Promise<GuidanceEligibility> => {
    return { shouldShow: false };
  },
  markShown: async (userId: string, guidanceId: string) => {},
  markCompleted: async (userId: string, guidanceId: string) => {},
  dismiss: async (userId: string, guidanceId: string) => {},
};

export function useEducation(userId: string, guidanceId: string) {
  const [eligibility, setEligibility] = useState<GuidanceEligibility>({
    shouldShow: false,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkEligibility();
  }, [userId, guidanceId]);

  const checkEligibility = async () => {
    try {
      const result = await EducationStateManager.checkEligibility(
        userId,
        guidanceId,
      );
      setEligibility(result);
    } catch (error) {
      console.error("Failed to check education eligibility:", error);
    } finally {
      setLoading(false);
    }
  };

  const markShown = async () => {
    await EducationStateManager.markShown(userId, guidanceId);
    setEligibility({ shouldShow: false, reason: "already_shown" });
  };

  const markCompleted = async () => {
    await EducationStateManager.markCompleted(userId, guidanceId);
    setEligibility({ shouldShow: false, reason: "completed" });
  };

  const dismiss = async () => {
    await EducationStateManager.dismiss(userId, guidanceId);
    setEligibility({ shouldShow: false, reason: "dismissed" });
  };

  return {
    shouldShow: eligibility.shouldShow,
    loading,
    markShown,
    markCompleted,
    dismiss,
  };
}
