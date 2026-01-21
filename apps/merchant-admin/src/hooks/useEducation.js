"use client";
import { useState, useEffect } from "react";
const EducationStateManager = {
    checkEligibility: async (userId, guidanceId) => {
        return { shouldShow: false };
    },
    markShown: async (userId, guidanceId) => { },
    markCompleted: async (userId, guidanceId) => { },
    dismiss: async (userId, guidanceId) => { },
};
export function useEducation(userId, guidanceId) {
    const [eligibility, setEligibility] = useState({
        shouldShow: false,
    });
    const [loading, setLoading] = useState(true);
    useEffect(() => {
        checkEligibility();
    }, [userId, guidanceId]);
    const checkEligibility = async () => {
        try {
            const result = await EducationStateManager.checkEligibility(userId, guidanceId);
            setEligibility(result);
        }
        catch (error) {
            console.error("Failed to check education eligibility:", error);
        }
        finally {
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
