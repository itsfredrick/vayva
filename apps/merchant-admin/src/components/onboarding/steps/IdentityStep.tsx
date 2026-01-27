"use client";

import { useOnboarding } from "../OnboardingContext";
import { Button, Input, Label } from "@vayva/ui";
import { useState } from "react";
import { User, ArrowRight } from "lucide-react";

export default function IdentityStep() {
    const { nextStep, updateData, state, isSaving } = useOnboarding();
    const currentState = state as any;
    const [name, setName] = useState(currentState.identity?.fullName || "");
    const [phone, setPhone] = useState(currentState.identity?.phone || "");

    const handleContinue = () => {
        if (!name || !phone) return;
        updateData({
            identity: {
                ...state.identity,
                fullName: name,
                phone: phone
            }
        });
        nextStep();
    };

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="space-y-2 text-center">
                <div className="inline-flex items-center justify-center p-3 bg-vayva-green/10 rounded-2xl mb-2">
                    <User className="text-vayva-green h-6 w-6" />
                </div>
                <h2 className="text-3xl font-black text-black">Account Identity</h2>
                <p className="text-gray-500">Help us secure your account and verify your business.</p>
            </div>

            <div className="space-y-5">
                <div className="space-y-2">
                    <Label htmlFor="fullName" className="text-black font-semibold">Full Name</Label>
                    <Input
                        id="fullName"
                        placeholder="e.g. Adeola Johnson"
                        value={(name as any)}
                        onChange={(e: any) => setName(e.target.value)}
                        className="h-12 rounded-xl border-gray-200 focus:border-vayva-green focus:ring-vayva-green/20"
                    />
                </div>

                <div className="space-y-2">
                    <Label htmlFor="phone" className="text-black font-semibold">Phone Number</Label>
                    <div className="relative">
                        <div className="absolute left-4 top-1/2 -translate-y-1/2 flex items-center gap-2 pr-3 border-r border-gray-200">
                            <span className="text-sm font-bold text-gray-500">+234</span>
                        </div>
                        <Input
                            id="phone"
                            placeholder="801 234 5678"
                            value={(phone as any)}
                            onChange={(e: any) => setPhone(e.target.value)}
                            className="h-12 pl-20 font-medium rounded-xl border-gray-200 focus:border-vayva-green focus:ring-vayva-green/20"
                        />
                    </div>
                    <p className="text-xs text-gray-400">We'll use this for account verification via Paystack.</p>
                </div>
            </div>

            <div className="pt-4">
                <Button
                    className="w-full h-12 bg-vayva-green hover:bg-vayva-green/90 text-white rounded-xl font-bold shadow-xl shadow-vayva-green/20"
                    onClick={handleContinue}
                    disabled={!name || !phone || isSaving}
                >
                    Continue to Business Setup <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
            </div>
        </div>
    );
}
