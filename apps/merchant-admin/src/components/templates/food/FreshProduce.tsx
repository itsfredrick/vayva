import React from "react";
import { TemplateProps } from "../registry";

export const FreshProduceTemplate: React.FC<TemplateProps> = ({
  businessName,
  demoMode,
}) => {
  return (
    <div className="font-sans min-h-screen bg-green-50 text-green-900 pb-20">
      {/* Header */}
      <header className="bg-white px-6 py-4 border-b border-green-100 flex justify-between items-center sticky top-0 z-50">
        <div className="flex items-center gap-2">
          <span className="text-2xl">🥬</span>
          <div className="leading-tight">
            <h1 className="font-bold text-lg text-green-800">
              {businessName || "Fresh Farm Direct"}
            </h1>
            <p className="text-[10px] uppercase tracking-wider font-bold text-green-600">
              Harvested Today
            </p>
          </div>
        </div>
        <div className="bg-green-100 p-2 rounded-full relative">
          <svg
            className="w-6 h-6 text-green-700"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
            />
          </svg>
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] w-4 h-4 rounded-full flex items-center justify-center font-bold">
            3
          </span>
        </div>
      </header>

      {/* Daily Price Ticker */}
      <div className="bg-green-800 text-white text-xs py-2 overflow-hidden whitespace-nowrap">
        <div className="inline-block animate-marquee px-4">
          🍅 Tomatoes: ₦25,000/basket • 🌶️ Scotch Bonnet: ₦18,000/bag • 🥔 Irish
          Potato: ₦45,000/bag • 🧅 Onions: ₦32,000/bag
        </div>
      </div>

      {/* Search/Filter */}
      <div className="p-4 bg-white shadow-sm mb-6">
        <div className="flex gap-2 mb-4">
          <button className="flex-1 bg-green-600 text-white py-2 rounded-lg text-sm font-bold">
            Bulk / Wholesale
          </button>
          <button className="flex-1 bg-green-50 text-green-700 py-2 rounded-lg text-sm font-bold border border-green-100">
            Retail / Kg
          </button>
        </div>
        <input
          type="text"
          placeholder="Search vegetables, tubers, fruits..."
          className="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
        />
      </div>

      {/* Product List - Trust Oriented */}
      <section className="px-4 space-y-3">
        {[
          {
            name: "Fresh Tomatoes (Jos)",
            unit: "Paint Bucket",
            price: "₦4,500",
            img: "https://images.unsplash.com/photo-1592924357228-91a4daadcfea?w=800&q=80",
            stock: "High Stock",
          },
          {
            name: "Sweet Potato",
            unit: "10kg Bag",
            price: "₦8,000",
            img: "https://images.unsplash.com/photo-1596097635121-14b63b84043b?w=800&q=80",
            stock: "Low Stock",
          },
          {
            name: "Ugwu Leaves (Sliced)",
            unit: "Bundle",
            price: "₦500",
            img: "https://images.unsplash.com/photo-1576045057995-568f588f82fb?w=800&q=80",
            stock: "Fresh Cut",
          },
          {
            name: "Plantain (Unripe)",
            unit: "Bunch",
            price: "₦3,200",
            img: "https://images.unsplash.com/photo-1627308595229-7830a5c91f9f?w=800&q=80",
            stock: "",
          },
        ].map((item, i) => (
          <div
            key={i}
            className="bg-white p-3 rounded-xl border border-green-100 flex gap-4 shadow-sm"
          >
            <div className="w-20 h-20 bg-gray-100 rounded-lg shrink-0 overflow-hidden relative">
              <img
                src={item.img}
                alt={item.name}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="flex-1 flex flex-col justify-center">
              <h3 className="font-bold text-gray-900">{item.name}</h3>
              <p className="text-xs text-gray-500 font-medium mb-1">
                Per {item.unit}{" "}
                {item.stock && (
                  <span
                    className={`ml-2 text-[10px] px-1.5 py-0.5 rounded ${item.stock === "Low Stock" ? "bg-red-50 text-red-600" : "bg-green-50 text-green-600"}`}
                  >
                    {item.stock}
                  </span>
                )}
              </p>
              <div className="flex items-center justify-between mt-1">
                <span className="font-bold text-green-700 text-lg">
                  {item.price}
                </span>
                <div className="flex items-center border border-gray-200 rounded-lg overflow-hidden">
                  <button className="px-2 py-1 bg-gray-50 text-gray-600 hover:bg-gray-100">
                    -
                  </button>
                  <span className="px-2 py-1 text-xs font-bold w-6 text-center">
                    0
                  </span>
                  <button className="px-2 py-1 bg-green-50 text-green-700 hover:bg-green-100">
                    +
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </section>

      {/* Delivery Slot */}
      <div className="px-4 mt-8">
        <div className="bg-blue-50 border border-blue-100 p-4 rounded-xl flex items-center justify-between">
          <div>
            <div className="text-xs font-bold text-blue-600 uppercase mb-1">
              Next Delivery Run
            </div>
            <div className="font-bold text-blue-900">
              Tomorrow, 6:00 AM - 9:00 AM
            </div>
          </div>
          <button className="bg-white text-blue-600 border border-blue-200 px-3 py-1.5 rounded-lg text-xs font-bold">
            Change
          </button>
        </div>
      </div>
    </div>
  );
};
