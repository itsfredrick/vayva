import React from "react";
import { Icon, cn } from "@vayva/ui";
import { MarketplaceTemplate } from "@/types/intelligence";

export const MarketplaceGrid = ({
  templates,
}: {
  templates: MarketplaceTemplate[];
}) => {
  return (
    <div className="space-y-6">
      {/* Filters Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
          <Icon name="ShoppingBag" size={20} /> Template Marketplace
        </h3>
        <div className="flex gap-2 text-sm overflow-x-auto pb-2 sm:pb-0 no-scrollbar w-full sm:w-auto">
          {["All", "Retail", "Food", "Services", "Free"].map((filter) => (
            <button
              key={filter}
              className="px-3 py-1.5 rounded-full border border-gray-200 text-gray-600 whitespace-nowrap hover:bg-gray-50 hover:border-black hover:text-black transition-all font-medium"
            >
              {filter}
            </button>
          ))}
        </div>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {templates.map((tpl) => (
          <div
            key={tpl.id}
            className="group bg-white border border-gray-200 rounded-2xl overflow-hidden hover:shadow-lg transition-all duration-300"
          >
            {/* Image */}
            <div className="aspect-[4/3] bg-gray-100 relative group-hover:opacity-90 transition-opacity">
              {/* Placeholder image logic */}
              <div className="absolute inset-0 flex items-center justify-center text-gray-300">
                <Icon name="Image" size={48} />
              </div>

              <div className="absolute top-3 left-3 flex flex-col gap-1">
                {tpl.badges.map((badge) => (
                  <span
                    key={badge}
                    className="bg-black/80 backdrop-blur-sm text-white text-[10px] font-bold px-2 py-0.5 rounded-md uppercase tracking-wide"
                  >
                    {badge}
                  </span>
                ))}
              </div>

              <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-md shadow-sm flex items-center gap-1">
                <Icon
                  name="Star"
                  size={10}
                  className="text-amber-400 fill-amber-400"
                />
                <span className="text-xs font-bold text-gray-900">
                  {tpl.rating}
                </span>
              </div>

              {/* Overlay Actions */}
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
                <button className="bg-white text-black px-4 py-2 rounded-xl text-xs font-bold shadow-lg transform translate-y-2 group-hover:translate-y-0 transition-transform">
                  Preview
                </button>
              </div>
            </div>

            {/* Content */}
            <div className="p-5">
              <div className="flex justify-between items-start mb-2">
                <div>
                  <h4 className="font-bold text-gray-900">{tpl.name}</h4>
                  <p className="text-xs text-gray-500">by {tpl.designer}</p>
                </div>
                <div className="text-right">
                  <span
                    className={cn(
                      "font-bold",
                      tpl.price === 0 ? "text-green-600" : "text-gray-900",
                    )}
                  >
                    {tpl.price === 0
                      ? "Free"
                      : `₦${tpl.price.toLocaleString()}`}
                  </span>
                </div>
              </div>

              <div className="flex flex-wrap gap-1 mb-4">
                {tpl.best_for.map((tag) => (
                  <span
                    key={tag}
                    className="text-[10px] bg-gray-50 text-gray-500 px-1.5 py-0.5 rounded border border-gray-100"
                  >
                    {tag}
                  </span>
                ))}
              </div>

              <button className="w-full py-2.5 bg-black text-white rounded-xl text-sm font-bold hover:bg-gray-800 transition-colors">
                {tpl.price === 0 ? "Install Template" : "Purchase & Install"}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
