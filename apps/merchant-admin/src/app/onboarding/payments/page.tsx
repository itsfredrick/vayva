"use client";

import React, { useState } from "react";
import { Button, Icon, cn, Input } from "@vayva/ui";
import { Switch } from "@/components/ui/Switch";
import { useOnboarding } from "@/context/OnboardingContext";

// Master Prompt Step 7: Payments (Expanded)
// Method Behavior Preview: Show appearance in order
// Proof Rules: Optional/Required/Transfer-only
// Reconciliation: Education for Locked features

type PaymentMethod = "transfer" | "cash" | "pos" | "mixed";
type ProofRule = "optional" | "required_all" | "required_transfer";

export default function PaymentsPage() {
  const { state, updateState, goToStep } = useOnboarding();
  const userPlan = state?.plan || "free";
  const isFree = userPlan === "free";

  const [methods, setMethods] = useState<PaymentMethod[]>([]);
  const [proofRule, setProofRule] = useState<ProofRule>("optional");
  const [activePreview, setActivePreview] = useState<PaymentMethod | null>(
    null,
  );

  const [bankDetails, setBankDetails] = useState({
    bankName: "",
    accountNumber: "",
    accountName: "",
  });
  const [currency, setCurrency] = useState("NGN");
  const [payoutAcknowledged, setPayoutAcknowledged] = useState(false);

  const toggleMethod = (id: PaymentMethod) => {
    if (methods.includes(id)) {
      setMethods(methods.filter((m) => m !== id));
      if (activePreview === id) setActivePreview(null);
    } else {
      setMethods([...methods, id]);
      setActivePreview(id);
    }
  };

  const handleContinue = async () => {
    if (methods.length === 0) return;
    await updateState({
      payments: {
        method: methods.length > 1 ? "mixed" : methods[0],
        proofRequired: proofRule !== "optional",
        currency,
        settlementBank: bankDetails.accountNumber ? bankDetails : undefined,
        payoutScheduleAcknowledged: payoutAcknowledged,
      },
    });
    await goToStep("delivery");
  };

  const methodOptions: {
    id: PaymentMethod;
    label: string;
    icon: string;
    desc: string;
  }[] = [
    {
      id: "transfer",
      label: "Bank Transfer",
      icon: "Landmark",
      desc: "Direct deposit to your account",
    },
    {
      id: "cash",
      label: "Cash",
      icon: "Coins",
      desc: "Physical cash on pickup/delivery",
    },
    {
      id: "pos",
      label: "POS Terminal",
      icon: "CreditCard",
      desc: "Card machine payment",
    },
    {
      id: "mixed",
      label: "Mixed / Other",
      icon: "Wallet",
      desc: "Multiple methods allowed",
    },
  ];

  return (
    <div className="flex flex-col lg:flex-row h-full gap-8 max-w-6xl mx-auto items-start">
      <div className="flex-1 w-full max-w-lg lg:pt-10">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            How do you accept payment?
          </h1>
          <p className="text-gray-500">
            Select all methods that apply. We'll show these to your customers.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
          {methodOptions.map((opt) => (
            <button
              key={opt.id}
              onClick={() => toggleMethod(opt.id)}
              onMouseEnter={() => setActivePreview(opt.id)}
              className={cn(
                "flex flex-col items-start p-4 rounded-xl border-2 transition-all duration-200 text-left",
                methods.includes(opt.id)
                  ? "bg-black text-white border-black shadow-md"
                  : "bg-white text-gray-600 border-gray-100 hover:border-gray-300",
              )}
            >
              <div className="flex justify-between w-full mb-2">
                <Icon name={opt.icon as any} size={20} />
                {methods.includes(opt.id) && <Icon name="Check" size={16} />}
              </div>
              <span className="text-sm font-bold block">{opt.label}</span>
              <span
                className={cn(
                  "text-[10px]",
                  methods.includes(opt.id) ? "text-gray-400" : "text-gray-400",
                )}
              >
                {opt.desc}
              </span>
            </button>
          ))}
        </div>

        {methods.length > 0 && (
          <div className="space-y-6 bg-gray-50 p-6 rounded-2xl border border-gray-100 mb-8 animate-in slide-in-from-top-4 fade-in">
            {/* Proof Rules configuration */}
            <div className="space-y-3">
              <h4 className="font-bold text-gray-900 text-sm">
                Payment Proof Rules
              </h4>
              <div className="flex flex-col gap-2">
                {(
                  [
                    {
                      id: "optional",
                      label: "Optional",
                      desc: "Customers can skip upload",
                    },
                    {
                      id: "required_transfer",
                      label: "Required for Transfers",
                      desc: "Only for bank transfers",
                    },
                    {
                      id: "required_all",
                      label: "Always Required",
                      desc: "Strict verification",
                    },
                  ] as const
                ).map((rule) => (
                  <button
                    key={rule.id}
                    onClick={() => setProofRule(rule.id)}
                    className={cn(
                      "flex items-center gap-3 p-3 rounded-lg border text-sm transition-colors",
                      proofRule === rule.id
                        ? "bg-white border-black text-black ring-1 ring-black"
                        : "bg-transparent border-transparent hover:bg-gray-100 text-gray-500",
                    )}
                  >
                    <div
                      className={cn(
                        "w-4 h-4 rounded-full border flex items-center justify-center",
                        proofRule === rule.id
                          ? "border-black"
                          : "border-gray-300",
                      )}
                    >
                      {proofRule === rule.id && (
                        <div className="w-2 h-2 bg-black rounded-full" />
                      )}
                    </div>
                    <div className="text-left">
                      <span className="block font-medium">{rule.label}</span>
                      <span className="text-[10px] text-gray-400">
                        {rule.desc}
                      </span>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Reconcile (Locked) Educational */}
            <div
              className={cn(
                "pt-6 border-t border-gray-200",
                isFree && "opacity-80",
              )}
            >
              <div className="flex items-start justify-between">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <h4 className="font-bold text-gray-900 text-sm">
                      Auto-Reconciliation
                    </h4>
                    {isFree && (
                      <span className="text-[10px] bg-gray-200 px-1.5 py-0.5 rounded text-gray-600 font-bold">
                        GROWTH
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-gray-500 max-w-xs">
                    Automatically match bank alerts to orders. No manual
                    checking required.
                  </p>
                </div>
                <Switch
                  checked={false}
                  onCheckedChange={() => {}}
                  disabled={isFree}
                />
              </div>
            </div>
          </div>
        )}

        <div className="space-y-6 pt-8 border-t border-gray-100">
          <div className="space-y-4">
            <h4 className="font-bold text-gray-900 text-lg">Payout Settings</h4>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">
                  Store Currency
                </label>
                <Input
                  value={currency}
                  readOnly
                  className="bg-gray-50 text-gray-500 cursor-not-allowed"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">
                  Payout Schedule
                </label>
                <div className="p-3 bg-gray-50 rounded-xl border border-gray-200 text-sm text-gray-600 flex items-center justify-between">
                  <span>Daily (T+1)</span>
                  <Icon name="Calendar" size={16} className="text-gray-400" />
                </div>
              </div>
            </div>

            <div className="space-y-4 bg-gray-50 p-6 rounded-2xl border border-gray-100">
              <h5 className="font-bold text-gray-900 text-sm">
                Settlement Bank Account
              </h5>
              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-gray-500 uppercase">
                    Bank Name
                  </label>
                  <Input
                    placeholder="e.g. GTBank"
                    value={bankDetails.bankName}
                    onChange={(e) =>
                      setBankDetails({
                        ...bankDetails,
                        bankName: e.target.value,
                      })
                    }
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-gray-500 uppercase">
                      Account Number
                    </label>
                    <Input
                      placeholder="0123456789"
                      value={bankDetails.accountNumber}
                      onChange={(e) =>
                        setBankDetails({
                          ...bankDetails,
                          accountNumber: e.target.value,
                        })
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-gray-500 uppercase">
                      Account Name
                    </label>
                    <Input
                      placeholder="Auto-fetched..."
                      value={bankDetails.accountName}
                      onChange={(e) =>
                        setBankDetails({
                          ...bankDetails,
                          accountName: e.target.value,
                        })
                      }
                    />
                  </div>
                </div>
              </div>
            </div>

            <label className="flex items-start gap-3 cursor-pointer">
              <div className="pt-0.5">
                <input
                  type="checkbox"
                  className="w-4 h-4 rounded border-gray-300 text-black focus:ring-black"
                  checked={payoutAcknowledged}
                  onChange={(e) => setPayoutAcknowledged(e.target.checked)}
                />
              </div>
              <span className="text-sm text-gray-500">
                I acknowledge that payouts are processed daily for transactions
                settled before 11:59 PM.
              </span>
            </label>
          </div>
        </div>

        <Button
          onClick={handleContinue}
          disabled={methods.length === 0}
          className="!bg-black text-white h-12 px-8 rounded-xl text-base shadow-lg hover:shadow-xl transition-all w-full md:w-auto"
        >
          Continue
        </Button>
      </div>

      {/* Live Preview of Order Card */}
      <div className="hidden lg:block flex-1 w-full sticky top-24">
        <div className="bg-white rounded-3xl border border-gray-100 shadow-xl p-6 min-h-[500px] flex flex-col">
          <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-8 text-center">
            Customer Checkout Preview
          </h3>

          <div className="max-w-sm mx-auto w-full bg-gray-50 rounded-2xl p-4 border border-gray-100 shadow-sm relative overflow-hidden">
            {/* Fake Checkout Header */}
            <div className="flex justify-between items-center mb-6 border-b border-gray-200 pb-4">
              <span className="font-bold text-gray-900">Checkout</span>
              <span className="text-gray-500 text-sm">₦ 25,000</span>
            </div>

            {/* Payment Selection Simulation */}
            <div className="space-y-3">
              <h4 className="text-xs font-bold text-gray-500 uppercase">
                Select Payment
              </h4>
              <div className="space-y-2">
                {methods.length > 0 ? (
                  methods.map((m) => (
                    <div
                      key={m}
                      className={cn(
                        "p-3 rounded-lg border flex items-center gap-3 transition-colors",
                        activePreview === m
                          ? "bg-white border-green-500 shadow-sm"
                          : "bg-white border-gray-200 opacity-70",
                      )}
                    >
                      <div
                        className={cn(
                          "w-4 h-4 rounded-full border",
                          activePreview === m
                            ? "border-green-500 border-4"
                            : "border-gray-300",
                        )}
                      />
                      <div className="flex-1 text-sm font-medium capitalize flex items-center gap-2">
                        {m.replace("_", " ")}
                        {m === "transfer" && (
                          <span className="text-[10px] bg-blue-100 text-blue-700 px-1 rounded">
                            Fastest
                          </span>
                        )}
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-4 text-gray-400 text-xs italic">
                    Select methods to see them appear here
                  </div>
                )}
              </div>
            </div>

            {/* Proof Upload Simulation */}
            {(proofRule === "required_all" ||
              (proofRule === "required_transfer" &&
                activePreview === "transfer")) &&
              activePreview && (
                <div className="mt-6 animate-in fade-in slide-in-from-bottom-2">
                  <div className="p-4 rounded-lg border border-dashed border-gray-300 bg-white flex flex-col items-center justify-center text-center gap-2 cursor-pointer hover:bg-gray-50 transition-colors">
                    <Icon
                      name="CloudUpload"
                      size={24}
                      className="text-gray-400"
                    />
                    <div className="space-y-0.5">
                      <p className="text-sm font-medium text-gray-900">
                        Upload Proof
                      </p>
                      <p className="text-[10px] text-gray-500">
                        Required to complete order
                      </p>
                    </div>
                  </div>
                </div>
              )}
          </div>

          <div className="mt-auto pt-8 text-center">
            <p className="text-xs text-gray-400">
              Updates live as you configure.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
