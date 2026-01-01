import React from "react";
import { TemplateProps } from "../registry";

export const LogisticsServiceTemplate: React.FC<TemplateProps> = ({
  businessName,
  demoMode,
}) => {
  return (
    <div className="font-sans min-h-screen bg-slate-50 text-slate-900">
      {/* Header */}
      <header className="bg-blue-900 text-white px-6 py-4 flex justify-between items-center sticky top-0 z-50 shadow-lg">
        <div className="font-bold text-xl tracking-tight italic flex items-center gap-2">
          <span className="text-yellow-400">⚡</span>
          {businessName || "Flash Logistics"}
        </div>
        <div className="flex gap-4 text-xs font-bold">
          <a href="#" className="hover:text-yellow-400">
            Track Item
          </a>
          <a href="#" className="hover:text-yellow-400">
            Get Quote
          </a>
        </div>
      </header>

      {/* Quick Quote Hero */}
      <section className="bg-blue-800 text-white p-6 pb-12 rounded-b-[2rem]">
        <h1 className="text-2xl font-bold mb-6 text-center">
          Move anything across Lagos,
          <br />
          Instantly.
        </h1>

        <div className="bg-white text-slate-900 rounded-xl p-4 shadow-xl max-w-md mx-auto">
          <div className="space-y-3">
            <div className="flex items-center gap-3 border-b border-gray-100 pb-2">
              <span className="text-blue-600">🟢</span>
              <div className="flex-1">
                <label className="block text-[10px] text-gray-400 font-bold uppercase">
                  Pickup Location
                </label>
                <input
                  type="text"
                  placeholder="e.g. 14 Admiralty Way"
                  className="w-full text-sm font-bold outline-none placeholder-gray-300"
                />
              </div>
            </div>
            <div className="flex items-center gap-3 pt-1">
              <span className="text-red-600">📍</span>
              <div className="flex-1">
                <label className="block text-[10px] text-gray-400 font-bold uppercase">
                  Drop-off Location
                </label>
                <input
                  type="text"
                  placeholder="e.g. Ikeja City Mall"
                  className="w-full text-sm font-bold outline-none placeholder-gray-300"
                />
              </div>
            </div>
          </div>
          <button className="w-full bg-yellow-400 text-blue-900 mt-6 py-3 rounded-lg font-bold text-sm hover:bg-yellow-300 transition-colors shadow-lg shadow-yellow-400/20">
            Check Price
          </button>
        </div>
      </section>

      {/* Service Types */}
      <section className="p-6">
        <h2 className="text-sm font-bold text-slate-500 uppercase mb-4">
          Our Fleet
        </h2>
        <div className="grid grid-cols-2 gap-3">
          {[
            {
              name: "Bike Delivery",
              time: "Same Day",
              price: "from ₦1,500",
              icon: "🏍️",
            },
            {
              name: "Van Haulage",
              time: "Scheduled",
              price: "from ₦15,000",
              icon: "🚐",
            },
            {
              name: "Inter-State",
              time: "3-5 Days",
              price: "Quote Only",
              icon: "🚚",
            },
            {
              name: "International",
              time: "7-14 Days",
              price: "DHL Partner",
              icon: "✈️",
            },
          ].map((s, i) => (
            <div
              key={i}
              className="bg-white p-4 rounded-xl border border-slate-200 hover:border-blue-500 cursor-pointer transition-colors"
            >
              <div className="text-3xl mb-2">{s.icon}</div>
              <h3 className="font-bold text-sm">{s.name}</h3>
              <div className="flex justify-between items-center mt-2">
                <span className="text-[10px] text-slate-400 bg-slate-100 px-1.5 py-0.5 rounded">
                  {s.time}
                </span>
                <span className="text-xs font-bold text-blue-600">
                  {s.price}
                </span>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};
