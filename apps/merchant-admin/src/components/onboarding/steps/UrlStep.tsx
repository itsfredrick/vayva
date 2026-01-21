"use client";

import { useOnboarding } from "../OnboardingContext";
import { Button, Input, Label } from "@vayva/ui";
import { useState, useEffect } from "react";
import { Check, X, Loader2 } from "lucide-react";

export default function UrlStep() {
    const { nextStep, prevStep, updateData, state, isSaving } = useOnboarding();
    const [slug, setSlug] = useState(state.business?.slug || "");
    const [checking, setChecking] = useState(false);
    const [available, setAvailable] = useState<boolean | null>(null);
    const [error, setError] = useState("");

    // Debounced slug availability check
    useEffect(() => {
        if (!slug || slug.length < 3) {
            setAvailable(null);
            setError("");
            return;
        }

        const timer = setTimeout(async () => {
            setChecking(true);
            setError("");
            try {
                const res = await fetch(`/api/onboarding/check-slug?slug=${encodeURIComponent(slug)}`);
                const data = await res.json();
                setAvailable(data.available);
                if (!data.available) {
                    setError("This URL is already taken. Please choose another.");
                }
            } catch (err) {
                setError("Failed to check availability. Please try again.");
                setAvailable(null);
            } finally {
                setChecking(false);
            }
        }, 500);

        return () => clearTimeout(timer);
    }, [slug]);

    const handleContinue = () => {
        if (!slug || !available) return;
        updateData({
            business: {
                ...(state.business as any),
                slug
            }
        });
        nextStep();
    };

    return (
        <div className="space-y-6">
            <div className="space-y-1">
                <h2 className="text-2xl font-bold">Store URL</h2>
                <p className="text-gray-500">Choose a unique link for your store.</p>
            </div>

            <div className="space-y-4">
                <div className="space-y-2">
                    <Label htmlFor="slug">Store Link</Label>
                    <div className="flex items-center relative">
                        <span className="bg-gray-100 border border-r-0 rounded-l px-3 py-2 text-gray-500 text-sm">
                            vayva.shop/
                        </span>
                        <Input
                            id="slug"
                            className="rounded-l-none pr-10"
                            placeholder="my-store"
                            value={slug}
                            onChange={(e) => setSlug(e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, ""))}
                        />
                        <div className="absolute right-3 top-1/2 -translate-y-1/2">
                            {checking && <Loader2 className="h-4 w-4 animate-spin text-gray-400" />}
                            {!checking && available === true && <Check className="h-4 w-4 text-green-600" />}
                            {!checking && available === false && <X className="h-4 w-4 text-red-600" />}
                        </div>
                    </div>
                    {error && <p className="text-xs text-red-600">{error}</p>}
                    {available === true && <p className="text-xs text-green-600">✓ This URL is available!</p>}
                    <p className="text-xs text-gray-400">You can add a custom domain later.</p>
                </div>
            </div>

            <div className="pt-4 flex gap-3">
                <Button variant="outline" onClick={prevStep} disabled={isSaving}>
                    Back
                </Button>
                <Button
                    className="flex-1"
                    onClick={handleContinue}
                    disabled={!slug || !available || checking || isSaving}
                >
                    Continue
                </Button>
            </div>
        </div>
    );
}
