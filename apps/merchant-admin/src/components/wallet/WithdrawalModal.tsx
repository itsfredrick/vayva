import React, { useState, useEffect } from "react";
import { Modal, Icon, cn, Button } from "@vayva/ui";
import {
  WithdrawalEligibility,
  WithdrawalQuote,
  PayoutAccount,
} from "@vayva/shared";
import { AnimatePresence, motion } from "framer-motion";

interface WithdrawalModalProps {
  isOpen: boolean;
  onClose: () => void;
  availableBalance: number;
  onSuccess: () => void;
}

export const WithdrawalModal = ({
  isOpen,
  onClose,
  availableBalance,
  onSuccess,
}: WithdrawalModalProps) => {
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [loading, setLoading] = useState(false);
  const [eligibility, setEligibility] = useState<WithdrawalEligibility | null>(
    null,
  );
  const [accounts, setAccounts] = useState<PayoutAccount[]>([]);
  const [selectedAccount, setSelectedAccount] = useState<string>("");
  const [amount, setAmount] = useState<number>(0);
  const [quote, setQuote] = useState<WithdrawalQuote | null>(null);

  // Load Eligibility on Open
  useEffect(() => {
    if (isOpen) {
      setStep(1);
      setLoading(true);
      Promise.all([
        fetch("/api/wallet/withdraw/eligibility").then((r) => r.json()),
        fetch("/api/wallet/payout-accounts").then((r) => r.json()),
      ]).then(([eligRes, accRes]) => {
        setEligibility(eligRes);
        setAccounts(accRes);
        if (accRes.length > 0) setSelectedAccount(accRes[0].id);
        setLoading(false);
      });
    }
  }, [isOpen]);

  const handleGetQuote = async () => {
    if (!amount || amount <= 0) return;
    setLoading(true);
    const res = await fetch("/api/wallet/withdraw/quote", {
      method: "POST",
      body: JSON.stringify({ amount, payout_account_id: selectedAccount }),
    });
    const q = await res.json();
    setQuote(q);
    setLoading(false);
    setStep(3);
  };

  const handleConfirm = async () => {
    setLoading(true);
    try {
      await fetch("/api/wallet/withdraw", {
        method: "POST",
        body: JSON.stringify({ amount, payout_account_id: selectedAccount }),
      });
      onSuccess();
      onClose();
    } catch (e) {
      console.error(e);
      alert("Withdrawal failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const StepIndicator = () => (
    <div className="flex items-center gap-2 mb-6 text-xs font-bold text-gray-400">
      <span className={cn(step >= 1 ? "text-black" : "")}>1. Check</span>
      <span className="h-px w-4 bg-gray-200" />
      <span className={cn(step >= 2 ? "text-black" : "")}>2. Value</span>
      <span className="h-px w-4 bg-gray-200" />
      <span className={cn(step >= 3 ? "text-black" : "")}>3. Review</span>
    </div>
  );

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Withdraw Funds"
      className="max-w-lg"
    >
      <div className="space-y-6">
        <StepIndicator />

        {/* STEP 1: ELIGIBILITY */}
        {step === 1 && (
          <div className="space-y-4">
            {loading && (
              <div className="text-gray-500 text-sm">
                Checking eligibility...
              </div>
            )}

            {eligibility && (
              <>
                <div className="p-4 bg-gray-50 rounded-xl border border-gray-100 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">KYC Status</span>
                    {eligibility.kycStatus === "verified" ? (
                      <span className="text-xs font-bold text-green-600 bg-green-50 px-2 py-1 rounded-md">
                        Verified
                      </span>
                    ) : (
                      <span className="text-xs font-bold text-amber-600 bg-amber-50 px-2 py-1 rounded-md flex items-center gap-1">
                        <Icon name={"AlertTriangle" as any} size={12} /> Action
                        Required
                      </span>
                    )}
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">
                      Payout Account
                    </span>
                    {eligibility.hasPayoutAccount ? (
                      <span className="text-xs font-bold text-green-600 bg-green-50 px-2 py-1 rounded-md">
                        Added
                      </span>
                    ) : (
                      <span className="text-xs font-bold text-red-600 bg-red-50 px-2 py-1 rounded-md">
                        Missing
                      </span>
                    )}
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">
                      Available Balance
                    </span>
                    <span className="font-mono text-sm font-bold">
                      ₦{availableBalance.toLocaleString()}
                    </span>
                  </div>
                </div>

                {eligibility.isEligible ? (
                  <Button onClick={() => setStep(2)} className="w-full">
                    Continue
                  </Button>
                ) : (
                  <div className="text-center">
                    <p className="text-sm text-red-600 font-medium mb-3">
                      {eligibility.blockedReasons[0] ||
                        "Please resolve the issues above."}
                    </p>
                    <Button
                      variant="outline"
                      className="w-full"
                      onClick={onClose}
                    >
                      Close
                    </Button>
                  </div>
                )}
              </>
            )}
          </div>
        )}

        {/* STEP 2: DETAILS */}
        {step === 2 && (
          <div className="space-y-6">
            <div className="space-y-2">
              <label className="text-xs font-bold text-gray-500 uppercase">
                Payout Account
              </label>
              {accounts.map((acc: any) => (
                <div
                  key={acc.id}
                  onClick={() => setSelectedAccount(acc.id)}
                  className={cn(
                    "p-4 border rounded-xl cursor-pointer transition-all flex items-center justify-between",
                    selectedAccount === acc.id
                      ? "border-black bg-gray-50 shadow-sm"
                      : "border-gray-200",
                  )}
                >
                  <div>
                    <div className="font-bold text-sm text-gray-900">
                      {acc.bankName}
                    </div>
                    <div className="text-xs text-gray-500">
                      {acc.accountName} • {acc.accountNumber}
                    </div>
                  </div>
                  {selectedAccount === acc.id && (
                    <Icon name="Check" size={16} className="text-black" />
                  )}
                </div>
              ))}
              {/* Placeholder for Add Functionality */}
              <button className="text-xs font-bold text-black underline pl-1 pt-1">
                + Add another account
              </button>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-gray-500 uppercase">
                Amount to Withdraw
              </label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 font-bold">
                  ₦
                </span>
                <input
                  type="number"
                  value={amount || ""}
                  onChange={(e) => setAmount(Number(e.target.value))}
                  className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl font-mono text-lg font-bold focus:ring-2 focus:ring-black focus:border-transparent outline-none transition-shadow"
                  placeholder="0.00"
                />
              </div>
              <div className="flex justify-between items-center text-xs text-gray-500 px-1">
                <span>Balance: ₦{availableBalance.toLocaleString()}</span>
                <button
                  onClick={() => setAmount(availableBalance)}
                  className="font-bold text-blue-600 hover:underline"
                >
                  Max
                </button>
              </div>
            </div>

            <div className="flex gap-3 pt-4">
              <Button
                variant="outline"
                onClick={() => setStep(1)}
                className="flex-1"
              >
                Back
              </Button>
              <Button
                onClick={handleGetQuote}
                className="flex-1"
                disabled={!amount || amount > availableBalance || loading}
              >
                {loading ? "Calculating..." : "Review"}
              </Button>
            </div>
          </div>
        )}

        {/* STEP 3: CONFIRM */}
        {step === 3 && quote && (
          <div className="space-y-6">
            <div className="bg-gray-50 border border-gray-100 rounded-xl p-5 space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Amount</span>
                <span className="font-bold font-mono">
                  ₦{quote.amount.toLocaleString()}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Service Fee</span>
                <span className="font-bold font-mono text-gray-600">
                  - ₦{quote.fee.toLocaleString()}
                </span>
              </div>
              <div className="h-px bg-gray-200 my-2" />
              <div className="flex justify-between text-base">
                <span className="font-bold text-gray-900">Total to You</span>
                <span className="font-bold font-mono text-green-600">
                  ₦{quote.netAmount.toLocaleString()}
                </span>
              </div>
            </div>

            <div className="flex items-start gap-2 bg-blue-50 text-blue-800 p-4 rounded-xl text-xs">
              <Icon name="Info" size={16} className="shrink-0 mt-0.5" />
              <p>
                Funds will arrive in your{" "}
                <strong>
                  {accounts.find((a) => a.id === selectedAccount)?.bankName}
                </strong>{" "}
                account {quote.estimatedArrival}.
              </p>
            </div>

            <div className="flex gap-3 pt-2">
              <Button
                variant="outline"
                onClick={() => setStep(2)}
                className="flex-1"
              >
                Back
              </Button>
              <Button
                onClick={handleConfirm}
                className="flex-1"
                disabled={loading}
              >
                {loading ? "Processing..." : "Confirm Withdrawal"}
              </Button>
            </div>
          </div>
        )}
      </div>
    </Modal>
  );
};
