"use client";

import { useState } from "react";
import { LocaleKey, LOCALES } from "@/data/locales";
import { Check, Copy, CreditCard, Gift, Loader2 } from "lucide-react";

interface GiftCardBuyFormProps {
  lang: LocaleKey;
}

const AMOUNTS = [500, 1000, 1500, 2000];

export function GiftCardBuyForm({ lang }: GiftCardBuyFormProps) {
  const t = LOCALES[lang].giftCards.buy;

  // Form State
  const [amount, setAmount] = useState<number | "custom">(1000);
  const [customAmount, setCustomAmount] = useState("");
  const [recipientName, setRecipientName] = useState("");
  const [recipientEmail, setRecipientEmail] = useState("");
  const [senderEmail, setSenderEmail] = useState("");
  const [message, setMessage] = useState("");
  const [sendStrategy, setSendStrategy] = useState<"now" | "date">("now");

  // UI State
  const [loading, setLoading] = useState(false);
  const [successCode, setSuccessCode] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    // Test API call
    await new Promise((resolve) => setTimeout(resolve, 1500));

    const finalAmount = amount === "custom" ? Number(customAmount) : amount;
    const code = `GIFT-${finalAmount}-${Math.random().toString(36).substring(2, 6).toUpperCase()}`;

    setSuccessCode(code);
    setLoading(false);
  };

  const copyToClipboard = () => {
    if (!successCode) return;
    navigator.clipboard.writeText(successCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (successCode) {
    return (
      <div className="bg-white rounded-2xl border border-green-100 p-8 text-center animate-fade-in-up">
        <div className="w-16 h-16 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-6 text-green-600">
          <Check size={32} />
        </div>
        <h3 className="text-2xl font-bold text-gray-900 mb-2">
          {t.successTitle}
        </h3>
        <p className="text-gray-500 mb-8">{t.successDesc}</p>

        <div className="bg-gray-50 border border-gray-200 rounded-xl p-4 flex items-center justify-between mb-8 max-w-sm mx-auto">
          <span className="font-mono text-xl font-bold tracking-wider text-gray-900">
            {successCode}
          </span>
          <button
            onClick={copyToClipboard}
            className="text-gray-500 hover:text-black transition-colors"
            title={t.copy}
          >
            {copied ? (
              <Check size={20} className="text-green-600" />
            ) : (
              <Copy size={20} />
            )}
          </button>
        </div>

        <button
          onClick={() => {
            setSuccessCode(null);
            setAmount(1000);
            setRecipientName("");
            setRecipientEmail("");
          }}
          className="text-sm font-bold text-gray-900 underline hover:text-gray-600"
        >
          {lang === "tr" ? "Yeni Bir Tane Al" : "Buy Another"}
        </button>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white rounded-2xl border border-gray-100 p-6 md:p-8 shadow-sm"
    >
      <h3 className="text-lg font-bold text-gray-900 mb-6 flex items-center gap-2">
        <Gift size={20} className="text-green-500" />
        {t.amountLabel}
      </h3>

      {/* Amounts */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-8">
        {AMOUNTS.map((val) => (
          <button
            key={val}
            type="button"
            onClick={() => setAmount(val)}
            className={`h-14 rounded-xl border-2 font-bold transition-all ${
              amount === val
                ? "border-green-500 bg-green-50 text-green-700"
                : "border-gray-100 hover:border-gray-200 text-gray-600"
            }`}
          >
            {val}₺
          </button>
        ))}
        <div className="relative">
          <input
            type="number"
            placeholder={t.customAmount}
            value={customAmount}
            onChange={(e) => {
              setAmount("custom");
              setCustomAmount(e.target.value);
            }}
            onClick={() => setAmount("custom")}
            className={`w-full h-14 pl-4 pr-4 rounded-xl border-2 font-bold outline-none transition-all ${
              amount === "custom"
                ? "border-green-500 bg-white ring-0"
                : "border-gray-100 focus:border-gray-200"
            }`}
          />
          {amount === "custom" && (
            <span className="absolute right-4 top-1/2 -translate-y-1/2 font-bold text-gray-400">
              ₺
            </span>
          )}
        </div>
      </div>

      <div className="space-y-4 mb-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input
            required
            type="text"
            placeholder={t.recipientName}
            value={recipientName}
            onChange={(e) => setRecipientName(e.target.value)}
            className="w-full p-4 bg-gray-50 border border-gray-100 rounded-xl outline-none focus:ring-2 focus:ring-black/5 transaction-all"
          />
          <input
            required
            type="email"
            placeholder={t.recipientEmail}
            value={recipientEmail}
            onChange={(e) => setRecipientEmail(e.target.value)}
            className="w-full p-4 bg-gray-50 border border-gray-100 rounded-xl outline-none focus:ring-2 focus:ring-black/5 transaction-all"
          />
        </div>
        <input
          required
          type="email"
          placeholder={t.senderEmail}
          value={senderEmail}
          onChange={(e) => setSenderEmail(e.target.value)}
          className="w-full p-4 bg-gray-50 border border-gray-100 rounded-xl outline-none focus:ring-2 focus:ring-black/5 transaction-all"
        />
        <textarea
          rows={3}
          placeholder={t.message}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          className="w-full p-4 bg-gray-50 border border-gray-100 rounded-xl outline-none focus:ring-2 focus:ring-black/5 transaction-all resize-none"
        />
      </div>

      <div className="mb-8">
        <label className="block text-sm font-bold text-gray-700 mb-3">
          {t.timing}
        </label>
        <div className="flex gap-4">
          <button
            type="button"
            onClick={() => setSendStrategy("now")}
            className={`flex-1 py-3 px-4 rounded-xl border text-sm font-bold transition-all ${
              sendStrategy === "now"
                ? "border-black bg-black text-white"
                : "border-gray-200 text-gray-600 hover:border-gray-300"
            }`}
          >
            {t.now}
          </button>
          <button
            type="button"
            onClick={() => setSendStrategy("date")}
            className={`flex-1 py-3 px-4 rounded-xl border text-sm font-bold transition-all ${
              sendStrategy === "date"
                ? "border-black bg-black text-white"
                : "border-gray-200 text-gray-600 hover:border-gray-300"
            }`}
          >
            {t.date}
          </button>
        </div>
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full bg-[#0B1220] text-white font-bold h-14 rounded-xl hover:bg-black transition-all flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
      >
        {loading ? (
          <Loader2 className="animate-spin" />
        ) : (
          <CreditCard size={20} />
        )}
        {t.submit}
      </button>
    </form>
  );
}
