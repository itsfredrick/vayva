"use client";

import { useOnboarding } from "../OnboardingContext";
import { Button, Input, Label, Icon } from "@vayva/ui";
import { useState } from "react";

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
        <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-500">
            <div className="space-y-2">
                <div className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center mb-4">
                    <Icon name="User" className="text-primary" size={24} />
                </div>
                <h2 className="text-2xl font-black text-black">Account Identity</h2>
                <p className="text-gray-500 text-lg">Help us secure your account and verify your business.</p>
            </div>

            <div className="space-y-6">
                <div className="space-y-2">
                    <Label htmlFor="fullName">Full Name</Label>
                    <Input
                        id="fullName"
                        placeholder="e.g. Adeola Johnson"
                        value={(name as any)}
                        onChange={(e: any) => setName(e.target.value)}
                        className="h-12"
                    />
                </div>

                <div className="space-y-2">
                    <Label htmlFor="phone">Phone Number</Label>
                    <div className="relative">
                        <div className="absolute left-4 top-1/2 -translate-y-1/2 flex items-center gap-2 pr-3 border-r border-gray-100">
                            <span className="text-sm font-bold text-gray-500">+234</span>
                        </div>
                        <Input
                            id="phone"
                            placeholder="801 234 5678"
                            value={(phone as any)}
                            onChange={(e: any) => setPhone(e.target.value)}
                            className="h-12 pl-16 font-medium"
                        />
                    </div>
                </div>
            </div>

            <div className="pt-6">
                <Button
                    className="w-full h-12 shadow-xl shadow-primary/10"
                    onClick={handleContinue}
                    disabled={!name || !phone || isSaving}
                >
                    Continue to Business Setup
                </Button>
            </div>
        </div>
    );
}
