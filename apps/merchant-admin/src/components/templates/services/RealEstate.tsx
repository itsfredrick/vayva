import React from "react";
import { TemplateProps } from "../registry";

export const RealEstateTemplate: React.FC<TemplateProps> = ({
  businessName,
  demoMode,
}) => {
  return (
    <div className="font-sans min-h-screen bg-gray-50 text-slate-800">
      {/* Split Screen Hero */}
      <div className="grid grid-cols-1 lg:grid-cols-2 h-screen">
        <div className="bg-slate-900 text-white p-12 flex flex-col justify-center relative">
          <div className="absolute top-8 left-8 font-serif text-2xl tracking-widest leading-none">
            {businessName ? businessName.split(" ")[0] : "LEKKI"}
            <br />
            <span className="text-gold-500 text-sm font-sans tracking-normal opacity-50">
              LUXURY PROPERTIES
            </span>
          </div>
          <h1 className="text-5xl font-serif mb-6 leading-tight">
            Find your space <br />
            in the city.
          </h1>
          <div className="bg-white/10 p-6 backdrop-blur-md rounded-lg max-w-md">
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-[10px] uppercase font-bold text-gray-400 mb-1">
                  Location
                </label>
                <select className="w-full bg-transparent border-b border-gray-500 text-white py-1 outline-none text-sm">
                  <option className="text-black">Ikoyi</option>
                  <option className="text-black">Victoria Island</option>
                  <option className="text-black">Lekki Phase 1</option>
                </select>
              </div>
              <div>
                <label className="block text-[10px] uppercase font-bold text-gray-400 mb-1">
                  Type
                </label>
                <select className="w-full bg-transparent border-b border-gray-500 text-white py-1 outline-none text-sm">
                  <option className="text-black">Apartment</option>
                  <option className="text-black">Duplex</option>
                  <option className="text-black">Land</option>
                </select>
              </div>
            </div>
            <button className="w-full bg-white text-slate-900 py-3 font-bold uppercase tracking-widest text-xs hover:bg-gray-100">
              Search Listings
            </button>
          </div>
        </div>
        <div className="relative hidden lg:block">
          <img
            src="https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=1200&q=80"
            className="absolute inset-0 w-full h-full object-cover"
          />
          <div className="absolute bottom-8 left-8 right-8 flex gap-2 overflow-x-auto pb-2">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="min-w-[200px] bg-white p-3 rounded shadow-lg cursor-pointer hover:-translate-y-1 transition-transform"
              >
                <div className="text-[10px] uppercase font-bold text-gray-400 mb-1">
                  Just Listed
                </div>
                <div className="font-bold text-sm mb-1">
                  4 Bed Terrace, Ikate
                </div>
                <div className="text-blue-600 font-bold">₦120,000,000</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Mobile Property List */}
      <section className="lg:hidden p-4 pb-20">
        <h2 className="font-serif text-2xl mb-6">Featured Properties</h2>
        <div className="space-y-6">
          {[
            {
              title: "Ocean View Apt",
              loc: "Eko Atlantic",
              price: "$250,000",
              img: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800&q=80",
            },
            {
              title: "Detached Duplex",
              loc: "Chevron Drive",
              price: "₦180,000,000",
              img: "https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=800&q=80",
            },
          ].map((p, i) => (
            <div
              key={i}
              className="bg-white rounded-xl overflow-hidden shadow-sm"
            >
              <div className="h-48 relative">
                <img src={p.img} className="w-full h-full object-cover" />
                <span className="absolute bottom-2 left-2 bg-black/60 text-white px-2 py-1 text-xs font-bold rounded">
                  {p.price}
                </span>
              </div>
              <div className="p-4 flex justify-between items-center">
                <div>
                  <h3 className="font-bold text-lg leading-none mb-1">
                    {p.title}
                  </h3>
                  <p className="text-sm text-gray-500">{p.loc}</p>
                </div>
                <button className="bg-slate-900 text-white px-4 py-2 text-xs font-bold rounded uppercase">
                  Tour
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};
