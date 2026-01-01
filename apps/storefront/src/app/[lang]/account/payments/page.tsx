"use client";

import React, { useState } from "react";
import { useParams } from "next/navigation";
import { LocaleKey, LOCALES } from "@/data/locales";
import { useUserInteractions } from "@/hooks/useUserInteractions";
import { PaymentMethodModal } from "@/components/account/PaymentMethodModal";
import {
  CreditCard,
  Plus,
  Trash2,
  Check,
  Lock,
  CheckCircle,
} from "lucide-react";

export default function PaymentsPage({ params }: any) {
  const { lang: rawLang } = useParams() as { lang: string };
  const lang = (rawLang === "tr" ? "tr" : "en") as LocaleKey;
  const t = LOCALES[lang].account.payments;
  const {
    paymentMethods,
    addPaymentMethod,
    removePaymentMethod,
    setDefaultPaymentMethod,
    isLoaded,
  } = useUserInteractions();

  const [isModalOpen, setIsModalOpen] = useState(false);

  if (!isLoaded) return null;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">{t.title}</h1>
        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 bg-black text-white px-4 py-2 rounded-xl font-bold text-sm hover:bg-gray-800 transition-colors"
        >
          <Plus size={16} />
          {t.add}
        </button>
      </div>

      {paymentMethods.length === 0 ? (
        <div className="bg-white border rounded-2xl p-12 text-center text-gray-400">
          <CreditCard size={48} className="mx-auto mb-4 opacity-50" />
          <p>{t.empty}</p>
        </div>
      ) : (
        <div className="grid gap-4">
          {paymentMethods.map((pm) => (
            <div
              key={pm.id}
              className={`bg-white p-6 rounded-2xl border transition-all ${pm.isDefault ? "border-green-500 shadow-sm ring-1 ring-green-100" : "border-gray-100"}`}
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-8 bg-gray-100 rounded flex items-center justify-center font-bold text-xs text-gray-500">
                    VISA
                  </div>
                  <div className="flex flex-col">
                    <span className="font-bold flex items-center gap-2">
                      •••• {pm.last4}
                      {pm.isDefault && (
                        <span className="text-[10px] bg-green-100 text-green-700 px-2 py-0.5 rounded-full font-bold">
                          {t.default}
                        </span>
                      )}
                    </span>
                    <span className="text-xs text-gray-400">{pm.expiry}</span>
                  </div>
                </div>
                <div className="flex gap-2">
                  {!pm.isDefault && (
                    <button
                      onClick={() => setDefaultPaymentMethod(pm.id)}
                      className="text-xs font-bold text-gray-400 hover:text-black transition-colors"
                    >
                      {t.setDefault}
                    </button>
                  )}
                  <button
                    onClick={() => removePaymentMethod(pm.id)}
                    className="text-gray-400 hover:text-red-500 transition-colors"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
              <div className="text-sm font-medium text-gray-500 uppercase tracking-widest">
                {pm.holder}
              </div>
            </div>
          ))}
        </div>
      )}

      <PaymentMethodModal
        lang={lang}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={addPaymentMethod}
      />
    </div>
  );
}
