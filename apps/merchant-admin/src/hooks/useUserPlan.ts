
import { useState, useEffect } from 'react';

// Single source type definition
export type BillingPlan = 'free' | 'growth' | 'pro';

export interface UserPlan {
    tier: BillingPlan;
    loading: boolean;
    source: string;
    isAuthenticated: boolean;
}

export function useUserPlan(): UserPlan {
    const [plan, setPlan] = useState<BillingPlan>('free');
    const [source, setSource] = useState('initial');
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        let mounted = true;

        async function fetchPlan() {
            try {
                const res = await fetch('/api/me/plan');
                if (!res.ok) {
                    throw new Error('Failed to fetch plan');
                }
                const data = await res.json();

                if (mounted) {
                    setPlan((data.plan as BillingPlan) || 'free');
                    setSource(data.source || 'api');
                    setIsAuthenticated(!!data.isAuthenticated);
                }
            } catch (err) {
                console.error('Error fetching user plan:', err);
                if (mounted) {
                    setSource('error_fallback');
                }
            } finally {
                if (mounted) {
                    setLoading(false);
                }
            }
        }

        fetchPlan();

        return () => { mounted = false; };
    }, []);

    return { tier: plan, loading, source, isAuthenticated };
}
