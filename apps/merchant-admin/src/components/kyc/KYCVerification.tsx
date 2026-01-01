"use client";

import React, { useState } from "react";
import { Button, Input, GlassPanel, Icon, cn } from "@vayva/ui";

interface KYCVerificationProps {
  onSuccess?: () => void;
  onCancel?: () => void;
}

export function KYCVerification({ onSuccess, onCancel }: KYCVerificationProps) {
  const [method, setMethod] = useState<"BVN" | "NIN" | null>(null);
  const [consent, setConsent] = useState(false);
  const [formData, setFormData] = useState({
    idNumber: "",
    firstName: "",
    lastName: "",
    dob: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [step, setStep] = useState<"SELECT" | "FORM" | "SUCCESS">("SELECT");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!consent) {
      setError("Consent is required to proceed");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/kyc/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          method,
          ...formData,
          consent,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Verification failed");
      }

      setStep("SUCCESS");
      if (onSuccess) onSuccess();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (step === "SUCCESS") {
    return (
      <div className="text-center py-12 space-y-6">
        <div className="w-20 h-20 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
          <Icon name={"CheckCircle" as any} size={40} />
        </div>
        <div className="space-y-2">
          <h2 className="text-2xl font-bold text-white">
            Verification Successful
          </h2>
          <p className="text-text-secondary">
            Your identity has been verified system-wide.
          </p>
        </div>
        <Button onClick={onCancel} className="w-full">
          Return to Dashboard
        </Button>
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto space-y-8 p-4">
      <div className="space-y-2">
        <h2 className="text-2xl font-bold text-white">Identity Verification</h2>
        <p className="text-text-secondary font-medium">
          Choose a method to verify your business identity.
        </p>
      </div>

      {step === "SELECT" ? (
        <div className="grid grid-cols-1 gap-4">
          <button
            onClick={() => {
              setMethod("BVN");
              setStep("FORM");
            }}
            className="p-6 bg-white/5 border border-white/10 rounded-2xl flex items-center gap-4 hover:bg-white/10 transition-all text-left group"
          >
            <div className="p-3 bg-primary/20 text-primary rounded-xl group-hover:bg-primary group-hover:text-black transition-all">
              <Icon name="CreditCard" size={24} />
            </div>
            <div>
              <h3 className="font-bold text-white">
                Bank Verification Number (BVN)
              </h3>
              <p className="text-xs text-text-secondary">
                Instant verification via your 11-digit BVN.
              </p>
            </div>
          </button>

          <button
            onClick={() => {
              setMethod("NIN");
              setStep("FORM");
            }}
            className="p-6 bg-white/5 border border-white/10 rounded-2xl flex items-center gap-4 hover:bg-white/10 transition-all text-left group"
          >
            <div className="p-3 bg-white/10 text-white rounded-xl group-hover:bg-white group-hover:text-black transition-all">
              <Icon name="Shield" size={24} />
            </div>
            <div>
              <h3 className="font-bold text-white">
                National Identity Number (NIN)
              </h3>
              <p className="text-xs text-text-secondary">
                Verify using your 11-digit National ID.
              </p>
            </div>
          </button>

          <div className="pt-4">
            <Button variant="ghost" onClick={onCancel} className="w-full">
              Cancel
            </Button>
          </div>
        </div>
      ) : (
        <form
          onSubmit={handleSubmit}
          className="space-y-6 animate-in slide-in-from-right-4 duration-300"
        >
          <div className="space-y-4">
            <Input
              label={`${method} Number`}
              placeholder={`Enter your ${method}`}
              value={formData.idNumber}
              onChange={(e) =>
                setFormData({ ...formData, idNumber: e.target.value })
              }
              required
            />
            <div className="grid grid-cols-2 gap-4">
              <Input
                label="First Name"
                placeholder="As on ID"
                value={formData.firstName}
                onChange={(e) =>
                  setFormData({ ...formData, firstName: e.target.value })
                }
                required
              />
              <Input
                label="Last Name"
                placeholder="As on ID"
                value={formData.lastName}
                onChange={(e) =>
                  setFormData({ ...formData, lastName: e.target.value })
                }
                required
              />
            </div>
            <Input
              label="Date of Birth"
              type="date"
              value={formData.dob}
              onChange={(e) =>
                setFormData({ ...formData, dob: e.target.value })
              }
              required
            />
          </div>

          <div className="flex items-start gap-3 p-4 bg-white/5 rounded-xl border border-white/10">
            <input
              type="checkbox"
              checked={consent}
              onChange={(e) => setConsent(e.target.checked)}
              className="mt-1 accent-primary"
              id="consent-check"
            />
            <label
              htmlFor="consent-check"
              className="text-xs text-text-secondary leading-relaxed cursor-pointer select-none"
            >
              I hereby give consent for Vayva to verify my identity details
              against official government databases as provided by authorized
              providers.
            </label>
          </div>

          {error && (
            <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-xl flex items-center gap-2 text-red-500 text-sm">
              <Icon name={"AlertCircle" as any} size={16} />
              {error}
            </div>
          )}

          <div className="flex gap-3 pt-4">
            <Button
              variant="ghost"
              onClick={() => setStep("SELECT")}
              className="flex-1"
            >
              Back
            </Button>
            <Button type="submit" isLoading={loading} className="flex-[2]">
              Verify Identity
            </Button>
          </div>
        </form>
      )}
      {/* Partner Attribution */}
      <div className="flex items-center justify-center gap-2 pt-4 opacity-50 grayscale hover:grayscale-0 transition-all">
        <span className="text-[10px] uppercase font-bold text-text-secondary tracking-widest">
          Powered by
        </span>
        <img src="/youverify_logo.png" alt="Youverify" className="h-4 w-auto" />
      </div>
    </div>
  );
}
