'use client';

import { useState, useEffect } from 'react';
import { ActivationManager, ActivationStatus } from '@vayva/analytics/activation';

export function useActivation(userId: string) {
    const [status, setStatus] = useState<ActivationStatus>({
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
        } catch (error) {
            console.error('Failed to load activation status:', error);
        } finally {
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
