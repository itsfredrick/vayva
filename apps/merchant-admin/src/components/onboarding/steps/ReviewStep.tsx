"use client";

import { useOnboarding } from "../OnboardingContext";
import { Button } from "@vayva/ui";

export default function ReviewStep() {
    const { completeOnboarding, prevStep, state, isSaving } = useOnboarding();

    return (
        <div className="space-y-6">
            <div className="text-center space-y-2">
                <div className="text-4xl">🎉</div>
                <h2 className="text-2xl font-bold">You're all set!</h2>
                <p className="text-gray-500">Review your details before launching.</p>
            </div>

            <div className="bg-white rounded-lg border divide-y text-sm">
                <div className="p-4 flex justify-between">
                    <span className="text-gray-500">Store Name</span>
                    <span className="font-medium">{state.business?.storeName}</span>
                </div>
                <div className="p-4 flex justify-between">
                    <span className="text-gray-500">URL</span>
                    <span className="font-medium">vayva.shop/{state.business?.slug}</span>
                </div>
                <div className="p-4 flex justify-between">
                    <span className="text-gray-500">Bank</span>
                    <span className="font-medium">{state.finance?.bankName} - {state.finance?.accountNumber}</span>
                </div>
            </div>

            <div className="pt-4 flex gap-3">
                <Button variant="outline" onClick={prevStep} disabled={isSaving}>
                    Back
                </Button>
                <Button
                    className="flex-1"
                    onClick={completeOnboarding}
                    disabled={isSaving}
                    isLoading={isSaving}
                    size="lg"
                >
                    Launch Store
                </Button>
            </div>
        </div>
    );
}
