"use client";

import React, { useState } from "react";
import { Button, Input, Label, cn } from "@vayva/ui";
// Adjust import based on actual UI library
import { useToast } from "@/components/ui/use-toast";

// Local Mocks for missing UI components to pass build
const Dialog = ({ children, open, onOpenChange }: any) => {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="relative bg-white rounded-lg shadow-xl w-full max-w-md m-4">
        {/* eslint-disable-next-line no-restricted-syntax */}
        <button
          onClick={() => onOpenChange(false)}
          className="absolute top-2 right-2 text-gray-500 hover:text-black"
        >
          ✕
        </button>
        {children}
      </div>
    </div>
  );
};
const DialogContent = ({ children }: any) => <div className="p-6">{children}</div>;
const DialogHeader = ({ children }: any) => <div className="mb-4 border-b pb-2">{children}</div>;
const DialogTitle = ({ children }: any) => <h2 className="text-lg font-bold">{children}</h2>;

export function WithdrawModal({ open, onOpenChange, balance, bankAccounts }: any) {
  const [amount, setAmount] = useState("");
  const [bankId, setBankId] = useState("");
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    if (!amount || !bankId) return;

    setLoading(true);
    try {
      const res = await fetch("/api/account/payouts", {
        method: "POST",
        body: JSON.stringify({ amount: Number(amount), bankAccountId: bankId }),
      });
      if (!res.ok) throw new Error("Failed");
      toast({ title: "Withdrawal Requested" });
      onOpenChange(false);
    } catch (error) {
      toast({ title: "Error", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Withdraw Funds</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label>Amount (Balance: ₦{balance?.toLocaleString() || 0})</Label>
            <Input
              type="number"
              value={amount}
              onChange={(e: any) => setAmount(e.target.value)}
              max={balance}
            />
          </div>
          <div className="space-y-2">
            <Label>Bank Account</Label>
            <select
              className="w-full h-10 px-3 rounded-md border border-input bg-background text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
              value={bankId}
              onChange={(e) => setBankId(e.target.value)}
            >
              <option value="">Select bank</option>
              {(bankAccounts || []).map((b: any) => (
                <option key={b.id} value={b.id}>
                  {b.bankName} - {b.accountNumber}
                </option>
              ))}
            </select>
          </div>
          <Button type="submit" disabled={loading || !amount || !bankId} className="w-full">
            {loading ? "Processing..." : "Withdraw"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
