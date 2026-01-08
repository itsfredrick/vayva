import React from "react";
import { TemplateProps } from "../registry";

export const HomeServicesTemplate: React.FC<TemplateProps> = ({
  businessName,
  demoMode,
}) => {
  return (
    <div className="font-sans min-h-screen bg-blue-50/50 text-slate-800">
      {/* Trust Header */}
      <header className="bg-white px-4 py-4 flex justify-between items-center border-b border-slate-100 sticky top-0 z-50">
        <div className="font-bold text-xl text-blue-900 flex items-center gap-2">
          <div className="w-8 h-8 bg-blue-600 rounded flex items-center justify-center text-white">
            <svg
              className="w-5 h-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19.428 15.428a2 2 0 00-1.022-.547l-2.384-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z"
              />
            </svg>
          </div>
          {businessName || "Sparkle Clean"}
        </div>
        <button className="bg-blue-600 text-white px-4 py-2 rounded-lg text-xs font-bold hover:bg-blue-700 transition-colors">
          Get Quote
        </button>
      </header>

      {/* Hero Trust Indicators */}
      <section className="bg-blue-900 text-white p-8 text-center">
        <h1 className="text-2xl font-bold mb-4">
          Professional Cleaning & Pest Control
        </h1>
        <div className="flex justify-center gap-4 text-[10px] font-bold uppercase tracking-widest opacity-80">
          <span className="flex items-center gap-1">
            <svg
              className="w-3 h-3"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>{" "}
            Vetted Staff
          </span>
          <span className="flex items-center gap-1">
            <svg
              className="w-3 h-3"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>{" "}
            On Time
          </span>
        </div>
      </section>

      {/* Services Grid */}
      <section className="-mt-6 px-4 pb-12">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[
            {
              name: "Deep Home Cleaning",
              price: "from ₦25,000",
              desc: "Full interior detailing, floors, and surfaces.",
              icon: "🏠",
            },
            {
              name: "Fumigation",
              price: "from ₦35,000",
              desc: "Pest control for roaches, rats, and mosquitoes.",
              icon: "☠️",
            },
            {
              name: "Post-Construction",
              price: "Get Quote",
              desc: "Removal of debris and cement stains.",
              icon: "🏗️",
            },
            {
              name: "Sofa & Carpet",
              price: "from ₦5,000/seat",
              desc: "Shampooing and steam cleaning.",
              icon: "🛋️",
            },
          ].map((item, i) => (
            <div
              key={i}
              className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 hover:shadow-md transition-shadow"
            >
              <div className="flex justify-between items-start mb-4">
                <div className="text-3xl">{item.icon}</div>
                <span className="text-xs font-bold text-blue-600 bg-blue-50 px-2 py-1 rounded">
                  {item.price}
                </span>
              </div>
              <h3 className="font-bold text-slate-900 mb-1">{item.name}</h3>
              <p className="text-sm text-slate-500 leading-relaxed mb-4">
                {item.desc}
              </p>
              <button className="w-full border border-slate-200 py-2 rounded-lg text-xs font-bold text-slate-600 hover:bg-slate-50 hover:text-slate-900 transition-colors">
                View Details
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* Testimonial / Social Proof */}
      <section className="px-4 pb-12">
        <div className="bg-white rounded-xl p-6 border border-slate-100">
          <div className="flex gap-1 text-yellow-400 mb-3">
            {[1, 2, 3, 4, 5].map((s) => (
              <svg key={s} className="w-4 h-4 fill-current" viewBox="0 0 20 20">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
            ))}
          </div>
          <p className="text-sm text-slate-600 italic mb-4">
            "The team arrived exactly at 9am as promised. My apartment has never
            looked this clean. Highly recommended for busy professionals."
          </p>
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-slate-200 rounded-full"></div>
            <div>
              <div className="text-xs font-bold text-slate-900">Chioma O.</div>
              <div className="text-[10px] text-slate-400">Lekki Phase 1</div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
