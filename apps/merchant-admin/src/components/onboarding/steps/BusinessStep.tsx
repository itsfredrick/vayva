"use client";

import { useOnboarding } from "../OnboardingContext";
import { Button, Input, Label, Select } from "@vayva/ui";
import { useState } from "react";
import { INDUSTRY_CONFIG } from "@/config/industry";
import { Store, ArrowRight, ArrowLeft } from "lucide-react";
import { AddressInputNG } from "@/components/ui/AddressInputNG";

export default function BusinessStep() {
    const { nextStep, prevStep, updateData, state, isSaving } = useOnboarding();
    const currentState = state as any;
    const [storeName, setStoreName] = useState(currentState.business?.storeName || "");
    const [legalName, setLegalName] = useState(currentState.business?.legalName || "");
    const [phone, setPhone] = useState(currentState.business?.phone || "");
    const [industrySlug, setIndustrySlug] = useState(currentState.industrySlug || "retail");
    const [registeredAddress, setRegisteredAddress] = useState(currentState.business?.registeredAddress || {});
    const [pickupAddressObj, setPickupAddressObj] = useState(currentState.logistics?.pickupAddressObj || {});

    const formatPickupAddress = (addr: any) => {
        if (!addr) return "";
        const parts = [addr.addressLine1, addr.city, addr.state].filter(Boolean);
        const base = parts.join(", ");
        return addr.landmark ? `${base} (${addr.landmark})` : base;
    };

    const handleContinue = () => {
        if (!storeName || !phone || !industrySlug) return;

        const pickupAddress = formatPickupAddress(pickupAddressObj);

        updateData({
            industrySlug: industrySlug as any,
            business: {
                ...state.business!,
                storeName,
                legalName: (legalName || "").trim() || undefined,
                registeredAddress: registeredAddress || undefined,
                phone,
                name: storeName,
                slug: state.business?.slug || storeName.toLowerCase().replace(/[^a-z0-9]/g, "-"),
                country: "NG",
                state: pickupAddressObj?.state || state.business?.state || "Lagos",
                city: pickupAddressObj?.city || state.business?.city || "Lagos",
                email: state.business?.email || "",
                businessRegistrationType: "individual"
            },
            logistics: {
                ...state.logistics,
                pickupAddressObj: pickupAddressObj || undefined,
                pickupAddress: pickupAddress || undefined,
            },
        } as any);
        nextStep();
    };

    const selectedConfig = INDUSTRY_CONFIG[industrySlug as keyof typeof INDUSTRY_CONFIG];

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="space-y-2 text-center">
                <div className="inline-flex items-center justify-center p-3 bg-vayva-green/10 rounded-2xl mb-2">
                    <Store className="text-vayva-green h-6 w-6" />
                </div>
                <h2 className="text-3xl font-black text-black">Business Basics</h2>
                <p className="text-gray-500">Tell us about your store so we can customize your experience.</p>
            </div>

            <div className="space-y-5">
                <div className="space-y-2">
                    <Label htmlFor="legalName" className="text-black font-semibold">Business Name</Label>
                    <Input
                        id="legalName"
                        placeholder="e.g. Adeola Ventures Ltd"
                        value={legalName}
                        onChange={(e: any) => setLegalName(e.target.value)}
                        className="h-12 rounded-xl border-gray-200 focus:border-vayva-green focus:ring-vayva-green/20"
                    />
                    <p className="text-xs text-gray-400">This is your legal/company name (can be different from your store name).</p>
                </div>

                <div className="space-y-2">
                    <Label htmlFor="storeName" className="text-black font-semibold">Store Name</Label>
                    <Input
                        id="storeName"
                        placeholder="e.g. Adeola's Fashion"
                        value={storeName}
                        onChange={(e: any) => setStoreName(e.target.value)}
                        className="h-12 rounded-xl border-gray-200 focus:border-vayva-green focus:ring-vayva-green/20"
                    />
                </div>

                <div className="space-y-2">
                    <Label htmlFor="industry" className="text-black font-semibold">Industry</Label>
                    <Select
                        id="industry"
                        value={industrySlug}
                        onChange={(e: any) => setIndustrySlug(e.target.value)}
                        className="h-12 rounded-xl border-gray-200 focus:border-vayva-green"
                    >
                        {Object.entries(INDUSTRY_CONFIG).map(([slug, config]) => (
                            <option key={slug} value={slug}>
                                {config.displayName}
                            </option>
                        ))}
                    </Select>
                    {selectedConfig?.description && (
                        <p className="text-xs text-gray-400 mt-1">{selectedConfig.description}</p>
                    )}
                </div>

                <div className="space-y-2">
                    <Label htmlFor="phone" className="text-black font-semibold">Business Phone Number</Label>
                    <Input
                        id="phone"
                        placeholder="e.g. 08012345678"
                        value={phone}
                        onChange={(e: any) => setPhone(e.target.value)}
                        className="h-12 rounded-xl border-gray-200 focus:border-vayva-green focus:ring-vayva-green/20"
                    />
                    <p className="text-xs text-gray-400">This will be used for customer inquiries and Paystack verification.</p>
                </div>

                <div className="space-y-2">
                    <Label className="text-black font-semibold">Business Address (Internal)</Label>
                    <AddressInputNG value={registeredAddress} onChange={setRegisteredAddress} />
                    <p className="text-xs text-gray-400">For compliance/KYC only. This is not shown to customers.</p>
                </div>

                <div className="space-y-2">
                    <Label className="text-black font-semibold">Store Address (Delivery / Pickup)</Label>
                    <AddressInputNG value={pickupAddressObj} onChange={setPickupAddressObj} />
                    <p className="text-xs text-gray-400">Used for delivery and pickup operations. This is the store address.</p>
                </div>
            </div>

            <div className="pt-4 flex gap-3">
                <Button 
                    variant="outline" 
                    onClick={prevStep} 
                    disabled={isSaving}
                    className="h-12 px-6 rounded-xl border-gray-200 hover:bg-gray-50"
                >
                    <ArrowLeft className="mr-2 h-4 w-4" /> Back
                </Button>
                <Button 
                    className="flex-1 h-12 bg-vayva-green hover:bg-vayva-green/90 text-white rounded-xl font-bold" 
                    onClick={handleContinue} 
                    disabled={!storeName || !phone || isSaving}
                >
                    Continue <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
            </div>
        </div>
    );
}
