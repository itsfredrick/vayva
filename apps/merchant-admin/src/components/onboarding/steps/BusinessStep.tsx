"use client";

import { useOnboarding } from "../OnboardingContext";
import { Button, Input, Label, Select } from "@vayva/ui";
import { useState } from "react";
import { INDUSTRY_CONFIG } from "@/config/industry";

export default function BusinessStep() {
    const { nextStep, prevStep, updateData, state, isSaving } = useOnboarding();
    const currentState = state as any;
    const [storeName, setStoreName] = useState(currentState.business?.storeName || "");
    const [phone, setPhone] = useState(currentState.business?.phone || "");
    const [industrySlug, setIndustrySlug] = useState(currentState.industrySlug || "retail");

    const handleContinue = () => {
        if (!storeName || !phone || !industrySlug) return;
        updateData({
            industrySlug: industrySlug as any,
            business: {
                ...state.business!,
                storeName,
                phone,
                name: storeName,
                slug: state.business?.slug || storeName.toLowerCase().replace(/[^a-z0-9]/g, "-"),
                country: "NG",
                state: state.business?.state || "Lagos",
                city: state.business?.city || "Lagos",
                email: state.business?.email || "",
                businessRegistrationType: "individual"
            }
        } as any);
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
                        onChange={(e: any) => setStoreName(e.target.value)}
                    />
                </div>

                <div className="space-y-2">
                    <Label htmlFor="industry">Industry</Label>
                    <Select
                        id="industry"
                        value={industrySlug}
                        onChange={(e: any) => setIndustrySlug(e.target.value)}
                    >
                        {Object.entries(INDUSTRY_CONFIG).map(([slug, config]) => (
                            <option key={slug} value={slug}>
                                {config.displayName}
                            </option>
                        ))}
                    </Select>
                </div>

                <div className="space-y-2">
                    <Label htmlFor="phone">Business Phone Number</Label>
                    <Input
                        id="phone"
                        placeholder="e.g. 08012345678"
                        value={phone}
                        onChange={(e: any) => setPhone(e.target.value)}
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
