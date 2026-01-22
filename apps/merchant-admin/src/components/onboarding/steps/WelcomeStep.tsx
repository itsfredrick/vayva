"use client";

import { useOnboarding } from "../OnboardingContext";
import { Button, Icon } from "@vayva/ui";
import { ArrowRight, CheckCircle2 } from "lucide-react";

export default function WelcomeStep() {
    const { nextStep, skipOnboarding } = useOnboarding();

    const onboardingSteps = [
        { id: 1, title: "Identity", desc: "Confirm your personal details", icon: "User" },
        { id: 2, title: "Store Profile", desc: "Define your business name & industry", icon: "Store" },
        { id: 3, title: "Custom URL", desc: "Secure your unique store address", icon: "Globe" },
        { id: 4, title: "Branding", desc: "Upload logo and choose brand colors", icon: "Palette" },
        { id: 5, title: "Payments", desc: "Connect bank for payouts", icon: "CreditCard" },
    ];

    return (
        <div className="max-w-md mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <div className="space-y-3 text-center">
                <div className="inline-flex items-center justify-center p-3 bg-primary/10 rounded-2xl mb-2">
                    <Icon name="Rocket" className="text-primary h-8 w-8" />
                </div>
                <h1 className="text-4xl font-black tracking-tight text-black">
                    Welcome to Vayva
                </h1>
                <p className="text-gray-500 text-lg leading-relaxed">
                    Let's get your store set up and ready for customers in minutes.
                </p>
            </div>

            <div className="space-y-4">
                {onboardingSteps.map((step) => (
                    <div key={step.id} className="flex items-center gap-4 p-4 bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all group">
                        <div className="w-10 h-10 rounded-xl bg-gray-50 flex items-center justify-center group-hover:bg-primary/10 transition-colors">
                            <Icon name={step.icon as unknown} size={20} className="text-gray-400 group-hover:text-primary" />
                        </div>
                        <div className="flex-1">
                            <h4 className="font-bold text-sm text-gray-900">{step.title}</h4>
                            <p className="text-xs text-gray-500">{step.desc}</p>
                        </div>
                        <CheckCircle2 className="h-4 w-4 text-gray-200" />
                    </div>
                ))}
            </div>

            <div className="space-y-4 pt-4">
                <Button size="lg" className="w-full h-14 text-lg shadow-xl shadow-primary/20" onClick={nextStep}>
                    Start Setup <ArrowRight className="ml-2 h-5 w-5" />
                </Button>

                <Button
                    variant="ghost"
                    onClick={skipOnboarding}
                    className="w-full text-sm text-gray-400 hover:text-gray-600 transition-colors py-2"
                >
                    Explore Demo Store first
                </Button>
            </div>
        </div>
    );
}
