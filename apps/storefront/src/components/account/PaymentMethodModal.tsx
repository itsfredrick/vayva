"use client";

import { useState } from "react";
import { LocaleKey, LOCALES } from "@/data/locales";
import { X, CreditCard } from "lucide-react";

interface PaymentMethodModalProps {
  lang: LocaleKey;
  isOpen: boolean;
  onClose: () => void;
  onSave: (payment: any) => void;
}

export function PaymentMethodModal({
  lang,
  isOpen,
  onClose,
  onSave,
}: PaymentMethodModalProps) {
  const t = LOCALES[lang].account.payments.form;

  const [holder, setHolder] = useState("");
  const [number, setNumber] = useState("");
  const [expiry, setExpiry] = useState("");
  const [cvv, setCvv] = useState("");

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Test: just take last 4 of numeric input
    const numeric = number.replace(/\D/g, "");
    const last4 = numeric.slice(-4) || "1234";

    onSave({
      holder,
      last4,
      expiry,
      isDefault: false,
    });

    // Reset
    setHolder("");
    setNumber("");
    setExpiry("");
    setCvv("");
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        onClick={onClose}
      />
      <div className="bg-white rounded-3xl w-full max-w-lg relative z-10 shadow-2xl animate-fade-in-up">
        <div className="p-6 border-b border-gray-100 flex items-center justify-between">
          <h2 className="text-lg font-bold flex items-center gap-2">
            <CreditCard size={20} />
            {t.title}
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">
              {t.holder}
            </label>
            <input
              required
              type="text"
              value={holder}
              onChange={(e) => setHolder(e.target.value)}
              className="w-full p-3 bg-gray-50 border border-gray-100 rounded-xl"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">
              {t.number}
            </label>
            <input
              required
              type="text"
              maxLength={19}
              placeholder="0000 0000 0000 0000"
              value={number}
              onChange={(e) => setNumber(e.target.value)}
              className="w-full p-3 bg-gray-50 border border-gray-100 rounded-xl font-mono"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">
                {t.expiry}
              </label>
              <input
                required
                type="text"
                placeholder="MM/YY"
                maxLength={5}
                value={expiry}
                onChange={(e) => setExpiry(e.target.value)}
                className="w-full p-3 bg-gray-50 border border-gray-100 rounded-xl text-center"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">
                {t.cvv}
              </label>
              <input
                required
                type="password"
                maxLength={3}
                placeholder="123"
                value={cvv}
                onChange={(e) => setCvv(e.target.value)}
                className="w-full p-3 bg-gray-50 border border-gray-100 rounded-xl text-center"
              />
            </div>
          </div>

          <div className="pt-4 flex gap-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-4 font-bold text-gray-500 hover:bg-gray-50 rounded-xl"
            >
              {t.cancel}
            </button>
            <button
              type="submit"
              className="flex-1 py-4 bg-black text-white font-bold rounded-xl hover:bg-gray-900 transition-colors"
            >
              {t.save}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
