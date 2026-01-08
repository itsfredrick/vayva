import React from "react";
import { TemplateProps } from "../registry";

export const EventPlanningTemplate: React.FC<TemplateProps> = ({
  businessName,
  demoMode,
}) => {
  return (
    <div className="font-sans min-h-screen bg-white text-gray-900">
      {/* Celebratory Header */}
      <header className="relative h-[60vh] flex items-center justify-center text-center text-white">
        <div className="absolute inset-0 bg-black/40 z-10"></div>
        <img
          src="https://images.unsplash.com/photo-1519225463351-193509074455?w=1600&q=80"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="relative z-20 px-4">
          <div className="uppercase tracking-[0.3em] text-sm font-bold mb-4">
            Event Planning & Design
          </div>
          <h1 className="text-4xl md:text-6xl font-serif italic mb-8">
            {businessName || "Golden Moments"}
          </h1>
          <button className="bg-white text-black px-8 py-4 uppercase tracking-widest text-xs font-bold hover:bg-gray-100 transition-colors">
            Plan My Event
          </button>
        </div>
      </header>

      {/* Packages */}
      <section className="py-20 px-4 bg-gray-50">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-serif mb-4">Curated Packages</h2>
            <p className="text-gray-500 max-w-lg mx-auto">
              We handle everything from intimate proposals to grand wedding
              receptions. Choose a tier or request a custom quote.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                name: "Intimate",
                price: "₦250,000",
                features: [
                  "Up to 50 Guests",
                  "Venue Styling",
                  "Coordination",
                  "Basic Sound",
                ],
              },
              {
                name: "Grand",
                price: "₦850,000",
                features: [
                  "Up to 300 Guests",
                  "Premium Decor",
                  "Full Planning",
                  "Live Band Stage",
                  "Catering Logic",
                ],
              },
              {
                name: "Royal",
                price: "Custom",
                features: [
                  "Unlimited Guests",
                  "Luxury Styling",
                  "Destination Logistics",
                  "Concierge Service",
                  "Celebrity Management",
                ],
              },
            ].map((pkg, i) => (
              <div
                key={i}
                className={`bg-white p-8 border ${i === 1 ? "border-amber-400 shadow-xl relative" : "border-gray-100 shadow-sm"}`}
              >
                {i === 1 && (
                  <div className="absolute top-0 left-0 w-full text-center -translate-y-1/2">
                    <span className="bg-amber-400 text-white text-[10px] uppercase font-bold px-3 py-1 rounded-full">
                      Most Popular
                    </span>
                  </div>
                )}
                <h3 className="font-serif text-2xl mb-2">{pkg.name}</h3>
                <div className="text-sm text-gray-400 font-bold uppercase tracking-wider mb-8">
                  Starting at {pkg.price}
                </div>
                <ul className="space-y-4 mb-8">
                  {pkg.features.map((f) => (
                    <li
                      key={f}
                      className="flex items-center gap-3 text-sm text-gray-600"
                    >
                      <span className="w-1.5 h-1.5 rounded-full bg-amber-400"></span>
                      {f}
                    </li>
                  ))}
                </ul>
                <button
                  className={`w-full py-3 text-xs font-bold uppercase tracking-wider border ${i === 1 ? "bg-amber-400 border-amber-400 text-white" : "border-gray-200 hover:bg-black hover:text-white transition-colors"}`}
                >
                  Select Package
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};
