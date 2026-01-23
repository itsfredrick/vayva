"use client";
import { useState, useEffect } from "react";
const ActivationManager = {
    checkActivation: async (userId: unknown) => {
        try {
            const res = await fetch("/api/analytics/activation");
            if (res.ok) {
                return await res.json();
            }
        }
        catch (e) {
            console.error("Activation check failed", e);
        }
        // Fallback if API fails
        return {
            isActivated: false,
            firstOrderCreated: false,
            firstPaymentRecorded: false,
            firstOrderCompleted: false,
        };
    },
};
export function useActivation(userId: unknown) {
    const [status, setStatus] = useState({
        isActivated: false,
        firstOrderCreated: false,
        firstPaymentRecorded: false,
        firstOrderCompleted: false,
    });
    const [loading, setLoading] = useState(true);
    useEffect(() => {
        loadActivationStatus();
    }, [userId]);
    const loadActivationStatus = async () => {
        try {
            const activationStatus = await ActivationManager.checkActivation(userId);
            setStatus(activationStatus);
        }
        catch (error) {
            console.error("Failed to load activation status:", error);
        }
        finally {
            setLoading(false);
        }
    };
    const refresh = () => {
        loadActivationStatus();
    };
    return {
        status,
        loading,
        refresh,
        isActivated: status.isActivated,
        progress: {
            firstOrder: status.firstOrderCreated,
            firstPayment: status.firstPaymentRecorded,
            firstCompletion: status.firstOrderCompleted,
        },
    };
}
