"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Button, Icon, IconName } from "@vayva/ui";
import { motion } from "framer-motion";
import { useWallet } from "@/context/WalletContext";

// 1. KYC Block Screen
export const KycBlockScreen = () => (
  <div className="flex flex-col items-center justify-center h-[60vh] text-center max-w-md mx-auto p-6">
    <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-6 text-gray-500">
      <Icon name="ShieldAlert" size={32} />
    </div>
    <h2 className="text-2xl font-bold text-[#0B0B0B] mb-2">
      Complete KYC to unlock your wallet
    </h2>
    <p className="text-[#525252] mb-8">
      To ensure the security of your funds and comply with regulations, we need
      to verify your identity (BVN/NIN) before you can access payouts.
    </p>
    <div className="flex gap-4">
      <Link href="/dashboard/settings/kyc">
        <Button>Complete Verification</Button>
      </Link>
      <Link href="/admin">
        <Button variant="outline">Back to Dashboard</Button>
      </Link>
    </div>
  </div>
);

// 2. PIN Setup Screen
export const PinSetupScreen = () => {
  const { setPin } = useWallet();
  const [pin, setPinValue] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (pin.length !== 4) return;
    setLoading(true);
    await setPin(pin);
    setLoading(false);
  };

  return (
    <div className="flex flex-col items-center justify-center h-[60vh] text-center max-w-sm mx-auto p-6">
      <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center mb-6 text-blue-600">
        <Icon name="LockKeyhole" size={32} />
      </div>
      <h2 className="text-2xl font-bold text-[#0B0B0B] mb-2">
        Create Wallet PIN
      </h2>
      <p className="text-[#525252] mb-8">
        Set a secure 4-digit PIN to authorize withdrawals and sensitive actions.
      </p>
      <form onSubmit={handleSubmit} className="w-full flex flex-col gap-4">
        <input
          type="password"
          maxLength={4}
          placeholder="0000"
          className="text-center text-3xl tracking-[1em] font-bold border-b-2 border-gray-200 py-2 focus:border-black focus:outline-none bg-transparent"
          value={pin}
          onChange={(e) => setPinValue(e.target.value.replace(/\D/g, ""))}
        />
        <Button
          type="submit"
          disabled={pin.length !== 4 || loading}
          className="w-full"
        >
          {loading ? "Setting PIN..." : "Set Secure PIN"}
        </Button>
      </form>
    </div>
  );
};

// 3. Unlock Screen
export const UnlockScreen = () => {
  const { unlockWallet } = useWallet();
  const [pin, setPinValue] = useState("");
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (pin.length !== 4) return;
    setLoading(true);
    setError(false);
    const success = await unlockWallet(pin);
    if (!success) {
      setError(true);
      setPinValue("");
    }
    setLoading(false);
  };

  return (
    <div className="flex flex-col items-center justify-center h-[60vh] text-center max-w-sm mx-auto p-6">
      <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mb-6 text-[#0B0B0B]">
        <Icon name="Lock" size={32} />
      </div>
      <h2 className="text-2xl font-bold text-[#0B0B0B] mb-2">Unlock Wallet</h2>
      <p className="text-[#525252] mb-8">
        Enter your 4-digit PIN to access your funds.
      </p>
      <form onSubmit={handleSubmit} className="w-full flex flex-col gap-4">
        <input
          type="password"
          maxLength={4}
          placeholder="••••"
          className={`text-center text-3xl tracking-[1em] font-bold border-b-2 py-2 focus:outline-none bg-transparent transition-colors
                        ${error ? "border-red-500 text-red-500" : "border-gray-200 focus:border-black"}`}
          value={pin}
          onChange={(e) => {
            setPinValue(e.target.value.replace(/\D/g, ""));
            setError(false);
          }}
          autoFocus
        />
        <Button
          type="submit"
          disabled={pin.length !== 4 || loading}
          className="w-full"
        >
          {loading ? "Unlocking..." : "Unlock"}
        </Button>
        {error && <p className="text-red-500 text-sm">Incorrect PIN</p>}
        <button
          type="button"
          className="text-xs text-gray-500 hover:text-black hover:underline"
        >
          Forgot PIN?
        </button>
      </form>
    </div>
  );
};
