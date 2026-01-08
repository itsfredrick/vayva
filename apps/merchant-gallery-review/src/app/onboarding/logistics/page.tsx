"use client";

import React, { useState, useEffect } from "react";
import { Button, Icon } from "@vayva/ui";
import { Switch } from "@/components/ui/Switch";
import { useOnboarding } from "@/context/OnboardingContext";

export default function LogisticsPage() {
    const { state, updateState, goToStep } = useOnboarding();
    const [isSkipping, setIsSkipping] = useState(false);

    // Delivery options
    const [policy, setPolicy] = useState<"pickup" | "delivery" | "both">(
        (state?.logistics?.policy as "pickup" | "delivery" | "both") || "both"
    );

    const [providers, setProviders] = useState({
        manual: state?.logistics?.providers?.manual ?? true,
        kwik: state?.logistics?.providers?.kwik ?? false,
        gokada: state?.logistics?.providers?.gokada ?? false,
    });

    // Auto-skip logic
    useEffect(() => {
        if (state?.intent && state.intent.hasDelivery === false) {
            setIsSkipping(true);
            goToStep("inventory");
        }
    }, [state, goToStep]);

    if (isSkipping) {
        return (
            <div className="flex items-center justify-center h-full">
                <div className="text-center">
                    <Icon name="Loader" className="animate-spin text-gray-400 mx-auto mb-4" size={32} />
                    <p className="text-gray-500">Skipping logistics for your business type...</p>
                </div>
            </div>
        );
    }

    const handleContinue = async () => {
        await updateState({
            logistics: {
                policy,
                providers
            }
        });
        await goToStep("inventory");
    };

    return (
        <div className="max-w-3xl mx-auto py-8">
            <div className="mb-8">
                <h1 className="text-2xl font-bold text-gray-900 mb-2">
                    Logistics & Delivery
                </h1>
                <p className="text-gray-500">
                    How do your customers get their orders?
                </p>
            </div>

            <div className="space-y-6">
                {/* Section 1: Order Handling Policy */}
                <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm">
                    <h3 className="font-bold text-gray-900 mb-4">fulfillment Policy</h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <button
                            onClick={() => setPolicy("pickup")}
                            className={`p-4 rounded-xl border-2 text-left transition-all ${policy === "pickup"
                                ? "border-black bg-gray-50 ring-1 ring-black/5"
                                : "border-gray-100 hover:border-gray-200"
                                }`}
                        >
                            <Icon name="Store" className="mb-3 text-gray-700" size={24} />
                            <div className="font-bold text-gray-900 mb-1">Pickup Only</div>
                            <div className="text-xs text-gray-500">Customers come to you</div>
                        </button>

                        <button
                            onClick={() => setPolicy("delivery")}
                            className={`p-4 rounded-xl border-2 text-left transition-all ${policy === "delivery"
                                ? "border-black bg-gray-50 ring-1 ring-black/5"
                                : "border-gray-100 hover:border-gray-200"
                                }`}
                        >
                            <Icon name="Truck" className="mb-3 text-gray-700" size={24} />
                            <div className="font-bold text-gray-900 mb-1">Delivery Only</div>
                            <div className="text-xs text-gray-500">You dispatch orders</div>
                        </button>

                        <button
                            onClick={() => setPolicy("both")}
                            className={`p-4 rounded-xl border-2 text-left transition-all ${policy === "both"
                                ? "border-black bg-gray-50 ring-1 ring-black/5"
                                : "border-gray-100 hover:border-gray-200"
                                }`}
                        >
                            <Icon name="ArrowLeftRight" className="mb-3 text-gray-700" size={24} />
                            <div className="font-bold text-gray-900 mb-1">Both</div>
                            <div className="text-xs text-gray-500">Flexible options</div>
                        </button>
                    </div>
                </div>

                {/* Section 2: Delivery Providers (Only if Delivery is enabled) */}
                {policy !== "pickup" && (
                    <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm animate-in fade-in slide-in-from-top-4">
                        <h3 className="font-bold text-gray-900 mb-4">Delivery Providers</h3>
                        <div className="space-y-4">
                            {/* Manual Option */}
                            <div className="flex items-center justify-between p-4 rounded-xl border border-gray-100 bg-gray-50">
                                <div className="flex items-center gap-4">
                                    <div className="w-10 h-10 rounded-full bg-white border border-gray-200 flex items-center justify-center">
                                        <Icon name="User" size={20} className="text-gray-500" />
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-gray-900">Self Managed</h4>
                                        <p className="text-xs text-gray-500">You handle your own drivers or logistics</p>
                                    </div>
                                </div>
                                <Switch
                                    checked={providers.manual}
                                    onCheckedChange={(c: boolean) => setProviders({ ...providers, manual: c })}
                                />
                            </div>

                            {/* Integrated Providers Placeholder */}
                            <div className="flex items-center justify-between p-4 rounded-xl border border-gray-100 bg-white hover:border-blue-200 transition-colors">
                                <div className="flex items-center gap-4">
                                    <div className="w-10 h-10 rounded-full bg-blue-50 border border-blue-100 flex items-center justify-center">
                                        <Icon name="Bike" size={20} className="text-blue-600" />
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-gray-900">Kwik Delivery</h4>
                                        <p className="text-xs text-gray-500">Instant connection required (Coming Soon)</p>
                                    </div>
                                </div>
                                <Switch
                                    checked={providers.kwik}
                                    onCheckedChange={(c: boolean) => setProviders({ ...providers, kwik: c })}
                                    disabled // Disabled for now until integrated
                                />
                            </div>

                            <div className="flex items-center justify-between p-4 rounded-xl border border-gray-100 bg-white hover:border-green-200 transition-colors">
                                <div className="flex items-center gap-4">
                                    <div className="w-10 h-10 rounded-full bg-green-50 border border-green-100 flex items-center justify-center">
                                        <Icon name="Bike" size={20} className="text-green-600" />
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-gray-900">Gokada</h4>
                                        <p className="text-xs text-gray-500">Instant connection required (Coming Soon)</p>
                                    </div>
                                </div>
                                <Switch
                                    checked={providers.gokada}
                                    onCheckedChange={(c: boolean) => setProviders({ ...providers, gokada: c })}
                                    disabled
                                />
                            </div>
                        </div>
                        <p className="text-xs text-gray-400 mt-4 px-1">
                            * Integrated providers will automatically quote prices on checkout.
                        </p>
                    </div>
                )}
            </div>

            <div className="flex justify-end pt-8">
                <Button
                    onClick={handleContinue}
                    className="!bg-black text-white px-10 rounded-xl h-12 shadow-lg hover:shadow-xl transition-all"
                >
                    Continue
                    <Icon name="ArrowRight" className="ml-2 w-4 h-4" />
                </Button>
            </div>
        </div>
    );
}
