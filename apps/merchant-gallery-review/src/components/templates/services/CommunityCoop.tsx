import React from "react";
import { TemplateProps } from "../registry";

export const CommunityCoopTemplate: React.FC<TemplateProps> = ({
  businessName,
  demoMode,
}) => {
  return (
    <div className="font-sans min-h-screen bg-[#FDFBF7] text-stone-900">
      {/* Friendly Header */}
      <header className="px-6 py-6 text-center border-b border-stone-200">
        <div className="inline-block bg-orange-100 text-orange-800 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest mb-4">
          Community Buy Group
        </div>
        <h1 className="text-3xl font-black text-stone-800 mb-2">
          {businessName || "Lagos Mums Co-op"}
        </h1>
        <p className="text-stone-500 text-sm max-w-sm mx-auto">
          Join 1,200+ members buying food in bulk to save money. Next cycle
          closes in <span className="font-bold text-orange-600">3 days</span>.
        </p>
      </header>

      {/* Active Deals Grid */}
      <section className="p-6">
        <div className="max-w-md mx-auto space-y-4">
          {[
            {
              name: "50kg Bag of Rice",
              retail: "₦85,000",
              coop: "₦72,000",
              progress: 85,
              slots: "10 slots left",
            },
            {
              name: "Frozen Turkey (Carton)",
              retail: "₦45,000",
              coop: "₦38,500",
              progress: 40,
              slots: "15 slots left",
            },
            {
              name: "Palm Oil (25 Litres)",
              retail: "₦30,000",
              coop: "₦26,000",
              progress: 100,
              slots: "Sold Out",
            },
          ].map((deal, i) => (
            <div
              key={i}
              className={`bg-white p-5 rounded-2xl shadow-sm border-2 ${deal.progress === 100 ? "border-gray-100 grayscale opacity-70" : "border-stone-100"}`}
            >
              <div className="flex justify-between items-start mb-2">
                <h3 className="font-bold text-lg leading-tight">{deal.name}</h3>
                <div className="text-right">
                  <div className="text-xs text-gray-400 line-through">
                    {deal.retail}
                  </div>
                  <div className="text-xl font-bold text-green-600">
                    {deal.coop}
                  </div>
                </div>
              </div>

              {/* Membership Progress Bar */}
              <div className="bg-gray-100 h-2.5 rounded-full overflow-hidden mb-2">
                <div
                  className="bg-orange-400 h-full rounded-full"
                  style={{ width: `${deal.progress}%` }}
                ></div>
              </div>
              <div className="flex justify-between items-center text-xs font-bold text-stone-500 mb-4">
                <span>{deal.progress}% Funded</span>
                <span>{deal.slots}</span>
              </div>

              <button
                disabled={deal.progress === 100}
                className="w-full bg-stone-900 text-white py-3 rounded-xl font-bold hover:bg-stone-700 disabled:bg-gray-200 disabled:text-gray-400 cursor-pointer disabled:cursor-not-allowed"
              >
                {deal.progress === 100 ? "Closed" : "Join Deal"}
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* Membership CTA */}
      <section className="fixed bottom-0 left-0 right-0 p-4 bg-[#FDFBF7]/90 backdrop-blur border-t border-stone-200">
        <div className="max-w-md mx-auto bg-orange-100 rounded-xl p-4 flex justify-between items-center">
          <div>
            <div className="text-xs font-bold text-orange-900 uppercase mb-0.5">
              Not a member?
            </div>
            <div className="text-sm font-bold text-orange-950">
              Join for ₦1,000/mo
            </div>
          </div>
          <button className="bg-orange-500 text-white px-4 py-2 rounded-lg font-bold text-sm hover:bg-orange-600">
            Register
          </button>
        </div>
      </section>
    </div>
  );
};
