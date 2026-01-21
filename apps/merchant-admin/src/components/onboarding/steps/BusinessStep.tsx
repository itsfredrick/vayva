"use client";

import { useOnboarding } from "../OnboardingContext";
import { Button, Input, Label } from "@vayva/ui";
import { useState } from "react";

export default function BusinessStep() {
    const { nextStep, prevStep, updateData, state, isSaving } = useOnboarding();
    const [storeName, setStoreName] = useState(state.business?.storeName || "");
    const [phone, setPhone] = useState(state.business?.phone || "");

    const handleContinue = () => {
        if (!storeName || !phone) return;
        updateData({
            business: {
                ...state.business!, // Force unwrapping is risky usually but we init emptiness
                storeName,
                phone,
                // Defaults
                name: storeName,
                slug: state.business?.slug || storeName.toLowerCase().replace(/[^a-z0-9]/g, "-"),
                country: "NG",
                state: state.business?.state || "Lagos",
                city: state.business?.city || "Lagos",
                email: state.business?.email || "",
                businessRegistrationType: "individual"
            }
        });
        nextStep();
    };

    return (
        <div className="space-y-6">
            <div className="space-y-1">
                <h2 className="text-2xl font-bold">Business Basics</h2>
                <p className="text-gray-500">Tell us about your store.</p>
            </div>

            <div className="space-y-4">
                <div className="space-y-2">
                    <Label htmlFor="storeName">Store Name</Label>
                    <Input
                        id="storeName"
                        placeholder="e.g. Adeola's Fashion"
                        value={storeName}
                        onChange={(e) => setStoreName(e.target.value)}
                    />
                </div>

                <div className="space-y-2">
                    <Label htmlFor="phone">Business Phone Number</Label>
                    <Input
                        id="phone"
                        placeholder="e.g. 08012345678"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                    />
                </div>
            </div>

            <div className="pt-4 flex gap-3">
                <Button variant="outline" onClick={prevStep} disabled={isSaving}>
                    Back
                </Button>
                <Button className="flex-1" onClick={handleContinue} disabled={!storeName || !phone || isSaving}>
                    Continue
                </Button>
            </div>
        </div>
    );
}
