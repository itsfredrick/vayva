import React from "react";
import { TemplateProps } from "../registry";

export const PharmacyHealthTemplate: React.FC<TemplateProps> = ({
  businessName,
  demoMode,
}) => {
  return (
    <div className="font-sans min-h-screen bg-emerald-50 text-emerald-900 pb-20">
      {/* Trust Header */}
      <header className="bg-white px-6 py-4 flex justify-between items-center shadow-sm sticky top-0 z-50">
        <div className="flex items-center gap-2 font-bold text-xl text-emerald-700">
          <span className="text-2xl">✚</span>
          {businessName || "LifeCare Pharmacy"}
        </div>
        <div className="flex gap-4 items-center">
          <span className="bg-emerald-100 text-emerald-800 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wide">
            License #10293
          </span>
          <button className="bg-emerald-600 text-white px-4 py-2 rounded-lg text-xs font-bold hover:bg-emerald-700">
            Upload Prescription
          </button>
        </div>
      </header>

      {/* Emergency/Search */}
      <div className="bg-emerald-700 text-white p-8 text-center rounded-b-3xl mb-8 shadow-xl shadow-emerald-900/10">
        <h1 className="text-2xl font-bold mb-2">
          Your family's health, first.
        </h1>
        <p className="text-sm text-emerald-100 mb-6">
          Genuine drugs. Expert advice. Fast delivery.
        </p>
        <div className="relative max-w-lg mx-auto">
          <input
            type="text"
            placeholder="Search for medications (e.g. Panadol, Malaria)"
            className="w-full py-4 px-6 rounded-full text-gray-900 font-medium shadow-lg outline-none focus:ring-4 focus:ring-emerald-500/30"
          />
          <button className="absolute right-2 top-2 bg-emerald-600 p-2 rounded-full text-white hover:bg-emerald-500">
            <svg
              className="w-6 h-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </button>
        </div>
      </div>

      {/* Categories */}
      <section className="px-6 mb-8">
        <div className="flex gap-4 overflow-x-auto pb-4">
          {[
            "Baby Care",
            "Malaria",
            "Vitamins",
            "Sexual Health",
            "First Aid",
          ].map((cat) => (
            <div
              key={cat}
              className="bg-white min-w-[120px] p-4 rounded-xl shadow-sm text-center cursor-pointer hover:shadow-md transition-shadow"
            >
              <div className="text-2xl mb-2">💊</div>
              <div className="text-xs font-bold">{cat}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Consultation Teaser */}
      <section className="px-6">
        <div className="bg-white rounded-xl p-6 flex items-start gap-4 border border-emerald-100 shadow-sm relative overflow-hidden">
          <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center text-3xl z-10">
            👨🏾‍⚕️
          </div>
          <div className="flex-1 z-10">
            <h3 className="font-bold text-lg text-emerald-800 mb-1">
              Speak to a Pharmacist
            </h3>
            <p className="text-xs text-gray-500 mb-3 leading-relaxed">
              Not sure what you need? Our licensed pharmacists are available for
              a private chat.
            </p>
            <button className="text-xs font-bold text-white bg-emerald-600 px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-emerald-700">
              Start Chat
            </button>
          </div>
          <div className="absolute right-[-20px] bottom-[-20px] text-[150px] opacity-5 text-emerald-900 select-none pointer-events-none">
            💬
          </div>
        </div>
      </section>
    </div>
  );
};
