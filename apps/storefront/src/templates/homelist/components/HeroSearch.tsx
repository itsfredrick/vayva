import React, { useState } from "react";
import { Search, MapPin } from "lucide-react";

export const HeroSearch = () => {
  const [activeTab, setActiveTab] = useState<"buy" | "rent" | "shortlet">(
    "rent",
  );

  return (
    <section className="relative h-[500px] w-full bg-[#0F172A] flex flex-col items-center justify-center p-6 bg-[url('https://images.unsplash.com/photo-1564013799919-ab600027ffc6?auto=format&fit=crop&q=80')] bg-cover bg-center bg-no-repeat">
      <div className="absolute inset-0 bg-[#0F172A]/70 backdrop-blur-[1px]"></div>

      <div className="relative z-10 w-full max-w-4xl text-center">
        <h1 className="text-4xl md:text-6xl font-black text-white mb-6 leading-tight drop-shadow-sm">
          Find a place you'll love <br /> to live.
        </h1>

        {/* Tabs */}
        <div className="inline-flex bg-white/20 backdrop-blur-md p-1 rounded-t-xl overflow-hidden">
          {(["buy", "rent", "shortlet"] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-8 py-3 text-sm font-bold capitalize transition-all ${activeTab === tab ? "bg-white text-[#0F172A] rounded-t-lg" : "text-white hover:bg-white/10"}`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Search Box */}
        <div className="bg-white p-4 rounded-b-xl rounded-r-xl shadow-2xl flex flex-col md:flex-row gap-4 items-center animate-in fade-in slide-in-from-bottom-4 duration-500">
          <div className="flex-1 w-full relative">
            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
              <MapPin size={20} />
            </div>
            <input
              type="text"
              placeholder="City, neighborhood, address, or school..."
              className="w-full pl-12 pr-4 py-4 bg-gray-50 border border-transparent hover:bg-white hover:border-gray-200 rounded-lg text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#2563EB] font-medium transition-all"
            />
          </div>

          <button className="w-full md:w-auto bg-[#2563EB] hover:bg-[#1D4ED8] text-white px-8 py-4 rounded-lg font-bold flex items-center justify-center gap-2 transition-colors shadow-lg shadow-blue-200">
            <Search size={20} />
            <span>Search</span>
          </button>
        </div>

        <div className="mt-6 flex flex-wrap justify-center gap-3 text-white/80 text-xs font-medium">
          <span>Popular:</span>
          <button className="hover:text-white hover:underline">
            Lekki Phase 1
          </button>
          <button className="hover:text-white hover:underline">Ikoyi</button>
          <button className="hover:text-white hover:underline">
            Banana Island
          </button>
          <button className="hover:text-white hover:underline">
            Victoria Island
          </button>
        </div>
      </div>
    </section>
  );
};
