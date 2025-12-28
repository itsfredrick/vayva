'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { OnboardingState, OnboardingStepId } from '@/types/onboarding';
import { OnboardingService } from '@/services/onboarding';
import { useRouter } from 'next/navigation';
import { telemetry } from '@/lib/telemetry';
import { getAttribution } from '@/lib/attribution';
import { ONBOARDING_PROFILES } from '@/lib/onboarding-profiles';

interface OnboardingContextType {
    state: OnboardingState | null;
    loading: boolean;
    updateState: (data: Partial<OnboardingState>) => Promise<void>;
    goToStep: (step: OnboardingStepId) => Promise<void>;
    completeOnboarding: () => Promise<void>;
    handleSaveExit: () => void;
}

const OnboardingContext = createContext<OnboardingContextType | undefined>(undefined);

export function OnboardingProvider({ children }: { children: React.ReactNode }) {
    const [state, setState] = useState<OnboardingState | null>(null);
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
        loadState();
    }, []);

    const loadState = async () => {
        try {
            // Race between actual load and a safety timeout
            // This ensures we never get stuck on "Loading setup..." for more than 2 seconds
            const dataPromise = OnboardingService.getState();
            const timeoutPromise = new Promise<OnboardingState>((resolve) => {
                setTimeout(() => {
                    console.warn('Onboarding state load timed out, using default');
                    resolve(OnboardingService.getState()); // Fallback to default state generator
                }, 2000);
            });

            let data = await Promise.race([dataPromise, timeoutPromise]);

            // FAST PATH LOGIC: Check attribution for template context
            try {
                const attribution = getAttribution();
                const initialTemplate = attribution.initial_template; // Slug or ID

                // If we have a template in attribution but not in state (or state is fresh), apply profile
                // We only do this if the user hasn't explicitly selected a different template in the flow yet
                if (initialTemplate && (!data.template?.id || data.template.id === initialTemplate)) {
                    console.log('[ONBOARDING] Found initial template context:', initialTemplate);
                    const profile = ONBOARDING_PROFILES[initialTemplate];

                    if (profile) {
                        console.log('[ONBOARDING] Applying fast path profile:', profile);

                        // Apply Skip & Require Steps
                        data.skippedSteps = profile.skipSteps || [];
                        data.requiredSteps = profile.requireSteps || [];

                        // Apply Prefills
                        if (profile.prefill) {
                            // Business Category
                            if (profile.prefill.industryCategory && !data.business?.category) {
                                data.business = { ...data.business, category: profile.prefill.industryCategory } as any;
                            }

                            // Delivery
                            if (profile.prefill.deliveryEnabled !== undefined) {
                                // If delivery is disabled by default (e.g. digital), set policy efficiently
                                if (profile.prefill.deliveryEnabled === false) {
                                    // Maybe set a flag or implicit policy, schema calls for 'policy' enum
                                    // We won't force 'pickup_only' but we might note it.
                                    // Actually, if skipped, we don't need to populate detailed fields unless required.
                                }
                            }

                            // Payments
                            if (profile.prefill.paymentsEnabled) {
                                // Maybe pre-select a method?
                            }

                            // Set template in state so UI knows
                            if (!data.template) {
                                data.template = { id: initialTemplate, name: initialTemplate }; // Name will need lookup if we want pretty name
                                data.templateSelected = true;
                            }
                        }

                        // Telemetry
                        telemetry.track('onboarding_fast_path_activated', {
                            template: initialTemplate,
                            skipped: data.skippedSteps,
                            required: data.requiredSteps
                        });

                        // Start Event
                        telemetry.track('ONBOARDING_STARTED', {
                            templateSlug: initialTemplate,
                            entryPoint: attribution?.entry_point,
                            fastPath: true
                        });
                    }
                }
            } catch (e) {
                console.error('[ONBOARDING] Error applying fast path:', e);
            }

            // Fetch user data from auth to pre-populate business name
            try {
                const response = await fetch('/api/auth/merchant/me', {
                    credentials: 'include'
                });
                if (response.ok) {
                    const userData = await response.json();
                    // Merge user's businessName into onboarding state if not already set
                    if (userData.user?.businessName && !data.business?.name) {
                        data.business = {
                            name: userData.user.businessName,
                            email: userData.user?.email || '',
                            category: data.business?.category || '',
                            location: data.business?.location || { city: '', state: '', country: 'Nigeria' },
                            ...data.business
                        };
                    }
                }
            } catch (error) {
                console.warn('Could not fetch user data for onboarding:', error);
            }

            setState(data);
        } catch (error) {
            console.error('Failed to load onboarding state:', error);
            // Even on error, we should try to set a safe default or at least stop loading
            setState({
                isComplete: false,
                currentStep: 'welcome',
                lastUpdatedAt: new Date().toISOString(),
                whatsappConnected: false,
                templateSelected: false,
                kycStatus: 'not_started',
                plan: 'free'
            });
        } finally {
            setLoading(false);
        }
    };

    const updateState = async (data: Partial<OnboardingState>) => {
        if (!state) return;

        const newState = { ...state, ...data };
        setState(newState);

        // Persist
        await OnboardingService.saveStep(newState.currentStep, data);
    };

    const goToStep = async (step: OnboardingStepId) => {
        if (!state) return;

        // Telemetry: Step Complete (for the previous step)
        telemetry.track('ONBOARDING_STEP_COMPLETED', {
            step: state.currentStep, // Canonical field name
            nextStep: step,
            templateSlug: state.template?.id,
            plan: state.plan,
            fastPath: !!state.skippedSteps?.length
        });

        // Update current step in state
        await updateState({ currentStep: step });

        // Route to page
        router.push(`/onboarding/${step}`);
    };

    const completeOnboarding = async () => {
        // Telemetry: Required Flow Complete
        // Telemetry: Required Flow Complete
        telemetry.track('ONBOARDING_COMPLETED', {
            timeToDashboardMs: 0, // Placeholder
            templateId: state?.template?.id,
            templateSlug: state?.template?.id,
            plan: state?.plan,
            fastPath: !!state?.skippedSteps?.length,
            whatsappConnected: state?.whatsappConnected
        });

        try {
            // 1. Get Store ID (needed for install)
            // We fetch simple me endpoint to get store context
            const userRes = await fetch('/api/auth/merchant/me');
            if (!userRes.ok) throw new Error('Failed to get user context');
            const userData = await userRes.json();
            const storeId = userData.store?.id;

            if (storeId && state?.template?.id) {
                // 2. Call Install API
                const installRes = await fetch('/api/templates/install', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        storeId: storeId,
                        templateId: state.template.id
                    })
                });

                if (!installRes.ok) {
                    console.error('Template install failed, continuing anyway...', await installRes.text());
                } else {
                    console.log('Template installed successfully');
                }
            }
        } catch (e) {
            console.error('Error during template installation:', e);
            // We don't block completion on this, as we want to get them to dashboard regardless
        }

        // Save final state
        const finalState: OnboardingState = {
            ...state!,
            isComplete: true,
            currentStep: state!.currentStep || 'complete',
        };
        setState(finalState);
        await OnboardingService.complete();

        // Redirect to dashboard with welcome param
        router.push('/admin/dashboard?welcome=true');
    };

    const handleSaveExit = async () => {
        try {
            // Save current progress to backend
            if (state) {
                await OnboardingService.saveStep(state.currentStep, state);
            }

            // Log user out
            await fetch('/api/auth/merchant/logout', {
                method: 'POST',
                credentials: 'include'
            });

            // Redirect to login page
            router.push('/signin');
        } catch (error) {
            console.error('Error during save & exit:', error);
            // Still redirect to login even if save fails
            router.push('/signin');
        }
    };

    return (
        <OnboardingContext.Provider value={{
            state,
            loading,
            updateState,
            goToStep,
            completeOnboarding,
            handleSaveExit
        }}>
            {children}
        </OnboardingContext.Provider>
    );
}

export function useOnboarding() {
    const context = useContext(OnboardingContext);
    if (context === undefined) {
        throw new Error('useOnboarding must be used within an OnboardingProvider');
    }
    return context;
}
