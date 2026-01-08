"use client";

import React, { useState } from "react";
import { Button, Input, Icon } from "@vayva/ui";
import { PhoneInput } from "@/components/ui/PhoneInput";
import { useOnboarding } from "@/context/OnboardingContext";
import { useAuth } from "@/context/AuthContext";
import { OnboardingState } from "@/types/onboarding";

export default function KycPage() {
  const { state, updateState, goToStep } = useOnboarding();
  const { user } = useAuth();
  const isRegisteredBusiness = state?.business?.type === "registered";

  interface KycFormData {
    fullName: string;
    dob: string;
    address: string;
    nin: string;
    phone: string;
    cacNumber: string;
  }

  const [formData, setFormData] = useState<KycFormData>({
    fullName: state?.identity?.fullName || "",
    dob: state?.identity?.dob || "",
    address: state?.identity?.address || "",
    nin: state?.identity?.nin || "",
    phone: state?.identity?.phone || "",
    cacNumber: state?.identity?.cacNumber || "",
  });

  // Strict Cleanup: If strict individual, ensure CAC is empty
  React.useEffect(() => {
    if (!isRegisteredBusiness) {
      setFormData(prev => ({ ...prev, cacNumber: "" }));
    }
  }, [isRegisteredBusiness]);

  const [verifying, setVerifying] = useState(false);

  const handleVerify = () => {
    setVerifying(true);
    // Mock API simulation
    setTimeout(async () => {
      setVerifying(false);

      const { phone, ...restIdentity } = formData;
      await updateState({
        identity: {
          ...restIdentity,
          phone: phone || "",
        },
        kycStatus: "verified" // Auto-verify for demo
      });
      await goToStep("review");
    }, 1500);
  };

  const isFormValid = !!(
    formData.fullName &&
    formData.dob &&
    formData.address &&
    formData.nin &&
    formData.phone &&
    (!isRegisteredBusiness || formData.cacNumber)
  );

  return (
    <div className="max-w-2xl mx-auto py-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">
          Verify your Identity
        </h1>
        <p className="text-gray-500">
          To comply with regulations, we need to verify who you are.
        </p>
      </div>

      <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm space-y-6">
        <Input
          label="Full Legal Name"
          placeholder="As it appears on your ID"
          value={formData.fullName}
          onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
        />

        <div className="grid grid-cols-2 gap-4">
          <Input
            label="Date of Birth"
            type="date"
            value={formData.dob}
            onChange={(e) => setFormData({ ...formData, dob: e.target.value })}
          />
          <Input
            label="NIN (National ID)"
            placeholder="11-digit number"
            maxLength={11}
            value={formData.nin}
            onChange={(e) => setFormData({ ...formData, nin: e.target.value })}
          />
        </div>

        <PhoneInput
          label="Phone Number"
          value={formData.phone || ""}
          onChange={(val: string) => setFormData({ ...formData, phone: val })}
        />

        <Input
          label="Residential Address"
          placeholder="House number, Street name"
          value={formData.address}
          onChange={(e) => setFormData({ ...formData, address: e.target.value })}
        />

        {/* Conditional Logic for Business Type */}
        {isRegisteredBusiness && (
          <div className="p-4 bg-gray-50 rounded-xl border border-gray-200 animate-in fade-in slide-in-from-top-2">
            <h4 className="font-bold text-gray-900 text-sm mb-3 flex items-center gap-2">
              <Icon name="Building" size={16} />
              Business Verification
            </h4>
            <Input
              label="CAC Registration Number"
              placeholder="RC123456"
              value={formData.cacNumber}
              onChange={(e) => setFormData({ ...formData, cacNumber: e.target.value })}
              className="bg-white"
            />
            <p className="text-xs text-gray-500 mt-2">
              We'll verify this against the Corporate Affairs Commission database.
            </p>
          </div>
        )}

        <div className="pt-4">
          <Button
            onClick={handleVerify}
            disabled={!isFormValid || verifying}
            className="w-full !bg-black text-white h-12 rounded-xl shadow-lg hover:shadow-xl transition-all"
          >
            {verifying ? (
              <span className="flex items-center gap-2">
                <Icon name="Loader" className="animate-spin" size={16} /> Verifying...
              </span>
            ) : (
              "Verify Identity"
            )}
          </Button>
          <p className="text-center text-xs text-gray-400 mt-4 flex items-center justify-center gap-1">
            <Icon name="Lock" size={10} />
            Your data is encrypted and securely stored.
          </p>
        </div>
      </div>
    </div>
  );
}
