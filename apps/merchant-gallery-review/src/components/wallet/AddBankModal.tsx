"use client";

import React, { useState } from "react";
import { Button, Icon } from "@vayva/ui";
import { motion, AnimatePresence } from "framer-motion";
import { WalletService } from "@/services/wallet";

interface AddBankModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export const AddBankModal = ({
  isOpen,
  onClose,
  onSuccess,
}: AddBankModalProps) => {
  const [bankName, setBankName] = useState("");
  const [accountNumber, setAccountNumber] = useState("");
  const [accountName, setAccountName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      await WalletService.addBank({
        bankName,
        accountNumber,
        accountName,
        bankCode: "000", // Test code
        isDefault: true,
      } as any);
      onSuccess();
      onClose();
    } catch (err: any) {
      setError(err.response?.data?.error || "Failed to add bank account");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-[60] flex items-center justify-center bg-black/50 backdrop-blur-sm"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white rounded-xl shadow-xl w-full max-w-md overflow-hidden"
      >
        <div className="flex items-center justify-between p-4 border-b border-gray-100">
          <h3 className="font-bold text-[#0B0B0B]">Add Bank Account</h3>
          <button
            onClick={onClose}
            className="p-1 hover:bg-gray-100 rounded-full text-gray-400"
          >
            <Icon name="X" size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 flex flex-col gap-4">
          <div className="flex flex-col gap-1">
            <label className="text-xs font-bold text-[#525252]">
              Bank Name
            </label>
            <input
              required
              className="h-10 px-3 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-black/5"
              value={bankName}
              onChange={(e) => setBankName(e.target.value)}
              placeholder="e.g. GTBank"
            />
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-xs font-bold text-[#525252]">
              Account Number
            </label>
            <input
              required
              maxLength={10}
              className="h-10 px-3 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-black/5"
              value={accountNumber}
              onChange={(e) =>
                setAccountNumber(e.target.value.replace(/\D/g, ""))
              }
              placeholder="0123456789"
            />
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-xs font-bold text-[#525252]">
              Account Holder Name
            </label>
            <input
              required
              className="h-10 px-3 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-black/5"
              value={accountName}
              onChange={(e) => setAccountName(e.target.value)}
              placeholder="John Doe"
            />
          </div>

          {error && <p className="text-red-500 text-xs">{error}</p>}

          <Button type="submit" disabled={loading} className="w-full mt-2">
            {loading ? "Adding..." : "Add Account"}
          </Button>
        </form>
      </motion.div>
    </div>
  );
};
